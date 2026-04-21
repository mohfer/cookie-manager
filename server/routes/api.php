<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CookieController;
use App\Http\Controllers\ProfileController;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:register');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:forgot-password');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:reset-password');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/cookies', [CookieController::class, 'index']);
    Route::post('/cookies', [CookieController::class, 'store']);
    Route::get('/cookies/{cookie}', [CookieController::class, 'show'])->whereNumber('cookie');
    Route::put('/cookies/{cookie}', [CookieController::class, 'update'])->whereNumber('cookie');
    Route::delete('/cookies/{cookie}', [CookieController::class, 'destroy'])->whereNumber('cookie');
});
