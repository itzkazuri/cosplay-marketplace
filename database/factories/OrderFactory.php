<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

        return [
            'order_number' => 'ORD-'.strtoupper(fake()->unique()->bothify('??????')),
            'user_id' => User::factory(),
            'recipient_name' => fake()->name(),
            'recipient_phone' => fake()->phoneNumber(),
            'shipping_address' => fake()->address(),
            'shipping_city' => fake()->city(),
            'shipping_province' => fake()->state(),
            'shipping_postal_code' => fake()->postcode(),
            'subtotal' => fake()->randomFloat(2, 50000, 5000000),
            'shipping_cost' => fake()->randomFloat(2, 10000, 100000),
            'total' => fake()->randomFloat(2, 60000, 5100000),
            'status' => fake()->randomElement($statuses),
            'cancel_reason' => null,
            'notes' => fake()->optional(0.3)->sentence(),
        ];
    }

    /**
     * Indicate that the order is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the order is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
        ]);
    }

    /**
     * Indicate that the order is delivered.
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'delivered',
        ]);
    }

    /**
     * Indicate that the order is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'cancel_reason' => fake()->randomElement(['payment_expired', 'out_of_stock', 'buyer_request', 'seller_request', 'fraud_suspected']),
        ]);
    }
}
