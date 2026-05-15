<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    require_editor_or_admin();
    $statement = db()->query('SELECT * FROM hero_stats ORDER BY sort_order ASC, id ASC');
    api_envelope_ok(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin_write();
    require_editor_or_admin();
    $payload = read_json_input();
    $statement = db()->prepare(
        'INSERT INTO hero_stats (icon_key, label, value, color_class, sort_order, is_active)
         VALUES (:icon_key, :label, :value, :color_class, :sort_order, :is_active)'
    );
    $statement->execute([
        'icon_key' => trim((string) ($payload['icon_key'] ?? 'users')),
        'label' => trim((string) ($payload['label'] ?? '')),
        'value' => trim((string) ($payload['value'] ?? '')),
        'color_class' => trim((string) ($payload['color_class'] ?? 'from-green-500 to-emerald-600')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM hero_stats WHERE id = :id');
    $fetch->execute(['id' => $id]);
    api_envelope_ok(['message' => 'تمت إضافة الإحصائية.', 'item' => $fetch->fetch()], 201);
}

if ($method === 'PUT') {
    require_admin_write();
    require_editor_or_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = read_json_input();
    $statement = db()->prepare(
        'UPDATE hero_stats
         SET icon_key = :icon_key,
             label = :label,
             value = :value,
             color_class = :color_class,
             sort_order = :sort_order,
             is_active = :is_active
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'icon_key' => trim((string) ($payload['icon_key'] ?? 'users')),
        'label' => trim((string) ($payload['label'] ?? '')),
        'value' => trim((string) ($payload['value'] ?? '')),
        'color_class' => trim((string) ($payload['color_class'] ?? 'from-green-500 to-emerald-600')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $fetch = db()->prepare('SELECT * FROM hero_stats WHERE id = :id');
    $fetch->execute(['id' => $id]);
    api_envelope_ok(['message' => 'تم تحديث الإحصائية.', 'item' => $fetch->fetch()]);
}

if ($method === 'DELETE') {
    require_admin_write();
    require_editor_or_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM hero_stats WHERE id = :id');
    $statement->execute(['id' => $id]);
    api_envelope_ok(['message' => 'تم حذف الإحصائية.']);
}

api_envelope_error('method_not_allowed', 'الطريقة غير مدعومة.', 405);
