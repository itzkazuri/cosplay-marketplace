<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'type',
        'value',
        'min_purchase',
        'max_discount',
        'usage_limit',
        'used_count',
        'starts_at',
        'ends_at',
        'applies_to_all_products',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'min_purchase' => 'decimal:2',
            'max_discount' => 'decimal:2',
            'usage_limit' => 'integer',
            'used_count' => 'integer',
            'starts_at' => 'date',
            'ends_at' => 'date',
            'applies_to_all_products' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_voucher')->withTimestamps();
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
