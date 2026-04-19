<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StoreCookieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'domain' => ['required', 'string', 'unique:cookies,domain'],
            'name' => ['required', 'string', 'unique:cookies,name'],
            'value' => ['required', 'array'],
        ];
    }
}
