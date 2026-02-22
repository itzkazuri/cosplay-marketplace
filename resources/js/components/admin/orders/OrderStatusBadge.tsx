interface OrderStatusBadgeProps {
    status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
        pending: { label: 'Pending', color: 'badge-warning', icon: '⏳' },
        paid: { label: 'Dibayar', color: 'badge-info', icon: '💰' },
        processing: { label: 'Diproses', color: 'badge-primary', icon: '🔄' },
        shipped: { label: 'Dikirim', color: 'badge-secondary', icon: '📦' },
        delivered: { label: 'Diterima', color: 'badge-success', icon: '✅' },
        cancelled: { label: 'Dibatalkan', color: 'badge-error', icon: '❌' },
        refunded: { label: 'Direfund', color: 'badge-ghost', icon: '💸' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`badge badge-sm font-bold py-2 px-3 rounded-lg ${config.color}`}>
            <span className="mr-1">{config.icon}</span>
            {config.label}
        </span>
    );
}
