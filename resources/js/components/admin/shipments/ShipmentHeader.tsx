import { Truck, Package, Clock, CheckCircle } from 'lucide-react';

interface ShipmentStats {
    total_shipments: number;
    pending_shipments: number;
    in_transit_shipments: number;
    delivered_shipments: number;
}

interface ShipmentHeaderProps {
    stats: ShipmentStats;
    onAddShipment: () => void;
}

export default function ShipmentHeader({ stats, onAddShipment }: ShipmentHeaderProps) {
    const statCards = [
        {
            title: 'Total Pengiriman',
            value: stats.total_shipments,
            icon: Truck,
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            title: 'Menunggu Kirim',
            value: stats.pending_shipments,
            icon: Clock,
            color: 'text-warning',
            bg: 'bg-warning/10',
        },
        {
            title: 'Dalam Perjalanan',
            value: stats.in_transit_shipments,
            icon: Package,
            color: 'text-info',
            bg: 'bg-info/10',
        },
        {
            title: 'Terkirim',
            value: stats.delivered_shipments,
            icon: CheckCircle,
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
