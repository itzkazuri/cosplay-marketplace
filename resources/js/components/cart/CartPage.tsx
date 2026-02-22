import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import CartHeader from './CartHeader';
import CartItemList from './CartItemList';
import CartSummary from './CartSummary';

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

interface CartSummaryData {
    subtotal: number;
    shipping: number;
    total: number;
}

interface CartPageProps {
    items: CartItem[];
    summary: CartSummaryData;
}

export default function CartPage({ items, summary }: CartPageProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 bg-base-100">
                <CartHeader total={items.length} />
                <div className="container mx-auto px-4 py-10">
                    <div className="grid lg:grid-cols-[1.6fr_0.8fr] gap-8">
                        <CartItemList items={items} />
                        <CartSummary summary={summary} disabled={items.length === 0} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
