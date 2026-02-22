import AdminLayout from '@/components/layout/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Star,
    Search,
    Filter,
    ThumbsUp,
    MessageSquare,
    ChevronRight,
    TrendingUp,
    Eye,
    EyeOff,
    Clock,
} from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
    main_image: string | null;
    base_price: number;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    average_rating: number | null;
    total_ratings_count: number;
}

interface Statistics {
    total: number;
    visible: number;
    pending: number;
    average: number;
    distribution: Record<number, number>;
}

interface Filters {
    search: string | null;
    min_rating: string | null;
}

interface Props {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    statistics: Statistics;
    filters: Filters;
}

export default function Index({ products, statistics, filters }: Props) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        router.get(route('admin.product-ratings.index'), {
            search: formData.get('search'),
            min_rating: formData.get('min_rating'),
        }, {
            preserveState: true,
        });
    };

    const renderStars = (rating: number, size: number = 4) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-${size} h-${size} ${
                            star <= Math.round(rating)
                                ? 'fill-warning text-warning'
                                : 'fill-base-300 text-base-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const getProductImage = (product: Product) => {
        if (product.main_image) {
            return product.main_image;
        }
        return null;
    };

    return (
        <AdminLayout title="Rating Produk">
            <Head title="Rating Produk" />

            {/* Header */}
            <div className="bg-base-100 border-b border-base-300 mb-6">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-base-content">Rating Produk</h1>
                            <p className="text-sm text-base-content/70 mt-1">
                                Kelola dan lihat rating dari setiap produk
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-base-content/70">Total Rating</p>
                                    <h3 className="text-2xl font-bold text-base-content">{statistics.total}</h3>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-base-content/70">Rating Ditampilkan</p>
                                    <h3 className="text-2xl font-bold text-base-content">{statistics.visible}</h3>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-success" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-base-content/70">Menunggu Persetujuan</p>
                                    <h3 className="text-2xl font-bold text-base-content">{statistics.pending}</h3>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-warning" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-base-content/70">Rata-rata Rating</p>
                                    <h3 className="text-2xl font-bold text-base-content">{statistics.average}</h3>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-accent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">Distribusi Rating</h3>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = statistics.distribution[star] || 0;
                                const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 w-16">
                                            <span className="text-sm font-medium text-base-content">{star}</span>
                                            <Star className="w-4 h-4 fill-warning text-warning" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-base-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-warning transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm text-base-content/70 w-12 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

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
                                        defaultValue={filters.search || ''}
                                        placeholder="Cari produk..."
                                        className="input input-bordered w-full pl-10"
                                    />
                                </div>
                            </div>
                            <select
                                name="min_rating"
                                defaultValue={filters.min_rating || ''}
                                className="select select-bordered"
                            >
                                <option value="">Semua Rating</option>
                                <option value="5">5 Bintang</option>
                                <option value="4">4+ Bintang</option>
                                <option value="3">3+ Bintang</option>
                                <option value="2">2+ Bintang</option>
                                <option value="1">1+ Bintang</option>
                            </select>
                            <button type="submit" className="btn btn-primary">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>
                </form>

                {/* Products Table */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-base-content/70">Produk</th>
                                        <th className="text-base-content/70 text-center">Kategori</th>
                                        <th className="text-base-content/70 text-center">Rating</th>
                                        <th className="text-base-content/70 text-center">Total Review</th>
                                        <th className="text-base-content/70 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-base-content/50 py-8">
                                                Belum ada produk dengan rating
                                            </td>
                                        </tr>
                                    ) : (
                                        products.data.map((product) => (
                                            <tr key={product.id} className="hover">
                                                <td>
                                                    <Link
                                                        href={route('admin.product-ratings.show', product.id)}
                                                        className="flex items-center gap-3 hover:text-primary transition-colors"
                                                    >
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle w-12 h-12 bg-base-200">
                                                                {getProductImage(product) ? (
                                                                    <img
                                                                        src={getProductImage(product)}
                                                                        alt={product.name}
                                                                        className="object-cover w-full h-full"
                                                                    />
                                                                ) : (
                                                                    <div className="flex items-center justify-center w-full h-full">
                                                                        <span className="text-lg font-bold text-base-content/50">
                                                                            {product.name.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-base-content">{product.name}</div>
                                                            <div className="text-xs text-base-content/50">Rp {Number(product.base_price).toLocaleString('id-ID')}</div>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="text-center">
                                                    <span className="badge badge-ghost badge-sm">
                                                        {product.category.name}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    {product.average_rating ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            {renderStars(product.average_rating)}
                                                            <span className="text-sm font-medium text-base-content">
                                                                {product.average_rating.toFixed(1)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-base-content/50">-</span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <span className="badge badge-primary badge-sm gap-1">
                                                        <ThumbsUp className="w-3 h-3" />
                                                        {product.total_ratings_count}
                                                    </span>
                                                </td>
                                                <td className="text-right">
                                                    <Link
                                                        href={route('admin.product-ratings.show', product.id)}
                                                        className="btn btn-ghost btn-sm"
                                                    >
                                                        Lihat Review
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {products.links.map((link, index) => (
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
