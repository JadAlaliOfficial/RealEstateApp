<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyInfoWithoutInsuranceRequest extends FormRequest
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
            'city_id' => 'nullable|integer|exists:cities,id',
            'property_name' => 'required|string|max:255|',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'city_id.integer' => 'The city must be a valid selection.',
            'city_id.exists' => 'The selected city does not exist.',
            'property_name.required' => 'The property name field is required.',
            'property_name.string' => 'The property name must be a string.',
            'property_name.max' => 'The property name may not be greater than 255 characters.',
        ];
    }


    /**
     * Get custom attribute names for validation errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'city_id' => 'city',
            'property_name' => 'property name',
        ];
    }
}
