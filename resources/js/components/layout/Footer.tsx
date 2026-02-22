import { Link } from '@inertiajs/react';
import { 
    InstagramLogoIcon, 
    TwitterLogoIcon, 
    MixerHorizontalIcon, 
    DiscordLogoIcon 
} from '@radix-ui/react-icons';

export default function Footer() {
    return (
        <footer className="bg-base-200 border-t border-base-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">
                            <span className="text-primary">CosPlay</span>
                            <span className="text-accent">Shop</span>
                        </h3>
                        <p className="text-base-content/70 mb-4">
                            Toko cosplay terpercaya dengan koleksi kostum dan aksesoris terlengkap untuk karakter anime, game, dan film favoritmu.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="btn btn-circle btn-ghost btn-sm">
                                <InstagramLogoIcon className="h-5 w-5" />
                            </a>
                            <a href="#" className="btn btn-circle btn-ghost btn-sm">
                                <TwitterLogoIcon className="h-5 w-5" />
                            </a>
                            <a href="#" className="btn btn-circle btn-ghost btn-sm">
                                <MixerHorizontalIcon className="h-5 w-5" />
                            </a>
                            <a href="#" className="btn btn-circle btn-ghost btn-sm">
                                <DiscordLogoIcon className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-lg">Tautan</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-base-content/70 hover:text-primary">Beranda</Link></li>
                            <li><Link href="/products" className="text-base-content/70 hover:text-primary">Produk</Link></li>
                            <li><Link href="/categories" className="text-base-content/70 hover:text-primary">Kategori</Link></li>
                            <li><Link href="/about" className="text-base-content/70 hover:text-primary">Tentang Kami</Link></li>
                            <li><Link href="/contact" className="text-base-content/70 hover:text-primary">Kontak</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-bold mb-4 text-lg">Bantuan</h4>
                        <ul className="space-y-2">
                            <li><Link href="/faq" className="text-base-content/70 hover:text-primary">FAQ</Link></li>
                            <li><Link href="/shipping" className="text-base-content/70 hover:text-primary">Pengiriman</Link></li>
                            <li><Link href="/returns" className="text-base-content/70 hover:text-primary">Pengembalian</Link></li>
                            <li><Link href="/size-guide" className="text-base-content/70 hover:text-primary">Panduan Ukuran</Link></li>
                            <li><Link href="/terms" className="text-base-content/70 hover:text-primary">Syarat & Ketentuan</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold mb-4 text-lg">Newsletter</h4>
                        <p className="text-base-content/70 mb-4">
                            Dapatkan info promo terbaru dan diskon eksklusif!
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                placeholder="Email kamu" 
                                className="input input-bordered flex-1"
                            />
                            <button className="btn btn-primary">
                                Kirim
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-base-300 mt-8 pt-8 text-center text-base-content/70">
                    <p>&copy; 2026 CosPlay Shop. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
