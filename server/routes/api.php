<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CookieController;

Route::get('/cookies', [CookieController::class, 'index']);
Route::post('/cookies', [CookieController::class, 'store']);
Route::get('/cookies/{id}', [CookieController::class, 'show']);
Route::put('/cookies/{id}', [CookieController::class, 'update']);
Route::delete('/cookies/{id}', [CookieController::class, 'destroy']);
