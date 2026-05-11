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

$ch = curl_init($upstream . '/translate');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

$response = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

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

