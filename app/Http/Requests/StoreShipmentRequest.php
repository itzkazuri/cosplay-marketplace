<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShipmentRequest extends FormRequest
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
            'order_id' => ['required', 'exists:orders,id'],
            'courier' => ['required', 'in:jne,jnt,sicepat,pos_indonesia,anteraja,wahana,tiki,ninja_express,gosend,grab_express,other'],
            'courier_service' => ['required', 'in:REG,YES,OKE,EXPRESS,SAME_DAY,NEXT_DAY,CARGO,OTHER'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:pending,packed,shipped,in_transit,delivered,returned,failed'],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'order_id.required' => 'Order wajib dipilih.',
            'order_id.exists' => 'Order tidak valid.',
            'courier.required' => 'Kurir wajib dipilih.',
            'courier_service.required' => 'Layanan kurir wajib dipilih.',
            'status.required' => 'Status wajib dipilih.',
        ];
    }
}
