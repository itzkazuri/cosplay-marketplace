import { Link } from '@inertiajs/react';
import { Film, Gamepad2, Scissors, Shapes, Sparkles, Wand2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    type: string;
    image?: string | null;
    productsCount: number;
}

const TYPE_ICONS: Record<string, typeof Film> = {
    aksesori: Sparkles,
    custom: Wand2,
    ready_stock: Shapes,
    wig: Scissors,
    props: Film,
};

const getCategoryIcon = (type: string) => {
    return TYPE_ICONS[type] ?? Gamepad2;
};

const getCategoryAccent = (type: string): string => {
    switch (type) {
        case 'aksesori':
            return 'from-pink-500 to-rose-500';
        case 'custom':
            return 'from-yellow-500 to-orange-500';
        case 'ready_stock':
            return 'from-blue-500 to-cyan-500';
        case 'wig':
            return 'from-indigo-500 to-purple-500';
        case 'props':
            return 'from-green-500 to-emerald-500';
        default:
            return 'from-purple-500 to-violet-500';
    }
};

interface CategoriesSectionProps {
    categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
    return (
        <section className="py-16 bg-base-200">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        Kategori <span className="text-accent">Populer</span>
                    </h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Jelajahi koleksi cosplay berdasarkan kategori favoritmu
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.length === 0 ? (
                        <div className="col-span-full text-center text-base-content/70">
                            Belum ada kategori tersedia.
                        </div>
                    ) : (
                        categories.map((category) => {
                            const CategoryIcon = getCategoryIcon(category.type);

                            return (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug ?? category.id}`}
                                    className="group"
                                >
                                    <div className="card bg-base-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="card-body items-center text-center p-6">
                                            {/* Icon */}
                                            <div
                                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getCategoryAccent(category.type)} flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform`}
                                            >
                                                <CategoryIcon className="h-7 w-7 text-white" />
                                            </div>

                                            {/* Name */}
                                            <h3 className="font-bold text-lg group-hover:text-accent transition-colors">
                                                {category.name}
                                            </h3>

                                            {/* Count */}
                                            <p className="text-sm text-base-content/70">
                                                {category.productsCount.toLocaleString('id-ID')} produk
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>

                {/* View All */}
                <div className="text-center mt-12">
                    <Link href="/categories" className="btn btn-outline btn-lg">
                        Lihat Semua Kategori
                    </Link>
                </div>
            </div>
        </section>
    );
}
