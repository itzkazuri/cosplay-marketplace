import { ShoppingCart, TrendingUp, Package, Clock } from 'lucide-react';

interface OrderStats {
    total_orders: number;
    pending_orders: number;
    processing_orders: number;
    total_revenue: string | number;
}

interface OrderHeaderProps {
    stats: OrderStats;
}

export default function OrderHeader({ stats }: OrderHeaderProps) {
    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(typeof value === 'string' ? parseFloat(value) : value);
    };

    const statCards = [
        {
            title: 'Total Order',
            value: stats.total_orders,
            icon: ShoppingCart,
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            title: 'Pending',
            value: stats.pending_orders,
            icon: Clock,
            color: 'text-warning',
            bg: 'bg-warning/10',
        },
        {
            title: 'Diproses',
            value: stats.processing_orders,
            icon: Package,
            color: 'text-info',
            bg: 'bg-info/10',
        },
        {
            title: 'Total Pendapatan',
            value: formatCurrency(stats.total_revenue),
            icon: TrendingUp,
            color: 'text-success',
            bg: 'bg-success/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat) => (
                <div
                    key={stat.title}
                    className="card bg-base-100 border border-base-300 rounded-2xl p-4 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                                {stat.title}
                            </p>
                            <p className="text-2xl font-black text-base-content mt-1">
                                {stat.value}
                            </p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
