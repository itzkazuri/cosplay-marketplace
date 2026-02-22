import WishlistCard from './WishlistCard';
import { HeartOff } from 'lucide-react';

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

interface WishlistGridProps {
    items: WishlistItem[];
}

export default function WishlistGrid({ items }: WishlistGridProps) {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                {items.length === 0 ? (
                    <div className="card bg-base-200">
                        <div className="card-body items-center text-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-100 text-base-content/60">
                                <HeartOff className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">
                                    Wishlist masih kosong
                                </h3>
                                <p className="text-base-content/70">
                                    Mulai tambahkan cosplay favoritmu.
                                </p>
                            </div>
                            <button className="btn btn-primary btn-wide">
                                Jelajahi Produk
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <WishlistCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
