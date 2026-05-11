<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $newsId = (int) ($_GET['news_id'] ?? 0);

    if ($newsId <= 0) {
        json_response(['message' => 'رقم الخبر مطلوب.'], 422);
    }

    $statement = db()->prepare(
        'SELECT COUNT(*) AS rating_count, COALESCE(AVG(rating), 0) AS average_rating
         FROM news_ratings
         WHERE news_id = :news_id'
    );
    $statement->execute(['news_id' => $newsId]);
    $stats = $statement->fetch() ?: ['rating_count' => 0, 'average_rating' => 0];

    $userRating = null;
    $user = get_public_user_session();

    if ($user !== null) {
        $userStatement = db()->prepare(
            'SELECT rating FROM news_ratings WHERE news_id = :news_id AND user_id = :user_id LIMIT 1'
        );
        $userStatement->execute([
            'news_id' => $newsId,
            'user_id' => (int) $user['id'],
        ]);
        $userRatingValue = $userStatement->fetchColumn();
        $userRating = $userRatingValue !== false ? (int) $userRatingValue : null;
    }

    json_response([
        'average' => round((float) ($stats['average_rating'] ?? 0), 1),
        'count' => (int) ($stats['rating_count'] ?? 0),
        'user_rating' => $userRating,
    ]);
}

if ($method === 'POST') {
    $user = require_public_user();
    $payload = read_json_input();
    $newsId = (int) ($payload['news_id'] ?? 0);
    $rating = (int) ($payload['rating'] ?? 0);

    if ($newsId <= 0 || $rating < 1 || $rating > 5) {
        json_response(['message' => 'قيمة التقييم غير صالحة.'], 422);
    }

    $statement = db()->prepare(
        'INSERT INTO news_ratings (news_id, user_id, rating)
         VALUES (:news_id, :user_id, :rating)
         ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP'
    );
    $statement->execute([
        'news_id' => $newsId,
        'user_id' => (int) $user['id'],
        'rating' => $rating,
    ]);

    json_response(['message' => 'تم حفظ التقييم بنجاح.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);