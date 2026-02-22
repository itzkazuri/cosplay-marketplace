import { Image, ShoppingBag, Star } from 'lucide-react';

interface WishlistProduct {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    category?: string | null;
    price: number;
    originalPrice?: number | null;
    rating: number;
    reviews: number;
}

interface WishlistItem {
    id: number;
    product: WishlistProduct;
}

interface WishlistCardProps {
    item: WishlistItem;
}

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

export default function WishlistCard({ item }: WishlistCardProps) {
    const product = item.product;

    return (
        <div className="card bg-base-200 hover:shadow-xl transition-all duration-300 group">
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
                {product.category && (
                    <div className="absolute top-3 left-3 badge badge-outline bg-base-100/80">
                        {product.category}
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
                        <ShoppingBag className="h-4 w-4" />
                        Tambah ke Keranjang
                    </button>
                </div>
            </div>
        </div>
    );
}
