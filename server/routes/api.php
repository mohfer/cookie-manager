<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CookieController;
use App\Http\Controllers\ProfileController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/cookies', [CookieController::class, 'index']);
    Route::post('/cookies', [CookieController::class, 'store']);
    Route::get('/cookies/{cookie}', [CookieController::class, 'show']);
    Route::put('/cookies/{cookie}', [CookieController::class, 'update']);
    Route::delete('/cookies/{cookie}', [CookieController::class, 'destroy']);
});
