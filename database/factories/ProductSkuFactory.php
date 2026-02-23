<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductSku>
 */
class ProductSkuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sku = fake()->unique()->bothify('SKU-####-???');

        return [
            'product_id' => Product::factory(),
            'sku' => $sku,
            'size' => fake()->randomElement(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'free_size']),
            'gender' => fake()->randomElement(['unisex', 'male', 'female']),
            'color' => fake()->randomElement(['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Navy']),
            'custom_option' => null,
            'price' => fake()->numberBetween(100000, 2000000),
            'stock' => fake()->numberBetween(5, 100),
            'is_custom_order' => false,
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the SKU is for a custom order.
     */
    public function customOrder(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_custom_order' => true,
            'size' => 'custom',
            'custom_option' => fake()->sentence(3),
        ]);
    }

    /**
     * Indicate that the SKU is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the SKU has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => fake()->numberBetween(1, 5),
        ]);
    }

    /**
     * Indicate that the SKU is for male gender.
     */
    public function male(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'male',
        ]);
    }

    /**
     * Indicate that the SKU is for female gender.
     */
    public function female(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'female',
        ]);
    }

    /**
     * Indicate that the SKU is unisex.
     */
    public function unisex(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'unisex',
        ]);
    }
}
