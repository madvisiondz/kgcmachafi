<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    $statement = db()->query('SELECT * FROM video_programs ORDER BY sort_order ASC, id ASC');
    json_response(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin_write();
    $payload = read_json_input();
    $statement = db()->prepare(
        'INSERT INTO video_programs (title, duration, specialty, image_url, video_url, sort_order, is_active)
         VALUES (:title, :duration, :specialty, :image_url, :video_url, :sort_order, :is_active)'
    );
    $statement->execute([
        'title' => trim((string) ($payload['title'] ?? '')),
        'duration' => trim((string) ($payload['duration'] ?? '')),
        'specialty' => trim((string) ($payload['specialty'] ?? 'general')),
        'image_url' => trim((string) ($payload['image_url'] ?? '')),
        'video_url' => trim((string) ($payload['video_url'] ?? '')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);
    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM video_programs WHERE id = :id');
    $fetch->execute(['id' => $id]);
    json_response(['message' => 'تمت إضافة الحلقة.', 'item' => $fetch->fetch()], 201);
}

if ($method === 'PUT') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = read_json_input();
    $statement = db()->prepare(
        'UPDATE video_programs
         SET title = :title,
             duration = :duration,
             specialty = :specialty,
             image_url = :image_url,
             video_url = :video_url,
             sort_order = :sort_order,
             is_active = :is_active
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'title' => trim((string) ($payload['title'] ?? '')),
        'duration' => trim((string) ($payload['duration'] ?? '')),
        'specialty' => trim((string) ($payload['specialty'] ?? 'general')),
        'image_url' => trim((string) ($payload['image_url'] ?? '')),
        'video_url' => trim((string) ($payload['video_url'] ?? '')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);
    $fetch = db()->prepare('SELECT * FROM video_programs WHERE id = :id');
    $fetch->execute(['id' => $id]);
    json_response(['message' => 'تم تحديث الحلقة.', 'item' => $fetch->fetch()]);
}

if ($method === 'DELETE') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM video_programs WHERE id = :id');
    $statement->execute(['id' => $id]);
    json_response(['message' => 'تم حذف الحلقة.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);
