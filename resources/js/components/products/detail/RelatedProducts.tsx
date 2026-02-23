import { Link } from '@inertiajs/react';
import { Star, Package } from 'lucide-react';

interface RelatedProduct {
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

interface RelatedProductsProps {
    products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Produk Terkait</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => {
                    const discountPercentage = product.originalPrice
                        ? Math.round((1 - product.price / product.originalPrice) * 100)
                        : 0;

                    return (
                        <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="group card bg-base-100 hover:bg-base-200 transition-all duration-300 shadow-sm hover:shadow-xl"
                        >
                            <figure className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-xl">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-base-content/30">
                                        <Package className="w-12 h-12" />
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {product.originalPrice && (
                                    <span className="absolute top-2 left-2 badge badge-error text-white font-bold text-xs">
                                        -{discountPercentage}%
                                    </span>
                                )}
                            </figure>

                            <div className="card-body p-3">
                                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                                    <span className="text-xs font-medium">{product.rating}</span>
                                    <span className="text-xs text-base-content/60">
                                        ({product.reviews})
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-1">
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
                    );
                })}
            </div>
        </div>
    );
}
