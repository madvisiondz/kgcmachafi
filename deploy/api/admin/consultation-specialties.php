<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    $sql = 'SELECT s.*, COUNT(d.id) AS doctors_count
            FROM consultation_specialties s
            LEFT JOIN consultation_doctors d ON d.specialty_id = s.id AND d.is_active = 1
            GROUP BY s.id
            ORDER BY s.sort_order ASC, s.id ASC';
    $statement = db()->query($sql);
    json_response(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin();
    $payload = read_json_input();
    $statement = db()->prepare(
        'INSERT INTO consultation_specialties (name, icon_emoji, color_class, sort_order, is_active)
         VALUES (:name, :icon_emoji, :color_class, :sort_order, :is_active)'
    );
    $statement->execute([
        'name' => trim((string) ($payload['name'] ?? '')),
        'icon_emoji' => trim((string) ($payload['icon_emoji'] ?? '🏥')),
        'color_class' => trim((string) ($payload['color_class'] ?? 'from-green-500 to-emerald-600')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);
    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM consultation_specialties WHERE id = :id');
    $fetch->execute(['id' => $id]);
    json_response(['message' => 'تمت إضافة التخصص.', 'item' => $fetch->fetch()], 201);
}

if ($method === 'PUT') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = read_json_input();
    $statement = db()->prepare(
        'UPDATE consultation_specialties
         SET name = :name,
             icon_emoji = :icon_emoji,
             color_class = :color_class,
             sort_order = :sort_order,
             is_active = :is_active
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'name' => trim((string) ($payload['name'] ?? '')),
        'icon_emoji' => trim((string) ($payload['icon_emoji'] ?? '🏥')),
        'color_class' => trim((string) ($payload['color_class'] ?? 'from-green-500 to-emerald-600')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);
    $fetch = db()->prepare('SELECT * FROM consultation_specialties WHERE id = :id');
    $fetch->execute(['id' => $id]);
    json_response(['message' => 'تم تحديث التخصص.', 'item' => $fetch->fetch()]);
}

if ($method === 'DELETE') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM consultation_specialties WHERE id = :id');
    $statement->execute(['id' => $id]);
    json_response(['message' => 'تم حذف التخصص.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);
