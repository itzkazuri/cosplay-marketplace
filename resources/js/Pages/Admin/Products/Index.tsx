import AdminLayout from '@/components/layout/AdminLayout';
import AlertDialog from '@/components/ui/AlertDialog';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    Download,
    ShoppingBag,
    Package,
    Layers,
    Tag,
    Image,
    ChevronRight,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    ArrowUpDown
} from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    slug: string;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    base_price: string | number;
    weight: number;
    main_image: string | null;
    is_custom: boolean;
    is_active: boolean;
    skus: Array<{
        id: number;
        sku: string;
        size: string | null;
        stock: number;
        is_active: boolean;
    }>;
    created_at: string;
    updated_at: string;
}

interface ProductsPaginated {
    data: Product[];
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
    products: ProductsPaginated;
}

export default function ProductsIndex({ products }: Props) {
    const [deleteCandidate, setDeleteCandidate] = useState<{ id: number; name: string } | null>(null);

    const getStatusLabel = (product: Product): string => {
        const totalStock = product.skus.reduce((sum, sku) => sum + sku.stock, 0);
        if (!product.is_active) return 'Nonaktif';
        if (totalStock === 0) return 'Out of Stock';
        if (product.is_custom) return 'Pre-Order';
        return 'Ready';
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Ready':
                return 'badge-success';
            case 'Pre-Order':
                return 'badge-info';
            case 'Out of Stock':
                return 'badge-error';
            default:
                return 'badge-ghost';
        }
    };

    const getTotalStock = (product: Product): number => {
        return product.skus.reduce((sum, sku) => sum + sku.stock, 0);
    };

    const formatPrice = (price: string | number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(typeof price === 'string' ? parseFloat(price) : price);
    };

    const handleDelete = (productId: number, productName: string) => {
        setDeleteCandidate({ id: productId, name: productName });
    };

    const confirmDelete = () => {
        if (deleteCandidate === null) {
            return;
        }

        router.delete(route('admin.products.destroy', deleteCandidate.id), {
            preserveScroll: true,
        });
        setDeleteCandidate(null);
    };

    return (
        <AdminLayout title="Manajemen Produk">
            <AlertDialog
                isOpen={deleteCandidate !== null}
                title="Hapus Produk"
                message={`Produk "${deleteCandidate?.name ?? ''}" akan dihapus permanen. Lanjutkan?`}
                confirmLabel="Ya, Hapus"
                confirmType="error"
                onCancel={() => setDeleteCandidate(null)}
                onConfirm={confirmDelete}
            />

            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-base-content uppercase flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-primary shrink-0" />
                        Daftar Produk
                    </h1>
                    <p className="text-sm text-base-content/50 font-medium">Kelola semua inventaris produk cosplay Anda di sini.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn btn-outline btn-sm font-bold gap-2 rounded-xl">
                        <Download className="w-4 h-4" /> Ekspor CSV
                    </button>
                    <Link href={route('admin.products.create')} className="btn btn-primary btn-sm font-black gap-2 rounded-xl shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" /> Tambah Produk
                    </Link>
                </div>
            </div>

            {/* ── Sub-Nav Tabs ── */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <Link href={route('admin.products.index')} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/30">
                    <Package className="w-4 h-4" /> Semua Produk
                </Link>
                <Link href={route('admin.categories.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Tag className="w-4 h-4 text-base-content/50" /> Kategori
                </Link>
                <Link href={route('admin.product-skus.index')} className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Layers className="w-4 h-4 text-base-content/50" /> SKU & Stok
                </Link>
                <Link href="/admin/product-images" className="flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-base-200 transition-colors">
                    <Image className="w-4 h-4 text-base-content/50" /> Media
                </Link>
            </div>

            {/* ── Filters & Search ── */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari produk berdasarkan nama, SKU, atau ID..."
                        className="input input-bordered w-full pl-12 rounded-2xl focus:input-primary border-base-300 font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select className="select select-bordered rounded-2xl focus:select-primary border-base-300 font-bold text-xs flex-1 md:flex-none">
                        <option>Semua Status</option>
                        <option>Ready</option>
                        <option>Pre-Order</option>
                        <option>Out of Stock</option>
                        <option>Nonaktif</option>
                    </select>
                    <button className="btn btn-square btn-outline rounded-2xl border-base-300">
                        <Filter className="w-4 h-4 opacity-50" />
                    </button>
                </div>
            </div>

            {/* ── Main Table ── */}
            <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-300">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-base-200/50">
                                <th className="w-12">
                                    <label>
                                        <input type="checkbox" className="checkbox checkbox-sm checkbox-primary rounded-md" />
                                    </label>
                                </th>
                                <th className="text-xs font-black uppercase tracking-wider opacity-50 flex items-center gap-1 group cursor-pointer">
                                    Produk
                                    <ArrowUpDown className="w-3 h-3 group-hover:text-primary transition-colors" />
                                </th>
                                <th className="text-xs font-black uppercase tracking-wider opacity-50">Kategori</th>
                                <th className="text-xs font-black uppercase tracking-wider opacity-50">Harga</th>
                                <th className="text-xs font-black uppercase tracking-wider opacity-50">Stok</th>
                                <th className="text-xs font-black uppercase tracking-wider opacity-50">Status</th>
                                <th className="w-16"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12">
                                        <Package className="w-16 h-16 text-base-content/10 mx-auto mb-4" />
                                        <p className="font-bold text-base-content mb-2">Belum ada produk</p>
                                        <p className="text-sm text-base-content/50 mb-4">Mulai dengan menambahkan produk pertama Anda</p>
                                        <Link href={route('admin.products.create')} className="btn btn-primary btn-sm gap-2 rounded-xl font-bold">
                                            <Plus className="w-4 h-4" /> Tambah Produk
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                products.data.map((product) => {
                                    const status = getStatusLabel(product);
                                    const totalStock = getTotalStock(product);
                                    return (
                                        <tr key={product.id} className="hover:bg-primary/5 transition-colors group">
                                            <td>
                                                <label>
                                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary rounded-md" />
                                                </label>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-4">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12 bg-base-200">
                                                            {product.main_image ? (
                                                                <img src={product.main_image} alt={product.name} />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <ShoppingBag className="w-5 h-5 opacity-20" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="font-bold text-sm tracking-tight max-w-[200px] group-hover:text-primary transition-colors">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-[10px] text-base-content/50 uppercase font-black tracking-widest">
                                                            #{product.id.toString().padStart(4, '0')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="badge badge-outline badge-sm gap-1 font-bold rounded-lg border-base-300 py-3 px-3">
                                                    <Tag className="w-3 h-3 text-primary" />
                                                    {product.category?.name || '-'}
                                                </div>
                                            </td>
                                            <td className="font-black text-sm">
                                                {formatPrice(product.base_price)}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        totalStock > 10 ? 'bg-success' :
                                                        totalStock > 0 ? 'bg-warning' : 'bg-error'
                                                    }`}></div>
                                                    <span className="text-sm font-bold">{totalStock} pcs</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm font-bold py-2.5 px-3 rounded-lg ${getStatusColor(status)}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="dropdown dropdown-left dropdown-end">
                                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-square">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </div>
                                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-base-100 border border-base-300 rounded-2xl w-48 z-50">
                                                        <li>
                                                            <Link href="#" className="rounded-xl py-2 font-medium">
                                                                <Eye className="w-4 h-4 text-info" />
                                                                <span>Lihat Detail</span>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href={route('admin.products.edit', product.id)} className="rounded-xl py-2 font-medium">
                                                                <Edit className="w-4 h-4 text-warning" />
                                                                <span>Ubah Data</span>
                                                            </Link>
                                                        </li>
                                                        <li className="mt-1 border-t border-base-200 pt-1">
                                                            <button
                                                                onClick={() => handleDelete(product.id, product.name)}
                                                                className="rounded-xl py-2 font-medium text-error hover:bg-error/10"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                <span>Hapus Produk</span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Pagination ── */}
            {products.data.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2">
                    <p className="text-xs font-bold text-base-content/40 tracking-widest uppercase">
                        Menampilkan {products.from} - {products.to} dari {products.total} Produk
                    </p>
                    <div className="join shadow-xl shadow-base-content/5 rounded-2xl overflow-hidden">
                        {products.links.map((link, index) => {
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
                            if (index === products.links.length - 1 && link.label === 'Next &raquo;') {
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
