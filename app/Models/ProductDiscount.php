<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductDiscount extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'name',
        'type',
        'value',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'starts_at' => 'date',
            'ends_at' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeActive(Builder $query, ?CarbonInterface $date = null): Builder
    {
        $activeDate = $date ?? now();

        return $query->where('is_active', true)
            ->where(function (Builder $builder) use ($activeDate) {
                $builder->whereNull('starts_at')
                    ->orWhereDate('starts_at', '<=', $activeDate);
            })
            ->where(function (Builder $builder) use ($activeDate) {
                $builder->whereNull('ends_at')
                    ->orWhereDate('ends_at', '>=', $activeDate);
            });
    }
}
