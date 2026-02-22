import AdminLayout from '@/components/layout/AdminLayout';
import RevenueCard from '@/components/admin/revenue/RevenueCard';
import RevenueChart from '@/components/admin/revenue/RevenueChart';
import RevenueTable from '@/components/admin/revenue/RevenueTable';
import { Head, Link, router } from '@inertiajs/react';
import {
    TrendingUp,
    Package,
    ShoppingCart,
    DollarSign,
    Truck,
    CreditCard,
    Calendar,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';

interface YearlyRevenueProps {
    selectedYear: number;
    availableYears: number[];
    currentYear: {
        year: number;
        gross_revenue: number;
        gross_revenue_formatted: string;
        net_revenue: number;
        net_revenue_formatted: string;
        total_shipping: number;
        total_shipping_formatted: string;
        total_orders: number;
        cancelled_orders: number;
        total_items_sold: number;
        average_order_value: number;
        average_order_value_formatted: string;
        previous_year_revenue: number;
        previous_year_revenue_formatted: string;
        growth_percentage: number;
    };
    allYears: any[];
    monthlyTrend: any[];
    topProducts: any[];
    paymentMethods: any[];
}

export default function YearlyRevenue({
    selectedYear,
    availableYears,
    currentYear,
    allYears,
    monthlyTrend,
    topProducts,
    paymentMethods,
}: YearlyRevenueProps) {
    const handleYearChange = (direction: 'prev' | 'next') => {
        const newYear = direction === 'prev' ? selectedYear - 1 : selectedYear + 1;
        if (availableYears.includes(newYear)) {
            router.get(route('admin.revenue.yearly'), { year: newYear });
        }
    };

    const getTrend = (growth: number): 'up' | 'down' | 'neutral' => {
        if (growth > 0) return 'up';
        if (growth < 0) return 'down';
        return 'neutral';
    };

    return (
        <AdminLayout title="Pendapatan Tahunan">
            <Head title="Pendapatan Tahunan" />
            
            {/* Header */}
            <div className="bg-base-100 border-b border-base-300 mb-6">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-base-content">Pendapatan Tahunan</h1>
                            <p className="text-sm text-base-content/70 mt-1">
                                Laporan pendapatan tahunan dan perbandingan performa
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('admin.revenue.monthly')}
                                className="btn btn-sm btn-ghost"
                            >
                                Lihat Bulanan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Year Selector */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleYearChange('prev')}
                                    className="btn btn-square btn-sm btn-ghost"
                                    disabled={!availableYears.includes(selectedYear - 1)}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => router.get(route('admin.revenue.yearly'), { year: parseInt(e.target.value) })}
                                    className="select select-bordered"
                                >
                                    {availableYears.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleYearChange('next')}
                                    className="btn btn-square btn-sm btn-ghost"
                                    disabled={!availableYears.includes(selectedYear + 1)}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-base-content/70">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">Tahun {selectedYear}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <RevenueCard
                        title="Pendapatan Kotor"
                        value={`Rp ${currentYear.gross_revenue_formatted}`}
                        icon={DollarSign}
                        description="Total sebelum biaya pengiriman"
                        trend={getTrend(currentYear.growth_percentage)}
                        trendValue={`${currentYear.growth_percentage >= 0 ? '+' : ''}${currentYear.growth_percentage}% vs ${selectedYear - 1}`}
                    />
                    <RevenueCard
                        title="Pendapatan Bersih"
                        value={`Rp ${currentYear.net_revenue_formatted}`}
                        icon={TrendingUp}
                        description="Setelah pesanan selesai"
                    />
                    <RevenueCard
                        title="Total Pesanan"
                        value={currentYear.total_orders}
                        icon={ShoppingCart}
                        description={`${currentYear.cancelled_orders} dibatalkan`}
                    />
                    <RevenueCard
                        title="Produk Terjual"
                        value={currentYear.total_items_sold}
                        icon={Package}
                        description="Total item terjual"
                    />
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RevenueCard
                        title="Ongkir Total"
                        value={`Rp ${currentYear.total_shipping_formatted}`}
                        icon={Truck}
                    />
                    <RevenueCard
                        title="Rata-rata Order"
                        value={`Rp ${currentYear.average_order_value_formatted}`}
                        icon={CreditCard}
                    />
                    <RevenueCard
                        title="Pendapatan Tahun Lalu"
                        value={`Rp ${currentYear.previous_year_revenue_formatted}`}
                        icon={Calendar}
                        description={`Tahun ${selectedYear - 1}`}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {monthlyTrend.length > 0 && (
                        <RevenueChart
                            data={monthlyTrend}
                            type="bar"
                            dataKey="revenue"
                            xKey="month_name"
                            title="Tren Pendapatan Bulanan"
                            height={300}
                        />
                    )}
                    {paymentMethods.length > 0 && (
                        <RevenueChart
                            data={paymentMethods.map(pm => ({
                                name: pm.payment_type_label,
                                total: pm.total,
                            }))}
                            type="pie"
                            dataKey="total"
                            nameKey="name"
                            title="Metode Pembayaran"
                            height={300}
                        />
                    )}
                </div>

                {/* Top Products */}
                <RevenueTable
                    products={topProducts}
                    title={`Top Produk - Tahun ${selectedYear}`}
                />

                {/* Yearly Comparison */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">Perbandingan Tahunan</h3>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-base-content/70">Tahun</th>
                                        <th className="text-base-content/70 text-right">Pendapatan Kotor</th>
                                        <th className="text-base-content/70 text-right">Pendapatan Bersih</th>
                                        <th className="text-base-content/70 text-right">Pesanan</th>
                                        <th className="text-base-content/70 text-right">Item</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allYears.map((year) => (
                                        <tr
                                            key={year.year}
                                            className={`hover cursor-pointer ${year.year === selectedYear ? 'bg-primary/10' : ''}`}
                                            onClick={() => router.get(route('admin.revenue.yearly'), { year: year.year })}
                                        >
                                            <td className="font-medium text-base-content">
                                                {year.year}
                                                {year.year === selectedYear && (
                                                    <span className="badge badge-primary badge-xs ml-2">Aktif</span>
                                                )}
                                            </td>
                                            <td className="text-right font-medium text-base-content">
                                                Rp {year.gross_revenue_formatted}
                                            </td>
                                            <td className="text-right text-base-content/70">
                                                Rp {year.net_revenue_formatted}
                                            </td>
                                            <td className="text-right text-base-content/70">
                                                {year.total_orders}
                                            </td>
                                            <td className="text-right text-base-content/70">
                                                {year.total_items_sold}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
