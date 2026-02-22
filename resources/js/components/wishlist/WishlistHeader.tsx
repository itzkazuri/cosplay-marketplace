import { Heart } from 'lucide-react';

interface WishlistHeaderProps {
    total: number;
}

export default function WishlistHeader({ total }: WishlistHeaderProps) {
    return (
        <section className="bg-base-200">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Wishlist</h1>
                        <p className="text-base-content/70">
                            Simpan cosplay favoritmu untuk dibeli nanti.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-base-100 px-4 py-2 text-sm font-semibold text-base-content/70">
                        <Heart className="h-4 w-4 text-secondary" />
                        {total} item
                    </div>
                </div>
            </div>
        </section>
    );
}
