<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RevenueReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'period_type',
        'year',
        'month',
        'total_orders',
        'total_items_sold',
        'cancelled_orders',
        'gross_revenue',
        'total_shipping',
        'net_revenue',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'month' => 'integer',
            'total_orders' => 'integer',
            'total_items_sold' => 'integer',
            'cancelled_orders' => 'integer',
            'gross_revenue' => 'decimal:2',
            'total_shipping' => 'decimal:2',
            'net_revenue' => 'decimal:2',
        ];
    }
}
