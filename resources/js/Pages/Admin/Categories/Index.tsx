import AdminLayout from '@/components/layout/AdminLayout';
import AlertDialog from '@/components/ui/AlertDialog';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Tag,
    Package,
    Layers,
    Image as ImageIcon,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    ChevronRight,
    ShoppingBag,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    type: 'aksesori' | 'custom' | 'ready_stock' | 'wig' | 'props';
    is_active: boolean;
    products_count?: number;
    created_at: string;
    updated_at: string;
}

interface CategoriesPaginated {
    data: Category[];
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
    categories: CategoriesPaginated;
}

export default function Index({ categories }: Props) {
    const [deleteCandidate, setDeleteCandidate] = useState<{ id: number; name: string } | null>(null);
    const getTypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            ready_stock: 'Ready Stock',
            custom: 'Custom Order',
            aksesori: 'Aksesoris',
            wig: 'Wig',
            props: 'Props',
        };
        return labels[type] || type;
    };

    const getTypeColor = (type: string): string => {
        const colors: Record<string, string> = {
            ready_stock: 'badge-success',
            custom: 'badge-warning',
            aksesori: 'badge-info',
            wig: 'badge-secondary',
            props: 'badge-error',
        };
        return colors[type] || 'badge-ghost';
    };

    const handleDelete = (categoryId: number, categoryName: string) => {
        setDeleteCandidate({ id: categoryId, name: categoryName });
    };

    const confirmDelete = () => {
        if (deleteCandidate === null) {
            return;
        }

        router.delete(route('admin.categories.destroy', deleteCandidate.id), {
            preserveScroll: true,
        });
        setDeleteCandidate(null);
    };

    return (
        <AdminLayout title="Manajemen Kategori">
            <Head title="Manajemen Kategori" />
            <AlertDialog
                isOpen={deleteCandidate !== null}
                title="Hapus Kategori"
                message={`Kategori "${deleteCandidate?.name ?? ''}" akan dihapus. Lanjutkan?`}
                confirmLabel="Ya, Hapus"
                confirmType="error"
                onCancel={() => setDeleteCandidate(null)}
                onConfirm={confirmDelete}
            />

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-base-content uppercase flex items-center gap-3">
                        <Tag className="w-8 h-8 text-primary shrink-0" />
                        Daftar Kategori
                    </h1>
                    <p className="text-sm text-base-content/50 font-medium">Kelola kategori produk cosplay Anda di sini.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={route('admin.categories.create')} className="btn btn-primary btn-sm font-black gap-2 rounded-xl shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" /> Tambah Kategori
                    </Link>
                </div>
            </div>

            {/* Sub-Nav Tabs */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <Link href={route('admin.categories.index')} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/30">
                    <Tag className="w-4 h-4" /> Semua Kategori
                </Link>
                <Link href={route('admin.products.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Package className="w-4 h-4 text-base-content/50" /> Produk
                </Link>
                <Link href={route('admin.product-skus.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Layers className="w-4 h-4 text-base-content/50" /> SKU & Stok
                </Link>
                <Link href="/admin/product-images" className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <ImageIcon className="w-4 h-4 text-base-content/50" /> Media
                </Link>
            </div>

            {/* Categories Grid */}
            {categories.data.length === 0 ? (
                <div className="card bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
                    <Tag className="w-16 h-16 text-base-content/10 mx-auto mb-4" />
                    <h3 className="font-bold text-lg text-base-content mb-2">Belum ada kategori</h3>
                    <p className="text-sm text-base-content/50 mb-4">Mulai dengan menambahkan kategori pertama Anda</p>
                    <Link href={route('admin.categories.create')} className="btn btn-primary gap-2 rounded-xl font-bold">
                        <Plus className="w-4 h-4" /> Tambah Kategori
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.data.map((category) => (
                        <div
                            key={category.id}
                            className="card bg-base-100 border border-base-300 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group"
                        >
                            {/* Image */}
                            <div className="relative h-40 bg-base-200 overflow-hidden">
                                {category.image ? (
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Tag className="w-12 h-12 text-base-content/20" />
                                    </div>
                                )}
                                
                                {/* Status Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`badge badge-sm font-bold ${
                                        category.is_active ? 'badge-success' : 'badge-ghost'
                                    }`}>
                                        {category.is_active ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Aktif
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-3 h-3 mr-1" />
                                                Nonaktif
                                            </>
                                        )}
                                    </span>
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`badge badge-sm font-bold ${getTypeColor(category.type)}`}>
                                        {getTypeLabel(category.type)}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="card-body p-4">
                                <h3 className="font-bold text-lg truncate" title={category.name}>
                                    {category.name}
                                </h3>
                                <p className="text-xs text-base-content/50 font-mono truncate">
                                    /{category.slug}
                                </p>
                                
                                {category.description && (
                                    <p className="text-sm text-base-content/60 line-clamp-2 mt-2">
                                        {category.description}
                                    </p>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-base-200">
                                    <div className="flex items-center gap-1 text-xs text-base-content/50">
                                        <Package className="w-3 h-3" />
                                        <span className="font-bold">{category.products_count ?? 0} Produk</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-3">
                                    <Link
                                        href={route('admin.categories.edit', category.id)}
                                        className="btn btn-outline btn-sm flex-1 gap-2 rounded-xl font-bold"
                                    >
                                        <Edit className="w-3 h-3" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-xl"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {categories.data.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2">
                    <p className="text-xs font-bold text-base-content/40 tracking-widest uppercase">
                        Menampilkan {categories.from} - {categories.to} dari {categories.total} Kategori
                    </p>
                    <div className="join shadow-xl shadow-base-content/5 rounded-2xl overflow-hidden">
                        {categories.links.map((link, index) => {
                            if (index === 0 && link.label === '&laquo; Previous') {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className="join-item btn btn-sm bg-base-100 border-base-300 hover:bg-primary hover:text-primary-content transition-all duration-300 disabled:opacity-50"
                                        disabled={!link.url}
                                    >
                                        Sebelumnya
                                    </button>
                                );
                            }
                            if (index === categories.links.length - 1 && link.label === 'Next &raquo;') {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className="join-item btn btn-sm bg-base-100 border-base-300 hover:bg-primary hover:text-primary-content transition-all duration-300 disabled:opacity-50"
                                        disabled={!link.url}
                                    >
                                        Berikutnya
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                );
                            }
                            return (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.visit(link.url)}
                                    className={`join-item btn btn-sm transition-all duration-300 ${
                                        link.active
                                            ? 'bg-primary text-primary-content'
                                            : 'bg-base-100 border-base-300 hover:bg-primary hover:text-primary-content'
                                    }`}
                                >
                                    {link.label.replace('&laquo;', '').replace('&raquo;', '').trim()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
