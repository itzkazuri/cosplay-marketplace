<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
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
}
