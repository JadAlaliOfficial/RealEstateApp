<?php
// app/Http/Requests/ImportUnitsRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class ImportUnitsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                File::types(['csv', 'txt'])
                    ->max(10240) // 10MB max
            ],
            'skip_duplicates' => 'boolean',
            'update_existing' => 'boolean',
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
