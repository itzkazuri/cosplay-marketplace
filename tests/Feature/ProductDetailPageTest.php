<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductRating;
use App\Models\ProductSku;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ProductDetailPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_detail_page_renders_for_visitor(): void
    {
        // Create category
        $category = Category::factory()->create([
            'name' => 'Kostum Custom',
            'slug' => 'kostum-custom',
            'type' => 'custom',
            'is_active' => true,
        ]);

        // Create product
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Cosplay Naruto Uzumaki',
            'slug' => 'cosplay-naruto-uzumaki',
            'description' => 'Kostum cosplay Naruto Uzumaki berkualitas tinggi.',
            'base_price' => 350000,
            'is_active' => true,
        ]);

        // Create product SKUs
        ProductSku::factory()->count(3)->create([
            'product_id' => $product->id,
        ]);

        // Create product ratings
        ProductRating::factory()->count(5)->create([
            'product_id' => $product->id,
            'is_visible' => true,
            'approved_at' => now(),
        ]);

        // Visit product detail page
        $response = $this->get("/products/{$product->slug}");

        $response->assertOk();
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Products/Show')
                ->where('product.id', $product->id)
                ->where('product.name', 'Cosplay Naruto Uzumaki')
                ->where('product.slug', 'cosplay-naruto-uzumaki')
                ->where('product.price', 350000)
                ->has('product.category')
                ->where('product.category.name', 'Kostum Custom')
                ->has('product.variants', 3)
                ->has('product.ratings', 5)
                ->where('product.reviewsCount', 5)
        );
    }

    public function test_product_detail_page_shows_discount_information(): void
    {
        $category = Category::factory()->create([
            'name' => 'Wig',
            'slug' => 'wig',
            'type' => 'wig',
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Wig Goku Super Saiyan',
            'slug' => 'wig-goku-super-saiyan',
            'base_price' => 200000,
            'is_active' => true,
        ]);

        ProductSku::factory()->create([
            'product_id' => $product->id,
        ]);

        // Create active discount
        \App\Models\ProductDiscount::factory()->create([
            'product_id' => $product->id,
            'type' => 'percentage',
            'value' => 25,
            'is_active' => true,
        ]);

        $response = $this->get("/products/{$product->slug}");

        $response->assertOk();
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Products/Show')
                ->where('product.discountPercentage', 25)
                ->where('product.price', 150000) // 200000 - 25%
        );
    }

    public function test_product_detail_page_shows_rating_distribution(): void
    {
        $category = Category::factory()->create([
            'name' => 'Aksesoris',
            'slug' => 'aksesoris',
            'type' => 'aksesori',
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Pedang Demon Slayer',
            'slug' => 'pedang-demon-slayer',
            'is_active' => true,
        ]);

        ProductSku::factory()->create([
            'product_id' => $product->id,
        ]);

        // Create ratings with different values
        ProductRating::factory()->count(3)->highRating()->create([
            'product_id' => $product->id,
        ]);
        ProductRating::factory()->count(2)->mediumRating()->create([
            'product_id' => $product->id,
        ]);
        ProductRating::factory()->count(1)->lowRating()->create([
            'product_id' => $product->id,
        ]);

        $response = $this->get("/products/{$product->slug}");

        $response->assertOk();
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Products/Show')
                ->has('product.ratingDistribution', 5)
        );
    }

    public function test_product_detail_page_shows_related_products(): void
    {
        $category = Category::factory()->create([
            'name' => 'Ready Stock',
            'slug' => 'ready-stock',
            'type' => 'ready_stock',
            'is_active' => true,
        ]);

        // Create main product
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Cosplay Attack Titan',
            'slug' => 'cosplay-attack-titan',
            'is_active' => true,
        ]);

        ProductSku::factory()->create([
            'product_id' => $product->id,
        ]);

        // Create related products in same category
        Product::factory()->count(4)->create([
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        $response = $this->get("/products/{$product->slug}");

        $response->assertOk();
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Products/Show')
                ->has('product.relatedProducts', 4)
        );
    }

    public function test_inactive_product_is_not_accessible(): void
    {
        $category = Category::factory()->create([
            'name' => 'Props',
            'slug' => 'props',
            'type' => 'props',
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Inactive Product',
            'slug' => 'inactive-product',
            'is_active' => false,
        ]);

        ProductSku::factory()->create([
            'product_id' => $product->id,
        ]);

        // Inactive products should show error page
        $this->get("/products/{$product->slug}")
            ->assertInertia(fn ($page) => $page->component('Errors/Error'));
    }

    public function test_non_existent_product_is_not_accessible(): void
    {
        // Non-existent products should show error page
        $this->get('/products/non-existent-product')
            ->assertInertia(fn ($page) => $page->component('Errors/Error'));
    }

    public function test_product_detail_page_shows_total_sold(): void
    {
        $category = Category::factory()->create([
            'name' => 'Kostum Custom',
            'slug' => 'kostum-custom',
            'type' => 'custom',
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Cosplay One Piece Luffy',
            'slug' => 'cosplay-one-piece-luffy',
            'is_active' => true,
        ]);

        $sku = ProductSku::factory()->create([
            'product_id' => $product->id,
            'sku' => 'SKU-LUFFY-001',
        ]);

        // Create user and order to simulate sold products
        $user = User::factory()->user()->create();
        $order = \App\Models\Order::factory()->delivered()->create([
            'user_id' => $user->id,
        ]);

        // Create order item
        \App\Models\OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_sku_id' => $sku->id,
            'product_name' => $product->name,
            'sku_code' => $sku->sku,
            'quantity' => 2,
            'price' => 350000,
        ]);

        $response = $this->get("/products/{$product->slug}");

        $response->assertOk();
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Products/Show')
                ->where('product.totalSold', 2)
        );
    }
}
