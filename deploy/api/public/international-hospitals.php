<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function format_public_international_hospital(array $item): array
{
    $item['payment_methods'] = json_decode((string) ($item['payment_methods_json'] ?? '[]'), true) ?: [];
    $item['insurance_providers'] = json_decode((string) ($item['insurance_providers_json'] ?? '[]'), true) ?: [];
    $item['features'] = json_decode((string) ($item['features_json'] ?? '[]'), true) ?: [];
    $item['rating'] = isset($item['rating']) ? (float) $item['rating'] : 0.0;
    $item['reviews_count'] = isset($item['reviews_count']) ? (int) $item['reviews_count'] : 0;
    return $item;
}

if ($method === 'GET') {
    $country = trim((string) ($_GET['country'] ?? ''));
    $specialty = trim((string) ($_GET['specialty'] ?? ''));

    $conditions = ['is_active = 1'];
    $params = [];

    if ($country !== '' && $country !== 'all') {
        $conditions[] = 'country = :country';
        $params['country'] = $country;
    }

    if ($specialty !== '' && $specialty !== 'all') {
        $conditions[] = 'specialty = :specialty';
        $params['specialty'] = $specialty;
    }

    $sql = 'SELECT * FROM international_hospitals WHERE ' . implode(' AND ', $conditions) . ' ORDER BY sort_order ASC, country ASC, name ASC';
    $statement = db()->prepare($sql);
    $statement->execute($params);

    json_response([
        'items' => array_map('format_public_international_hospital', $statement->fetchAll()),
    ]);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);