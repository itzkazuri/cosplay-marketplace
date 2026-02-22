import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import CategoryHero from './CategoryHero';
import CategoryStats from './CategoryStats';
import CategoryProductGrid from './CategoryProductGrid';

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

interface CategoryPageProps {
    category: CategoryInfo;
    products: CategoryProduct[];
    stats: CategoryStats;
}

export default function CategoryPage({ category, products, stats }: CategoryPageProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <CategoryHero category={category} />
                <CategoryStats stats={stats} />
                <CategoryProductGrid products={products} />
            </main>

            <Footer />
        </div>
    );
}
