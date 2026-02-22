import { Image, Minus, Plus, Trash2 } from 'lucide-react';

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

interface CartItemRowProps {
    item: CartItem;
}

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

export default function CartItemRow({ item }: CartItemRowProps) {
    return (
        <div className="card bg-base-200">
            <div className="card-body flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-24 w-20 rounded-xl overflow-hidden bg-base-300 flex items-center justify-center">
                        {item.product.image ? (
                            <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Image className="h-6 w-6 text-base-content/60" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold">{item.product.name}</h3>
                        <div className="text-sm text-base-content/70">
                            {item.sku.size && <span>Size: {item.sku.size}</span>}
                            {item.sku.color && (
                                <span className="ml-2">• {item.sku.color}</span>
                            )}
                            {item.sku.gender && (
                                <span className="ml-2">• {item.sku.gender}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">
                                {formatPrice(item.price)}
                            </span>
                            {item.originalPrice && (
                                <span className="text-xs text-base-content/50 line-through">
                                    {formatPrice(item.originalPrice)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center gap-2">
                        <button className="btn btn-ghost btn-sm btn-square">
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2rem] text-center font-semibold">
                            {item.quantity}
                        </span>
                        <button className="btn btn-ghost btn-sm btn-square">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-base-content/60">
                            Subtotal
                        </div>
                        <div className="font-bold">{formatPrice(item.lineTotal)}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm text-error">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
