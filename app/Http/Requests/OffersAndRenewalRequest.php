<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class OffersAndRenewalRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'tenant_id' => [
                'nullable', 'integer',
                Rule::exists('tenants', 'id')->where('is_archived', false),
            ],
            'property' => [
                'nullable', 'string',
                Rule::exists('property_info_without_insurance', 'property_name')->where('is_archived', false),
            ],
            'city_name' => [
                'nullable', 'string',
                Rule::exists('cities', 'city')->where('is_archived', false),
            ],
            'unit' => [
                'nullable', 'string',
                Rule::exists('units', 'unit_name')->where('is_archived', false),
            ],
            'tenant' => [
                'nullable', 'string', 
                function($attribute, $value, $fail) {
                    if (empty($value)) {
                        return; // Allow null/empty since it's nullable
                    }
                    
                    $nameParts = explode(' ', trim($value), 2);
                    if (count($nameParts) < 2) {
                        $fail('The ' . $attribute . ' must contain both first and last name separated by a space.');
                        return;
                    }
                    
                    [$firstName, $lastName] = $nameParts;
                    $tenant = DB::table('tenants')
                        ->where('first_name', trim($firstName))
                        ->where('last_name', trim($lastName))
                        ->where('is_archived', false)
                        ->first();
                        
                    if (!$tenant) {
                        $fail('The tenant "' . $value . '" does not exist in the tenants table or is archived.');
                        return;
                    }
                    
                    // Set the tenant_id for use in the controller if needed
                    $this->merge(['resolved_tenant_id' => $tenant->id]);
                }
            ],
            'date_sent_offer' => 'required|date',
            'date_offer_expires' => 'nullable|date',
            'status' => 'nullable|string|max:255',
            'date_of_acceptance' => 'nullable|date',
            'last_notice_sent' => 'nullable|date',
            'notice_kind' => 'nullable|string|max:255',
            'lease_sent' => 'nullable|string|max:255',
            'date_sent_lease' => 'nullable|date',
            'lease_expires' => 'nullable|date',
            'lease_signed' => 'nullable|string|max:255',
            'date_signed' => 'nullable|date',
            'last_notice_sent_2' => 'nullable|date',
            'notice_kind_2' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:65535',
            'how_many_days_left' => 'nullable|integer|min:0|max:9999',
            'expired' => 'nullable|string|max:255',
            'other_tenants' => 'nullable|string|max:255',
            'date_of_decline' => 'nullable|date',
        ];
    }

    /**
     * Get custom validation messages
     */
    public function messages()
    {
        return [
            'tenant_id.exists' => 'The selected tenant does not exist or is archived.',
            'property.exists' => 'The selected property does not exist or is archived.',
            'city_name.exists' => 'The selected city does not exist or is archived.',
            'unit.exists' => 'The selected unit does not exist or is archived.',
            'date_sent_offer.required' => 'The date sent offer field is required.',
            'how_many_days_left.min' => 'Days left cannot be negative.',
            'how_many_days_left.max' => 'Days left cannot exceed 9999.',
            'notes.max' => 'Notes cannot exceed 65535 characters.',
            'other_tenants.max' => 'Other tenants field cannot exceed 255 characters.',
        ];
    }

    /**
     * Get custom attribute names for validation messages
     */
    public function attributes()
    {
        return [
            'tenant_id' => 'tenant',
            'city_name' => 'city',
            'date_sent_offer' => 'date sent offer',
            'date_offer_expires' => 'offer expiration date',
            'date_of_acceptance' => 'date of acceptance',
            'last_notice_sent' => 'last notice sent date',
            'notice_kind' => 'notice type',
            'lease_sent' => 'lease sent status',
            'date_sent_lease' => 'lease sent date',
            'lease_expires' => 'lease expiration date',
            'lease_signed' => 'lease signed status',
            'date_signed' => 'date signed',
            'last_notice_sent_2' => 'second notice sent date',
            'notice_kind_2' => 'second notice type',
            'how_many_days_left' => 'days left',
            'other_tenants' => 'other tenants',
            'date_of_decline' => 'date of decline',
        ];
    }

    /**
     * Prepare data for validation
     */
    protected function prepareForValidation()
    {
        // Clean up tenant name input
        if ($this->has('tenant') && $this->input('tenant')) {
            $this->merge([
                'tenant' => trim($this->input('tenant'))
            ]);
        }

        // Clean up other string inputs
        $stringFields = ['property', 'city_name', 'unit', 'status', 'notice_kind', 'lease_sent', 'lease_signed', 'notice_kind_2', 'expired', 'other_tenants'];
        $cleanedData = [];
        
        foreach ($stringFields as $field) {
            if ($this->has($field) && $this->input($field)) {
                $cleanedData[$field] = trim($this->input($field));
            }
        }
        
        if (!empty($cleanedData)) {
            $this->merge($cleanedData);
        }
    }

    /**
     * Get the validated data with resolved tenant_id
     */
    public function validatedWithTenantId()
    {
        $validated = $this->validated();
        
        // If we resolved a tenant_id from the tenant name, use it
        if ($this->has('resolved_tenant_id')) {
            $validated['tenant_id'] = $this->input('resolved_tenant_id');
        }
        
        // Remove the tenant name field as we're using tenant_id in the database
        unset($validated['tenant'], $validated['resolved_tenant_id']);
        
        return $validated;
    }
}
