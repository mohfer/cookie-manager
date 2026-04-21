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
            'domain' => ['sometimes', 'required', 'string', Rule::unique('cookies', 'domain')->ignore($cookieId)->where(fn ($query) => $query->where('user_id', $userId))],
            'name' => ['sometimes', 'required', 'string', Rule::unique('cookies', 'name')->ignore($cookieId)->where(fn ($query) => $query->where('user_id', $userId))],
            'value' => ['sometimes', 'required', 'array'],
        ];
    }
}
