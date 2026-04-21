<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

final class Cookie extends Model
{
    protected $fillable = [
        'user_id',
        'domain',
        'name',
        'value',
    ];

    /**
     * The "value" column stores encrypted JSON.
     * We handle encryption/decryption via accessors/mutators.
     */
    protected $casts = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Decrypt value when getting - returns the decoded array.
     */
    public function getValueAttribute(?string $value): array
    {
        if ($value === null) {
            return [];
        }

        try {
            $decrypted = Crypt::decryptString($value);

            return json_decode($decrypted, true) ?? [];
        } catch (\Exception) {
            // Fallback: maybe stored as plain JSON (legacy data)
            $decoded = json_decode($value, true);

            return is_array($decoded) ? $decoded : [];
        }
    }

    /**
     * Encrypt value when setting - accepts array or JSON string.
     */
    public function setValueAttribute(array|string|null $value): void
    {
        if ($value === null) {
            $this->attributes['value'] = null;

            return;
        }

        $json = is_array($value) ? json_encode($value) : $value;
        $this->attributes['value'] = Crypt::encryptString($json);
    }
}
