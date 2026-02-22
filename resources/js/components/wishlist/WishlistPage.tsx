import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import WishlistHeader from './WishlistHeader';
import WishlistGrid from './WishlistGrid';

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

interface WishlistPageProps {
    items: WishlistItem[];
}

export default function WishlistPage({ items }: WishlistPageProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 bg-base-100">
                <WishlistHeader total={items.length} />
                <WishlistGrid items={items} />
            </main>

            <Footer />
        </div>
    );
}
