<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDiscount;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class PromoManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_promo_management_page(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get(route('admin.vouchers.index'));

        $response->assertOk();
    }

    public function test_discount_cannot_be_created_for_product_with_active_voucher(): void
    {
        $admin = $this->createAdmin();
        $product = $this->createProduct('Yor Forger Outfit');

        $voucher = Voucher::query()->create([
            'name' => 'Voucher Yor',
            'code' => 'YOR10',
            'type' => 'percentage',
            'value' => 10,
            'applies_to_all_products' => false,
            'is_active' => true,
        ]);

        $voucher->products()->attach($product->id);

        try {
            $this->actingAs($admin)->post(route('admin.discounts.store'), [
                'product_id' => $product->id,
                'name' => 'Diskon Spesial',
                'type' => 'percentage',
                'value' => 15,
                'is_active' => true,
            ]);
            $this->fail('Expected validation exception for discounted product with active voucher.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('product_id', $exception->errors());
        }

        $this->assertDatabaseCount('product_discounts', 0);
    }

    public function test_voucher_cannot_be_created_for_discounted_product(): void
    {
        $admin = $this->createAdmin();
        $product = $this->createProduct('Gojo Satoru Outfit');

        ProductDiscount::query()->create([
            'product_id' => $product->id,
            'name' => 'Diskon Gojo',
            'type' => 'fixed',
            'value' => 50000,
            'is_active' => true,
        ]);

        try {
            $this->actingAs($admin)->post(route('admin.vouchers.store'), [
                'name' => 'Voucher Gojo',
                'code' => 'GOJO20',
                'type' => 'percentage',
                'value' => 20,
                'applies_to_all_products' => false,
                'is_active' => true,
                'product_ids' => [$product->id],
            ]);
            $this->fail('Expected validation exception for voucher mapped to discounted product.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('product_ids', $exception->errors());
        }

        $this->assertDatabaseCount('vouchers', 0);
    }

    private function createAdmin(): User
    {
        return User::query()->create([
            'name' => 'Admin Promo',
            'email' => 'admin-promo@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
    }

    private function createProduct(string $name): Product
    {
        $category = Category::query()->create([
            'name' => 'Kategori '.Str::random(5),
            'slug' => 'kategori-'.Str::lower(Str::random(8)),
            'type' => 'ready_stock',
            'is_active' => true,
        ]);

        return Product::query()->create([
            'category_id' => $category->id,
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'description' => 'Produk test promo',
            'base_price' => 250000,
            'is_custom' => false,
            'is_active' => true,
            'weight' => 1000,
        ]);
    }
}
