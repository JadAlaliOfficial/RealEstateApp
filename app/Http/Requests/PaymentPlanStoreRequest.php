<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentPlanStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tenant_id' => [
                'nullable',
                'integer',
                Rule::exists('tenants', 'id')->where(function ($query) {
                    return $query->where('is_archived', false);
                })
            ],
            'amount' => 'required|numeric|min:0',
            'dates' => 'required|date',
            'paid' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000'
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'tenant_id.exists' => 'The selected tenant is invalid or archived.',
            'amount.required' => 'The amount field is required.',
            'amount.numeric' => 'The amount must be a valid number.',
            'amount.min' => 'The amount must be at least 0.',
            'dates.required' => 'The date field is required.',
            'dates.date' => 'The date must be a valid date.',
            'paid.numeric' => 'The paid amount must be a valid number.',
            'paid.min' => 'The paid amount must be at least 0.',
            'notes.max' => 'The notes field cannot exceed 1000 characters.'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'tenant_id' => 'tenant',
            'dates' => 'payment date',
            'paid' => 'paid amount'
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        // No additional cross-field validation beyond base rules
    }
}
