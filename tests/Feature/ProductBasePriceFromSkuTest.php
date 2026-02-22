<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class ProductBasePriceFromSkuTest extends TestCase
{
    use RefreshDatabase;

    public function test_base_price_is_derived_from_sku_prices_when_missing(): void
    {
        config(['filesystems.default' => 'minio']);
        Storage::fake('minio');

        $admin = $this->createAdmin();
        $category = $this->createCategory();

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Produk Harga SKU',
            'category_id' => $category->id,
            'description' => 'Deskripsi',
            'weight' => 1200,
            'main_image' => UploadedFile::fake()->image('thumb.jpg'),
            'images' => [
                UploadedFile::fake()->image('p1.jpg'),
                UploadedFile::fake()->image('p2.jpg'),
                UploadedFile::fake()->image('p3.jpg'),
            ],
            'skus' => [
                [
                    'sku' => 'SKU-ALPHA',
                    'price' => 250000,
                    'stock' => 5,
                ],
                [
                    'sku' => 'SKU-BETA',
                    'price' => 175000,
                    'stock' => 2,
                ],
            ],
        ]);

        $response->assertRedirect(route('admin.products.index'));

        $product = Product::query()->where('name', 'Produk Harga SKU')->firstOrFail();

        $this->assertSame('175000.00', $product->base_price);
    }

    public function test_base_price_is_required_when_no_skus_are_provided(): void
    {
        config(['filesystems.default' => 'minio']);
        Storage::fake('minio');

        $admin = $this->createAdmin();
        $category = $this->createCategory();

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Produk Tanpa SKU',
            'category_id' => $category->id,
            'description' => 'Deskripsi',
            'weight' => 800,
            'main_image' => UploadedFile::fake()->image('thumb.jpg'),
            'images' => [
                UploadedFile::fake()->image('p1.jpg'),
                UploadedFile::fake()->image('p2.jpg'),
                UploadedFile::fake()->image('p3.jpg'),
            ],
        ]);

        $response->assertInvalid(['base_price']);
    }

    private function createAdmin(): User
    {
        return User::query()->create([
            'name' => 'Admin Produk',
            'email' => 'admin-produk@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
    }

    private function createCategory(): Category
    {
        return Category::query()->create([
            'name' => 'Kategori '.Str::random(6),
            'slug' => 'kategori-'.Str::lower(Str::random(8)),
            'type' => 'ready_stock',
            'is_active' => true,
        ]);
    }
}
