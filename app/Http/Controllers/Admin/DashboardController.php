<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductRating;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        // Total revenue from settled orders
        $totalRevenue = Order::where('status', 'delivered')
            ->sum('total');

        // Orders count
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $processingOrders = Order::where('status', 'processing')->count();

        // Users count (excluding admins)
        $totalUsers = User::where('role', 'user')->count();

        // Products count
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();

        // Products sold (from order items)
        $productsSold = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'delivered')
            ->sum('quantity');

        // Recent orders
        $recentOrders = Order::with(['user', 'items'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'user' => [
                        'name' => $order->user->name,
                        'email' => $order->user->email,
                    ],
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                ];
            });

        // Top selling products
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('product_skus', 'order_items.product_sku_id', '=', 'product_skus.id')
            ->join('products', 'product_skus.product_id', '=', 'products.id')
            ->where('orders.status', 'delivered')
            ->select('products.id', 'products.name', 'products.slug', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name', 'products.slug')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // Rating stats
        $totalRatings = ProductRating::count();
        $averageRating = ProductRating::where('is_visible', true)->avg('rating') ?? 0;
        $pendingRatings = ProductRating::whereNull('approved_at')->count();

        // Revenue trend (last 7 days)
        $revenueTrend = Order::where('status', 'delivered')
            ->where('created_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'revenue' => number_format($totalRevenue, 0, ',', '.'),
                'orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'processing_orders' => $processingOrders,
                'users' => $totalUsers,
                'products' => $totalProducts,
                'active_products' => $activeProducts,
                'products_sold' => $productsSold,
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'ratings' => [
                'total' => $totalRatings,
                'average' => round($averageRating, 1),
                'pending' => $pendingRatings,
            ],
        ]);
    }
}
