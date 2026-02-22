<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained()->onDelete('cascade');

            $table->enum('courier', [
                'jne', 'jnt', 'sicepat', 'pos_indonesia',
                'anteraja', 'wahana', 'tiki', 'ninja_express',
                'gosend', 'grab_express', 'other',
            ])->nullable();

            $table->enum('courier_service', [
                'REG', 'YES', 'OKE', 'EXPRESS',
                'SAME_DAY', 'NEXT_DAY', 'CARGO', 'OTHER',
            ])->nullable();

            $table->string('tracking_number', 100)->nullable();

            $table->enum('status', [
                'pending',
                'packed',
                'shipped',
                'in_transit',
                'delivered',
                'returned',
                'failed',
            ])->default('pending');

            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
