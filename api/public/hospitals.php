<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function format_public_hospital(array $item): array
{
    $item['specialties'] = json_decode((string) ($item['specialties_json'] ?? '[]'), true) ?: [];
    $item['payment_methods'] = json_decode((string) ($item['payment_methods_json'] ?? '[]'), true) ?: [];
    $item['insurance_providers'] = json_decode((string) ($item['insurance_providers_json'] ?? '[]'), true) ?: [];
    $item['features'] = json_decode((string) ($item['features_json'] ?? '[]'), true) ?: [];
    $item['rating'] = isset($item['rating']) ? (float) $item['rating'] : 0.0;
    $item['reviews_count'] = isset($item['reviews_count']) ? (int) $item['reviews_count'] : 0;
    return $item;
}

if ($method === 'GET') {
    $wilayaId = trim((string) ($_GET['wilaya'] ?? ''));
    $type = trim((string) ($_GET['type'] ?? ''));
    $city = trim((string) ($_GET['city'] ?? ''));

    $conditions = ['is_active = 1'];
    $params = [];

    if ($wilayaId !== '') {
        $conditions[] = 'wilaya_id = :wilaya_id';
        $params['wilaya_id'] = $wilayaId;
    }

    if ($type !== '' && $type !== 'all') {
        $conditions[] = 'type = :type';
        $params['type'] = $type;
    }

    if ($city !== '') {
        $conditions[] = 'city = :city';
        $params['city'] = $city;
    }

    $sql = 'SELECT * FROM hospitals WHERE ' . implode(' AND ', $conditions) . ' ORDER BY sort_order ASC, wilaya_id ASC, city ASC, name ASC';
    $statement = db()->prepare($sql);
    $statement->execute($params);

    json_response([
        'items' => array_map('format_public_hospital', $statement->fetchAll()),
    ]);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);
