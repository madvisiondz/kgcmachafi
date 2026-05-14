<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

function format_public_international_hospital(array $item): array
{
    $item['payment_methods'] = json_decode((string) ($item['payment_methods_json'] ?? '[]'), true) ?: [];
    $item['insurance_providers'] = json_decode((string) ($item['insurance_providers_json'] ?? '[]'), true) ?: [];
    $item['features'] = json_decode((string) ($item['features_json'] ?? '[]'), true) ?: [];
    $item['rating'] = isset($item['rating']) ? (float) $item['rating'] : 0.0;
    $item['reviews_count'] = isset($item['reviews_count']) ? (int) $item['reviews_count'] : 0;

    return $item;
}

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

$p = request_pagination(200, 500);
$limit = $p['limit'];
$offset = $p['offset'];

$whereSql = implode(' AND ', $conditions);
$countSql = 'SELECT COUNT(*) AS c FROM international_hospitals WHERE ' . $whereSql;
$countStmt = db()->prepare($countSql);
$countStmt->execute($params);
$total = (int) ($countStmt->fetch()['c'] ?? 0);

$sql = 'SELECT * FROM international_hospitals WHERE ' . $whereSql . ' ORDER BY sort_order ASC, country ASC, name ASC LIMIT :limit OFFSET :offset';
$statement = db()->prepare($sql);
foreach ($params as $k => $v) {
    $statement->bindValue(':' . $k, $v);
}
$statement->bindValue(':limit', $limit, PDO::PARAM_INT);
$statement->bindValue(':offset', $offset, PDO::PARAM_INT);
$statement->execute();

$items = array_map('format_public_international_hospital', $statement->fetchAll());
$totalPages = max(1, (int) ceil($total / max(1, $limit)));

api_envelope_list($items, [
    'page' => $p['page'],
    'per_page' => $limit,
    'total' => $total,
    'total_pages' => $totalPages,
]);
