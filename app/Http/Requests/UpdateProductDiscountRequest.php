<?php

namespace App\Http\Requests;

use App\Models\ProductDiscount;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class UpdateProductDiscountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var ProductDiscount|null $discount */
        $discount = $this->route('discount');

        return [
            'product_id' => ['required', 'exists:products,id', Rule::unique('product_discounts', 'product_id')->ignore($discount?->id)],
            'name' => ['required', 'string', 'max:120'],
            'type' => ['required', 'in:percentage,fixed'],
            'value' => ['required', 'numeric', 'min:0.01'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['boolean'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (! $this->willBeActiveNow()) {
                return;
            }

            $productId = (int) $this->input('product_id');

            $hasActiveVoucher = Voucher::query()
                ->active()
                ->where(function (Builder $query) use ($productId) {
                    $query->where('applies_to_all_products', true)
                        ->orWhereHas('products', function (Builder $builder) use ($productId) {
                            $builder->where('products.id', $productId);
                        });
                })
                ->exists();

            if ($hasActiveVoucher) {
                $validator->errors()->add('product_id', 'Produk ini sedang terhubung dengan voucher aktif. Nonaktifkan voucher terlebih dahulu sebelum memberi diskon.');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'Produk wajib dipilih.',
            'product_id.exists' => 'Produk tidak valid.',
            'product_id.unique' => 'Produk ini sudah memiliki diskon.',
            'name.required' => 'Nama diskon wajib diisi.',
            'type.required' => 'Tipe diskon wajib dipilih.',
            'type.in' => 'Tipe diskon tidak valid.',
            'value.required' => 'Nilai diskon wajib diisi.',
            'value.min' => 'Nilai diskon harus lebih dari 0.',
            'ends_at.after_or_equal' => 'Tanggal akhir harus setelah atau sama dengan tanggal mulai.',
        ];
    }

    private function willBeActiveNow(): bool
    {
        $isActive = $this->boolean('is_active', true);

        if (! $isActive) {
            return false;
        }

        $today = now()->startOfDay();
        $startsAt = $this->input('starts_at') ? Carbon::parse($this->input('starts_at'))->startOfDay() : null;
        $endsAt = $this->input('ends_at') ? Carbon::parse($this->input('ends_at'))->endOfDay() : null;

        if ($startsAt && $startsAt->greaterThan($today)) {
            return false;
        }

        if ($endsAt && $endsAt->lessThan($today)) {
            return false;
        }

        return true;
    }
}
