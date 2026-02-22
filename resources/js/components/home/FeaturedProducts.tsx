import { Link } from '@inertiajs/react';
import { ArrowRight, Image, Star } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string | null;
    rating: number;
    reviews: number;
    category?: string | null;
    slug: string;
}

interface FeaturedProductsProps {
    products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <section className="py-16 bg-base-100">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        Produk <span className="text-primary">Unggulan</span>
                    </h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Pilihan kostum cosplay terpopuler dengan kualitas terbaik dan harga terjangkau
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.length === 0 ? (
                        <div className="col-span-full text-center text-base-content/70">
                            Produk unggulan belum tersedia.
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="card bg-base-200 hover:shadow-xl transition-all duration-300 group">
                                {/* Image */}
                                <figure className="relative aspect-[3/4] overflow-hidden bg-base-300">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-100/80 text-base-content/70">
                                                <Image className="h-7 w-7" />
                                            </div>
                                        </div>
                                    )}
                                    {/* Badges */}
                                    {product.originalPrice && (
                                        <div className="absolute top-3 left-3 badge badge-error text-white">
                                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                        </div>
                                    )}
                                    {product.category && (
                                        <div className="absolute top-3 right-3 bg-base-100/90 px-2 py-1 rounded text-xs font-medium">
                                            {product.category}
                                        </div>
                                    )}
                                </figure>

                                {/* Content */}
                                <div className="card-body p-4">
                                    <h3 className="font-medium line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    
                                    {/* Rating */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-warning">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-base-content/70">({product.reviews})</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-primary">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-base-content/50 line-through">
                                                {formatPrice(product.originalPrice)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <div className="card-actions mt-2">
                                        <button className="btn btn-primary btn-sm w-full">
                                            + Keranjang
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* View All */}
                <div className="text-center mt-12">
                    <Link href="/products" className="btn btn-outline btn-lg">
                        Lihat Semua Produk
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
