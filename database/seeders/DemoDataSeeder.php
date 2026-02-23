<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDiscount;
use App\Models\ProductRating;
use App\Models\ProductSku;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories (use firstOrCreate to avoid duplicates)
        $categoriesData = [
            ['name' => 'Kostum Custom', 'slug' => 'kostum-custom', 'type' => 'custom', 'description' => 'Kostum cosplay custom sesuai pesanan'],
            ['name' => 'Aksesoris', 'slug' => 'aksesoris', 'type' => 'aksesori', 'description' => 'Aksesoris cosplay berbagai jenis'],
            ['name' => 'Wig', 'slug' => 'wig', 'type' => 'wig', 'description' => 'Wig cosplay berbagai karakter'],
            ['name' => 'Props & Senjata', 'slug' => 'props-senjata', 'type' => 'props', 'description' => 'Props dan senjata cosplay'],
            ['name' => 'Ready Stock', 'slug' => 'ready-stock', 'type' => 'ready_stock', 'description' => 'Produk ready stock siap kirim'],
        ];

        foreach ($categoriesData as $categoryData) {
            Category::firstOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }

        // Get all categories
        $allCategories = Category::all();

        // Create users
        User::factory()->user()->count(10)->create();

        // Create products with variations
        $productNames = [
            ['name' => 'Cosplay Naruto Uzumaki', 'category' => 'kostum-custom', 'price' => 350000],
            ['name' => 'Cosplay Goku Super Saiyan', 'category' => 'kostum-custom', 'price' => 400000],
            ['name' => 'Cosplay Luffy Gear 5', 'category' => 'kostum-custom', 'price' => 380000],
            ['name' => 'Cosplay Tanjiro Kamado', 'category' => 'kostum-custom', 'price' => 360000],
            ['name' => 'Wig Naruto Blonde', 'category' => 'wig', 'price' => 150000],
            ['name' => 'Wig Goku Black', 'category' => 'wig', 'price' => 140000],
            ['name' => 'Wig Luffy Red', 'category' => 'wig', 'price' => 145000],
            ['name' => 'Pedang Demon Slayer', 'category' => 'props-senjata', 'price' => 250000],
            ['name' => 'Pedang One Piece', 'category' => 'props-senjata', 'price' => 280000],
            ['name' => 'Headband Konoha', 'category' => 'aksesoris', 'price' => 50000],
            ['name' => 'Dragon Ball Set', 'category' => 'aksesoris', 'price' => 120000],
            ['name' => 'Topeng Kakashi', 'category' => 'aksesoris', 'price' => 75000],
            ['name' => 'Cosplay Attack on Titan', 'category' => 'ready-stock', 'price' => 420000],
            ['name' => 'Cosplay My Hero Academia', 'category' => 'ready-stock', 'price' => 390000],
            ['name' => 'Cosplay Jujutsu Kaisen', 'category' => 'ready-stock', 'price' => 370000],
        ];

        foreach ($productNames as $productData) {
            $category = $allCategories->firstWhere('slug', $productData['category']);

            if ($category) {
                $product = Product::factory()->create([
                    'category_id' => $category->id,
                    'name' => $productData['name'],
                    'base_price' => $productData['price'],
                    'description' => $this->generateProductDescription($productData['name']),
                ]);

                // Create SKUs for each product
                ProductSku::factory()->count(3)->create([
                    'product_id' => $product->id,
                ]);

                // Create ratings (random 0-5 ratings per product)
                $ratingCount = rand(0, 5);
                if ($ratingCount > 0) {
                    ProductRating::factory()
                        ->count($ratingCount)
                        ->create([
                            'product_id' => $product->id,
                        ]);
                }

                // Some products have discounts (30% chance)
                if (rand(1, 100) <= 30) {
                    ProductDiscount::factory()->create([
                        'product_id' => $product->id,
                        'type' => rand(0, 1) ? 'percentage' : 'fixed',
                        'value' => rand(10, 30),
                    ]);
                }
            }
        }

        $this->command->info('✅ Demo data seeded successfully!');
        $this->command->info('📦 Created:');
        $this->command->info('   - '.$allCategories->count().' categories');
        $this->command->info('   - 10 users');
        $this->command->info('   - '.Product::count().' products');
        $this->command->info('   - '.ProductSku::count().' product SKUs');
        $this->command->info('   - '.ProductRating::count().' product ratings');
    }

    private function generateProductDescription(string $productName): string
    {
        $descriptions = [
            "Kostum cosplay {$productName} berkualitas tinggi dengan detail yang akurat. Cocok untuk event cosplay dan photoshoot.",
            "Produk {$productName} premium dengan bahan nyaman dan tahan lama. Tersedia berbagai ukuran.",
            "{$productName} original dengan kualitas terbaik. Perfect untuk kolektor dan cosplayer.",
            "Dapatkan {$productName} dengan harga terjangkau. Kualitas terjamin dan pengerjaan rapi.",
        ];

        return $descriptions[array_rand($descriptions)];
    }
}
