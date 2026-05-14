<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$id = (int) ($_GET['id'] ?? 0);
$archived = normalize_flag($_GET['archived'] ?? false);
$p = request_pagination(50, 100);
$limit = $p['limit'];
$offset = $p['offset'];
$page = $p['page'];

if ($id > 0) {
    $statement = db()->prepare('SELECT * FROM news_articles WHERE id = :id LIMIT 1');
    $statement->execute(['id' => $id]);
    $item = $statement->fetch();

    if (!$item) {
        api_envelope_error('not_found', 'Article not found.', 404);
    }

    api_envelope_ok(['item' => $item]);
}

$countStmt = db()->prepare('SELECT COUNT(*) AS c FROM news_articles WHERE is_archived = :a');
$countStmt->execute(['a' => $archived]);
$total = (int) ($countStmt->fetch()['c'] ?? 0);

$sql = 'SELECT * FROM news_articles WHERE is_archived = :is_archived ORDER BY date DESC, created_at DESC LIMIT :limit OFFSET :offset';
$statement = db()->prepare($sql);
$statement->bindValue(':is_archived', $archived, PDO::PARAM_INT);
$statement->bindValue(':limit', $limit, PDO::PARAM_INT);
$statement->bindValue(':offset', $offset, PDO::PARAM_INT);
$statement->execute();

$items = $statement->fetchAll();
$totalPages = max(1, (int) ceil($total / $limit));

api_envelope_list($items, [
    'page' => $page,
    'per_page' => $limit,
    'total' => $total,
    'total_pages' => $totalPages,
]);
