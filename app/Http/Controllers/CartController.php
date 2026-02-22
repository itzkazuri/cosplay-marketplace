<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $cart = Cart::query()
            ->where('user_id', $user->id)
            ->with([
                'items.productSku' => function ($query) {
                    $query->where('is_active', true)
                        ->with(['product' => function ($productQuery) {
                            $productQuery->where('is_active', true)
                                ->with(['discount' => fn ($discount) => $discount->active()]);
                        }]);
                },
            ])
            ->first();

        $items = collect();
        $subtotal = 0;

        if ($cart) {
            $items = $cart->items->map(function (CartItem $item) use (&$subtotal) {
                $sku = $item->productSku;
                $product = $sku?->product;
                if (! $sku || ! $product) {
                    return null;
                }

                $basePrice = (float) $sku->price;
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

                $lineTotal = $finalPrice * $item->quantity;
                $subtotal += $lineTotal;

                return [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'note' => $item->custom_note,
                    'product' => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'image' => $product->main_image,
                    ],
                    'sku' => [
                        'id' => $sku->id,
                        'code' => $sku->sku,
                        'size' => $sku->size,
                        'color' => $sku->color,
                        'gender' => $sku->gender,
                    ],
                    'price' => round($finalPrice),
                    'originalPrice' => $originalPrice ? round($originalPrice) : null,
                    'lineTotal' => round($lineTotal),
                ];
            })
                ->filter()
                ->values();
        }

        return Inertia::render('Cart', [
            'items' => $items,
            'summary' => [
                'subtotal' => round($subtotal),
                'shipping' => 0,
                'total' => round($subtotal),
            ],
        ]);
    }
}
