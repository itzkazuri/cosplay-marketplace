import { Link } from '@inertiajs/react';
import { Search, X, Package, Star, TrendingUp } from 'lucide-react';

interface SearchResultProduct {
    id: number;
    name: string;
    slug: string;
    category?: string | null;
    categorySlug?: string | null;
    image?: string | null;
    price: number;
    originalPrice?: number | null;
    rating: number;
    reviews: number;
}

interface SearchResultsProps {
    products: SearchResultProduct[];
    popularSearches: string[];
    hasResults: boolean;
    isSearching: boolean;
    query: string;
    isLoading: boolean;
    onItemClick: () => void;
    onPopularSearchClick: (term: string) => void;
}

export default function SearchResults({
    products,
    popularSearches,
    hasResults,
    isSearching,
    query,
    isLoading,
    onItemClick,
    onPopularSearchClick,
}: SearchResultsProps) {
    // Show loading state
    if (isLoading) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 overflow-hidden z-50">
                <div className="p-8 text-center">
                    <div className="loading loading-spinner loading-md text-primary"></div>
                    <p className="mt-2 text-sm text-base-content/70">Mencari...</p>
                </div>
            </div>
        );
    }

    // Show popular searches when query is empty
    if (!isSearching && popularSearches.length > 0) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 overflow-hidden z-50">
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-xs uppercase tracking-wide text-base-content/60">
                            Populer
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term, index) => (
                            <button
                                key={index}
                                onClick={() => onPopularSearchClick(term)}
                                className="btn btn-sm btn-ghost normal-case"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Show no results state
    if (isSearching && !hasResults && products.length === 0) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 overflow-hidden z-50">
                <div className="py-12 text-center px-4">
                    <Search className="h-12 w-12 mx-auto text-base-content/30 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">
                        Tidak ada hasil untuk "{query}"
                    </h3>
                    <p className="text-base-content/70 text-sm">
                        Coba kata kunci lain seperti nama karakter atau anime
                    </p>
                </div>
            </div>
        );
    }

    // Show product results when searching
    if (isSearching && products.length > 0) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Package className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm uppercase tracking-wide">
                            Produk Ditemukan
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group card bg-base-200 hover:bg-base-300 transition-all duration-200 cursor-pointer"
                                onClick={onItemClick}
                            >
                                <figure className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden rounded-lg">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-base-content/30">
                                            <Package className="h-12 w-12" />
                                        </div>
                                    )}
                                    {product.originalPrice && (
                                        <span className="absolute top-2 right-2 badge badge-error text-xs text-white">
                                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                        </span>
                                    )}
                                </figure>
                                <div className="card-body p-3">
                                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs text-base-content/70">
                                        <Star className="h-3 w-3 fill-warning text-warning" />
                                        <span>{product.rating}</span>
                                        <span>({product.reviews})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-primary font-bold text-sm">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-base-content/50 line-through">
                                                Rp {product.originalPrice.toLocaleString('id-ID')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
