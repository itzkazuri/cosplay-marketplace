<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\ProductSku;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $productSku = ProductSku::factory()->createOne();
        $price = fake()->numberBetween(100000, 2000000);
        $quantity = fake()->numberBetween(1, 5);

        return [
            'order_id' => Order::factory(),
            'product_sku_id' => $productSku,
            'product_name' => $productSku->product->name ?? 'Product Name',
            'sku_code' => $productSku->sku,
            'size' => $productSku->size,
            'color' => $productSku->color,
            'gender' => $productSku->gender ?? 'unisex',
            'custom_option' => null,
            'quantity' => $quantity,
            'price' => $price,
            'subtotal' => $price * $quantity,
            'custom_note' => null,
        ];
    }

    /**
     * Indicate that the order item has a custom note.
     */
    public function withCustomNote(): static
    {
        return $this->state(fn (array $attributes) => [
            'custom_note' => fake()->sentence(),
        ]);
    }

    /**
     * Indicate that the order item has a high quantity.
     */
    public function highQuantity(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => fake()->numberBetween(5, 10),
        ]);
    }
}
