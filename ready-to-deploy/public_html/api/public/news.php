<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$id = (int) ($_GET['id'] ?? 0);
$limit = max(0, (int) ($_GET['limit'] ?? 0));
$archived = normalize_flag($_GET['archived'] ?? false);

if ($id > 0) {
    $statement = db()->prepare('SELECT * FROM news_articles WHERE id = :id LIMIT 1');
    $statement->execute(['id' => $id]);
    $item = $statement->fetch();

    if (!$item) {
        json_response(['message' => 'الخبر غير موجود.'], 404);
    }

    json_response(['item' => $item]);
}

$sql = 'SELECT * FROM news_articles WHERE is_archived = :is_archived ORDER BY date DESC, created_at DESC';
if ($limit > 0) {
    $sql .= ' LIMIT :limit_value';
}

$statement = db()->prepare($sql);
$statement->bindValue(':is_archived', $archived, PDO::PARAM_INT);

if ($limit > 0) {
    $statement->bindValue(':limit_value', $limit, PDO::PARAM_INT);
}

$statement->execute();

json_response(['items' => $statement->fetchAll()]);
