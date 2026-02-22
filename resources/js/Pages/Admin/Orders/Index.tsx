import AdminLayout from '@/components/layout/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ShoppingCart, Package, Tag } from 'lucide-react';
import OrderHeader from '@/components/admin/orders/OrderHeader';
import OrderFilters from '@/components/admin/orders/OrderFilters';
import OrderTable from '@/components/admin/orders/OrderTable';
import OrderPagination from '@/components/admin/orders/OrderPagination';
import OrderDetailModal from '@/components/admin/orders/OrderDetailModal';

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
    updated_at: string;
}

interface OrdersPaginated {
    data: Order[];
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

interface OrderStats {
    total_orders: number;
    pending_orders: number;
    processing_orders: number;
    total_revenue: string | number;
}

interface Props {
    orders: OrdersPaginated;
    users: User[];
    stats: OrderStats;
}

export default function Index({ orders, users, stats }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedUser, setSelectedUser] = useState('');

    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleSearch = () => {
        router.get(route('admin.orders.index'), {
            search: searchQuery || null,
            status: selectedStatus || null,
            user_id: selectedUser || null,
        }, {
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedStatus('');
        setSelectedUser('');
        router.get(route('admin.orders.index'));
    };

    return (
        <AdminLayout title="Manajemen Order">
            <Head title="Manajemen Order" />

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
                        <ShoppingCart className="w-8 h-8 text-primary shrink-0" />
                        Daftar Order
                    </h1>
                    <p className="text-sm text-base-content/50 font-medium">Kelola semua pesanan pelanggan Anda di sini.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <OrderHeader stats={stats} />

            {/* Sub-Nav Tabs */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <a href={route('admin.products.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Package className="w-4 h-4 text-base-content/50" /> Produk
                </a>
                <a href={route('admin.categories.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Tag className="w-4 h-4 text-base-content/50" /> Kategori
                </a>
                <a href={route('admin.orders.index')} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/30">
                    <ShoppingCart className="w-4 h-4" /> Order
                </a>
            </div>

            {/* Filters */}
            <OrderFilters
                searchQuery={searchQuery}
                selectedStatus={selectedStatus}
                selectedUser={selectedUser}
                users={users}
                onSearchChange={setSearchQuery}
                onStatusChange={setSelectedStatus}
                onUserChange={setSelectedUser}
                onSearch={handleSearch}
                onClear={handleClearFilters}
            />

            {/* Table */}
            <OrderTable
                orders={orders.data}
                onViewDetail={handleViewDetail}
            />

            {/* Pagination */}
            <OrderPagination
                from={orders.from}
                to={orders.to}
                total={orders.total}
                links={orders.links}
            />

            {/* Order Detail Modal */}
            <OrderDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                order={selectedOrder}
            />
        </AdminLayout>
    );
}
