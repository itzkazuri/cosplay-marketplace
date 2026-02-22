import HomePage from '@/components/home/HomePage';

interface HomeStats {
    products: number;
    customers: number;
    satisfaction: number;
}

interface HomeCategory {
    id: number;
    name: string;
    slug: string;
    type: string;
    image?: string | null;
    productsCount: number;
}

interface HomeProduct {
    id: number;
    name: string;
    slug: string;
    category?: string | null;
    image?: string | null;
    price: number;
    originalPrice?: number | null;
    rating: number;
    reviews: number;
}

interface HomeTestimonial {
    id: number;
    name: string;
    avatar?: string | null;
    content: string;
    rating: number;
    product?: string | null;
}

interface HomeProps {
    categories: HomeCategory[];
    featuredProducts: HomeProduct[];
    testimonials: HomeTestimonial[];
    stats: HomeStats;
}

export default function Home({
    categories,
    featuredProducts,
    testimonials,
    stats,
}: HomeProps) {
    return (
        <HomePage
            categories={categories}
            featuredProducts={featuredProducts}
            testimonials={testimonials}
            stats={stats}
        />
    );
}
