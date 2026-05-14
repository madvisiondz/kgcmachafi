<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method !== 'GET') {
    api_envelope_error('method_not_allowed', 'Only GET is supported.', 405);
}

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

$p = request_pagination(200, 500);
$limit = $p['limit'];
$offset = $p['offset'];

$whereSql = implode(' AND ', $conditions);
$countSql = 'SELECT COUNT(*) AS c FROM hospitals WHERE ' . $whereSql;
$countStmt = db()->prepare($countSql);
$countStmt->execute($params);
$total = (int) ($countStmt->fetch()['c'] ?? 0);

$sql = 'SELECT * FROM hospitals WHERE ' . $whereSql . ' ORDER BY sort_order ASC, wilaya_id ASC, city ASC, name ASC LIMIT :limit OFFSET :offset';
$statement = db()->prepare($sql);
foreach ($params as $k => $v) {
    $statement->bindValue(':' . $k, $v);
}
$statement->bindValue(':limit', $limit, PDO::PARAM_INT);
$statement->bindValue(':offset', $offset, PDO::PARAM_INT);
$statement->execute();

$items = array_map('format_public_hospital', $statement->fetchAll());
$totalPages = max(1, (int) ceil($total / max(1, $limit)));

api_envelope_list($items, [
    'page' => $p['page'],
    'per_page' => $limit,
    'total' => $total,
    'total_pages' => $totalPages,
]);
