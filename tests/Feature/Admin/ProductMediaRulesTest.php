<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ProductMediaRulesTest extends TestCase
{
    use RefreshDatabase;

    public function test_thumbnail_is_required_when_creating_product(): void
    {
        config(['filesystems.default' => 'minio']);

        $admin = $this->createAdmin();
        $category = $this->createCategory();

        try {
            $this->actingAs($admin)->post(route('admin.products.store'), [
                'name' => 'Produk Tanpa Thumbnail',
                'category_id' => $category->id,
                'description' => 'Deskripsi',
                'base_price' => 250000,
                'weight' => 1000,
                'images' => [
                    UploadedFile::fake()->image('p1.jpg'),
                    UploadedFile::fake()->image('p2.jpg'),
                    UploadedFile::fake()->image('p3.jpg'),
                ],
            ]);

            $this->fail('Expected validation exception for missing thumbnail.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('main_image', $exception->errors());
        }
    }

    public function test_product_preview_must_be_exactly_three_images(): void
    {
        config(['filesystems.default' => 'minio']);

        $admin = $this->createAdmin();
        $category = $this->createCategory();

        try {
            $this->actingAs($admin)->post(route('admin.products.store'), [
                'name' => 'Produk Preview Kurang',
                'category_id' => $category->id,
                'description' => 'Deskripsi',
                'base_price' => 250000,
                'weight' => 1000,
                'main_image' => UploadedFile::fake()->image('thumb.jpg'),
                'images' => [
                    UploadedFile::fake()->image('p1.jpg'),
                    UploadedFile::fake()->image('p2.jpg'),
                ],
            ]);

            $this->fail('Expected validation exception for preview image count.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('images', $exception->errors());
        }
    }

    public function test_product_can_be_created_with_one_thumbnail_and_three_preview_images(): void
    {
        config(['filesystems.default' => 'minio']);
        Storage::fake('minio');

        $admin = $this->createAdmin();
        $category = $this->createCategory();

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Produk Valid Media',
            'category_id' => $category->id,
            'description' => 'Deskripsi',
            'base_price' => 250000,
            'weight' => 1000,
            'main_image' => UploadedFile::fake()->image('thumb.jpg'),
            'images' => [
                UploadedFile::fake()->image('p1.jpg'),
                UploadedFile::fake()->image('p2.jpg'),
                UploadedFile::fake()->image('p3.jpg'),
            ],
        ]);

        $response->assertRedirect(route('admin.products.index'));

        $product = Product::query()->where('name', 'Produk Valid Media')->firstOrFail();

        $this->assertNotSame('thumb.jpg', basename((string) $product->getRawOriginal('main_image')));
        Storage::disk('minio')->assertExists($product->getRawOriginal('main_image'));

        $this->assertDatabaseCount('product_images', 3);

        $product->images()->each(function ($image): void {
            Storage::disk('minio')->assertExists($image->getRawOriginal('image_path'));
        });
    }

    public function test_deleting_product_also_deletes_stored_images_from_minio(): void
    {
        config(['filesystems.default' => 'minio']);
        Storage::fake('minio');

        $admin = $this->createAdmin();
        $category = $this->createCategory();

        $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Produk Hapus Media',
            'category_id' => $category->id,
            'description' => 'Deskripsi',
            'base_price' => 250000,
            'weight' => 1000,
            'main_image' => UploadedFile::fake()->image('thumb.jpg'),
            'images' => [
                UploadedFile::fake()->image('p1.jpg'),
                UploadedFile::fake()->image('p2.jpg'),
                UploadedFile::fake()->image('p3.jpg'),
            ],
        ]);

        $product = Product::query()->where('name', 'Produk Hapus Media')->firstOrFail();
        $mainImagePath = $product->getRawOriginal('main_image');
        $previewImagePaths = $product->images()->pluck('image_path')->all();

        $response = $this->actingAs($admin)->delete(route('admin.products.destroy', $product));

        $response->assertRedirect(route('admin.products.index'));

        Storage::disk('minio')->assertMissing($mainImagePath);
        foreach ($previewImagePaths as $previewImagePath) {
            Storage::disk('minio')->assertMissing($previewImagePath);
        }
    }

    private function createAdmin(): User
    {
        return User::query()->create([
            'name' => 'Admin Product Media',
            'email' => 'admin-product-media@example.com',
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
