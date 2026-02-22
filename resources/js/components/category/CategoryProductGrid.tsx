import { Image, ShoppingBag, Star } from 'lucide-react';

interface CategoryProduct {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    price: number;
    originalPrice?: number | null;
    rating: number;
    reviews: number;
}

interface CategoryProductGridProps {
    products: CategoryProduct[];
}

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

export default function CategoryProductGrid({ products }: CategoryProductGridProps) {
    return (
        <section className="py-16 bg-base-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold">Produk Terbaru</h2>
                        <p className="text-base-content/70">
                            Temukan kostum dan item favoritmu di kategori ini.
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-base-content/60">
                        <ShoppingBag className="h-4 w-4" />
                        <span>{products.length} item</span>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="card bg-base-200">
                        <div className="card-body text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-base-100 text-base-content/60">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold">
                                Produk belum tersedia
                            </h3>
                            <p className="text-base-content/70">
                                Kategori ini sedang dipersiapkan. Cek lagi nanti ya.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="card bg-base-200 hover:shadow-xl transition-all duration-300 group"
                            >
                                <figure className="relative aspect-[4/5] overflow-hidden bg-base-300">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-100/80 text-base-content/70">
                                                <Image className="h-7 w-7" />
                                            </div>
                                        </div>
                                    )}
                                    {product.originalPrice && (
                                        <div className="absolute top-3 left-3 badge badge-error text-white">
                                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                        </div>
                                    )}
                                </figure>
                                <div className="card-body p-4">
                                    <h3 className="font-medium line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-warning">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-base-content/70">
                                            ({product.reviews})
                                        </span>
                                    </div>
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
                                    <div className="card-actions mt-2">
                                        <button className="btn btn-primary btn-sm w-full">
                                            + Keranjang
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
