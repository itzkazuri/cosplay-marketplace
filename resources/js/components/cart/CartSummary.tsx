import { ArrowRight } from 'lucide-react';

interface CartSummaryProps {
    summary: {
        subtotal: number;
        shipping: number;
        total: number;
    };
    disabled?: boolean;
}

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

export default function CartSummary({ summary, disabled = false }: CartSummaryProps) {
    return (
        <div className="card bg-base-200 sticky top-24">
            <div className="card-body gap-4">
                <h3 className="text-lg font-bold">Ringkasan Belanja</h3>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-base-content/70">Subtotal</span>
                        <span className="font-semibold">
                            {formatPrice(summary.subtotal)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-base-content/70">Ongkir</span>
                        <span className="font-semibold">
                            {formatPrice(summary.shipping)}
                        </span>
                    </div>
                    <div className="divider my-2" />
                    <div className="flex items-center justify-between text-base">
                        <span className="font-bold">Total</span>
                        <span className="font-black text-primary">
                            {formatPrice(summary.total)}
                        </span>
                    </div>
                </div>

                <button className="btn btn-primary btn-block" disabled={disabled}>
                    Lanjut Checkout
                    <ArrowRight className="h-4 w-4" />
                </button>
                <button className="btn btn-outline btn-block" disabled={disabled}>
                    Lanjut Belanja
                </button>
            </div>
        </div>
    );
}
