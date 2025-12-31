<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentPlanUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tenant_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('tenants', 'id')->where(function ($query) {
                    return $query->where('is_archived', false);
                })
            ],
            'amount' => 'sometimes|required|numeric|min:0',
            'dates' => 'sometimes|required|date',
            'paid' => 'sometimes|nullable|numeric|min:0',
            'notes' => 'sometimes|nullable|string|max:1000'
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
        $validator->after(function ($validator) {
            // If updating an existing record, check if amount is being reduced below paid amount
            // if ($this->filled('amount') && $this->route('payment_plan')) {
            //     $paymentPlan = $this->route('payment_plan');
            //     if ($this->amount < $paymentPlan->paid) {
            //         $validator->errors()->add('amount', 'The amount cannot be less than the already paid amount of $' . number_format($paymentPlan->paid, 2) . '.');
            //     }
            // }
        });
    }
}
