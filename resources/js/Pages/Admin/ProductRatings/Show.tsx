import AdminLayout from '@/components/layout/AdminLayout';
import AlertDialog from '@/components/ui/AlertDialog';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Star,
    Search,
    Filter,
    Check,
    X,
    Trash2,
    ChevronLeft,
    User,
    ShoppingCart,
    Image as ImageIcon,
    Shield,
    MessageSquare,
} from 'lucide-react';
import { useState } from 'react';

interface Rating {
    id: number;
    product_id: number;
    user_id: number;
    order_id: number | null;
    rating: number;
    review: string | null;
    images: string[] | null;
    is_verified_purchase: boolean;
    is_visible: boolean;
    helpful_count: number;
    approved_at: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
    };
    order: {
        id: number;
        order_number: string;
        status: string;
    } | null;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    main_image: string | null;
    base_price: number;
}

interface Stats {
    total: number;
    visible: number;
    pending: number;
    average: number;
}

interface Filters {
    rating: string | null;
    verified: boolean | null;
    visibility: string | null;
    search: string | null;
}

interface Props {
    product: Product;
    ratings: {
        data: Rating[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats: Stats;
    filters: Filters;
}

export default function Show({ product, ratings, stats, filters }: Props) {
    const [deleteRatingId, setDeleteRatingId] = useState<number | null>(null);
    const form = useForm({
        search: filters.search || '',
        rating: filters.rating || '',
        verified: filters.verified ? '1' : '',
        visibility: filters.visibility || '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('admin.product-ratings.show', product.id), form.data, {
            preserveState: true,
        });
    };

    const handleApprove = (ratingId: number) => {
        router.post(route('admin.product-ratings.approve', ratingId));
    };

    const handleReject = (ratingId: number) => {
        router.post(route('admin.product-ratings.reject', ratingId));
    };

    const handleDelete = (ratingId: number) => {
        setDeleteRatingId(ratingId);
    };

    const confirmDelete = () => {
        if (deleteRatingId === null) {
            return;
        }

        router.delete(route('admin.product-ratings.destroy', deleteRatingId));
        setDeleteRatingId(null);
    };

    const renderStars = (rating: number, size: number = 5) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-${size} h-${size} ${
                            star <= rating
                                ? 'fill-warning text-warning'
                                : 'fill-base-300 text-base-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const getStatusBadge = (rating: Rating) => {
        if (rating.is_visible && rating.approved_at) {
            return (
                <span className="badge badge-success badge-sm gap-1">
                    <Check className="w-3 h-3" />
                    Disetujui
                </span>
            );
        }
        if (!rating.is_visible && rating.approved_at) {
            return (
                <span className="badge badge-ghost badge-sm gap-1">
                    <X className="w-3 h-3" />
                    Ditolak
                </span>
            );
        }
        return (
            <span className="badge badge-warning badge-sm gap-1">
                <Shield className="w-3 h-3" />
                Menunggu
            </span>
        );
    };

    return (
        <AdminLayout title="Review Produk">
            <Head title={`Review - ${product.name}`} />
            <AlertDialog
                isOpen={deleteRatingId !== null}
                title="Hapus Rating"
                message="Rating ini akan dihapus permanen. Lanjutkan?"
                confirmLabel="Ya, Hapus"
                confirmType="error"
                onCancel={() => setDeleteRatingId(null)}
                onConfirm={confirmDelete}
            />

            {/* Header */}
            <div className="bg-base-100 border-b border-base-300 mb-6">
                <div className="px-6 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Link
                            href={route('admin.product-ratings.index')}
                            className="btn btn-ghost btn-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Kembali
                        </Link>
                        <h1 className="text-2xl font-bold text-base-content">Review Produk</h1>
                    </div>

                    {/* Product Info */}
                    <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                        <div className="avatar">
                            <div className="mask mask-squircle w-20 h-20 bg-base-300">
                                {product.main_image ? (
                                    <img
                                        src={product.main_image}
                                        alt={product.name}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <span className="text-2xl font-bold text-base-content/50">
                                            {product.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-base-content">{product.name}</h2>
                            <p className="text-sm text-base-content/70">Rp {Number(product.base_price).toLocaleString('id-ID')}</p>
                            <div className="flex items-center gap-2 mt-2">
                                {renderStars(Math.round(stats.average), 4)}
                                <span className="text-sm font-medium text-base-content">
                                    {stats.average.toFixed(1)} ({stats.total} review)
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="text-center px-4 py-2 bg-base-100 rounded-lg">
                                <p className="text-xs text-base-content/70">Total</p>
                                <p className="text-lg font-bold text-base-content">{stats.total}</p>
                            </div>
                            <div className="text-center px-4 py-2 bg-base-100 rounded-lg">
                                <p className="text-xs text-base-content/70">Ditampilkan</p>
                                <p className="text-lg font-bold text-success">{stats.visible}</p>
                            </div>
                            <div className="text-center px-4 py-2 bg-base-100 rounded-lg">
                                <p className="text-xs text-base-content/70">Pending</p>
                                <p className="text-lg font-bold text-warning">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Search & Filter */}
                <form onSubmit={handleSearch} className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-4">
                        <div className="flex flex-wrap gap-3">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                                    <input
                                        type="text"
                                        name="search"
                                        value={form.data.search}
                                        onChange={(e) => form.setData('search', e.target.value)}
                                        placeholder="Cari review..."
                                        className="input input-bordered w-full pl-10"
                                    />
                                </div>
                            </div>
                            <select
                                name="rating"
                                value={form.data.rating}
                                onChange={(e) => form.setData('rating', e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="">Semua Rating</option>
                                <option value="5">5 Bintang</option>
                                <option value="4">4 Bintang</option>
                                <option value="3">3 Bintang</option>
                                <option value="2">2 Bintang</option>
                                <option value="1">1 Bintang</option>
                            </select>
                            <select
                                name="verified"
                                value={form.data.verified}
                                onChange={(e) => form.setData('verified', e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="">Semua</option>
                                <option value="1">Terverifikasi</option>
                                <option value="0">Belum Terverifikasi</option>
                            </select>
                            <select
                                name="visibility"
                                value={form.data.visibility}
                                onChange={(e) => form.setData('visibility', e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="">Semua Status</option>
                                <option value="visible">Ditampilkan</option>
                                <option value="hidden">Disembunyikan</option>
                                <option value="pending">Menunggu</option>
                            </select>
                            <button type="submit" className="btn btn-primary">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-4">
                    {ratings.data.length === 0 ? (
                        <div className="card bg-base-100 shadow-sm border border-base-300">
                            <div className="card-body p-8 text-center">
                                <MessageSquare className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
                                <p className="text-base-content/50 font-medium">Belum ada review untuk produk ini</p>
                            </div>
                        </div>
                    ) : (
                        ratings.data.map((rating) => (
                            <div key={rating.id} className="card bg-base-100 shadow-sm border border-base-300">
                                <div className="card-body">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary">
                                                    <span className="text-sm font-bold">
                                                        {rating.user.name.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-base-content">{rating.user.name}</div>
                                                <div className="text-xs text-base-content/50">{rating.user.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(rating)}
                                            {rating.is_verified_purchase && (
                                                <span className="badge badge-primary badge-sm gap-1">
                                                    <Shield className="w-3 h-3" />
                                                    Terverifikasi
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="mt-2">
                                        {renderStars(rating.rating)}
                                    </div>

                                    {/* Review */}
                                    {rating.review && (
                                        <p className="text-base-content/80 mt-2">{rating.review}</p>
                                    )}

                                    {/* Images */}
                                    {rating.images && rating.images.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {rating.images.map((image, index) => (
                                                <div key={index} className="avatar">
                                                    <div className="mask mask-squircle w-20 h-20">
                                                        <img
                                                            src={image}
                                                            alt={`Review image ${index + 1}`}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Order Info */}
                                    {rating.order && (
                                        <div className="flex items-center gap-2 mt-3 text-sm text-base-content/70">
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>Order: {rating.order.order_number}</span>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-300">
                                        <div className="text-xs text-base-content/50">
                                            {new Date(rating.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>
                                        <div className="flex gap-2">
                                            {!rating.is_visible && !rating.approved_at && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(rating.id)}
                                                        className="btn btn-success btn-sm"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Setujui
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(rating.id)}
                                                        className="btn btn-ghost btn-sm"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Tolak
                                                    </button>
                                                </>
                                            )}
                                            {rating.is_visible && (
                                                <button
                                                    onClick={() => handleReject(rating.id)}
                                                    className="btn btn-ghost btn-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Sembunyikan
                                                </button>
                                            )}
                                            {!rating.is_visible && rating.approved_at && (
                                                <button
                                                    onClick={() => handleApprove(rating.id)}
                                                    className="btn btn-ghost btn-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Tampilkan
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(rating.id)}
                                                className="btn btn-error btn-sm text-white"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {ratings.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {ratings.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={`btn btn-sm ${
                                    link.active
                                        ? 'btn-primary'
                                        : link.url
                                        ? 'btn-ghost'
                                        : 'btn-ghost opacity-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
