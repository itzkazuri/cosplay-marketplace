import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import {
    Menu,
    Search,
    Heart,
    X,
    ChevronDown,
    ShoppingBag,
    User,
    LogOut,
    LayoutDashboard,
    UserCircle,
    Package,
    TrendingUp,
    Star
} from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

const NAV_LINKS = [
    { href: "/", label: "Beranda" },
    { href: "/products", label: "Produk" },
    {
        label: "Kategori",
        children: [
            { href: "/categories/kostum-custom", label: "🎭 Kostum Custom" },
            { href: "/categories/aksesoris", label: "✨ Aksesoris" },
            { href: "/categories/wig", label: "💇 Wig" },
            { href: "/categories/props-senjata", label: "⚔️ Props & Senjata" },
            { href: "/categories/ready-stock", label: "📦 Ready Stock" },
        ],
    },
    { href: "/about", label: "Tentang" },
];

interface NavbarProps {
    cartCount?: number;
    wishlistCount?: number;
}

interface SearchResultProduct {
    id: number;
    name: string;
    slug: string;
    category?: string | null;
    categorySlug?: string | null;
    image?: string | null;
    price: number;
    originalPrice?: number | null;
    rating: number;
    reviews: number;
}

interface SearchResponse {
    products: SearchResultProduct[];
    popularSearches: string[];
    hasResults: boolean;
}

export default function Navbar({
    cartCount = 0,
    wishlistCount = 0,
}: NavbarProps) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close mobile menu on resize
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 1024) setMobileOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Focus input when search opens
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // Fetch search results with debounce
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!searchOpen) {
            setSearchResults(null);
            return;
        }

        const searching = searchQuery.trim() !== "";
        setIsSearching(searching);

        debounceRef.current = setTimeout(() => {
            setIsLoading(true);
            fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
                .then((res) => res.json())
                .then((data) => {
                    setSearchResults(data);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchQuery, searchOpen]);

    const handleSearchClose = () => {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults(null);
    };

    const handlePopularSearchClick = (term: string) => {
        setSearchQuery(term);
        setIsSearching(true);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <>
            {/* ── MAIN NAV ──────────────────────────────────── */}
            <nav
                className={`
                    fixed top-0 inset-x-0 z-50 transition-all duration-300
                    ${
                        scrolled
                            ? "bg-base-100/90 backdrop-blur-xl shadow-md border-b border-base-300"
                            : "bg-base-100/70 backdrop-blur-md border-b border-base-200"
                    }
                `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
                    {/* ── HAMBURGER (mobile) ── */}
                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        className="btn btn-ghost btn-sm btn-square lg:hidden"
                        aria-label="Menu"
                    >
                        {mobileOpen ? (
                            <X className="w-4 h-4" />
                        ) : (
                            <Menu className="w-4 h-4" />
                        )}
                    </button>

                    {/* ── LOGO ── */}
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 shrink-0 group"
                    >
                        {/* icon bubble */}
                        <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <span className="text-primary-content text-sm font-black leading-none">
                                C
                            </span>
                        </span>
                        <span className="hidden sm:block">
                            <span className="font-black text-base-content text-lg tracking-tight">
                                Cosplay
                            </span>
                            <span className="font-black text-primary text-lg tracking-tight">
                                Shop
                            </span>
                        </span>
                    </Link>

                    {/* ── DESKTOP MENU ── */}
                    <div className="hidden lg:flex flex-1 items-center justify-center">
                        <ul className="flex items-center gap-1">
                            {NAV_LINKS.map((link) =>
                                link.children ? (
                                    /* Dropdown Kategori */
                                    <li key={link.label} className="relative">
                                        <button
                                            onClick={() =>
                                                setCategoryOpen((v) => !v)
                                            }
                                            onBlur={() =>
                                                setTimeout(
                                                    () =>
                                                        setCategoryOpen(false),
                                                    150,
                                                )
                                            }
                                            className="btn btn-ghost btn-sm gap-1 font-medium text-base-content/80 hover:text-primary hover:bg-primary/10"
                                        >
                                            {link.label}
                                            <ChevronDown
                                                className={`w-3.5 h-3.5 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
                                            />
                                        </button>

                                        {categoryOpen && (
                                            <ul className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-base-100 border border-base-300 rounded-2xl shadow-xl overflow-hidden p-1.5 z-50">
                                                {link.children.map((child) => (
                                                    <li key={child.href}>
                                                        <Link
                                                            href={child.href}
                                                            className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/80 hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                                                            onClick={() =>
                                                                setCategoryOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ) : (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="btn btn-ghost btn-sm font-medium text-base-content/80 hover:text-primary hover:bg-primary/10"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>

                    {/* ── RIGHT ACTIONS ── */}
                    <div className="flex items-center gap-1 ml-auto lg:ml-0">
                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary"
                            aria-label="Cari"
                        >
                            <Search className="w-4 h-4" />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary relative"
                            aria-label="Wishlist"
                        >
                            <Heart className="w-4 h-4" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 badge badge-primary badge-xs min-w-[1.1rem] h-[1.1rem] text-[10px] p-0 flex items-center justify-center">
                                    {wishlistCount > 9 ? "9+" : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary relative"
                            aria-label="Keranjang"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 badge badge-primary badge-xs min-w-[1.1rem] h-[1.1rem] text-[10px] p-0 flex items-center justify-center">
                                    {cartCount > 9 ? "9+" : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Theme Switcher */}
                        <ThemeSwitcher />

                        {/* User / Login */}
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-ghost btn-sm btn-circle"
                                >
                                    {user.avatar ? (
                                        <div className="avatar">
                                            <div className="w-7 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-1">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="avatar placeholder">
                                            <div className="w-7 rounded-full bg-primary text-primary-content">
                                                <span className="text-xs font-bold">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-base-100 border border-base-300 rounded-2xl shadow-xl z-50 w-52 p-1.5 mt-2"
                                >
                                    <li className="px-3 py-2 border-b border-base-200 mb-1">
                                        <div className="pointer-events-none">
                                            <p className="font-semibold text-sm text-base-content truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-[10px] text-base-content/50 capitalize font-bold tracking-wider">
                                                {user.role}
                                            </p>
                                        </div>
                                    </li>
                                    {user.role === "admin" && (
                                        <li>
                                            <Link
                                                href="/admin"
                                                className="rounded-xl text-sm font-medium py-2.5"
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-primary" />
                                                Dashboard Admin
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link
                                            href="/profile"
                                            className="rounded-xl text-sm font-medium py-2.5"
                                        >
                                            <UserCircle className="w-4 h-4" />
                                            Profil Saya
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/orders"
                                            className="rounded-xl text-sm font-medium py-2.5"
                                        >
                                            <Package className="w-4 h-4" />
                                            Pesanan Saya
                                        </Link>
                                    </li>
                                    <li className="mt-1 border-t border-base-200 pt-1">
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="rounded-xl text-sm font-bold text-error hover:bg-error/10 py-2.5"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Keluar
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="btn btn-primary btn-sm rounded-xl font-semibold hidden sm:flex"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── MOBILE DRAWER ── */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-base-200
                        ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                    <div className="bg-base-100 px-4 py-4 flex flex-col gap-1">
                        {NAV_LINKS.map((link) =>
                            link.children ? (
                                <div key={link.label}>
                                    <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest px-3 pt-3 pb-1">
                                        {link.label}
                                    </p>
                                    {link.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/80 hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-base-content/80 hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ),
                        )}

                        {/* Mobile login/user */}
                        {!user ? (
                            <div className="pt-3 mt-2 border-t border-base-200 flex gap-2">
                                <Link
                                    href="/login"
                                    className="btn btn-primary btn-sm flex-1 rounded-xl"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn btn-outline btn-sm flex-1 rounded-xl"
                                >
                                    Daftar
                                </Link>
                            </div>
                        ) : (
                            <div className="pt-3 mt-2 border-t border-base-200 flex flex-col gap-1">
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="btn btn-ghost btn-sm justify-start gap-3 rounded-xl text-primary"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard Admin
                                    </Link>
                                )}
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="btn btn-ghost btn-sm justify-start gap-3 rounded-xl text-error"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Keluar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── SPACER (ganti padding karena navbar fixed) ── */}
            <div className="h-16" />

            {/* ── SEARCH MODAL ── */}
            {searchOpen && (
                <div
                    className="fixed inset-0 z-[99] bg-base-content/20 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
                    onClick={handleSearchClose}
                >
                    <div
                        className="w-full max-w-xl bg-base-100 border border-base-300 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxHeight: '70vh' }}
                    >
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit}>
                            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-base-200">
                                <Search className="w-5 h-5 text-base-content/40 shrink-0" />
                                <input
                                    ref={searchInputRef}
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari kostum, wig, aksesoris..."
                                    className="flex-1 bg-transparent text-base outline-none placeholder:text-base-content/40"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="btn btn-ghost btn-xs btn-square"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleSearchClose}
                                    className="btn btn-ghost btn-xs btn-square"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </form>

                        {/* Search Results */}
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 70px)' }}>
                            {/* Loading State */}
                            {isLoading && (
                                <div className="p-8 text-center">
                                    <div className="loading loading-spinner loading-md text-primary"></div>
                                    <p className="mt-2 text-sm text-base-content/70">Mencari...</p>
                                </div>
                            )}

                            {/* Popular Searches (when query is empty) */}
                            {!isSearching && !isLoading && searchResults?.popularSearches && searchResults.popularSearches.length > 0 && (
                                <div className="px-4 py-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                        <p className="text-xs font-semibold text-base-content/60 uppercase tracking-widest">
                                            Populer
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {searchResults.popularSearches.map((tag, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePopularSearchClick(tag)}
                                                className="badge badge-ghost hover:badge-primary cursor-pointer transition-colors text-xs py-3 px-3"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Product Results (when searching) */}
                            {isSearching && !isLoading && searchResults?.products && searchResults.products.length > 0 && (
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Package className="w-4 h-4 text-primary" />
                                        <p className="text-xs font-semibold text-base-content/60 uppercase tracking-widest">
                                            Produk Ditemukan
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {searchResults.products.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.slug}`}
                                                className="group card bg-base-200 hover:bg-base-300 transition-all duration-200 cursor-pointer"
                                                onClick={handleSearchClose}
                                            >
                                                <figure className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden rounded-lg">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-base-content/30">
                                                            <Package className="w-12 h-12" />
                                                        </div>
                                                    )}
                                                    {product.originalPrice && (
                                                        <span className="absolute top-2 right-2 badge badge-error text-xs text-white">
                                                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                                        </span>
                                                    )}
                                                </figure>
                                                <div className="card-body p-3">
                                                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                                        {product.name}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-xs text-base-content/70">
                                                        <Star className="w-3 h-3 fill-warning text-warning" />
                                                        <span>{product.rating}</span>
                                                        <span>({product.reviews})</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-primary font-bold text-sm">
                                                            Rp {product.price.toLocaleString('id-ID')}
                                                        </span>
                                                        {product.originalPrice && (
                                                            <span className="text-xs text-base-content/50 line-through">
                                                                Rp {product.originalPrice.toLocaleString('id-ID')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results */}
                            {isSearching && !isLoading && searchResults?.products.length === 0 && (
                                <div className="py-12 text-center px-4">
                                    <Search className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">
                                        Tidak ada hasil untuk "{searchQuery}"
                                    </h3>
                                    <p className="text-base-content/70 text-sm">
                                        Coba kata kunci lain seperti nama karakter atau anime
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
