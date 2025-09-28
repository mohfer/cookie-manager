<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CookieController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/cookies', [CookieController::class, 'index']);
    Route::post('/cookies', [CookieController::class, 'store']);
    Route::get('/cookies/{id}', [CookieController::class, 'show']);
    Route::put('/cookies/{id}', [CookieController::class, 'update']);
    Route::delete('/cookies/{id}', [CookieController::class, 'destroy']);
});
