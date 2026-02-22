<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductRating;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductRatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $users = User::all();

        if ($products->isEmpty() || $users->isEmpty()) {
            $this->command->warn('No products or users found. Please create some products and users first.');

            return;
        }

        $products->each(function ($product) use ($users) {
            $randomUsers = $users->random(min(rand(3, 10), $users->count()));

            $randomUsers->each(function ($user) use ($product) {
                ProductRating::factory()
                    ->highRating()
                    ->create([
                        'product_id' => $product->id,
                        'user_id' => $user->id,
                    ]);
            });
        });

        $this->command->info('Product ratings seeded successfully!');
    }
}
