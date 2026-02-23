<?php

namespace Tests\Feature\Admin;

use App\Models\Product;
use App\Models\ProductRating;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ProductRatingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_product_ratings_index_page(): void
    {
        $admin = User::query()->create([
            'name' => 'Admin Test',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.product-ratings.index'));

        $response->assertOk();
    }

    public function test_admin_can_filter_products_by_minimum_rating(): void
    {
        $admin = User::factory()->admin()->create();

        $highRatedProduct = Product::factory()->create();
        $lowRatedProduct = Product::factory()->create();

        ProductRating::factory()->create([
            'product_id' => $highRatedProduct->id,
            'rating' => 5,
            'is_visible' => true,
            'approved_at' => now(),
        ]);

        ProductRating::factory()->create([
            'product_id' => $highRatedProduct->id,
            'rating' => 4,
            'is_visible' => true,
            'approved_at' => now(),
        ]);

        ProductRating::factory()->create([
            'product_id' => $lowRatedProduct->id,
            'rating' => 2,
            'is_visible' => true,
            'approved_at' => now(),
        ]);

        $this->assertSame(
            [$highRatedProduct->id],
            ProductRating::query()
                ->where('is_visible', true)
                ->select('product_id')
                ->groupBy('product_id')
                ->havingRaw('AVG(rating) >= ?', [4])
                ->pluck('product_id')
                ->all()
        );

        $this->assertSame(
            [$highRatedProduct->id],
            Product::query()
                ->whereRaw(
                    '(select avg(product_ratings.rating) from product_ratings where product_ratings.product_id = products.id and product_ratings.is_visible = 1) >= ?',
                    [4]
                )
                ->pluck('id')
                ->all()
        );

        $filteredProducts = Product::with(['category', 'ratings' => function ($query) {
            $query->select('product_id')
                ->selectRaw('AVG(rating) as average_rating')
                ->selectRaw('COUNT(*) as total_ratings')
                ->groupBy('product_id');
        }])
            ->withCount(['ratings as total_ratings_count' => function ($query) {
                $query->where('is_visible', true);
            }])
            ->withAvg(['ratings as average_rating' => function ($query) {
                $query->where('is_visible', true);
            }], 'rating')
            ->whereRaw(
                '(select avg(product_ratings.rating) from product_ratings where product_ratings.product_id = products.id and product_ratings.is_visible = 1) >= ?',
                [4]
            )
            ->latest()
            ->get();

        $this->assertCount(1, $filteredProducts);

        $response = $this->actingAs($admin)->get(route('admin.product-ratings.index', [
            'min_rating' => 4,
        ]));

        $response->assertOk();
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Admin/ProductRatings/Index')
                ->has('products')
                ->where('filters.min_rating', '4')
        );
    }
}
