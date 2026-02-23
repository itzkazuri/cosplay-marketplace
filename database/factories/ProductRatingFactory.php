<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductRating>
 */
class ProductRatingFactory extends Factory
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
            'user_id' => User::factory()->user(),
            'order_id' => null,
            'rating' => fake()->numberBetween(1, 5),
            'review' => fake()->optional(0.8)->paragraph(),
            'images' => null,
            'is_verified_purchase' => fake()->boolean(30),
            'is_visible' => true,
            'helpful_count' => fake()->numberBetween(0, 50),
            'approved_at' => now(),
        ];
    }

    /**
     * Indicate that the rating is from a verified purchase.
     */
    public function verifiedPurchase(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified_purchase' => true,
            'order_id' => Order::factory(),
        ]);
    }

    /**
     * Indicate that the rating has images.
     */
    public function withImages(int $count = 2): static
    {
        return $this->state(fn (array $attributes) => [
            'images' => fake()->randomElements([
                'images/review1.jpg',
                'images/review2.jpg',
                'images/review3.jpg',
                'images/review4.jpg',
            ], $count),
        ]);
    }

    /**
     * Indicate that the rating is not visible.
     */
    public function hidden(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_visible' => false,
            'approved_at' => null,
        ]);
    }

    /**
     * Indicate that the rating has a high rating (4-5 stars).
     */
    public function highRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => fake()->numberBetween(4, 5),
        ]);
    }

    /**
     * Indicate that the rating has a low rating (1-2 stars).
     */
    public function lowRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => fake()->numberBetween(1, 2),
        ]);
    }

    /**
     * Indicate that the rating has a medium rating (3 stars).
     */
    public function mediumRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => 3,
        ]);
    }

    /**
     * Indicate that the rating is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_visible' => true,
            'approved_at' => now(),
        ]);
    }

    /**
     * Indicate that the rating is pending approval.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_visible' => false,
            'approved_at' => null,
        ]);
    }
}
