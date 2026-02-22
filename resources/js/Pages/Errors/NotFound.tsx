import { Link } from "@inertiajs/react";
import { Home, ShoppingBag, Search } from "lucide-react";

const CATEGORIES = [
    { name: "Kostum Custom", icon: "🎭", slug: "kostum-custom" },
    { name: "Aksesoris", icon: "✨", slug: "aksesoris" },
    { name: "Wig", icon: "💇", slug: "wig" },
    { name: "Props & Senjata", icon: "⚔️", slug: "props-senjata" },
    { name: "Ready Stock", icon: "📦", slug: "ready-stock" },
];

export default function NotFound() {
    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary opacity-[0.06] blur-[120px] rounded-full" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-[350px] h-[350px] bg-secondary opacity-[0.05] blur-[100px] rounded-full" />

            <div className="relative z-10 w-full max-w-xl mx-auto">
                {/* ── Illustration ── */}
                <div className="text-center mb-8">
                    <div className="relative inline-block group mb-6">
                        <div className="absolute inset-0 blur-3xl opacity-20 bg-primary rounded-full animate-pulse" />
                        <img
                            src="/image/404.png"
                            alt="404 - Halaman Tidak Ditemukan"
                            className="relative w-56 h-56 object-contain mx-auto drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Badge */}
                    <div className="flex justify-center mb-4">
                        <div className="badge badge-warning badge-outline font-mono font-bold px-3 py-2 text-sm">
                            HTTP 404
                        </div>
                    </div>

                    <h1 className="text-3xl font-extrabold text-base-content tracking-tight mb-2">
                        Halaman Tidak Ditemukan
                    </h1>
                    <p className="text-base-content/55 text-sm leading-relaxed max-w-sm mx-auto">
                        Maaf, halaman yang kamu cari tidak ada atau sudah
                        dipindahkan. Coba cari produk yang kamu mau.
                    </p>
                </div>

                {/* ── Search ── */}
                <div className="card bg-base-200 border border-base-300 shadow-md mb-4">
                    <div className="card-body p-4">
                        <label className="label pb-1">
                            <span className="label-text text-xs text-base-content/40 uppercase tracking-widest font-semibold">
                                Cari Produk
                            </span>
                        </label>
                        <label className="input input-bordered flex items-center gap-2 bg-base-300 border-base-300 focus-within:border-primary transition-colors">
                            <Search className="w-4 h-4 text-base-content/40 shrink-0" />
                            <input
                                type="text"
                                placeholder="Kostum, wig, aksesoris..."
                                className="grow bg-transparent text-sm placeholder:text-base-content/30"
                            />
                        </label>
                    </div>
                </div>

                {/* ── Actions ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <Link href="/" className="btn btn-primary flex-1 gap-2">
                        <Home className="w-4 h-4" />
                        Ke Beranda
                    </Link>
                    <Link
                        href="/products"
                        className="btn btn-outline flex-1 gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Lihat Produk
                    </Link>
                </div>

                {/* ── Category Quick Links ── */}
                <div className="card bg-base-200 border border-base-300 shadow-md mb-8">
                    <div className="card-body p-4">
                        <p className="text-xs text-base-content/40 uppercase tracking-widest font-semibold text-center mb-3">
                            Jelajahi Kategori
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/categories/${cat.slug}`}
                                    className="badge badge-lg badge-ghost hover:badge-primary cursor-pointer transition-all duration-200 hover:scale-105 gap-1.5 py-3 font-medium"
                                >
                                    <span>{cat.icon}</span>
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Decorative dots ── */}
                <div className="flex justify-center gap-2">
                    <div
                        className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                    />
                    <div
                        className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"
                        style={{ animationDelay: "120ms" }}
                    />
                    <div
                        className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                        style={{ animationDelay: "240ms" }}
                    />
                </div>
            </div>
        </div>
    );
}
