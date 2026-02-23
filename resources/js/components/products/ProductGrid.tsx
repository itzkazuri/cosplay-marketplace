import { Package, Grid3X3, List } from 'lucide-react';
import ProductCard from './ProductCard';

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

interface ProductGridProps {
    products: Product[];
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    isLoading: boolean;
}

export default function ProductGrid({
    products,
    viewMode,
    onViewModeChange,
    isLoading,
}: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-base-content/70">Memuat produk...</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <Package className="w-20 h-20 mx-auto text-base-content/20 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-base-content/70 mb-4">
                    Coba ubah filter atau kata kunci pencarian Anda
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-base-content/70">
                    Menampilkan <span className="font-semibold">{products.length}</span> produk
                </p>
                <div className="flex gap-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`btn btn-sm ${viewMode === 'grid' ? 'btn-active' : 'btn-ghost'}`}
                        title="Tampilan Grid"
                    >
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`btn btn-sm ${viewMode === 'list' ? 'btn-active' : 'btn-ghost'}`}
                        title="Tampilan List"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Products Grid/List */}
            <div
                className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                        : 'flex flex-col gap-4'
                }
            >
                {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </div>
    );
}
