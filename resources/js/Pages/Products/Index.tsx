import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FilterSidebar from '@/components/products/FilterSidebar';
import ProductGrid from '@/components/products/ProductGrid';
import SortDropdown from '@/components/products/SortDropdown';
import { Search, Filter, X } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    type: string;
    image?: string | null;
    productsCount: number;
}

interface Filters {
    category?: string | null;
    min_price?: string | null;
    max_price?: string | null;
    discount?: boolean;
    sort?: string;
    search?: string | null;
}

interface Product {
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
    discount?: {
        type: string;
        value: number;
    } | null;
}

interface ProductsProps {
    categories: Category[];
    filters: Filters;
    priceRange: {
        min: number;
        max: number;
    };
}

type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

export default function Index({ categories, filters: initialFilters, priceRange }: ProductsProps) {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const initialSearch = searchParams.get('search');

    const [localFilters, setLocalFilters] = useState<Filters>({
        category: initialFilters.category || null,
        min_price: initialFilters.min_price || null,
        max_price: initialFilters.max_price || null,
        discount: initialFilters.discount || false,
        sort: (initialFilters.sort as SortOption) || 'latest',
        search: initialSearch || null,
    });

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
    }, [localFilters]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (localFilters.category) params.append('category', localFilters.category);
            if (localFilters.min_price) params.append('min_price', localFilters.min_price);
            if (localFilters.max_price) params.append('max_price', localFilters.max_price);
            if (localFilters.discount) params.append('discount', '1');
            if (localFilters.sort) params.append('sort', localFilters.sort);
            if (localFilters.search) params.append('search', localFilters.search);

            const response = await fetch(`/api/products/filter?${params.toString()}`);
            const data = await response.json();
            setProducts(data.products.data || data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setLocalFilters((prev) => ({
            ...prev,
            ...newFilters,
        }));
    };

    const handleSortChange = (sort: SortOption) => {
        setLocalFilters((prev) => ({ ...prev, sort }));
    };

    const handleClearFilters = () => {
        setLocalFilters({
            category: null,
            min_price: null,
            max_price: null,
            discount: false,
            sort: 'latest',
            search: null,
        });
    };

    const hasActiveFilters =
        localFilters.category ||
        localFilters.min_price ||
        localFilters.max_price ||
        localFilters.discount ||
        localFilters.search;

    return (
        <>
            <Head title="Semua Produk" />
            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-1 bg-base-200">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-primary/10 via-base-100 to-accent/10 py-8">
                        <div className="container mx-auto px-4">
                            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Semua Produk</h1>
                            <p className="text-base-content/70">
                                Temukan cosplay perfect untuk karakter impianmu
                            </p>

                            {/* Search Bar */}
                            {localFilters.search && (
                                <div className="mt-4 flex items-center gap-2 bg-base-100 rounded-xl p-2 max-w-xl">
                                    <Search className="w-5 h-5 text-base-content/40 ml-2" />
                                    <input
                                        type="text"
                                        value={localFilters.search}
                                        onChange={(e) =>
                                            handleFilterChange({ search: e.target.value || null })
                                        }
                                        placeholder="Cari produk..."
                                        className="flex-1 bg-transparent outline-none"
                                    />
                                    <button
                                        onClick={() => handleFilterChange({ search: null })}
                                        className="btn btn-ghost btn-xs btn-square"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className="flex gap-6">
                            {/* Desktop Sidebar */}
                            <aside className="hidden lg:block w-64 shrink-0">
                                <FilterSidebar
                                    categories={categories}
                                    priceRange={priceRange}
                                    filters={localFilters}
                                    onFilterChange={handleFilterChange}
                                    onClearFilters={handleClearFilters}
                                />
                            </aside>

                            {/* Main Content */}
                            <div className="flex-1">
                                {/* Toolbar */}
                                <div className="flex justify-between items-center mb-4">
                                    {/* Mobile Filter Button */}
                                    <button
                                        onClick={() => setShowMobileFilters(true)}
                                        className="btn btn-sm btn-ghost lg:hidden gap-2"
                                    >
                                        <Filter className="w-4 h-4" />
                                        Filter
                                        {hasActiveFilters && (
                                            <span className="badge badge-primary badge-xs" />
                                        )}
                                    </button>

                                    <div className="ml-auto">
                                        <SortDropdown
                                            currentSort={(localFilters.sort as SortOption) || 'latest'}
                                            onSortChange={handleSortChange}
                                        />
                                    </div>
                                </div>

                                {/* Product Grid */}
                                <ProductGrid
                                    products={products}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
                <div
                    className="fixed inset-0 z-[100] bg-base-content/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setShowMobileFilters(false)}
                >
                    <div
                        className="absolute left-0 top-0 h-full w-80 bg-base-200 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg">Filter</h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="btn btn-ghost btn-sm btn-square"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <FilterSidebar
                                categories={categories}
                                priceRange={priceRange}
                                filters={localFilters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
