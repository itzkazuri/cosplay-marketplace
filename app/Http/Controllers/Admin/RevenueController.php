<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RevenueController extends Controller
{
    /**
     * Display monthly revenue report.
     */
    public function monthly(Request $request): Response
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);

        // Get monthly revenue data
        $monthlyData = $this->calculateMonthlyRevenue($year, $month);

        // Get all months data for the selected year
        $allMonthsData = $this->getAllMonthsData($year);

        // Get available years from orders
        $availableYears = Order::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');

        // Monthly trend (daily breakdown for selected month)
        $dailyTrend = $this->getDailyTrend($year, $month);

        // Top products for the selected month
        $topProducts = $this->getTopProducts($year, $month);

        // Payment method breakdown
        $paymentMethods = $this->getPaymentMethodBreakdown($year, $month);

        return Inertia::render('Admin/Revenue/Monthly', [
            'selectedYear' => (int) $year,
            'selectedMonth' => (int) $month,
            'availableYears' => $availableYears->toArray(),
            'currentMonth' => $monthlyData,
            'allMonths' => $allMonthsData,
            'dailyTrend' => $dailyTrend,
            'topProducts' => $topProducts,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    /**
     * Display yearly revenue report.
     */
    public function yearly(Request $request): Response
    {
        $year = $request->input('year', now()->year);

        // Get yearly revenue data
        $yearlyData = $this->calculateYearlyRevenue($year);

        // Get all years data for comparison
        $allYearsData = $this->getAllYearsData();

        // Get available years from orders
        $availableYears = Order::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');

        // Monthly trend for the selected year
        $monthlyTrend = $this->getMonthlyTrend($year);

        // Top products for the selected year
        $topProducts = $this->getTopProducts($year);

        // Payment method breakdown for the year
        $paymentMethods = $this->getPaymentMethodBreakdown($year);

        return Inertia::render('Admin/Revenue/Yearly', [
            'selectedYear' => (int) $year,
            'availableYears' => $availableYears->toArray(),
            'currentYear' => $yearlyData,
            'allYears' => $allYearsData,
            'monthlyTrend' => $monthlyTrend,
            'topProducts' => $topProducts,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    /**
     * Calculate revenue for a specific month.
     */
    private function calculateMonthlyRevenue(int $year, int $month): array
    {
        $startDate = "$year-$month-01";
        $endDate = date('Y-m-t', strtotime($startDate)); // Last day of month

        $orders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered']);

        $deliveredOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'delivered');

        $cancelledOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('status', ['cancelled', 'refunded']);

        $grossRevenue = $orders->sum('total');
        $netRevenue = $deliveredOrders->sum('total');
        $totalShipping = $orders->sum('shipping_cost');
        $totalOrders = $orders->count();
        $cancelledCount = $cancelledOrders->count();

        $totalItemsSold = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->whereIn('orders.status', ['paid', 'processing', 'shipped', 'delivered'])
            ->sum('order_items.quantity');

        return [
            'year' => $year,
            'month' => $month,
            'month_name' => date('F', mktime(0, 0, 0, $month, 1)),
            'gross_revenue' => (float) $grossRevenue,
            'gross_revenue_formatted' => number_format($grossRevenue, 0, ',', '.'),
            'net_revenue' => (float) $netRevenue,
            'net_revenue_formatted' => number_format($netRevenue, 0, ',', '.'),
            'total_shipping' => (float) $totalShipping,
            'total_shipping_formatted' => number_format($totalShipping, 0, ',', '.'),
            'total_orders' => $totalOrders,
            'cancelled_orders' => $cancelledCount,
            'total_items_sold' => $totalItemsSold,
            'average_order_value' => $totalOrders > 0 ? $grossRevenue / $totalOrders : 0,
            'average_order_value_formatted' => $totalOrders > 0 ? number_format($grossRevenue / $totalOrders, 0, ',', '.') : '0',
        ];
    }

    /**
     * Calculate revenue for a specific year.
     */
    private function calculateYearlyRevenue(int $year): array
    {
        $startDate = "$year-01-01";
        $endDate = "$year-12-31";

        $orders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered']);

        $deliveredOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'delivered');

        $cancelledOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('status', ['cancelled', 'refunded']);

        $grossRevenue = $orders->sum('total');
        $netRevenue = $deliveredOrders->sum('total');
        $totalShipping = $orders->sum('shipping_cost');
        $totalOrders = $orders->count();
        $cancelledCount = $cancelledOrders->count();

        $totalItemsSold = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->whereIn('orders.status', ['paid', 'processing', 'shipped', 'delivered'])
            ->sum('order_items.quantity');

        // Calculate previous year data for comparison
        $prevYear = $year - 1;
        $prevYearRevenue = Order::whereBetween('created_at', ["$prevYear-01-01", "$prevYear-12-31"])
            ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered'])
            ->sum('total');

        $growthPercentage = $prevYearRevenue > 0 ? (($grossRevenue - $prevYearRevenue) / $prevYearRevenue) * 100 : 0;

        return [
            'year' => $year,
            'gross_revenue' => (float) $grossRevenue,
            'gross_revenue_formatted' => number_format($grossRevenue, 0, ',', '.'),
            'net_revenue' => (float) $netRevenue,
            'net_revenue_formatted' => number_format($netRevenue, 0, ',', '.'),
            'total_shipping' => (float) $totalShipping,
            'total_shipping_formatted' => number_format($totalShipping, 0, ',', '.'),
            'total_orders' => $totalOrders,
            'cancelled_orders' => $cancelledCount,
            'total_items_sold' => $totalItemsSold,
            'average_order_value' => $totalOrders > 0 ? $grossRevenue / $totalOrders : 0,
            'average_order_value_formatted' => $totalOrders > 0 ? number_format($grossRevenue / $totalOrders, 0, ',', '.') : '0',
            'previous_year_revenue' => (float) $prevYearRevenue,
            'previous_year_revenue_formatted' => number_format($prevYearRevenue, 0, ',', '.'),
            'growth_percentage' => round($growthPercentage, 2),
        ];
    }

    /**
     * Get all months data for a year.
     */
    private function getAllMonthsData(int $year): array
    {
        $months = [];
        for ($month = 1; $month <= 12; $month++) {
            $months[] = $this->calculateMonthlyRevenue($year, $month);
        }

        return $months;
    }

    /**
     * Get all years data for comparison.
     */
    private function getAllYearsData(): array
    {
        $years = [];
        $currentYear = now()->year;

        // Get data for last 5 years
        for ($year = $currentYear - 4; $year <= $currentYear; $year++) {
            if ($year < 2000) {
                continue;
            }
            $years[] = $this->calculateYearlyRevenue($year);
        }

        return $years;
    }

    /**
     * Get daily revenue trend for a month.
     */
    private function getDailyTrend(int $year, int $month): array
    {
        $startDate = "$year-$month-01";
        $endDate = date('Y-m-t', strtotime($startDate));

        return Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered'])
            ->selectRaw('DAY(created_at) as day, SUM(total) as revenue, COUNT(*) as orders')
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->map(fn ($item) => [
                'day' => $item->day,
                'revenue' => (float) $item->revenue,
                'revenue_formatted' => number_format($item->revenue, 0, ',', '.'),
                'orders' => $item->orders,
            ])
            ->toArray();
    }

    /**
     * Get monthly revenue trend for a year.
     */
    private function getMonthlyTrend(int $year): array
    {
        $startDate = "$year-01-01";
        $endDate = "$year-12-31";

        return Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered'])
            ->selectRaw('MONTH(created_at) as month, SUM(total) as revenue, COUNT(*) as orders')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($item) => [
                'month' => $item->month,
                'month_name' => date('F', mktime(0, 0, 0, $item->month, 1)),
                'revenue' => (float) $item->revenue,
                'revenue_formatted' => number_format($item->revenue, 0, ',', '.'),
                'orders' => $item->orders,
            ])
            ->toArray();
    }

    /**
     * Get top selling products for a period.
     */
    private function getTopProducts(int $year, ?int $month = null): array
    {
        $query = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('product_skus', 'order_items.product_sku_id', '=', 'product_skus.id')
            ->join('products', 'product_skus.product_id', '=', 'products.id')
            ->whereYear('orders.created_at', $year)
            ->whereIn('orders.status', ['paid', 'processing', 'shipped', 'delivered']);

        if ($month) {
            $query->whereMonth('orders.created_at', $month);
        }

        return $query->select(
            'products.id',
            'products.name',
            'products.slug',
            'products.main_image',
            DB::raw('SUM(order_items.quantity) as total_sold'),
            DB::raw('SUM(order_items.subtotal) as total_revenue')
        )
            ->groupBy('products.id', 'products.name', 'products.slug', 'products.main_image')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'main_image' => $item->main_image,
                'total_sold' => $item->total_sold,
                'total_revenue' => (float) $item->total_revenue,
                'total_revenue_formatted' => number_format($item->total_revenue, 0, ',', '.'),
            ])
            ->toArray();
    }

    /**
     * Get payment method breakdown.
     */
    private function getPaymentMethodBreakdown(int $year, ?int $month = null): array
    {
        $query = DB::table('payments')
            ->join('orders', 'payments.order_id', '=', 'orders.id')
            ->whereYear('orders.created_at', $year)
            ->whereIn('payments.status', ['settlement', 'capture']);

        if ($month) {
            $query->whereMonth('orders.created_at', $month);
        }

        return $query->select(
            'payments.payment_type',
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(payments.amount) as total')
        )
            ->groupBy('payments.payment_type')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($item) => [
                'payment_type' => $item->payment_type,
                'payment_type_label' => $this->getPaymentTypeLabel($item->payment_type),
                'count' => $item->count,
                'total' => (float) $item->total,
                'total_formatted' => number_format($item->total, 0, ',', '.'),
            ])
            ->toArray();
    }

    /**
     * Get human-readable payment type label.
     */
    private function getPaymentTypeLabel(?string $type): string
    {
        $labels = [
            'credit_card' => 'Kartu Kredit',
            'bank_transfer' => 'Transfer Bank',
            'gopay' => 'GoPay',
            'shopeepay' => 'ShopeePay',
            'qris' => 'QRIS',
            'indomaret' => 'Indomaret',
            'alfamart' => 'Alfamart',
            'akulaku' => 'Akulaku',
            'kredivo' => 'Kredivo',
        ];

        return $labels[$type] ?? ucfirst($type ?? 'Lainnya');
    }
}
