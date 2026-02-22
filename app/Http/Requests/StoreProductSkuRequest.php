<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductSkuRequest extends FormRequest
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
        $skuId = $this->route('productSku')?->id;

        return [
            'product_id' => ['required', 'exists:products,id'],
            'sku' => ['required', 'string', 'max:100', 'unique:product_skus,sku,'.($skuId ?? 'NULL')],
            'size' => ['nullable', 'in:XS,S,M,L,XL,XXL,XXXL,free_size,custom'],
            'gender' => ['nullable', 'in:unisex,male,female'],
            'color' => ['nullable', 'string', 'max:100'],
            'custom_option' => ['nullable', 'string', 'max:200'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_custom_order' => ['boolean'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'Produk wajib dipilih.',
            'product_id.exists' => 'Produk tidak valid.',
            'sku.required' => 'Kode SKU wajib diisi.',
            'sku.unique' => 'Kode SKU sudah digunakan, gunakan yang lain.',
            'price.required' => 'Harga wajib diisi.',
            'price.numeric' => 'Harga harus berupa angka.',
            'stock.required' => 'Stok wajib diisi.',
            'stock.integer' => 'Stok harus berupa angka bulat.',
            'stock.min' => 'Stok tidak boleh negatif.',
        ];
    }
}
