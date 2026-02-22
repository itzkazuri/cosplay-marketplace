<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductRating;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class HomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_with_database_data(): void
    {
        Category::factory()->count(3)->create();
        $products = Product::factory()->count(4)->create();

        ProductRating::factory()->create([
            'product_id' => $products->first()->id,
            'rating' => 5,
            'review' => 'Produk sangat bagus.',
            'is_visible' => true,
            'approved_at' => now(),
        ]);

        ProductRating::factory()->create([
            'product_id' => $products->get(1)->id,
            'rating' => 4,
            'review' => 'Pengiriman cepat dan rapi.',
            'is_visible' => true,
            'approved_at' => now(),
        ]);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Home')
                ->has('categories', 3)
                ->has('featuredProducts', 4)
                ->has('testimonials', 2)
                ->where('stats.products', 4)
                ->where('stats.customers', 0)
                ->where('stats.satisfaction', 90)
        );
    }
}
