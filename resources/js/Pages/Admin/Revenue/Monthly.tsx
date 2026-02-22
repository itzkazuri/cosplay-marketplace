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

interface MonthlyRevenueProps {
    selectedYear: number;
    selectedMonth: number;
    availableYears: number[];
    currentMonth: {
        year: number;
        month: number;
        month_name: string;
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
    };
    allMonths: any[];
    dailyTrend: any[];
    topProducts: any[];
    paymentMethods: any[];
}

export default function MonthlyRevenue({
    selectedYear,
    selectedMonth,
    availableYears,
    currentMonth,
    allMonths,
    dailyTrend,
    topProducts,
    paymentMethods,
}: MonthlyRevenueProps) {
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const handleYearChange = (direction: 'prev' | 'next') => {
        const newYear = direction === 'prev' ? selectedYear - 1 : selectedYear + 1;
        if (availableYears.includes(newYear)) {
            router.get(route('admin.revenue.monthly'), { year: newYear, month: selectedMonth });
        }
    };

    const handleMonthChange = (month: number) => {
        router.get(route('admin.revenue.monthly'), { year: selectedYear, month });
    };

    const handlePreviousMonth = () => {
        let newMonth = selectedMonth - 1;
        let newYear = selectedYear;
        if (newMonth < 1) {
            newMonth = 12;
            newYear = selectedYear - 1;
        }
        if (availableYears.includes(newYear)) {
            router.get(route('admin.revenue.monthly'), { year: newYear, month: newMonth });
        }
    };

    const handleNextMonth = () => {
        let newMonth = selectedMonth + 1;
        let newYear = selectedYear;
        if (newMonth > 12) {
            newMonth = 1;
            newYear = selectedYear + 1;
        }
        if (availableYears.includes(newYear)) {
            router.get(route('admin.revenue.monthly'), { year: newYear, month: newMonth });
        }
    };

    return (
        <AdminLayout title="Pendapatan Bulanan">
            <Head title="Pendapatan Bulanan" />
            
            {/* Header */}
            <div className="bg-base-100 border-b border-base-300 mb-6">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-base-content">Pendapatan Bulanan</h1>
                            <p className="text-sm text-base-content/70 mt-1">
                                Laporan pendapatan dan analisis performa toko
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('admin.revenue.yearly')}
                                className="btn btn-sm btn-ghost"
                            >
                                Lihat Tahunan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Year & Month Selector */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePreviousMonth}
                                    className="btn btn-square btn-sm btn-ghost"
                                    disabled={!availableYears.includes(selectedMonth === 1 ? selectedYear - 1 : selectedYear)}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => router.get(route('admin.revenue.monthly'), { year: parseInt(e.target.value), month: selectedMonth })}
                                        className="select select-bordered select-sm"
                                    >
                                        {availableYears.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                                        className="select select-bordered select-sm"
                                    >
                                        {monthNames.map((name, index) => (
                                            <option key={index + 1} value={index + 1}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={handleNextMonth}
                                    className="btn btn-square btn-sm btn-ghost"
                                    disabled={!availableYears.includes(selectedMonth === 12 ? selectedYear + 1 : selectedYear)}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-base-content/70">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {monthNames[selectedMonth - 1]} {selectedYear}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <RevenueCard
                        title="Pendapatan Kotor"
                        value={`Rp ${currentMonth.gross_revenue_formatted}`}
                        icon={DollarSign}
                        description="Total sebelum biaya pengiriman"
                    />
                    <RevenueCard
                        title="Pendapatan Bersih"
                        value={`Rp ${currentMonth.net_revenue_formatted}`}
                        icon={TrendingUp}
                        description="Setelah pesanan selesai"
                    />
                    <RevenueCard
                        title="Total Pesanan"
                        value={currentMonth.total_orders}
                        icon={ShoppingCart}
                        description={`${currentMonth.cancelled_orders} dibatalkan`}
                    />
                    <RevenueCard
                        title="Produk Terjual"
                        value={currentMonth.total_items_sold}
                        icon={Package}
                        description="Total item terjual"
                    />
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RevenueCard
                        title="Ongkir Total"
                        value={`Rp ${currentMonth.total_shipping_formatted}`}
                        icon={Truck}
                    />
                    <RevenueCard
                        title="Rata-rata Order"
                        value={`Rp ${currentMonth.average_order_value_formatted}`}
                        icon={CreditCard}
                    />
                    <RevenueCard
                        title="Tingkat Pembatalan"
                        value={`${currentMonth.total_orders > 0 ? ((currentMonth.cancelled_orders / currentMonth.total_orders) * 100).toFixed(1) : 0}%`}
                        icon={Calendar}
                        trend={currentMonth.cancelled_orders > 0 ? 'down' : 'neutral'}
                        trendValue={`${currentMonth.cancelled_orders} order`}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {dailyTrend.length > 0 && (
                        <RevenueChart
                            data={dailyTrend}
                            type="line"
                            dataKey="revenue"
                            xKey="day"
                            title="Tren Pendapatan Harian"
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
                    title={`Top Produk - ${monthNames[selectedMonth - 1]} ${selectedYear}`}
                />

                {/* Monthly Overview */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">Ringkasan Bulanan Tahun {selectedYear}</h3>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-base-content/70">Bulan</th>
                                        <th className="text-base-content/70 text-right">Pendapatan</th>
                                        <th className="text-base-content/70 text-right">Pesanan</th>
                                        <th className="text-base-content/70 text-right">Item</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allMonths.map((month) => (
                                        <tr
                                            key={month.month}
                                            className={`hover cursor-pointer ${month.month === selectedMonth ? 'bg-primary/10' : ''}`}
                                            onClick={() => handleMonthChange(month.month)}
                                        >
                                            <td className="font-medium text-base-content">
                                                {month.month_name}
                                                {month.month === selectedMonth && (
                                                    <span className="badge badge-primary badge-xs ml-2">Aktif</span>
                                                )}
                                            </td>
                                            <td className="text-right font-medium text-base-content">
                                                Rp {month.gross_revenue_formatted}
                                            </td>
                                            <td className="text-right text-base-content/70">
                                                {month.total_orders}
                                            </td>
                                            <td className="text-right text-base-content/70">
                                                {month.total_items_sold}
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
