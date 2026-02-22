<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_sku_id')->constrained('product_skus');

            // Snapshot produk saat transaksi
            $table->string('product_name');
            $table->string('sku_code', 100);
            $table->string('size', 20)->nullable();
            $table->string('color', 100)->nullable();
            $table->enum('gender', ['unisex', 'male', 'female'])->default('unisex');
            $table->string('custom_option', 200)->nullable();

            $table->decimal('price', 12, 2);
            $table->integer('quantity')->unsigned();
            $table->decimal('subtotal', 12, 2);
            $table->text('custom_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
