import { Sparkles, Star } from 'lucide-react';

interface CategoryStatsProps {
    stats: {
        products: number;
        averageRating: number;
    };
}

export default function CategoryStats({ stats }: CategoryStatsProps) {
    return (
        <section className="py-10 bg-base-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="card bg-base-200">
                        <div className="card-body flex-row items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-sm text-base-content/70">
                                    Total Produk
                                </div>
                                <div className="text-2xl font-black">
                                    {stats.products}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-200">
                        <div className="card-body flex-row items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                                <Star className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-sm text-base-content/70">
                                    Rata-rata Rating
                                </div>
                                <div className="text-2xl font-black">
                                    {stats.averageRating.toFixed(1)} / 5
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
