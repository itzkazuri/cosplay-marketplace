<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'description' => fake()->optional()->paragraph(),
            'base_price' => fake()->numberBetween(150000, 1500000),
            'main_image' => null,
            'is_custom' => fake()->boolean(20),
            'is_active' => true,
            'weight' => fake()->numberBetween(200, 2000),
        ];
    }

    /**
     * Indicate that the product is custom only.
     */
    public function custom(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_custom' => true,
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the product has a discount.
     */
    public function withDiscount(): static
    {
        return $this->afterCreating(function ($product) {
            \App\Models\ProductDiscount::factory()->create([
                'product_id' => $product->id,
            ]);
        });
    }

    /**
     * Indicate that the product has ratings.
     */
    public function withRatings(int $count = 5): static
    {
        return $this->afterCreating(function ($product) use ($count) {
            \App\Models\ProductRating::factory()
                ->count($count)
                ->create([
                    'product_id' => $product->id,
                ]);
        });
    }

    /**
     * Indicate that the product has SKUs.
     */
    public function withSkus(int $count = 3): static
    {
        return $this->afterCreating(function ($product) use ($count) {
            \App\Models\ProductSku::factory()
                ->count($count)
                ->create([
                    'product_id' => $product->id,
                ]);
        });
    }
}
