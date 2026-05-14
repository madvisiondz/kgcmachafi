<?php
declare(strict_types=1);

/**
 * Public read-only directory. Writes go through /api/admin/ambulances.php (authenticated + CSRF).
 */
require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$wilayaId = trim((string) ($_GET['wilaya'] ?? ''));
$p = request_pagination(300, 500);
$limit = $p['limit'];
$offset = $p['offset'];

$params = [];
$where = ['is_active = 1'];
if ($wilayaId !== '') {
    $where[] = 'wilaya_id = :wilaya_id';
    $params['wilaya_id'] = $wilayaId;
}
$whereSql = implode(' AND ', $where);

$countSql = 'SELECT COUNT(*) AS c FROM ambulances WHERE ' . $whereSql;
$countStmt = db()->prepare($countSql);
$countStmt->execute($params);
$total = (int) ($countStmt->fetch()['c'] ?? 0);

$sql = 'SELECT * FROM ambulances WHERE ' . $whereSql
    . ' ORDER BY is_free DESC, wilaya_id ASC, city ASC, owner_name ASC LIMIT :limit OFFSET :offset';
$statement = db()->prepare($sql);
foreach ($params as $k => $v) {
    $statement->bindValue(':' . $k, $v);
}
$statement->bindValue(':limit', $limit, PDO::PARAM_INT);
$statement->bindValue(':offset', $offset, PDO::PARAM_INT);
$statement->execute();

$items = $statement->fetchAll();
$totalPages = max(1, (int) ceil($total / max(1, $limit)));

api_envelope_list($items, [
    'page' => $p['page'],
    'per_page' => $limit,
    'total' => $total,
    'total_pages' => $totalPages,
]);
