import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGallery from '@/components/products/detail/ProductGallery';
import ProductInfo from '@/components/products/detail/ProductInfo';
import ProductVariants from '@/components/products/detail/ProductVariants';
import ProductRatings from '@/components/products/detail/ProductRatings';
import RelatedProducts from '@/components/products/detail/RelatedProducts';
import { ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';

interface ProductImage {
    id: number;
    url: string;
}

interface ProductCategory {
    id: number;
    name: string;
    slug: string;
}

interface ProductVariant {
    id: number;
    sku: string;
    size?: string | null;
    gender?: string | null;
    color?: string | null;
    price: number;
    stock: number;
    isCustomOrder: boolean;
}

interface ProductRating {
    id: number;
    user: {
        name: string;
        avatar?: string | null;
    };
    rating: number;
    review?: string | null;
    images: string[];
    isVerifiedPurchase: boolean;
    approvedAt: string;
    helpfulCount: number;
}

interface RelatedProduct {
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

interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    category: ProductCategory | null;
    images: ProductImage[];
    mainImage?: string | null;
    price: number;
    originalPrice?: number | null;
    discountPercentage?: number | null;
    rating: number;
    reviewsCount: number;
    totalSold: number;
    weight: number;
    variants: ProductVariant[];
    sizes: string[];
    colors: string[];
    genders: string[];
    ratings: ProductRating[];
    ratingDistribution: Record<number, number>;
    relatedProducts: RelatedProduct[];
}

interface ShowProps {
    product: Product;
}

export default function Show({ product }: ShowProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants.length > 0 ? product.variants[0] : null
    );
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

    const handleAddToCart = () => {
        if (!selectedVariant) {
            router.visit('/login');
            return;
        }

        router.post('/cart/add', {
            product_sku_id: selectedVariant.id,
            quantity: quantity,
        });
    };

    const handleBuyNow = () => {
        if (!selectedVariant) {
            router.visit('/login');
            return;
        }

        router.post('/cart/add', {
            product_sku_id: selectedVariant.id,
            quantity: quantity,
        }, {
            onSuccess: () => {
                router.visit('/cart');
            },
        });
    };

    const handleWishlist = () => {
        router.post('/wishlist/add', {
            product_id: product.id,
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link disalin ke clipboard!');
        }
    };

    return (
        <>
            <Head title={product.name} />
            <Navbar />

            <main className="min-h-screen bg-base-200">
                {/* Breadcrumb */}
                <div className="bg-base-100 border-b border-base-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/" className="hover:text-primary">
                                Beranda
                            </Link>
                            <span className="text-base-content/40">/</span>
                            <Link href="/products" className="hover:text-primary">
                                Produk
                            </Link>
                            {product.category && (
                                <>
                                    <span className="text-base-content/40">/</span>
                                    <Link
                                        href={`/categories/${product.category.slug}`}
                                        className="hover:text-primary"
                                    >
                                        {product.category.name}
                                    </Link>
                                </>
                            )}
                            <span className="text-base-content/40">/</span>
                            <span className="text-base-content font-medium truncate">
                                {product.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Product Detail */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Gallery */}
                        <ProductGallery
                            images={product.images}
                            mainImage={product.mainImage}
                            name={product.name}
                        />

                        {/* Product Info */}
                        <ProductInfo
                            product={product}
                            onWishlist={handleWishlist}
                            onShare={handleShare}
                        />
                    </div>

                    {/* Variants & Add to Cart */}
                    <ProductVariants
                        product={product}
                        selectedVariant={selectedVariant}
                        quantity={quantity}
                        onVariantSelect={setSelectedVariant}
                        onQuantityChange={setQuantity}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                    />

                    {/* Features */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-base-100 rounded-xl shadow-sm">
                            <Truck className="w-8 h-8 text-primary" />
                            <div>
                                <h4 className="font-semibold text-sm">Pengiriman Cepat</h4>
                                <p className="text-xs text-base-content/60">
                                    Pengiriman ke seluruh Indonesia
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-base-100 rounded-xl shadow-sm">
                            <Shield className="w-8 h-8 text-primary" />
                            <div>
                                <h4 className="font-semibold text-sm">Jaminan Kualitas</h4>
                                <p className="text-xs text-base-content/60">
                                    Produk berkualitas tinggi
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-base-100 rounded-xl shadow-sm">
                            <RotateCcw className="w-8 h-8 text-primary" />
                            <div>
                                <h4 className="font-semibold text-sm">Retur Mudah</h4>
                                <p className="text-xs text-base-content/60">
                                    Kebijakan retur 7 hari
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-12 bg-base-100 rounded-2xl shadow-lg overflow-hidden">
                        <div className="border-b border-base-300">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                                        activeTab === 'description'
                                            ? 'text-primary border-b-2 border-primary'
                                            : 'text-base-content/60 hover:text-base-content'
                                    }`}
                                >
                                    Deskripsi Produk
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                                        activeTab === 'reviews'
                                            ? 'text-primary border-b-2 border-primary'
                                            : 'text-base-content/60 hover:text-base-content'
                                    }`}
                                >
                                    Ulasan ({product.reviewsCount})
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {activeTab === 'description' ? (
                                <div className="prose max-w-none">
                                    <p className="text-base-content whitespace-pre-wrap">
                                        {product.description || 'Deskripsi produk belum tersedia.'}
                                    </p>

                                    {/* Specifications */}
                                    <div className="mt-6">
                                        <h3 className="text-lg font-bold mb-4">Spesifikasi</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex justify-between py-2 border-b border-base-200">
                                                <span className="text-sm text-base-content/60">Berat</span>
                                                <span className="text-sm font-medium">{product.weight} gram</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-base-200">
                                                <span className="text-sm text-base-content/60">Terjual</span>
                                                <span className="text-sm font-medium">{product.totalSold} pcs</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-base-200">
                                                <span className="text-sm text-base-content/60">Rating</span>
                                                <span className="text-sm font-medium">{product.rating} / 5</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-base-200">
                                                <span className="text-sm text-base-content/60">Ulasan</span>
                                                <span className="text-sm font-medium">{product.reviewsCount} ulasan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <ProductRatings
                                    ratings={product.ratings}
                                    ratingDistribution={product.ratingDistribution}
                                    averageRating={product.rating}
                                    totalReviews={product.reviewsCount}
                                />
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    {product.relatedProducts.length > 0 && (
                        <RelatedProducts products={product.relatedProducts} />
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
