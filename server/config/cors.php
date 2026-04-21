<?php

$allowedOrigins = array_values(array_filter(array_map(
    'trim',
    explode(',', (string) env('CORS_ALLOWED_ORIGINS', (string) env('FRONTEND_URL', 'http://localhost:5173'))),
)));

$allowedMethods = array_values(array_filter(array_map(
    'trim',
    explode(',', (string) env('CORS_ALLOWED_METHODS', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')),
)));

$allowedHeaders = array_values(array_filter(array_map(
    'trim',
    explode(',', (string) env('CORS_ALLOWED_HEADERS', 'Content-Type,Accept,Authorization')),
)));

$allowedOriginPatterns = array_values(array_filter(array_map(
    'trim',
    explode(',', (string) env('CORS_ALLOWED_ORIGIN_PATTERNS', '')),
)));

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => $allowedMethods,

    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => $allowedOriginPatterns,

    'allowed_headers' => $allowedHeaders,

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
