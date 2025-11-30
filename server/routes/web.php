<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'code' => 200,
        'message' => 'API is running...',
        'data' => null
    ], 200);
});
