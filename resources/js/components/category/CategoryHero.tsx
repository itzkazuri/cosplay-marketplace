import { BadgeCheck, Image } from 'lucide-react';

interface CategoryInfo {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    type: string;
    image?: string | null;
}

interface CategoryHeroProps {
    category: CategoryInfo;
}

const getTypeLabel = (type: string): string => {
    switch (type) {
        case 'aksesori':
            return 'Aksesoris';
        case 'custom':
            return 'Custom';
        case 'ready_stock':
            return 'Ready Stock';
        case 'wig':
            return 'Wig';
        case 'props':
            return 'Props';
        default:
            return 'Kategori';
    }
};

export default function CategoryHero({ category }: CategoryHeroProps) {
    return (
        <section className="relative overflow-hidden bg-base-200">
            <div className="absolute inset-0">
                {category.image ? (
                    <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20" />
                )}
                <div className="absolute inset-0 bg-base-100/80 backdrop-blur-[2px]" />
            </div>

            <div className="relative container mx-auto px-4 py-16 lg:py-24">
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
                    <div className="space-y-5">
                        <div className="flex items-center gap-2">
                            <span className="badge badge-primary badge-lg">
                                {getTypeLabel(category.type)}
                            </span>
                            <span className="badge badge-outline">
                                <BadgeCheck className="h-4 w-4 mr-1" />
                                Koleksi Pilihan
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
                            {category.name}
                        </h1>
                        <p className="text-base-content/70 max-w-2xl">
                            {category.description ??
                                'Koleksi cosplay terbaik dengan kualitas premium dan detail yang akurat.'}
                        </p>
                    </div>

                    <div className="card bg-base-100 shadow-xl max-w-sm lg:ml-auto">
                        <figure className="h-56 w-full bg-base-200">
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-base-content/60">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-300">
                                        <Image className="h-7 w-7" />
                                    </div>
                                </div>
                            )}
                        </figure>
                    </div>
                </div>
            </div>
        </section>
    );
}
