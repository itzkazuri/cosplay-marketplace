<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('revenue_reports', function (Blueprint $table) {
            $table->id();
            $table->enum('period_type', ['monthly', 'yearly']);
            $table->smallInteger('year')->unsigned();
            $table->tinyInteger('month')->unsigned()->nullable();
            $table->integer('total_orders')->unsigned()->default(0);
            $table->integer('total_items_sold')->unsigned()->default(0);
            $table->integer('cancelled_orders')->unsigned()->default(0);
            $table->decimal('gross_revenue', 15, 2)->default(0);
            $table->decimal('total_shipping', 15, 2)->default(0);
            $table->decimal('net_revenue', 15, 2)->default(0);
            $table->timestamps();

            $table->unique(['period_type', 'year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('revenue_reports');
    }
};
