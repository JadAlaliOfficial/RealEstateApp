<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVendorTaskTrackerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'task_submission_date' => ['required', 'date'],
            'vendor_id' => [
                'nullable',
                'integer',
                Rule::exists('vendors_info', 'id')->where(function ($query) {
                    return $query->where('is_archived', false);
                })
            ],
            'unit_id' => [
                'nullable',
                'integer',
                Rule::exists('units', 'id')->where(function ($query) {
                    return $query->where('is_archived', false);
                })
            ],
            'assigned_tasks' => ['required', 'string'],
            'any_scheduled_visits' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'task_ending_date' => [
                'nullable', 
                'date',
                'after_or_equal:task_submission_date'
            ],
            'status' => ['nullable', 'string', 'max:255'],
            'urgent' => ['required', 'string', Rule::in(['Yes', 'No'])],
        ];
    }

    public function messages(): array
    {
        return [
            'vendor_id.exists' => 'The selected vendor must exist and be active.',
            'vendor_id.integer' => 'The vendor ID must be a valid integer.',
            'unit_id.exists' => 'The selected unit must exist and be active.',
            'unit_id.integer' => 'The unit ID must be a valid integer.',
            'urgent.in' => 'The urgent field must be either Yes or No.',
            'task_submission_date.required' => 'The task submission date is required.',
            'task_submission_date.date' => 'The task submission date must be a valid date.',
            'assigned_tasks.required' => 'The assigned tasks field is required.',
            'assigned_tasks.string' => 'The assigned tasks must be a valid text.',
            'any_scheduled_visits.date' => 'The scheduled visits date must be a valid date.',
            'task_ending_date.date' => 'The task ending date must be a valid date.',
            'task_ending_date.after_or_equal' => 'The task ending date must be on or after the submission date.',
            'status.max' => 'The status field may not be greater than 255 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'vendor_id' => 'vendor',
            'unit_id' => 'unit',
            'task_submission_date' => 'submission date',
            'any_scheduled_visits' => 'scheduled visits',
            'task_ending_date' => 'ending date',
            'assigned_tasks' => 'assigned tasks',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert empty strings to null for nullable fields
        $this->merge([
            'vendor_id' => $this->vendor_id === '' ? null : $this->vendor_id,
            'unit_id' => $this->unit_id === '' ? null : $this->unit_id,
            'any_scheduled_visits' => $this->any_scheduled_visits === '' ? null : $this->any_scheduled_visits,
            'task_ending_date' => $this->task_ending_date === '' ? null : $this->task_ending_date,
            'notes' => $this->notes === '' ? null : $this->notes,
            'status' => $this->status === '' ? null : $this->status,
        ]);
    }
}
