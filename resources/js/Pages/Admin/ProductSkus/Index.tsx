import AdminLayout from '@/components/layout/AdminLayout';
import AlertDialog from '@/components/ui/AlertDialog';
import { useToast } from '@/components/ui/Toast';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Layers, Tag, Package } from 'lucide-react';
import SkuHeader from '@/components/admin/product-skus/SkuHeader';
import SkuFilters from '@/components/admin/product-skus/SkuFilters';
import SkuTable from '@/components/admin/product-skus/SkuTable';
import SkuPagination from '@/components/admin/product-skus/SkuPagination';
import SkuFormModal from '@/components/admin/product-skus/SkuFormModal';

interface Product {
    id: number;
    name: string;
    slug: string;
}

interface Sku {
    id: number;
    product_id: number;
    sku: string;
    size: string | null;
    gender: string | null;
    color: string | null;
    custom_option: string | null;
    price: string | number;
    stock: number;
    is_custom_order: boolean;
    is_active: boolean;
    product: Product;
    created_at: string;
    updated_at: string;
}

interface SkusPaginated {
    data: Sku[];
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

interface Props {
    skus: SkusPaginated;
    products: Product[];
}

export default function Index({ skus, products }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSku, setEditingSku] = useState<Sku | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState<{ id: number; sku: string } | null>(null);
    const { showToast } = useToast();

    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const handleOpenModal = (sku?: Sku) => {
        setEditingSku(sku || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSku(null);
    };

    const handleSubmit = (data: any) => {
        setIsSubmitting(true);
        if (editingSku) {
            router.put(route('admin.product-skus.update', editingSku.id), data, {
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post(route('admin.product-skus.store'), data, {
                onFinish: () => setIsSubmitting(false),
            });
        }
    };

    const handleDelete = (skuId: number, skuCode: string) => {
        setDeleteCandidate({ id: skuId, sku: skuCode });
    };

    const confirmDelete = () => {
        if (deleteCandidate === null) {
            return;
        }

        router.delete(route('admin.product-skus.destroy', deleteCandidate.id), {
            preserveScroll: true,
        });
        setDeleteCandidate(null);
    };

    const handleUpdateStock = (skuId: number, currentStock: number) => {
        const newStock = prompt('Masukkan jumlah stok baru:', currentStock.toString());
        if (newStock === null) return;
        
        const stockValue = parseInt(newStock);
        if (isNaN(stockValue) || stockValue < 0) {
            showToast({
                type: 'error',
                title: 'Input Tidak Valid',
                message: 'Stok harus berupa angka yang valid',
            });
            return;
        }

        router.post(route('admin.product-skus.update-stock', skuId), {
            stock: stockValue,
        }, {
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        router.get(route('admin.product-skus.index'), {
            search: searchQuery || null,
            product_id: selectedProduct || null,
        }, {
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedProduct('');
        router.get(route('admin.product-skus.index'));
    };

    return (
        <AdminLayout title="SKU & Stok">
            <Head title="SKU & Stok" />
            <AlertDialog
                isOpen={deleteCandidate !== null}
                title="Hapus SKU"
                message={`SKU "${deleteCandidate?.sku ?? ''}" akan dihapus. Lanjutkan?`}
                confirmLabel="Ya, Hapus"
                confirmType="error"
                onCancel={() => setDeleteCandidate(null)}
                onConfirm={confirmDelete}
            />

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

            {/* Header */}
            <SkuHeader onAdd={handleOpenModal} />

            {/* Sub-Nav Tabs */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <a href={route('admin.products.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Package className="w-4 h-4 text-base-content/50" /> Produk
                </a>
                <a href={route('admin.categories.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Tag className="w-4 h-4 text-base-content/50" /> Kategori
                </a>
                <a href={route('admin.product-skus.index')} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/30">
                    <Layers className="w-4 h-4" /> SKU & Stok
                </a>
            </div>

            {/* Filters */}
            <SkuFilters
                searchQuery={searchQuery}
                selectedProduct={selectedProduct}
                products={products}
                onSearchChange={setSearchQuery}
                onProductChange={setSelectedProduct}
                onSearch={handleSearch}
                onClear={handleClearFilters}
            />

            {/* Table */}
            <SkuTable
                skus={skus.data}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onUpdateStock={handleUpdateStock}
            />

            {/* Pagination */}
            <SkuPagination
                from={skus.from}
                to={skus.to}
                total={skus.total}
                links={skus.links}
            />

            {/* SKU Form Modal */}
            <SkuFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                products={products}
                initialData={editingSku}
                isSubmitting={isSubmitting}
            />
        </AdminLayout>
    );
}
