<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductRating;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->orderByDesc('products_count')
            ->limit(8)
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'type' => $category->type,
                'image' => $category->image,
                'productsCount' => $category->products_count,
            ]);

        $featuredProducts = Product::query()
            ->where('is_active', true)
            ->with(['category', 'discount' => fn ($query) => $query->active()])
            ->withCount(['ratings as reviews_count' => fn ($query) => $query->visible()])
            ->withAvg(['ratings as average_rating' => fn ($query) => $query->visible()], 'rating')
            ->latest()
            ->limit(4)
            ->get()
            ->map(function (Product $product) {
                $basePrice = (float) $product->base_price;
                $discount = $product->discount;
                $finalPrice = $basePrice;
                $originalPrice = null;

                if ($discount) {
                    $discountValue = (float) $discount->value;
                    if ($discount->type === 'percentage') {
                        $finalPrice = max(0, $basePrice - ($basePrice * ($discountValue / 100)));
                    } else {
                        $finalPrice = max(0, $basePrice - $discountValue);
                    }

                    $originalPrice = $basePrice;
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'category' => $product->category?->name,
                    'image' => $product->main_image,
                    'price' => round($finalPrice),
                    'originalPrice' => $originalPrice ? round($originalPrice) : null,
                    'rating' => round((float) ($product->average_rating ?? 0), 1),
                    'reviews' => (int) ($product->reviews_count ?? 0),
                ];
            });

        $testimonials = ProductRating::query()
            ->visible()
            ->whereNotNull('review')
            ->with(['user:id,name,avatar', 'product:id,name'])
            ->latest('approved_at')
            ->limit(3)
            ->get()
            ->map(fn (ProductRating $rating) => [
                'id' => $rating->id,
                'name' => $rating->user?->name ?? 'Pelanggan',
                'avatar' => $rating->user?->avatar,
                'content' => $rating->review,
                'rating' => $rating->rating,
                'product' => $rating->product?->name,
            ]);

        $totalProducts = Product::query()->where('is_active', true)->count();
        $totalCustomers = User::query()->where('role', 'user')->count();
        $averageRating = ProductRating::query()->visible()->avg('rating') ?? 0;
        $satisfaction = (int) round(min(100, ($averageRating / 5) * 100));

        return Inertia::render('Home', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'testimonials' => $testimonials,
            'stats' => [
                'products' => $totalProducts,
                'customers' => $totalCustomers,
                'satisfaction' => $satisfaction,
            ],
        ]);
    }
}
