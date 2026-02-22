import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { X, Package, User, MapPin, Phone, Calendar, DollarSign, ClipboardList, Truck } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderItem {
    id: number;
    product_sku_id: number;
    product_name: string;
    sku_code: string;
    size: string | null;
    color: string | null;
    price: string | number;
    quantity: number;
    subtotal: string | number;
}

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
    shipping_address: string;
    shipping_city: string;
    shipping_province: string;
    shipping_postal_code: string;
    subtotal: string | number;
    shipping_cost: string | number;
    total: string | number;
    status: string;
    cancel_reason: string | null;
    notes: string | null;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Dibayar' },
    { value: 'processing', label: 'Diproses' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'delivered', label: 'Diterima' },
    { value: 'cancelled', label: 'Dibatalkan' },
    { value: 'refunded', label: 'Direfund' },
];

const cancelReasons = [
    { value: 'payment_expired', label: 'Pembayaran Kadaluarsa' },
    { value: 'out_of_stock', label: 'Stok Habis' },
    { value: 'buyer_request', label: 'Permintaan Pembeli' },
    { value: 'seller_request', label: 'Permintaan Penjual' },
    { value: 'fraud_suspected', label: 'Terduga Penipuan' },
];

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [showStatusForm, setShowStatusForm] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        status: order?.status || 'pending',
        cancel_reason: order?.cancel_reason || '',
    });

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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!order) return;

        setIsUpdatingStatus(true);
        router.post(`/admin/orders/${order.id}/update-status`, {
            status: data.status,
            cancel_reason: data.cancel_reason,
        }, {
            onFinish: () => {
                setIsUpdatingStatus(false);
                setShowStatusForm(false);
            },
        });
    };

    const handleClose = () => {
        setShowStatusForm(false);
        setData({ status: order?.status || 'pending', cancel_reason: '' });
        onClose();
    };

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-base-content/20 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative bg-base-100 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-base-300">
                {/* Header */}
                <div className="sticky top-0 bg-base-100 border-b border-base-300 p-5 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-black text-base-content flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Detail Order
                        </h2>
                        <p className="text-xs text-base-content/50 mt-0.5 font-mono">
                            {order.order_number}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="btn btn-ghost btn-sm btn-square rounded-xl"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-6">
                    {/* Status & Actions */}
                    <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-base-content/50">Status:</span>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                                onClick={() => setShowStatusForm(!showStatusForm)}
                                className="btn btn-primary btn-sm gap-2 rounded-xl font-bold"
                            >
                                <Truck className="w-4 h-4" />
                                Update Status
                            </button>
                        )}
                    </div>

                    {/* Update Status Form */}
                    {showStatusForm && (
                        <form onSubmit={handleUpdateStatus} className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <Truck className="w-4 h-4 text-primary" />
                                Update Status Order
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs">Status Baru</span>
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status' as any, e.target.value)}
                                        className="select select-bordered select-sm rounded-xl font-medium focus:select-primary"
                                    >
                                        {statusOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {data.status === 'cancelled' && (
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-bold text-xs">Alasan Pembatalan</span>
                                        </label>
                                        <select
                                            value={data.cancel_reason}
                                            onChange={(e) => setData('cancel_reason' as any, e.target.value)}
                                            className="select select-bordered select-sm rounded-xl font-medium focus:select-primary"
                                        >
                                            <option value="">Pilih Alasan</option>
                                            {cancelReasons.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowStatusForm(false)}
                                    className="btn btn-ghost btn-sm rounded-xl font-bold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn btn-primary btn-sm gap-2 rounded-xl font-black shadow-lg shadow-primary/20"
                                >
                                    <Package className="w-4 h-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card bg-base-100 border border-base-300 rounded-2xl p-4">
                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Informasi Customer
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-base-content/50 text-xs">Nama:</span>
                                    <p className="font-bold">{order.user.name}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/50 text-xs">Email:</span>
                                    <p className="font-medium">{order.user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 border border-base-300 rounded-2xl p-4">
                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                Alamat Pengiriman
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-base-content/50 text-xs">Penerima:</span>
                                    <p className="font-bold">{order.recipient_name}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/50 text-xs">Telepon:</span>
                                    <p className="font-medium">{order.recipient_phone}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/50 text-xs">Alamat:</span>
                                    <p className="font-medium">{order.shipping_address}</p>
                                    <p className="font-medium">{order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="card bg-base-100 border border-base-300 rounded-2xl p-4">
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-primary" />
                            Items Ordered
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-base-200/50">
                                        <th className="text-xs font-black uppercase">Produk</th>
                                        <th className="text-xs font-black uppercase">Varian</th>
                                        <th className="text-xs font-black uppercase text-right">Harga</th>
                                        <th className="text-xs font-black uppercase text-right">Qty</th>
                                        <th className="text-xs font-black uppercase text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="font-bold text-sm">{item.product_name}</td>
                                            <td>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.size && (
                                                        <span className="badge badge-outline badge-xs">
                                                            {item.size}
                                                        </span>
                                                    )}
                                                    {item.color && (
                                                        <span className="badge badge-outline badge-xs">
                                                            {item.color}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-right font-medium">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="text-right font-bold">{item.quantity}</td>
                                            <td className="text-right font-black text-success">
                                                {formatCurrency(item.subtotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="card bg-base-100 border border-base-300 rounded-2xl p-4">
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            Ringkasan Pembayaran
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-base-content/50">Subtotal</span>
                                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-base-content/50">Ongkos Kirim</span>
                                <span className="font-medium">{formatCurrency(order.shipping_cost)}</span>
                            </div>
                            <div className="divider my-2"></div>
                            <div className="flex justify-between">
                                <span className="font-bold text-base">Total</span>
                                <span className="font-black text-lg text-success">
                                    {formatCurrency(order.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Meta */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-sm">
                            <div className="flex items-center gap-2 text-base-content/50 mb-1">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs font-bold uppercase">Dibuat</span>
                            </div>
                            <p className="font-medium">{formatDate(order.created_at)}</p>
                        </div>
                        {order.notes && (
                            <div className="text-sm">
                                <span className="text-base-content/50 text-xs font-bold uppercase">Catatan</span>
                                <p className="font-medium mt-1 p-2 bg-base-200/50 rounded-lg">{order.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
