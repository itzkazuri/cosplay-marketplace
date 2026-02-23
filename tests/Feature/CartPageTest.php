<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductSku;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class CartPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_cart_page_redirects_to_login_when_not_authenticated(): void
    {
        $response = $this->get('/cart');

        $response->assertRedirect(route('login'));
    }

    public function test_cart_page_renders_for_user(): void
    {
        $user = User::query()->create([
            'name' => 'User Cart',
            'email' => 'cart@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $category = Category::query()->create([
            'name' => 'Kategori Cart',
            'slug' => 'kategori-cart',
            'description' => 'Deskripsi kategori cart.',
            'type' => 'ready_stock',
            'is_active' => true,
        ]);

        $product = Product::query()->create([
            'category_id' => $category->id,
            'name' => 'Produk Cart',
            'slug' => 'produk-cart',
            'description' => 'Produk untuk cart.',
            'base_price' => 200000,
            'main_image' => null,
            'is_custom' => false,
            'is_active' => true,
            'weight' => 500,
        ]);

        $sku = ProductSku::query()->create([
            'product_id' => $product->id,
            'sku' => 'SKU-CART-001',
            'size' => 'M',
            'gender' => 'unisex',
            'color' => 'Black',
            'custom_option' => null,
            'price' => 200000,
            'stock' => 10,
            'is_custom_order' => false,
            'is_active' => true,
        ]);

        $cart = Cart::query()->create([
            'user_id' => $user->id,
        ]);

        CartItem::query()->create([
            'cart_id' => $cart->id,
            'product_sku_id' => $sku->id,
            'quantity' => 2,
            'custom_note' => null,
        ]);

        $response = $this->actingAs($user)->get('/cart');

        $response->assertOk();
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Cart')
                ->has('items', 1)
                ->where('summary.subtotal', 400000)
                ->where('summary.total', 400000)
        );
    }
}
