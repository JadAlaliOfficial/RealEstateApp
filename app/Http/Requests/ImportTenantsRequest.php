<?php
// app/Http/Requests/ImportTenantsRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportTenantsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:csv,txt',
                'max:10240', // 10MB max
            ],
            'skip_duplicates' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Please select a CSV file to import.',
            'file.mimes' => 'The file must be a CSV file.',
            'file.max' => 'The file size must not exceed 10MB.',
        ];
    }
}
