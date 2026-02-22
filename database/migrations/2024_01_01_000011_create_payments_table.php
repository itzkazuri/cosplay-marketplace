<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained()->onDelete('cascade');

            $table->string('midtrans_order_id', 100)->unique();
            $table->string('transaction_id', 100)->nullable();

            // Midtrans payment_type yang umum dipakai
            $table->enum('payment_type', [
                'credit_card',
                'bank_transfer',
                'gopay',
                'shopeepay',
                'qris',
                'indomaret',
                'alfamart',
                'akulaku',
                'kredivo',
            ])->nullable();

            $table->string('va_number', 50)->nullable();
            $table->decimal('amount', 12, 2);

            // Status dari Midtrans notification
            $table->enum('status', [
                'pending',
                'capture',
                'settlement',
                'deny',
                'cancel',
                'expire',
                'refund',
                'failure',
            ])->default('pending');

            $table->json('midtrans_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
