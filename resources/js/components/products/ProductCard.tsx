import { Link } from '@inertiajs/react';
import { Star, Package } from 'lucide-react';

interface ProductCardProps {
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

export default function ProductCard({
    id,
    name,
    slug,
    category,
    categorySlug,
    image,
    price,
    originalPrice,
    rating,
    reviews,
    discount,
}: ProductCardProps) {
    const discountPercentage = originalPrice
        ? Math.round((1 - price / originalPrice) * 100)
        : 0;

    return (
        <Link
            href={`/products/${slug}`}
            className="group card bg-base-100 hover:bg-base-200 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
            <figure className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-base-content/30">
                        <Package className="w-16 h-16" />
                    </div>
                )}

                {/* Discount Badge */}
                {discount && (
                    <span className="absolute top-2 left-2 badge badge-error text-white font-bold">
                        -{discountPercentage}%
                    </span>
                )}

                {/* Quick Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button className="btn btn-sm btn-primary">
                        Lihat Detail
                    </button>
                </div>
            </figure>

            <div className="card-body p-4">
                <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
                    {name}
                </h3>

                {category && (
                    <Link
                        href={`/categories/${categorySlug}`}
                        className="text-xs text-base-content/60 hover:text-primary"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {category}
                    </Link>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{rating}</span>
                    <span className="text-xs text-base-content/60">({reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-lg">
                        Rp {price.toLocaleString('id-ID')}
                    </span>
                    {originalPrice && (
                        <span className="text-xs text-base-content/50 line-through">
                            Rp {originalPrice.toLocaleString('id-ID')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
