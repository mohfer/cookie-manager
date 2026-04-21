<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreCookieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'domain' => ['required', 'string', Rule::unique('cookies', 'domain')->where(fn ($query) => $query->where('user_id', $userId))],
            'name' => ['required', 'string', Rule::unique('cookies', 'name')->where(fn ($query) => $query->where('user_id', $userId))],
            'value' => ['required', 'array'],
        ];
    }
}
