<?php

namespace App\Http\Requests;

use App\Models\ProductDiscount;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class StoreVoucherRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:120'],
            'code' => ['required', 'string', 'max:50', 'alpha_num', 'unique:vouchers,code'],
            'type' => ['required', 'in:percentage,fixed'],
            'value' => ['required', 'numeric', 'min:0.01'],
            'min_purchase' => ['nullable', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'applies_to_all_products' => ['boolean'],
            'is_active' => ['boolean'],
            'product_ids' => [Rule::requiredIf(! $this->boolean('applies_to_all_products', false)), 'array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (! $this->willBeActiveNow()) {
                return;
            }

            $appliesToAllProducts = $this->boolean('applies_to_all_products', false);
            $productIds = collect($this->input('product_ids', []))
                ->filter()
                ->map(fn ($id) => (int) $id)
                ->unique()
                ->values()
                ->all();

            if ($appliesToAllProducts) {
                if (ProductDiscount::query()->active()->exists()) {
                    $validator->errors()->add('applies_to_all_products', 'Voucher semua produk tidak bisa diaktifkan karena masih ada produk dengan diskon aktif.');
                }

                return;
            }

            $hasDiscountedProduct = ProductDiscount::query()
                ->active()
                ->whereIn('product_id', $productIds)
                ->exists();

            if ($hasDiscountedProduct) {
                $validator->errors()->add('product_ids', 'Voucher tidak bisa diterapkan ke produk yang sedang diskon aktif.');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama voucher wajib diisi.',
            'code.required' => 'Kode voucher wajib diisi.',
            'code.alpha_num' => 'Kode voucher hanya boleh huruf dan angka.',
            'code.unique' => 'Kode voucher sudah digunakan.',
            'type.required' => 'Tipe voucher wajib dipilih.',
            'value.required' => 'Nilai voucher wajib diisi.',
            'value.min' => 'Nilai voucher harus lebih dari 0.',
            'usage_limit.min' => 'Batas penggunaan minimal 1.',
            'ends_at.after_or_equal' => 'Tanggal akhir harus setelah atau sama dengan tanggal mulai.',
            'product_ids.required' => 'Pilih minimal satu produk untuk voucher ini.',
            'product_ids.array' => 'Data produk voucher tidak valid.',
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
