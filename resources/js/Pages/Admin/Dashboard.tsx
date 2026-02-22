import AdminLayout from '@/components/layout/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ShoppingBag,
    Users,
    ClipboardList,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Package,
    Star
} from 'lucide-react';

interface Stats {
    revenue: string;
    orders: number;
    pending_orders: number;
    processing_orders: number;
    users: number;
    products: number;
    active_products: number;
    products_sold: number;
}

interface RecentOrder {
    id: number;
    order_number: string;
    user: {
        name: string;
        email: string;
    };
    total: number;
    status: string;
    created_at: string;
}

interface TopProduct {
    id: number;
    name: string;
    slug: string;
    total_sold: number;
}

interface Ratings {
    total: number;
    average: number;
    pending: number;
}

interface Props {
    stats: Stats;
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];
    ratings: Ratings;
}

export default function Dashboard({ 
    stats, 
    recentOrders = [], 
    topProducts = [], 
    ratings 
}: Props) {
    // Provide default values for safety
    const safeStats = {
        revenue: stats?.revenue || '0',
        orders: stats?.orders || 0,
        pending_orders: stats?.pending_orders || 0,
        processing_orders: stats?.processing_orders || 0,
        users: stats?.users || 0,
        products: stats?.products || 0,
        active_products: stats?.active_products || 0,
        products_sold: stats?.products_sold || 0,
    };

    const safeRatings = {
        total: ratings?.total || 0,
        average: ratings?.average || 0,
        pending: ratings?.pending || 0,
    };
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'warning',
            paid: 'info',
            processing: 'secondary',
            shipped: 'primary',
            delivered: 'success',
            cancelled: 'error',
            refunded: 'error',
        };
        return colors[status] || 'base';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Menunggu Pembayaran',
            paid: 'Dibayar',
            processing: 'Diproses',
            shipped: 'Dikirim',
            delivered: 'Selesai',
            cancelled: 'Dibatalkan',
            refunded: 'Dikembalikan',
        };
        return labels[status] || status;
    };

    const statCards = [
        { title: 'Total Pendapatan', value: `Rp ${safeStats.revenue}`, change: '+12.5%', icon: CreditCard, color: 'primary' },
        { title: 'Total Pesanan', value: safeStats.orders.toString(), change: safeStats.pending_orders > 0 ? `${safeStats.pending_orders} pending` : '0 pending', icon: ClipboardList, color: 'secondary', changeType: 'count' },
        { title: 'Total Pelanggan', value: safeStats.users.toLocaleString(), change: '+3.1%', icon: Users, color: 'accent' },
        { title: 'Produk Terjual', value: safeStats.products_sold.toString(), change: `${safeStats.products} produk`, icon: ShoppingBag, color: 'info', changeType: 'count' },
    ];

    return (
        <AdminLayout title="Dashboard">
            {/* ── Stats Overview ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    const isPositive = stat.change.startsWith('+');
                    return (
                        <div key={i} className="card bg-base-100 shadow-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                            <div className="card-body p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-2xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-xs font-black flex items-center gap-1 py-1 px-2 rounded-lg ${stat.changeType === 'count' ? 'bg-info/10 text-info' : (isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error')}`}>
                                        {stat.change}
                                        {stat.changeType !== 'count' && (isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />)}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest">{stat.title}</p>
                                <h3 className="text-2xl font-black text-base-content tracking-tight mt-1">{stat.value}</h3>
                            </div>
                            <div className={`h-1 w-full bg-${stat.color}/20`}>
                                <div className={`h-full bg-${stat.color} w-2/3 transition-all duration-1000 delay-300`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Recent Orders (Table Card) ── */}
                <div className="lg:col-span-2 card bg-base-100 shadow-xl overflow-hidden border border-base-300">
                    <div className="card-body p-0">
                        <div className="flex items-center justify-between p-6 border-b border-base-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight">Pesanan Terbaru</h3>
                            </div>
                            <Link href={route('admin.orders.index')} className="btn btn-ghost btn-sm text-primary font-bold">Lihat Semua</Link>
                        </div>

                        {recentOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr className="bg-base-200/50">
                                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Invoice</th>
                                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Pelanggan</th>
                                            <th className="text-xs font-black uppercase tracking-wider opacity-50 text-center">Status</th>
                                            <th className="text-xs font-black uppercase tracking-wider opacity-50 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-primary/5 transition-colors group">
                                                <td className="font-bold text-sm text-primary group-hover:underline cursor-pointer">{order.order_number}</td>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar placeholder">
                                                            <div className="w-8 rounded-full bg-base-300 text-base-content/50">
                                                                <span className="text-[10px] font-bold">{order.user.name.charAt(0)}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold block">{order.user.name}</span>
                                                            <span className="text-[10px] text-base-content/50">{order.user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span className={`badge badge-${getStatusColor(order.status)} badge-sm font-bold py-2 px-3 rounded-lg`}>
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </td>
                                                <td className="text-right font-black text-xs">Rp {order.total.toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <ClipboardList className="w-12 h-12 mx-auto text-base-content/20 mb-2" />
                                <p className="text-base-content/50 font-medium">Belum ada pesanan</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Quick Actions & Stats ── */}
                <div className="space-y-6">
                    {/* Rating Stats */}
                    <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body">
                            <h3 className="card-title text-sm font-black uppercase tracking-widest text-base-content/50 mb-4 flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                Statistik Rating
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 bg-primary/10 rounded-2xl text-center">
                                    <p className="text-[10px] font-bold uppercase text-primary/70">Total</p>
                                    <p className="text-lg font-black text-primary">{safeRatings.total}</p>
                                </div>
                                <div className="p-3 bg-secondary/10 rounded-2xl text-center">
                                    <p className="text-[10px] font-bold uppercase text-secondary/70">Rata-rata</p>
                                    <p className="text-lg font-black text-secondary">{safeRatings.average}★</p>
                                </div>
                                <div className="p-3 bg-warning/10 rounded-2xl text-center">
                                    <p className="text-[10px] font-bold uppercase text-warning/70">Pending</p>
                                    <p className="text-lg font-black text-warning">{safeRatings.pending}</p>
                                </div>
                            </div>
                            <Link href={route('admin.product-ratings.index')} className="btn btn-outline btn-sm mt-4 font-bold">
                                Kelola Rating
                            </Link>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body">
                            <h3 className="card-title text-sm font-black uppercase tracking-widest text-base-content/50 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Produk Terlaris
                            </h3>
                            {topProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {topProducts.map((product, i) => (
                                        <div key={product.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold truncate max-w-[150px]">{product.name}</p>
                                                    <p className="text-[10px] text-base-content/50">{product.total_sold} terjual</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-base-content/50 text-sm">Belum ada data penjualan</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card bg-primary text-primary-content shadow-xl overflow-hidden group">
                        <div className="card-body relative overflow-hidden">
                            <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                                <Package className="w-6 h-6" />
                                Analitik Cepat
                            </h3>
                            <p className="text-sm opacity-80 mb-6 font-medium">Lihat performa toko Anda dalam 24 jam terakhir.</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <p className="text-[10px] font-bold uppercase opacity-60">Produk Aktif</p>
                                    <p className="text-lg font-black">{safeStats.active_products}</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <p className="text-[10px] font-bold uppercase opacity-60">Processing</p>
                                    <p className="text-lg font-black">{safeStats.processing_orders}</p>
                                </div>
                            </div>
                            <div className="card-actions mt-6">
                                <Link href={route('admin.products.index')} className="btn btn-secondary btn-block font-black shadow-lg">Kelola Produk</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
