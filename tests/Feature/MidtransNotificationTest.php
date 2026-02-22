<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class MidtransNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_midtrans_notification_updates_payment_and_order_status(): void
    {
        config(['services.midtrans.server_key' => 'server-key-test']);

        [$order, $payment] = $this->createOrderWithPayment();

        $payload = [
            'order_id' => $payment->midtrans_order_id,
            'status_code' => '200',
            'gross_amount' => '250000.00',
            'transaction_status' => 'settlement',
            'transaction_id' => 'trx-123',
            'payment_type' => 'bank_transfer',
            'va_numbers' => [
                ['va_number' => '1234567890'],
            ],
        ];

        $payload['signature_key'] = hash(
            'sha512',
            $payload['order_id'].$payload['status_code'].$payload['gross_amount'].'server-key-test'
        );

        $response = $this->postJson(route('midtrans.notification'), $payload);

        $response->assertOk();

        $payment->refresh();
        $order->refresh();

        $this->assertSame('settlement', $payment->status);
        $this->assertSame('trx-123', $payment->transaction_id);
        $this->assertSame('bank_transfer', $payment->payment_type);
        $this->assertSame('1234567890', $payment->va_number);
        $this->assertNotNull($payment->paid_at);
        $this->assertSame('paid', $order->status);
    }

    public function test_midtrans_notification_rejects_invalid_signature(): void
    {
        config(['services.midtrans.server_key' => 'server-key-test']);

        [, $payment] = $this->createOrderWithPayment();

        $response = $this->postJson(route('midtrans.notification'), [
            'order_id' => $payment->midtrans_order_id,
            'status_code' => '200',
            'gross_amount' => '250000.00',
            'transaction_status' => 'settlement',
            'signature_key' => 'invalid-signature',
        ]);

        $response->assertForbidden();
    }

    /**
     * @return array{0: Order, 1: Payment}
     */
    private function createOrderWithPayment(): array
    {
        $user = User::query()->create([
            'name' => 'Webhook Tester',
            'email' => 'webhook-tester@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $order = Order::query()->create([
            'order_number' => 'ORD-WEBHOOK-001',
            'user_id' => $user->id,
            'recipient_name' => 'Webhook Recipient',
            'recipient_phone' => '08123456789',
            'shipping_address' => 'Jl. Webhook No. 1',
            'shipping_city' => 'Jakarta',
            'shipping_province' => 'DKI Jakarta',
            'shipping_postal_code' => '12345',
            'subtotal' => 240000,
            'shipping_cost' => 10000,
            'total' => 250000,
            'status' => 'pending',
        ]);

        $payment = Payment::query()->create([
            'order_id' => $order->id,
            'midtrans_order_id' => 'MID-ORD-WEBHOOK-001',
            'amount' => 250000,
            'status' => 'pending',
        ]);

        return [$order, $payment];
    }
}
