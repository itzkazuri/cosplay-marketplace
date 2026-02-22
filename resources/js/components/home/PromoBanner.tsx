import { Link } from '@inertiajs/react';
import { Gift, Truck } from 'lucide-react';

export default function PromoBanner() {
    return (
        <section className="py-12 bg-base-100">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Promo 1 */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-primary-content">
                        <div className="relative z-10">
                            <div className="badge badge-secondary badge-lg mb-4">PROMO</div>
                            <h3 className="text-3xl font-bold mb-2">Diskon 50%</h3>
                            <p className="mb-6 opacity-90">Untuk pembelian pertama kamu!</p>
                            <Link href="/register" className="btn btn-secondary text-secondary-content">
                                Daftar Sekarang
                            </Link>
                        </div>
                        <div className="absolute -right-8 -bottom-8 text-9xl opacity-20">
                            <Gift className="h-24 w-24" />
                        </div>
                    </div>

                    {/* Promo 2 */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary to-warning p-8 text-secondary-content">
                        <div className="relative z-10">
                            <div className="badge badge-accent badge-lg mb-4">GRATIS</div>
                            <h3 className="text-3xl font-bold mb-2">Ongkir Rp 50K</h3>
                            <p className="mb-6 opacity-90">Minimal pembelian Rp 500K</p>
                            <Link href="/products" className="btn btn-accent text-accent-content">
                                Belanja Sekarang
                            </Link>
                        </div>
                        <div className="absolute -right-8 -bottom-8 text-9xl opacity-20">
                            <Truck className="h-24 w-24" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
