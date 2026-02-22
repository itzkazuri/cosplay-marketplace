import { Head } from '@inertiajs/react';
import CartPage from '@/components/cart/CartPage';

interface CartProduct {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
}

interface CartSku {
    id: number;
    code?: string | null;
    size?: string | null;
    color?: string | null;
    gender?: string | null;
}

interface CartItem {
    id: number;
    quantity: number;
    note?: string | null;
    product: CartProduct;
    sku: CartSku;
    price: number;
    originalPrice?: number | null;
    lineTotal: number;
}

interface CartSummary {
    subtotal: number;
    shipping: number;
    total: number;
}

interface CartProps {
    items: CartItem[];
    summary: CartSummary;
}

export default function Cart({ items, summary }: CartProps) {
    return (
        <>
            <Head title="Keranjang" />
            <CartPage items={items} summary={summary} />
        </>
    );
}
