import { Eye, Truck, Calendar, Package } from 'lucide-react';
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
    order: Order;
    created_at: string;
}

interface ShipmentTableProps {
    shipments: Shipment[];
    onViewDetail: (shipment: Shipment) => void;
}

const courierLabels: Record<string, string> = {
    jne: 'JNE',
    jnt: 'J&T',
    sicepat: 'SiCepat',
    pos_indonesia: 'Pos Indonesia',
    anteraja: 'AnterAja',
    wahana: 'Wahana',
    tiki: 'TIKI',
    ninja_express: 'Ninja Express',
    gosend: 'GoSend',
    grab_express: 'GrabExpress',
    other: 'Lainnya',
};

export default function ShipmentTable({ shipments, onViewDetail }: ShipmentTableProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (shipments.length === 0) {
        return (
            <div className="card bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-base-content/20" />
                </div>
                <h3 className="font-bold text-lg text-base-content mb-2">Tidak ada pengiriman</h3>
                <p className="text-sm text-base-content/50">Belum ada data pengiriman</p>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-300">
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Resi</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Order</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Kurir</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Layanan</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Status</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Tanggal</th>
                            <th className="w-16"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.map((shipment) => (
                            <tr key={shipment.id} className="hover:bg-primary/5 transition-colors group">
                                <td>
                                    <div className="flex flex-col">
                                        {shipment.tracking_number ? (
                                            <>
                                                <span className="font-bold text-sm text-primary font-mono">
                                                    {shipment.tracking_number}
                                                </span>
                                                <span className="text-[10px] text-base-content/50">
                                                    #{shipment.id.toString().padStart(5, '0')}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xs text-base-content/40 italic">Belum ada resi</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm truncate max-w-[150px]">
                                            {shipment.order.recipient_name}
                                        </span>
                                        <span className="text-[10px] text-base-content/50 font-mono">
                                            {shipment.order.order_number}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-3 h-3 text-base-content/40" />
                                        <span className="font-bold text-sm">
                                            {courierLabels[shipment.courier] || shipment.courier}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-1">
                                        <Package className="w-3 h-3 text-base-content/40" />
                                        <span className="font-medium text-xs">
                                            {shipment.courier_service}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <ShipmentStatusBadge status={shipment.status} />
                                </td>
                                <td>
                                    <div className="flex items-center gap-1 text-xs text-base-content/60">
                                        <Calendar className="w-3 h-3" />
                                        <span className="font-medium">
                                            {formatDate(shipment.created_at)}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <button
                                        onClick={() => onViewDetail(shipment)}
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
