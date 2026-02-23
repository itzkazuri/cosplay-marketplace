<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductRating;
use App\Models\ProductSku;
use Inertia\Inertia;
use Inertia\Response;

class ProductDetailController extends Controller
{
    /**
     * Display product detail page.
     */
    public function show(string $slug): Response
    {
        $product = Product::query()
            ->with([
                'category',
                'skus' => fn ($query) => $query->where('is_active', true),
                'images',
                'discount' => fn ($query) => $query->active(),
            ])
            ->withCount(['ratings as reviews_count' => fn ($query) => $query->visible()])
            ->withAvg(['ratings as average_rating' => fn ($query) => $query->visible()], 'rating')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Calculate total stock sold from order items
        $totalSold = ProductSku::query()
            ->where('product_id', $product->id)
            ->where('is_active', true)
            ->withSum('orderItems as sold_count', 'quantity')
            ->get()
            ->sum('sold_count');

        // Calculate price with discount
        $basePrice = (float) $product->base_price;
        $discount = $product->discount;
        $finalPrice = $basePrice;
        $originalPrice = null;
        $discountPercentage = null;

        if ($discount) {
            $discountValue = (float) $discount->value;
            if ($discount->type === 'percentage') {
                $finalPrice = max(0, $basePrice - ($basePrice * ($discountValue / 100)));
                $discountPercentage = $discountValue;
            } else {
                $finalPrice = max(0, $basePrice - $discountValue);
                $discountPercentage = $basePrice > 0 ? round(($discountValue / $basePrice) * 100, 2) : 0;
            }
            $originalPrice = $basePrice;
        }

        // Get variant options
        $variants = $product->skus->map(function (ProductSku $sku) {
            return [
                'id' => $sku->id,
                'sku' => $sku->sku,
                'size' => $sku->size,
                'gender' => $sku->gender,
                'color' => $sku->color,
                'price' => (float) $sku->price,
                'stock' => $sku->stock,
                'isCustomOrder' => $sku->is_custom_order,
            ];
        });

        // Get unique options for filters
        $sizes = $product->skus->pluck('size')->unique()->filter()->values();
        $colors = $product->skus->pluck('color')->unique()->filter()->values();
        $genders = $product->skus->pluck('gender')->unique()->filter()->values();

        // Get visible ratings with user info
        $ratings = ProductRating::query()
            ->with('user')
            ->where('product_id', $product->id)
            ->where('is_visible', true)
            ->whereNotNull('approved_at')
            ->latest('approved_at')
            ->limit(5)
            ->get()
            ->map(function (ProductRating $rating) {
                return [
                    'id' => $rating->id,
                    'user' => [
                        'name' => $rating->user->name,
                        'avatar' => $rating->user->avatar,
                    ],
                    'rating' => $rating->rating,
                    'review' => $rating->review,
                    'images' => $rating->images ?? [],
                    'isVerifiedPurchase' => $rating->is_verified_purchase,
                    'approvedAt' => $rating->approved_at?->toDateString(),
                    'helpfulCount' => $rating->helpful_count ?? 0,
                ];
            });

        // Get related products (same category, excluding current product)
        $relatedProducts = Product::query()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->with(['category', 'discount' => fn ($query) => $query->active()])
            ->withCount(['ratings as reviews_count' => fn ($query) => $query->visible()])
            ->withAvg(['ratings as average_rating' => fn ($query) => $query->visible()], 'rating')
            ->limit(4)
            ->get()
            ->map(function (Product $relatedProduct) {
                $relatedBasePrice = (float) $relatedProduct->base_price;
                $relatedDiscount = $relatedProduct->discount;
                $relatedFinalPrice = $relatedBasePrice;
                $relatedOriginalPrice = null;

                if ($relatedDiscount) {
                    $relatedDiscountValue = (float) $relatedDiscount->value;
                    if ($relatedDiscount->type === 'percentage') {
                        $relatedFinalPrice = max(0, $relatedBasePrice - ($relatedBasePrice * ($relatedDiscountValue / 100)));
                    } else {
                        $relatedFinalPrice = max(0, $relatedBasePrice - $relatedDiscountValue);
                    }
                    $relatedOriginalPrice = $relatedBasePrice;
                }

                return [
                    'id' => $relatedProduct->id,
                    'name' => $relatedProduct->name,
                    'slug' => $relatedProduct->slug,
                    'category' => $relatedProduct->category?->name,
                    'categorySlug' => $relatedProduct->category?->slug,
                    'image' => $relatedProduct->main_image,
                    'price' => round($relatedFinalPrice),
                    'originalPrice' => $relatedOriginalPrice ? round($relatedOriginalPrice) : null,
                    'rating' => round((float) ($relatedProduct->average_rating ?? 0), 1),
                    'reviews' => (int) ($relatedProduct->reviews_count ?? 0),
                ];
            });

        // Rating distribution
        $ratingDistribution = [
            5 => ProductRating::where('product_id', $product->id)
                ->where('rating', 5)
                ->where('is_visible', true)
                ->whereNotNull('approved_at')
                ->count(),
            4 => ProductRating::where('product_id', $product->id)
                ->where('rating', 4)
                ->where('is_visible', true)
                ->whereNotNull('approved_at')
                ->count(),
            3 => ProductRating::where('product_id', $product->id)
                ->where('rating', 3)
                ->where('is_visible', true)
                ->whereNotNull('approved_at')
                ->count(),
            2 => ProductRating::where('product_id', $product->id)
                ->where('rating', 2)
                ->where('is_visible', true)
                ->whereNotNull('approved_at')
                ->count(),
            1 => ProductRating::where('product_id', $product->id)
                ->where('rating', 1)
                ->where('is_visible', true)
                ->whereNotNull('approved_at')
                ->count(),
        ];

        return Inertia::render('Products/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ] : null,
                'images' => $product->images->map(fn ($image) => [
                    'id' => $image->id,
                    'url' => $image->image_url,
                ]),
                'mainImage' => $product->main_image,
                'price' => round($finalPrice),
                'originalPrice' => $originalPrice ? round($originalPrice) : null,
                'discountPercentage' => $discountPercentage,
                'rating' => round((float) ($product->average_rating ?? 0), 1),
                'reviewsCount' => (int) ($product->reviews_count ?? 0),
                'totalSold' => $totalSold,
                'weight' => $product->weight,
                'variants' => $variants,
                'sizes' => $sizes,
                'colors' => $colors,
                'genders' => $genders,
                'ratings' => $ratings,
                'ratingDistribution' => $ratingDistribution,
                'relatedProducts' => $relatedProducts,
            ],
        ]);
    }
}
