<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_skus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('sku', 100)->unique();

            $table->enum('size', [
                'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
                'free_size',
                'custom',
            ])->nullable();

            $table->enum('gender', [
                'unisex',
                'male',
                'female',
            ])->default('unisex');

            $table->string('color', 100)->nullable();
            $table->string('custom_option', 200)->nullable();
            $table->decimal('price', 12, 2);
            $table->integer('stock')->default(0)->unsigned();
            $table->boolean('is_custom_order')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_skus');
    }
};
