<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateCookieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cookieId = (int) $this->route('cookie');
        $userId = $this->user()->id;

        return [
            'domain' => ['sometimes', 'required', 'string', 'max:255', 'regex:/^(\.?[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i', Rule::unique('cookies', 'domain')->ignore($cookieId)->where(fn ($query) => $query->where('user_id', $userId))],
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('cookies', 'name')->ignore($cookieId)->where(fn ($query) => $query->where('user_id', $userId))],
            'value' => ['sometimes', 'required', 'array'],
            'value.*.domain' => ['nullable', 'string', 'max:255'],
            'value.*.name' => ['required_with:value.*.value', 'string', 'max:255'],
            'value.*.value' => ['nullable', 'string', 'max:8192'],
            'value.*.path' => ['nullable', 'string', 'max:255'],
            'value.*.secure' => ['nullable', 'boolean'],
            'value.*.httpOnly' => ['nullable', 'boolean'],
            'value.*.hostOnly' => ['nullable', 'boolean'],
            'value.*.expirationDate' => ['nullable', 'numeric'],
            'value.*.sameSite' => ['nullable', 'string', Rule::in(['no_restriction', 'lax', 'strict', 'unspecified'])],
        ];
    }
}
