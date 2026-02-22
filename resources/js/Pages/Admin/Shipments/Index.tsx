import AdminLayout from '@/components/layout/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Truck, Package, Tag, ShoppingCart } from 'lucide-react';
import ShipmentHeader from '@/components/admin/shipments/ShipmentHeader';
import ShipmentFilters from '@/components/admin/shipments/ShipmentFilters';
import ShipmentTable from '@/components/admin/shipments/ShipmentTable';
import ShipmentPagination from '@/components/admin/shipments/ShipmentPagination';
import ShipmentDetailModal from '@/components/admin/shipments/ShipmentDetailModal';

interface Order {
    id: number;
    order_number: string;
    recipient_name: string;
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
    updated_at: string;
}

interface ShipmentsPaginated {
    data: Shipment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface ShipmentStats {
    total_shipments: number;
    pending_shipments: number;
    in_transit_shipments: number;
    delivered_shipments: number;
}

interface Props {
    shipments: ShipmentsPaginated;
    orders: Order[];
    stats: ShipmentStats;
}

export default function Index({ shipments, orders, stats }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCourier, setSelectedCourier] = useState('');

    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const handleViewDetail = (shipment: Shipment) => {
        setSelectedShipment(shipment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedShipment(null);
    };

    const handleSearch = () => {
        router.get(route('admin.shipments.index'), {
            search: searchQuery || null,
            status: selectedStatus || null,
            courier: selectedCourier || null,
        }, {
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedStatus('');
        setSelectedCourier('');
        router.get(route('admin.shipments.index'));
    };

    return (
        <AdminLayout title="Manajemen Pengiriman">
            <Head title="Manajemen Pengiriman" />

            {/* Success/Error Messages */}
            {flash?.success && (
                <div className="alert alert-success rounded-2xl mb-4 shadow-lg">
                    <span className="font-bold text-sm">{flash.success}</span>
                </div>
            )}
            {flash?.error && (
                <div className="alert alert-error rounded-2xl mb-4 shadow-lg">
                    <span className="font-bold text-sm">{flash.error}</span>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-base-content uppercase flex items-center gap-3">
                        <Truck className="w-8 h-8 text-primary shrink-0" />
                        Daftar Pengiriman
                    </h1>
                    <p className="text-sm text-base-content/50 font-medium">Kelola pengiriman order pelanggan Anda di sini.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <ShipmentHeader stats={stats} onAddShipment={() => setIsModalOpen(true)} />

            {/* Sub-Nav Tabs */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <a href={route('admin.products.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Package className="w-4 h-4 text-base-content/50" /> Produk
                </a>
                <a href={route('admin.categories.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Tag className="w-4 h-4 text-base-content/50" /> Kategori
                </a>
                <a href={route('admin.orders.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <ShoppingCart className="w-4 h-4 text-base-content/50" /> Order
                </a>
                <a href={route('admin.shipments.index')} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/30">
                    <Truck className="w-4 h-4" /> Pengiriman
                </a>
            </div>

            {/* Filters */}
            <ShipmentFilters
                searchQuery={searchQuery}
                selectedStatus={selectedStatus}
                selectedCourier={selectedCourier}
                onSearchChange={setSearchQuery}
                onStatusChange={setSelectedStatus}
                onCourierChange={setSelectedCourier}
                onSearch={handleSearch}
                onClear={handleClearFilters}
            />

            {/* Table */}
            <ShipmentTable
                shipments={shipments.data}
                onViewDetail={handleViewDetail}
            />

            {/* Pagination */}
            <ShipmentPagination
                from={shipments.from}
                to={shipments.to}
                total={shipments.total}
                links={shipments.links}
            />

            {/* Shipment Detail Modal */}
            <ShipmentDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                shipment={selectedShipment}
            />
        </AdminLayout>
    );
}
