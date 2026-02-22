import { ShoppingBag } from 'lucide-react';
import CartItemRow from './CartItemRow';

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

interface CartItemListProps {
    items: CartItem[];
}

export default function CartItemList({ items }: CartItemListProps) {
    if (items.length === 0) {
        return (
            <div className="card bg-base-200">
                <div className="card-body items-center text-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-100 text-base-content/60">
                        <ShoppingBag className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Keranjang kosong</h3>
                        <p className="text-base-content/70">
                            Tambahkan kostum favoritmu untuk mulai belanja.
                        </p>
                    </div>
                    <button className="btn btn-primary btn-wide">
                        Jelajahi Produk
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
            ))}
        </div>
    );
}
