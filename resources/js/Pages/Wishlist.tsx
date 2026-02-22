import { Head } from '@inertiajs/react';
import WishlistPage from '@/components/wishlist/WishlistPage';

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

interface WishlistProps {
    items: WishlistItem[];
}

export default function Wishlist({ items }: WishlistProps) {
    return (
        <>
            <Head title="Wishlist" />
            <WishlistPage items={items} />
        </>
    );
}
