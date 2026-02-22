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
        if (! Schema::hasTable('product_voucher')) {
            Schema::create('product_voucher', function (Blueprint $table) {
                $table->foreignId('voucher_id');
                $table->foreignId('product_id');
                $table->timestamps();

                $table->primary(['voucher_id', 'product_id']);
            });
        }

        $this->addForeignKeyIfMissing(
            table: 'product_voucher',
            column: 'voucher_id',
            referencedTable: 'vouchers',
            constraintName: 'product_voucher_voucher_id_foreign'
        );

        $this->addForeignKeyIfMissing(
            table: 'product_voucher',
            column: 'product_id',
            referencedTable: 'products',
            constraintName: 'product_voucher_product_id_foreign'
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_voucher');
    }

    private function addForeignKeyIfMissing(string $table, string $column, string $referencedTable, string $constraintName): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        $databaseName = DB::getDatabaseName();

        $exists = DB::table('information_schema.table_constraints')
            ->where('constraint_schema', $databaseName)
            ->where('table_name', $table)
            ->where('constraint_name', $constraintName)
            ->where('constraint_type', 'FOREIGN KEY')
            ->exists();

        if ($exists) {
            return;
        }

        Schema::table($table, function (Blueprint $blueprint) use ($column, $referencedTable, $constraintName) {
            $blueprint->foreign($column, $constraintName)
                ->references('id')
                ->on($referencedTable)
                ->cascadeOnDelete();
        });
    }
};
