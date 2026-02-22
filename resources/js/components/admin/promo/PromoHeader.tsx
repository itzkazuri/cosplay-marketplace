import { BadgePercent } from 'lucide-react';

export default function PromoHeader(): JSX.Element {
    return (
        <div className="hero rounded-3xl border border-base-300 bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/10 p-6 shadow-lg">
            <div className="hero-content w-full justify-between gap-6 px-0 py-0">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-black uppercase tracking-tight text-base-content">
                        <BadgePercent className="h-8 w-8 text-primary" />
                        Voucher & Diskon
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm font-medium text-base-content/70">
                        Kelola promo produk dengan aturan eksklusif: produk diskon tidak bisa pakai voucher, dan produk voucher tidak bisa diberi diskon aktif.
                    </p>
                </div>
            </div>
        </div>
    );
}
