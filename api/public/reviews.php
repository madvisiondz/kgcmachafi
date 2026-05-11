<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function resolve_review_config(string $type): ?array
{
    return match ($type) {
        'ambulance' => [
            'table' => 'ambulance_reviews',
            'target_field' => 'ambulance_id',
        ],
        'accommodation' => [
            'table' => 'accommodation_reviews',
            'target_field' => 'accommodation_id',
        ],
        default => null,
    };
}

function format_review(array $item): array
{
    $item['id'] = (int) $item['id'];
    $item['user_id'] = (int) $item['user_id'];
    $item['rating'] = (int) $item['rating'];
    $item['user'] = [
        'full_name' => $item['user_full_name'] ?? 'مستخدم',
    ];
    unset($item['user_full_name']);

    return $item;
}

if ($method === 'GET') {
    $type = trim((string) ($_GET['type'] ?? ''));
    $targetId = (int) ($_GET['target_id'] ?? 0);
    $config = resolve_review_config($type);

    if ($config === null || $targetId <= 0) {
        json_response(['message' => 'بيانات المراجعات غير صالحة.'], 422);
    }

    $statement = db()->prepare(
        sprintf(
            'SELECT r.*, u.full_name AS user_full_name
             FROM %s r
             INNER JOIN public_users u ON u.id = r.user_id
             WHERE r.%s = :target_id
             ORDER BY r.created_at DESC, r.id DESC',
            $config['table'],
            $config['target_field']
        )
    );
    $statement->execute(['target_id' => $targetId]);

    json_response(['items' => array_map('format_review', $statement->fetchAll())]);
}

if ($method === 'POST') {
    $user = require_public_user();
    $payload = read_json_input();
    $type = trim((string) ($payload['type'] ?? ''));
    $targetId = (int) ($payload['target_id'] ?? 0);
    $rating = (int) ($payload['rating'] ?? 0);
    $comment = trim((string) ($payload['comment'] ?? ''));
    $config = resolve_review_config($type);

    if ($config === null || $targetId <= 0 || $rating < 1 || $rating > 5) {
        json_response(['message' => 'بيانات المراجعة غير صالحة.'], 422);
    }

    $statement = db()->prepare(
        sprintf(
            'INSERT INTO %s (%s, user_id, rating, comment)
             VALUES (:target_id, :user_id, :rating, :comment)',
            $config['table'],
            $config['target_field']
        )
    );
    $statement->execute([
        'target_id' => $targetId,
        'user_id' => (int) $user['id'],
        'rating' => $rating,
        'comment' => $comment,
    ]);

    json_response(['message' => 'تم حفظ المراجعة بنجاح.'], 201);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);