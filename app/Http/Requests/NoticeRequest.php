<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NoticeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'notice_name' => 'required|string|max:255',
            'days' => 'required|integer|min:0',
        ];
    }
}
