<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$p = request_pagination(200, 500);
$limit = $p['limit'];
$offset = $p['offset'];

$countStmt = db()->query('SELECT COUNT(*) AS c FROM programs WHERE is_active = 1');
$total = (int) ($countStmt->fetch()['c'] ?? 0);

$statement = db()->prepare(
    'SELECT * FROM programs WHERE is_active = 1 ORDER BY day_of_week ASC, time_slot ASC, created_at DESC LIMIT :limit OFFSET :offset'
);
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
