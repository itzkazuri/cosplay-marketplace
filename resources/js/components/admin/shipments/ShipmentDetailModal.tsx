import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { X, Truck, Package, Calendar, ClipboardList } from 'lucide-react';
import ShipmentStatusBadge from './ShipmentStatusBadge';

interface Order {
    id: number;
    order_number: string;
    recipient_name: string;
    user: {
        name: string;
    };
}

interface Shipment {
    id: number;
    order_id: number;
    courier: string;
    courier_service: string;
    tracking_number: string | null;
    status: string;
    notes: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    order: Order;
    created_at: string;
}

interface ShipmentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    shipment: Shipment | null;
}

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'packed', label: 'Dikemas' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'in_transit', label: 'Dalam Perjalanan' },
    { value: 'delivered', label: 'Terkirim' },
    { value: 'returned', label: 'Dikembalikan' },
    { value: 'failed', label: 'Gagal' },
];

const courierOptions = [
    { value: 'jne', label: 'JNE' },
    { value: 'jnt', label: 'J&T' },
    { value: 'sicepat', label: 'SiCepat' },
    { value: 'pos_indonesia', label: 'Pos Indonesia' },
    { value: 'anteraja', label: 'AnterAja' },
    { value: 'wahana', label: 'Wahana' },
    { value: 'tiki', label: 'TIKI' },
    { value: 'ninja_express', label: 'Ninja Express' },
    { value: 'gosend', label: 'GoSend' },
    { value: 'grab_express', label: 'GrabExpress' },
    { value: 'other', label: 'Lainnya' },
];

const serviceOptions = [
    { value: 'REG', label: 'Regular' },
    { value: 'YES', label: 'Express Same Day' },
    { value: 'OKE', label: 'Ongkos Kirim Ekonomis' },
    { value: 'EXPRESS', label: 'Express' },
    { value: 'SAME_DAY', label: 'Same Day' },
    { value: 'NEXT_DAY', label: 'Next Day' },
    { value: 'CARGO', label: 'Cargo' },
    { value: 'OTHER', label: 'Lainnya' },
];

export default function ShipmentDetailModal({ isOpen, onClose, shipment }: ShipmentDetailModalProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        order_id: shipment?.order_id || '',
        courier: shipment?.courier || 'jne',
        courier_service: shipment?.courier_service || 'REG',
        tracking_number: shipment?.tracking_number || '',
        status: shipment?.status || 'pending',
        notes: shipment?.notes || '',
    });

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!shipment) return;

        setIsUpdating(true);
        if (shipment.id) {
            put(route('admin.shipments.update', shipment.id), {
                onFinish: () => {
                    setIsUpdating(false);
                    setShowUpdateForm(false);
                },
            });
        } else {
            post(route('admin.shipments.store'), {
                onFinish: () => {
                    setIsUpdating(false);
                    setShowUpdateForm(false);
                },
            });
        }
    };

    const handleUpdateStatus = (newStatus: string) => {
        if (!shipment) return;

        router.post(route('admin.shipments.update-status', shipment.id), {
            status: newStatus,
        }, {
            preserveScroll: true,
        });
    };

    const handleClose = () => {
        setShowUpdateForm(false);
        onClose();
    };

    if (!isOpen || !shipment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-base-content/20 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative bg-base-100 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-base-300">
                {/* Header */}
                <div className="sticky top-0 bg-base-100 border-b border-base-300 p-5 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-black text-base-content flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            Detail Pengiriman
                        </h2>
                        <p className="text-xs text-base-content/50 mt-0.5">
                            {shipment.order.order_number}
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
                            <ShipmentStatusBadge status={shipment.status} />
                        </div>
                        {shipment.status !== 'delivered' && (
                            <button
                                onClick={() => setShowUpdateForm(!showUpdateForm)}
                                className="btn btn-primary btn-sm gap-2 rounded-xl font-bold"
                            >
                                <Package className="w-4 h-4" />
                                Update
                            </button>
                        )}
                    </div>

                    {/* Update Form */}
                    {showUpdateForm && (
                        <form onSubmit={handleSubmit} className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-primary" />
                                Update Pengiriman
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs">Kurir</span>
                                    </label>
                                    <select
                                        value={data.courier}
                                        onChange={(e) => setData('courier' as any, e.target.value)}
                                        className="select select-bordered select-sm rounded-xl font-medium focus:select-primary"
                                    >
                                        {courierOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs">Layanan</span>
                                    </label>
                                    <select
                                        value={data.courier_service}
                                        onChange={(e) => setData('courier_service' as any, e.target.value)}
                                        className="select select-bordered select-sm rounded-xl font-medium focus:select-primary"
                                    >
                                        {serviceOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs">Nomor Resi</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan nomor resi"
                                        value={data.tracking_number}
                                        onChange={(e) => setData('tracking_number' as any, e.target.value)}
                                        className="input input-bordered input-sm rounded-xl font-medium focus:input-primary"
                                    />
                                </div>
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs">Status</span>
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
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs">Catatan</span>
                                    </label>
                                    <textarea
                                        placeholder="Catatan pengiriman..."
                                        value={data.notes}
                                        onChange={(e) => setData('notes' as any, e.target.value)}
                                        className="textarea textarea-bordered textarea-sm rounded-xl font-medium focus:textarea-primary min-h-[80px]"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateForm(false)}
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

                    {/* Order Info */}
                    <div className="card bg-base-100 border border-base-300 rounded-2xl p-4">
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            Informasi Order
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-base-content/50 text-xs">Nomor Order:</span>
                                <p className="font-bold font-mono">{shipment.order.order_number}</p>
                            </div>
                            <div>
                                <span className="text-base-content/50 text-xs">Penerima:</span>
                                <p className="font-medium">{shipment.order.recipient_name}</p>
                            </div>
                            <div>
                                <span className="text-base-content/50 text-xs">Customer:</span>
                                <p className="font-medium">{shipment.order.user.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipment Info */}
                    <div className="card bg-base-100 border border-base-300 rounded-2xl p-4">
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-primary" />
                            Informasi Pengiriman
                        </h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-base-content/50 text-xs">Kurir</span>
                                    <p className="font-bold">{shipment.courier?.toUpperCase()}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/50 text-xs">Layanan</span>
                                    <p className="font-bold">{shipment.courier_service}</p>
                                </div>
                            </div>
                            {shipment.tracking_number && (
                                <div>
                                    <span className="text-base-content/50 text-xs">Nomor Resi</span>
                                    <p className="font-bold font-mono text-primary">{shipment.tracking_number}</p>
                                </div>
                            )}
                            {shipment.notes && (
                                <div>
                                    <span className="text-base-content/50 text-xs">Catatan</span>
                                    <p className="font-medium p-2 bg-base-200/50 rounded-lg">{shipment.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="card bg-base-100 border border-base-300 rounded-2xl p-4">
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Timeline
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span className="text-base-content/50">Dibuat:</span>
                                <span className="font-medium">{formatDate(shipment.created_at)}</span>
                            </div>
                            {shipment.shipped_at && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-success"></div>
                                    <span className="text-base-content/50">Dikirim:</span>
                                    <span className="font-medium">{formatDate(shipment.shipped_at)}</span>
                                </div>
                            )}
                            {shipment.delivered_at && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-info"></div>
                                    <span className="text-base-content/50">Diterima:</span>
                                    <span className="font-medium">{formatDate(shipment.delivered_at)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Status Update */}
                    <div className="card bg-base-100 border border-base-300 rounded-2xl p-4">
                        <h3 className="font-bold text-sm mb-3">Update Cepat Status</h3>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleUpdateStatus(opt.value)}
                                    className={`btn btn-xs font-bold rounded-xl ${
                                        shipment.status === opt.value
                                            ? 'btn-primary'
                                            : 'btn-outline'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
