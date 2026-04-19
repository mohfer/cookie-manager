<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateCookieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cookieId = $this->route('cookie')->id;

        return [
            'domain' => ['sometimes', 'required', 'string', "unique:cookies,domain,{$cookieId}"],
            'name' => ['sometimes', 'required', 'string', "unique:cookies,name,{$cookieId}"],
            'value' => ['sometimes', 'required', 'array'],
        ];
    }
}
