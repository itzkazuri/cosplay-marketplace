<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductRating;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function show(Category $category): Response
    {
        if (! $category->is_active) {
            abort(404);
        }

        $products = $category->products()
            ->where('is_active', true)
            ->with(['discount' => fn ($query) => $query->active()])
            ->withCount(['ratings as reviews_count' => fn ($query) => $query->visible()])
            ->withAvg(['ratings as average_rating' => fn ($query) => $query->visible()], 'rating')
            ->latest()
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
                    'image' => $product->main_image,
                    'price' => round($finalPrice),
                    'originalPrice' => $originalPrice ? round($originalPrice) : null,
                    'rating' => round((float) ($product->average_rating ?? 0), 1),
                    'reviews' => (int) ($product->reviews_count ?? 0),
                ];
            });

        $productsCount = $products->count();
        $averageRating = ProductRating::query()
            ->visible()
            ->whereHas('product', fn ($query) => $query->where('category_id', $category->id))
            ->avg('rating') ?? 0;

        return Inertia::render('Category', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'type' => $category->type,
                'image' => $category->image,
            ],
            'products' => $products,
            'stats' => [
                'products' => $productsCount,
                'averageRating' => round((float) $averageRating, 1),
            ],
        ]);
    }
}
