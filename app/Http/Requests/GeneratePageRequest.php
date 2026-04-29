<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GeneratePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_name'    => ['required', 'string', 'max:100'],
            'description'     => ['required', 'string', 'min:20', 'max:1000'],
            'features'        => ['required', 'string', 'max:500'],
            'target_audience' => ['required', 'string', 'max:200'],
            'price'           => ['required', 'string', 'max:50'],
            'usp'             => ['required', 'string', 'max:300'],
        ];
    }

    public function messages(): array
    {
        return [
            'description.min' => 'Description must be at least 20 characters.',
        ];
    }
}
