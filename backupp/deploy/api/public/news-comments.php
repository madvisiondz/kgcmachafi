<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function format_news_comment(array $item): array
{
    $item['id'] = (int) $item['id'];
    $item['news_id'] = (int) $item['news_id'];
    $item['user_id'] = (int) $item['user_id'];
    $item['user'] = [
        'full_name' => $item['user_full_name'] ?? 'مستخدم',
        'role' => $item['user_role'] ?? 'member',
    ];
    unset($item['user_full_name'], $item['user_role']);

    return $item;
}

if ($method === 'GET') {
    $newsId = (int) ($_GET['news_id'] ?? 0);

    if ($newsId <= 0) {
        json_response(['message' => 'رقم الخبر مطلوب.'], 422);
    }

    $statement = db()->prepare(
        'SELECT c.*, u.full_name AS user_full_name, u.role AS user_role
         FROM news_comments c
         INNER JOIN public_users u ON u.id = c.user_id
         WHERE c.news_id = :news_id
         ORDER BY c.created_at DESC, c.id DESC'
    );
    $statement->execute(['news_id' => $newsId]);

    json_response(['items' => array_map('format_news_comment', $statement->fetchAll())]);
}

if ($method === 'POST') {
    $user = require_public_user();
    $payload = read_json_input();
    $newsId = (int) ($payload['news_id'] ?? 0);
    $content = trim((string) ($payload['content'] ?? ''));

    if ($newsId <= 0 || $content === '') {
        json_response(['message' => 'بيانات التعليق غير مكتملة.'], 422);
    }

    $statement = db()->prepare(
        'INSERT INTO news_comments (news_id, user_id, content)
         VALUES (:news_id, :user_id, :content)'
    );
    $statement->execute([
        'news_id' => $newsId,
        'user_id' => (int) $user['id'],
        'content' => $content,
    ]);

    $commentId = (int) db()->lastInsertId();
    $fetch = db()->prepare(
        'SELECT c.*, u.full_name AS user_full_name, u.role AS user_role
         FROM news_comments c
         INNER JOIN public_users u ON u.id = c.user_id
         WHERE c.id = :id LIMIT 1'
    );
    $fetch->execute(['id' => $commentId]);

    json_response([
        'message' => 'تمت إضافة التعليق بنجاح.',
        'item' => format_news_comment((array) $fetch->fetch()),
    ], 201);
}

if ($method === 'DELETE') {
    $user = require_public_user();
    $commentId = (int) ($_GET['id'] ?? 0);

    if ($commentId <= 0) {
        json_response(['message' => 'رقم التعليق مطلوب.'], 422);
    }

    $delete = db()->prepare('DELETE FROM news_comments WHERE id = :id AND user_id = :user_id');
    $delete->execute([
        'id' => $commentId,
        'user_id' => (int) $user['id'],
    ]);

    if ($delete->rowCount() === 0) {
        json_response(['message' => 'لا يمكن حذف هذا التعليق.'], 403);
    }

    json_response(['message' => 'تم حذف التعليق.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);