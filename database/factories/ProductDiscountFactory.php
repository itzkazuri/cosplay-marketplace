<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductDiscount>
 */
class ProductDiscountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'name' => Str::title(fake()->words(2, true)),
            'type' => fake()->randomElement(['percentage', 'fixed']),
            'value' => fake()->randomElement([10, 15, 20, 25, 30, 50000, 100000]),
            'starts_at' => now()->subDays(7),
            'ends_at' => now()->addDays(30),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the discount is a percentage type.
     */
    public function percentage(int $value = 20): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'percentage',
            'value' => $value,
        ]);
    }

    /**
     * Indicate that the discount is a fixed amount type.
     */
    public function fixed(int $value = 50000): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'fixed',
            'value' => $value,
        ]);
    }

    /**
     * Indicate that the discount is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'starts_at' => now()->subDays(7),
            'ends_at' => now()->addDays(30),
        ]);
    }

    /**
     * Indicate that the discount is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the discount has not started yet.
     */
    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => now()->addDays(7),
            'ends_at' => now()->addDays(37),
        ]);
    }

    /**
     * Indicate that the discount has expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => now()->subDays(37),
            'ends_at' => now()->subDays(7),
        ]);
    }
}
