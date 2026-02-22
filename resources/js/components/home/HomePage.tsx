import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import CategoriesSection from './CategoriesSection';
import FeaturesSection from './FeaturesSection';
import PromoBanner from './PromoBanner';
import TestimonialsSection from './TestimonialsSection';

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

interface HomePageProps {
    categories: HomeCategory[];
    featuredProducts: HomeProduct[];
    testimonials: HomeTestimonial[];
    stats: HomeStats;
}

export default function HomePage({
    categories,
    featuredProducts,
    testimonials,
    stats,
}: HomePageProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1">
                <HeroSection stats={stats} />
                <CategoriesSection categories={categories} />
                <FeaturedProducts products={featuredProducts} />
                <PromoBanner />
                <FeaturesSection />
                <TestimonialsSection testimonials={testimonials} />
            </main>
            
            <Footer />
        </div>
    );
}
