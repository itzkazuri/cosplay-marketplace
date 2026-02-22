import { ShoppingBag } from 'lucide-react';

interface CartHeaderProps {
    total: number;
}

export default function CartHeader({ total }: CartHeaderProps) {
    return (
        <section className="bg-base-200">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Keranjang</h1>
                        <p className="text-base-content/70">
                            Review item kamu sebelum checkout.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-base-100 px-4 py-2 text-sm font-semibold text-base-content/70">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        {total} item
                    </div>
                </div>
            </div>
        </section>
    );
}
