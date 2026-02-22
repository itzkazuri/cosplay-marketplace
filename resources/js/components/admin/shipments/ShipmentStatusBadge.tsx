interface ShipmentStatusBadgeProps {
    status: string;
}

export default function ShipmentStatusBadge({ status }: ShipmentStatusBadgeProps) {
    const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
        pending: { label: 'Pending', color: 'badge-warning', icon: '⏳' },
        packed: { label: 'Dikemas', color: 'badge-info', icon: '📦' },
        shipped: { label: 'Dikirim', color: 'badge-primary', icon: '🚚' },
        in_transit: { label: 'Dalam Perjalanan', color: 'badge-secondary', icon: '🔄' },
        delivered: { label: 'Terkirim', color: 'badge-success', icon: '✅' },
        returned: { label: 'Dikembalikan', color: 'badge-error', icon: '↩️' },
        failed: { label: 'Gagal', color: 'badge-ghost', icon: '❌' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`badge badge-sm font-bold py-2 px-3 rounded-lg ${config.color}`}>
            <span className="mr-1">{config.icon}</span>
            {config.label}
        </span>
    );
}
