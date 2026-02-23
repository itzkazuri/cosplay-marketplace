<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('products', function (Blueprint $table) {
                $table->index(['is_active', 'category_id'], 'idx_products_active_category');
                $table->index(['is_active', 'base_price'], 'idx_products_active_price');
                $table->index(['is_active', 'created_at'], 'idx_products_active_created');
                $table->index('name', 'idx_products_name');
            });

            Schema::table('product_discounts', function (Blueprint $table) {
                $table->index(['product_id', 'is_active'], 'idx_discounts_product_active');
                $table->index(['is_active', 'starts_at', 'ends_at'], 'idx_discounts_active_date');
            });

            Schema::table('categories', function (Blueprint $table) {
                $table->index(['is_active'], 'idx_categories_active');
            });

            return;
        }

        // Check and add indexes if they don't exist
        $indexes = DB::select('SHOW INDEX FROM products');
        $existingIndexes = array_column($indexes, 'Key_name');

        if (! in_array('idx_products_active_category', $existingIndexes)) {
            Schema::table('products', function (Blueprint $table) {
                $table->index(['is_active', 'category_id'], 'idx_products_active_category');
            });
        }

        if (! in_array('idx_products_active_price', $existingIndexes)) {
            Schema::table('products', function (Blueprint $table) {
                $table->index(['is_active', 'base_price'], 'idx_products_active_price');
            });
        }

        if (! in_array('idx_products_active_created', $existingIndexes)) {
            Schema::table('products', function (Blueprint $table) {
                $table->index(['is_active', 'created_at'], 'idx_products_active_created');
            });
        }

        if (! in_array('idx_products_name', $existingIndexes)) {
            Schema::table('products', function (Blueprint $table) {
                $table->index('name', 'idx_products_name');
            });
        }

        // Product discounts indexes
        $discountIndexes = DB::select('SHOW INDEX FROM product_discounts');
        $existingDiscountIndexes = array_column($discountIndexes, 'Key_name');

        if (! in_array('idx_discounts_product_active', $existingDiscountIndexes)) {
            Schema::table('product_discounts', function (Blueprint $table) {
                $table->index(['product_id', 'is_active'], 'idx_discounts_product_active');
            });
        }

        if (! in_array('idx_discounts_active_date', $existingDiscountIndexes)) {
            Schema::table('product_discounts', function (Blueprint $table) {
                $table->index(['is_active', 'starts_at', 'ends_at'], 'idx_discounts_active_date');
            });
        }

        // Categories indexes
        $categoryIndexes = DB::select('SHOW INDEX FROM categories');
        $existingCategoryIndexes = array_column($categoryIndexes, 'Key_name');

        if (! in_array('idx_categories_active', $existingCategoryIndexes)) {
            Schema::table('categories', function (Blueprint $table) {
                $table->index(['is_active'], 'idx_categories_active');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_active_category');
            $table->dropIndex('idx_products_active_price');
            $table->dropIndex('idx_products_active_created');
            $table->dropIndex('idx_products_name');
        });

        Schema::table('product_discounts', function (Blueprint $table) {
            $table->dropIndex('idx_discounts_product_active');
            $table->dropIndex('idx_discounts_active_date');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('idx_categories_active');
        });
    }
};
