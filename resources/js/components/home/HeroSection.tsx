import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles, Users, BadgeCheck } from 'lucide-react';

interface HeroStats {
    products: number;
    customers: number;
    satisfaction: number;
}

interface HeroSectionProps {
    stats: HeroStats;
}

const formatCompact = (value: number): string => {
    if (value >= 1000) {
        return `${Math.round(value / 100) / 10}K+`;
    }

    return `${value}+`;
};

export default function HeroSection({ stats }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-base-100 to-accent/10">
            <div className="container mx-auto px-4 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text content */}
                    <div className="space-y-6">
                        <div className="badge badge-primary badge-lg">New Collection 2026</div>
                        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                            Wujudkan Karakter
                            <span className="text-primary block">Impianmu</span>
                        </h1>
                        <p className="text-lg text-base-content/70 max-w-lg">
                            Temukan ribuan kostum cosplay berkualitas tinggi dari anime, game, dan film favoritmu. 
                            Custom size tersedia!
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/products" className="btn btn-primary btn-lg">
                                Belanja Sekarang
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link href="/categories" className="btn btn-outline btn-lg">
                                Lihat Kategori
                            </Link>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex gap-8 pt-8">
                            <div>
                                <div className="text-3xl font-bold text-primary flex items-center gap-2">
                                    <Sparkles className="h-5 w-5" />
                                    {formatCompact(stats.products)}
                                </div>
                                <div className="text-sm text-base-content/70">Produk</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-accent flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    {formatCompact(stats.customers)}
                                </div>
                                <div className="text-sm text-base-content/70">Customer</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-secondary flex items-center gap-2">
                                    <BadgeCheck className="h-5 w-5" />
                                    {stats.satisfaction}%
                                </div>
                                <div className="text-sm text-base-content/70">Puas</div>
                            </div>
                        </div>
                    </div>

                    {/* Image/Visual */}
                    <div className="relative">
                        <div className="relative z-10">
                            <div className="card bg-base-100 shadow-2xl">
                                <figure className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                                            <Sparkles className="h-10 w-10" />
                                        </div>
                                        <p className="text-base-content/70">Hero Banner</p>
                                        <p className="text-sm text-base-content/50">(Tambahkan banner cosplay di sini)</p>
                                    </div>
                                </figure>
                            </div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
