import { Link } from '@inertiajs/react';
import { Heart, Share2, Star } from 'lucide-react';

interface ProductCategory {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category: ProductCategory | null;
    price: number;
    originalPrice?: number | null;
    discountPercentage?: number | null;
    rating: number;
    reviewsCount: number;
    totalSold: number;
}

interface ProductInfoProps {
    product: Product;
    onWishlist: () => void;
    onShare: () => void;
}

export default function ProductInfo({ product, onWishlist, onShare }: ProductInfoProps) {
    return (
        <div className="space-y-6">
            {/* Category */}
            {product.category && (
                <Link
                    href={`/categories/${product.category.slug}`}
                    className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                >
                    {product.category.name}
                </Link>
            )}

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
                {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-5 h-5 ${
                                star <= Math.round(product.rating)
                                    ? 'fill-warning text-warning'
                                    : 'fill-base-300 text-base-300'
                            }`}
                        />
                    ))}
                </div>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-base-content/60">
                    ({product.reviewsCount} ulasan)
                </span>
                <span className="text-base-content/60">•</span>
                <span className="text-base-content/60">
                    {product.totalSold} terjual
                </span>
            </div>

            {/* Price */}
            <div className="p-4 bg-base-100 rounded-xl border border-base-300">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                        Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.originalPrice && (
                        <>
                            <span className="text-lg text-base-content/50 line-through">
                                Rp {product.originalPrice.toLocaleString('id-ID')}
                            </span>
                            {product.discountPercentage && (
                                <span className="badge badge-error text-white font-bold">
                                    -{product.discountPercentage}%
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={onWishlist}
                    className="btn btn-ghost btn-square"
                    aria-label="Tambah ke wishlist"
                >
                    <Heart className="w-6 h-6" />
                </button>
                <button
                    onClick={onShare}
                    className="btn btn-ghost btn-square"
                    aria-label="Bagikan"
                >
                    <Share2 className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
