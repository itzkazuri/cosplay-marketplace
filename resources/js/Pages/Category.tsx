import { Head } from '@inertiajs/react';
import CategoryPage from '@/components/category/CategoryPage';

interface CategoryInfo {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    type: string;
    image?: string | null;
}

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

interface CategoryStats {
    products: number;
    averageRating: number;
}

interface CategoryProps {
    category: CategoryInfo;
    products: CategoryProduct[];
    stats: CategoryStats;
}

export default function Category({ category, products, stats }: CategoryProps) {
    return (
        <>
            <Head title={`Kategori ${category.name}`} />
            <CategoryPage category={category} products={products} stats={stats} />
        </>
    );
}
