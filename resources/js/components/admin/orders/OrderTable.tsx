import { Eye, Phone, MapPin, Calendar } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Order {
    id: number;
    order_number: string;
    user: User;
    recipient_name: string;
    recipient_phone: string;
    shipping_city: string;
    shipping_province: string;
    total: string | number;
    status: string;
    items_count?: number;
    created_at: string;
}

interface OrderTableProps {
    orders: Order[];
    onViewDetail: (order: Order) => void;
}

export default function OrderTable({ orders, onViewDetail }: OrderTableProps) {
    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(typeof value === 'string' ? parseFloat(value) : value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (orders.length === 0) {
        return (
            <div className="card bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-base-content/20" />
                </div>
                <h3 className="font-bold text-lg text-base-content mb-2">Tidak ada order yang ditemukan</h3>
                <p className="text-sm text-base-content/50">Coba ubah filter pencarian</p>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-300">
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Order</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Customer</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Pengiriman</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Total</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Status</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Tanggal</th>
                            <th className="w-16"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-primary/5 transition-colors group">
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-primary font-mono">
                                            {order.order_number}
                                        </span>
                                        <span className="text-[10px] text-base-content/50">
                                            #{order.id.toString().padStart(5, '0')}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">
                                            {order.user.name}
                                        </span>
                                        <span className="text-[10px] text-base-content/50 truncate max-w-[150px]">
                                            {order.user.email}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1 text-xs">
                                            <MapPin className="w-3 h-3 text-base-content/40" />
                                            <span className="font-medium text-xs truncate max-w-[150px]">
                                                {order.shipping_city}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                            <Phone className="w-3 h-3 text-base-content/40" />
                                            <span className="font-medium text-xs">
                                                {order.recipient_phone}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="font-black text-sm text-success">
                                    {formatCurrency(order.total)}
                                </td>
                                <td>
                                    <OrderStatusBadge status={order.status} />
                                </td>
                                <td>
                                    <div className="flex items-center gap-1 text-xs text-base-content/60">
                                        <Calendar className="w-3 h-3" />
                                        <span className="font-medium">
                                            {formatDate(order.created_at)}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <button
                                        onClick={() => onViewDetail(order)}
                                        className="btn btn-ghost btn-xs btn-square text-primary hover:bg-primary/10 rounded-xl"
                                        title="Lihat Detail"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
