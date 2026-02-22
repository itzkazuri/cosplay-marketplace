<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CategoryMediaTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_store_category_image_to_minio(): void
    {
        config(['filesystems.default' => 'minio']);
        Storage::fake('minio');

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post(route('admin.categories.store'), [
            'name' => 'Kategori Gambar',
            'description' => 'Deskripsi',
            'type' => 'ready_stock',
            'is_active' => true,
            'image' => UploadedFile::fake()->image('category.jpg'),
        ]);

        $response->assertRedirect(route('admin.categories.index'));

        $category = Category::query()->where('name', 'Kategori Gambar')->firstOrFail();

        $this->assertNotNull($category->getRawOriginal('image'));
        Storage::disk('minio')->assertExists($category->getRawOriginal('image'));
    }

    public function test_updating_category_image_removes_old_file(): void
    {
        config(['filesystems.default' => 'minio']);
        Storage::fake('minio');

        $admin = $this->createAdmin();

        $this->actingAs($admin)->post(route('admin.categories.store'), [
            'name' => 'Kategori Update Gambar',
            'description' => 'Deskripsi',
            'type' => 'custom',
            'is_active' => true,
            'image' => UploadedFile::fake()->image('old.jpg'),
        ]);

        $category = Category::query()->where('name', 'Kategori Update Gambar')->firstOrFail();
        $oldImagePath = $category->getRawOriginal('image');

        $response = $this->actingAs($admin)->put(route('admin.categories.update', $category), [
            'name' => 'Kategori Update Gambar',
            'description' => 'Deskripsi Baru',
            'type' => 'custom',
            'is_active' => true,
            'image' => UploadedFile::fake()->image('new.jpg'),
        ]);

        $response->assertRedirect(route('admin.categories.index'));

        $category->refresh();
        $newImagePath = $category->getRawOriginal('image');

        $this->assertNotSame($oldImagePath, $newImagePath);
        Storage::disk('minio')->assertMissing($oldImagePath);
        Storage::disk('minio')->assertExists($newImagePath);
    }

    public function test_deleting_category_removes_stored_image(): void
    {
        config(['filesystems.default' => 'minio']);
        Storage::fake('minio');

        $admin = $this->createAdmin();

        $this->actingAs($admin)->post(route('admin.categories.store'), [
            'name' => 'Kategori Hapus Gambar',
            'description' => 'Deskripsi',
            'type' => 'props',
            'is_active' => true,
            'image' => UploadedFile::fake()->image('delete.jpg'),
        ]);

        $category = Category::query()->where('name', 'Kategori Hapus Gambar')->firstOrFail();
        $imagePath = $category->getRawOriginal('image');

        $response = $this->actingAs($admin)->delete(route('admin.categories.destroy', $category));

        $response->assertRedirect(route('admin.categories.index'));
        Storage::disk('minio')->assertMissing($imagePath);
    }

    private function createAdmin(): User
    {
        return User::query()->create([
            'name' => 'Admin Category Media',
            'email' => 'admin-category-media@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
    }
}
