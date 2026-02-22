<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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
        $isCreate = $this->isMethod('post');

        return [
            'name' => ['required', 'string', 'max:200'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'base_price' => [
                'nullable',
                'numeric',
                'min:0',
                Rule::requiredIf(fn () => empty($this->input('skus'))),
            ],
            'weight' => ['required', 'integer', 'min:0'],
            'main_image' => [$isCreate ? 'required' : 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'is_custom' => ['boolean'],
            'is_active' => ['boolean'],
            'skus' => ['nullable', 'array'],
            'skus.*.sku' => ['required_with:skus', 'string', 'max:100'],
            'skus.*.size' => ['nullable', 'in:XS,S,M,L,XL,XXL,XXXL,free_size,custom'],
            'skus.*.gender' => ['nullable', 'in:unisex,male,female'],
            'skus.*.color' => ['nullable', 'string', 'max:100'],
            'skus.*.custom_option' => ['nullable', 'string', 'max:200'],
            'skus.*.price' => ['required_with:skus', 'numeric', 'min:0'],
            'skus.*.stock' => ['required_with:skus', 'integer', 'min:0'],
            'skus.*.is_custom_order' => ['boolean'],
            'skus.*.is_active' => ['boolean'],
            'images' => [$isCreate ? 'required' : 'nullable', 'array', 'size:3'],
            'images.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'name.max' => 'Nama produk maksimal 200 karakter.',
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori tidak valid.',
            'base_price.required' => 'Harga wajib diisi jika belum ada SKU.',
            'base_price.numeric' => 'Harga dasar harus berupa angka.',
            'base_price.min' => 'Harga dasar tidak boleh negatif.',
            'weight.required' => 'Berat wajib diisi.',
            'weight.integer' => 'Berat harus berupa angka bulat.',
            'weight.min' => 'Berat tidak boleh negatif.',
            'main_image.required' => 'Thumbnail produk wajib diunggah.',
            'main_image.image' => 'Thumbnail produk harus berupa gambar.',
            'skus.*.sku.required_with' => 'SKU wajib diisi.',
            'skus.*.price.required_with' => 'Harga variant wajib diisi.',
            'skus.*.stock.required_with' => 'Stok variant wajib diisi.',
            'images.required' => 'Preview produk wajib diunggah.',
            'images.size' => 'Preview produk harus tepat 3 gambar.',
            'images.*.required' => 'Setiap preview produk wajib diunggah.',
            'images.*.image' => 'Setiap preview produk harus berupa gambar.',
        ];
    }
}
