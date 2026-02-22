<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $items = Wishlist::query()
            ->where('user_id', $user->id)
            ->with([
                'product' => function ($query) {
                    $query->where('is_active', true)
                        ->with(['discount' => fn ($discount) => $discount->active(), 'category'])
                        ->withCount(['ratings as reviews_count' => fn ($rating) => $rating->visible()])
                        ->withAvg(['ratings as average_rating' => fn ($rating) => $rating->visible()], 'rating');
                },
            ])
            ->latest()
            ->get()
            ->map(function (Wishlist $wishlist) {
                $product = $wishlist->product;
                if (! $product) {
                    return null;
                }

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
                    'id' => $wishlist->id,
                    'product' => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'image' => $product->main_image,
                        'category' => $product->category?->name,
                        'price' => round($finalPrice),
                        'originalPrice' => $originalPrice ? round($originalPrice) : null,
                        'rating' => round((float) ($product->average_rating ?? 0), 1),
                        'reviews' => (int) ($product->reviews_count ?? 0),
                    ],
                ];
            })
            ->filter()
            ->values();

        return Inertia::render('Wishlist', [
            'items' => $items,
        ]);
    }
}
