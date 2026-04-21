<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('login', function (Request $request): array {
            $login = (string) $request->input('login', '');

            return [
                Limit::perMinute(5)->by($request->ip() . '|' . $login),
                Limit::perMinute(30)->by($request->ip()),
            ];
        });

        RateLimiter::for('register', function (Request $request): array {
            $email = (string) $request->input('email', '');

            return [
                Limit::perMinute(5)->by($request->ip() . '|' . $email),
                Limit::perMinute(20)->by($request->ip()),
            ];
        });

        RateLimiter::for('forgot-password', function (Request $request): array {
            $email = (string) $request->input('email', '');

            return [
                Limit::perMinute(3)->by($request->ip() . '|' . $email),
                Limit::perHour(20)->by($request->ip()),
            ];
        });

        RateLimiter::for('reset-password', function (Request $request): array {
            $email = (string) $request->input('email', '');

            return [
                Limit::perMinute(5)->by($request->ip() . '|' . $email),
                Limit::perHour(30)->by($request->ip()),
            ];
        });
    }
}
