<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class WishlistPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_wishlist_page_renders_for_user(): void
    {
        $user = User::query()->create([
            'name' => 'User Wishlist',
            'email' => 'wishlist@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $category = Category::query()->create([
            'name' => 'Kategori A',
            'slug' => 'kategori-a',
            'description' => 'Deskripsi kategori.',
            'type' => 'ready_stock',
            'is_active' => true,
        ]);

        $product = Product::query()->create([
            'category_id' => $category->id,
            'name' => 'Produk Wishlist',
            'slug' => 'produk-wishlist',
            'description' => 'Produk untuk wishlist.',
            'base_price' => 150000,
            'main_image' => null,
            'is_custom' => false,
            'is_active' => true,
            'weight' => 500,
        ]);

        Wishlist::query()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        $response = $this->actingAs($user)->get('/wishlist');

        $response->assertOk();
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Wishlist')
                ->has('items', 1)
                ->where('items.0.product.slug', 'produk-wishlist')
        );
    }
}
