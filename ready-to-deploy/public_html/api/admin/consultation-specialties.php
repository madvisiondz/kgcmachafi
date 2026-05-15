<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    require_editor_or_admin();
    $sql = 'SELECT s.*, COUNT(d.id) AS doctors_count
            FROM consultation_specialties s
            LEFT JOIN consultation_doctors d ON d.specialty_id = s.id AND d.is_active = 1
            GROUP BY s.id
            ORDER BY s.sort_order ASC, s.id ASC';
    $statement = db()->query($sql);
    api_envelope_ok(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin_write();
    require_editor_or_admin();
    $payload = read_json_input();
    $statement = db()->prepare(
        'INSERT INTO consultation_specialties (specialty_key, name, icon_emoji, color_class, sort_order, is_active)
         VALUES (:specialty_key, :name, :icon_emoji, :color_class, :sort_order, :is_active)'
    );
    $statement->execute([
        'specialty_key' => trim((string) ($payload['specialty_key'] ?? '')) ?: 'custom-' . bin2hex(random_bytes(4)),
        'name' => trim((string) ($payload['name'] ?? '')),
        'icon_emoji' => trim((string) ($payload['icon_emoji'] ?? '🏥')),
        'color_class' => trim((string) ($payload['color_class'] ?? 'from-green-500 to-emerald-600')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);
    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM consultation_specialties WHERE id = :id');
    $fetch->execute(['id' => $id]);
    api_envelope_ok(['message' => 'تمت إضافة التخصص.', 'item' => $fetch->fetch()], 201);
}

if ($method === 'PUT') {
    require_admin_write();
    require_editor_or_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = read_json_input();
    $cur = db()->prepare('SELECT specialty_key FROM consultation_specialties WHERE id = :id LIMIT 1');
    $cur->execute(['id' => $id]);
    $curRow = $cur->fetch();
    if (!$curRow) {
        api_envelope_error('not_found', 'التخصص غير موجود.', 404);
    }
    $keyIn = trim((string) ($payload['specialty_key'] ?? ''));
    $specialtyKey = $keyIn !== '' ? $keyIn : (string) ($curRow['specialty_key'] ?? '');
    if ($specialtyKey === '') {
        api_envelope_error('validation', 'specialty_key مطلوب.', 422);
    }
    $statement = db()->prepare(
        'UPDATE consultation_specialties
         SET specialty_key = :specialty_key,
             name = :name,
             icon_emoji = :icon_emoji,
             color_class = :color_class,
             sort_order = :sort_order,
             is_active = :is_active
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'specialty_key' => $specialtyKey,
        'name' => trim((string) ($payload['name'] ?? '')),
        'icon_emoji' => trim((string) ($payload['icon_emoji'] ?? '🏥')),
        'color_class' => trim((string) ($payload['color_class'] ?? 'from-green-500 to-emerald-600')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);
    $fetch = db()->prepare('SELECT * FROM consultation_specialties WHERE id = :id');
    $fetch->execute(['id' => $id]);
    api_envelope_ok(['message' => 'تم تحديث التخصص.', 'item' => $fetch->fetch()]);
}

if ($method === 'DELETE') {
    require_admin_write();
    require_editor_or_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM consultation_specialties WHERE id = :id');
    $statement->execute(['id' => $id]);
    api_envelope_ok(['message' => 'تم حذف التخصص.']);
}

api_envelope_error('method_not_allowed', 'الطريقة غير مدعومة.', 405);
