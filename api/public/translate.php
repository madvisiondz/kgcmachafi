<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['POST']);

$payload = read_json_input();
$q = trim((string) ($payload['q'] ?? ''));
$source = trim((string) ($payload['source'] ?? 'ar'));
$target = trim((string) ($payload['target'] ?? 'en'));
$format = trim((string) ($payload['format'] ?? 'text'));

if ($q === '') {
    json_response(['message' => 'النص مطلوب للترجمة.'], 422);
}

// Configure your upstream translator in production.
// Recommended: self-host LibreTranslate and set LIBRETRANSLATE_URL env var.
$upstream = getenv('LIBRETRANSLATE_URL') ?: 'https://libretranslate.com';
$upstream = rtrim($upstream, '/');

$apiKey = getenv('LIBRETRANSLATE_API_KEY') ?: null;

$requestBody = [
    'q' => $q,
    'source' => $source,
    'target' => $target,
    'format' => $format !== '' ? $format : 'text',
];

if ($apiKey) {
    $requestBody['api_key'] = $apiKey;
}

function http_post_json(string $url, array $payload): array
{
    $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        return [0, false];
    }

    // Prefer cURL when available (fast + robust)
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);
        curl_setopt($ch, CURLOPT_TIMEOUT, 25);

        $response = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return [$status, $response];
    }

    // Fallback for shared hosting without cURL
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\nAccept: application/json\r\n",
            'content' => $json,
            'timeout' => 25,
        ],
    ]);

    $response = @file_get_contents($url, false, $context);

    $status = 0;
    if (isset($http_response_header) && is_array($http_response_header)) {
        foreach ($http_response_header as $headerLine) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#i', $headerLine, $m)) {
                $status = (int) $m[1];
                break;
            }
        }
    }

    return [$status, $response];
}

[$status, $response] = http_post_json($upstream . '/translate', $requestBody);

if ($response === false || $status < 200 || $status >= 300) {
    json_response(['message' => 'تعذر الاتصال بخدمة الترجمة.'], 502);
}

$decoded = json_decode($response, true);
if (!is_array($decoded) || !isset($decoded['translatedText'])) {
    json_response(['message' => 'استجابة الترجمة غير صالحة.'], 502);
}

json_response([
    'translatedText' => (string) $decoded['translatedText'],
]);

