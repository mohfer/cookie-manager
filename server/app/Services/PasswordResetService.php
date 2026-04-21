<?php

declare(strict_types=1);

namespace App\Services;

use App\Mail\ResetPassword;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class PasswordResetService
{
    public function sendResetLink(string $email): bool
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return true; // Don't reveal if email exists
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['token' => Hash::make($token), 'created_at' => now()],
        );

        Mail::to($user->email)->queue(new ResetPassword($user->name, $token, $email));

        return true;
    }

    public function reset(string $email, string $token, string $password): bool
    {
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record || !Hash::check($token, $record->token)) {
            return false;
        }

        // Check if token is expired (1 hour)
        if (now()->diffInHours($record->created_at) > 1) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();

            return false;
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return false;
        }

        $user->update(['password' => Hash::make($password)]);
        $user->tokens()->delete();
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return true;
    }
}
