<?php

namespace App\Http\Controllers\Midtrans;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    /**
     * Handle incoming Midtrans notification callback.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $payload = $request->all();

        $request->validate([
            'order_id' => ['required', 'string'],
            'status_code' => ['required', 'string'],
            'gross_amount' => ['required', 'string'],
            'signature_key' => ['required', 'string'],
            'transaction_status' => ['required', 'string'],
        ]);

        $serverKey = (string) config('services.midtrans.server_key');
        if ($serverKey === '') {
            return response()->json([
                'message' => 'Midtrans server key is not configured.',
            ], 500);
        }

        $expectedSignature = hash(
            'sha512',
            $payload['order_id'].$payload['status_code'].$payload['gross_amount'].$serverKey
        );

        if (! hash_equals($expectedSignature, (string) $payload['signature_key'])) {
            return response()->json([
                'message' => 'Invalid signature key.',
            ], 403);
        }

        DB::transaction(function () use ($payload): void {
            $payment = Payment::query()
                ->where('midtrans_order_id', $payload['order_id'])
                ->lockForUpdate()
                ->first();

            if (! $payment) {
                return;
            }

            $resolvedPaymentStatus = $this->resolvePaymentStatus(
                transactionStatus: (string) $payload['transaction_status'],
                paymentType: Arr::get($payload, 'payment_type'),
                fraudStatus: Arr::get($payload, 'fraud_status')
            );

            $paymentType = $this->normalizePaymentType(
                paymentType: Arr::get($payload, 'payment_type'),
                store: Arr::get($payload, 'store')
            );

            $payment->fill([
                'transaction_id' => Arr::get($payload, 'transaction_id'),
                'payment_type' => $paymentType,
                'va_number' => $this->resolveVaNumber($payload),
                'amount' => (float) $payload['gross_amount'],
                'status' => $resolvedPaymentStatus,
                'midtrans_response' => $payload,
            ]);

            if (in_array($resolvedPaymentStatus, ['capture', 'settlement'], true) && $payment->paid_at === null) {
                $payment->paid_at = now();
            }

            $payment->save();

            $this->syncOrderStatus($payment, $resolvedPaymentStatus);
        });

        return response()->json([
            'message' => 'Notification processed.',
        ]);
    }

    private function resolvePaymentStatus(string $transactionStatus, ?string $paymentType, ?string $fraudStatus): string
    {
        $transactionStatus = strtolower($transactionStatus);
        $paymentType = strtolower((string) $paymentType);
        $fraudStatus = strtolower((string) $fraudStatus);

        if ($transactionStatus === 'capture' && $paymentType === 'credit_card' && $fraudStatus === 'challenge') {
            return 'pending';
        }

        return match ($transactionStatus) {
            'capture' => 'capture',
            'settlement' => 'settlement',
            'pending' => 'pending',
            'deny' => 'deny',
            'cancel' => 'cancel',
            'expire' => 'expire',
            'refund', 'partial_refund' => 'refund',
            'failure' => 'failure',
            default => 'pending',
        };
    }

    private function syncOrderStatus(Payment $payment, string $paymentStatus): void
    {
        $order = $payment->order;

        if ($order === null) {
            return;
        }

        if (in_array($paymentStatus, ['capture', 'settlement'], true)) {
            if (in_array($order->status, ['pending', 'cancelled'], true)) {
                $order->update([
                    'status' => 'paid',
                    'cancel_reason' => null,
                ]);
            }

            return;
        }

        if (in_array($paymentStatus, ['expire', 'cancel', 'deny', 'failure'], true)) {
            if ($order->status === 'pending') {
                $order->update([
                    'status' => 'cancelled',
                    'cancel_reason' => $paymentStatus === 'expire' ? 'payment_expired' : 'seller_request',
                ]);
            }

            return;
        }

        if ($paymentStatus === 'refund') {
            $order->update([
                'status' => 'refunded',
                'cancel_reason' => null,
            ]);
        }
    }

    private function normalizePaymentType(?string $paymentType, ?string $store): ?string
    {
        $paymentType = strtolower((string) $paymentType);
        $store = strtolower((string) $store);

        return match ($paymentType) {
            'credit_card' => 'credit_card',
            'bank_transfer', 'echannel' => 'bank_transfer',
            'gopay' => 'gopay',
            'shopeepay' => 'shopeepay',
            'qris' => 'qris',
            'akulaku' => 'akulaku',
            'kredivo' => 'kredivo',
            'cstore' => in_array($store, ['alfamart', 'indomaret'], true) ? $store : null,
            default => null,
        };
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function resolveVaNumber(array $payload): ?string
    {
        $vaNumber = Arr::get($payload, 'va_numbers.0.va_number');

        if (is_string($vaNumber) && $vaNumber !== '') {
            return $vaNumber;
        }

        $permataVaNumber = Arr::get($payload, 'permata_va_number');

        if (is_string($permataVaNumber) && $permataVaNumber !== '') {
            return $permataVaNumber;
        }

        return null;
    }
}
