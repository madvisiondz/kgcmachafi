<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$upstream = getenv('LIBRETRANSLATE_URL') ?: 'https://libretranslate.com';
$upstream = rtrim($upstream, '/');

function bool_setting(string $key): bool
{
    $value = ini_get($key);
    if ($value === false) return false;
    return filter_var($value, FILTER_VALIDATE_BOOLEAN);
}

function try_head(string $url): array
{
    // cURL HEAD if available
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        return [$status, $err];
    }

    // Fallback: GET with stream context
    $ctx = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 10,
            'header' => "Accept: application/json\r\n",
        ],
    ]);
    $body = @file_get_contents($url, false, $ctx);
    $status = 0;
    if (isset($http_response_header) && is_array($http_response_header)) {
        foreach ($http_response_header as $line) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#i', $line, $m)) {
                $status = (int) $m[1];
                break;
            }
        }
    }
    return [$status, $body === false ? 'file_get_contents_failed' : ''];
}

[$status, $error] = try_head($upstream);

json_response([
    'ok' => $status >= 200 && $status < 500,
    'upstream' => $upstream,
    'probe_http_status' => $status,
    'probe_error' => $error,
    'php' => [
        'version' => PHP_VERSION,
        'curl_enabled' => function_exists('curl_init'),
        'allow_url_fopen' => bool_setting('allow_url_fopen'),
        'openssl_enabled' => extension_loaded('openssl'),
    ],
]);

