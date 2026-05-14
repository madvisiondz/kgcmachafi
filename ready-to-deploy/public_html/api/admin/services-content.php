<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    $statement = db()->query('SELECT * FROM services ORDER BY sort_order ASC, id ASC');
    $items = array_map(static function (array $item): array {
        $item['features'] = json_decode((string) ($item['features_json'] ?? '[]'), true) ?? [];
        unset($item['features_json']);
        return $item;
    }, $statement->fetchAll());
    json_response(['items' => $items]);
}

if ($method === 'POST') {
    require_admin_write();
    $payload = read_json_input();
    $statement = db()->prepare(
        'INSERT INTO services (icon_key, title, description, details, features_json, color_class, bg_class, sort_order, is_active)
         VALUES (:icon_key, :title, :description, :details, :features_json, :color_class, :bg_class, :sort_order, :is_active)'
    );
    $statement->execute([
        'icon_key' => trim((string) ($payload['icon_key'] ?? 'heart')),
        'title' => trim((string) ($payload['title'] ?? '')),
        'description' => trim((string) ($payload['description'] ?? '')),
        'details' => trim((string) ($payload['details'] ?? '')),
        'features_json' => json_encode(array_values($payload['features'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'color_class' => trim((string) ($payload['color_class'] ?? 'from-green-500 to-emerald-600')),
        'bg_class' => trim((string) ($payload['bg_class'] ?? 'bg-green-50')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM services WHERE id = :id');
    $fetch->execute(['id' => $id]);
    $item = $fetch->fetch();
    $item['features'] = json_decode((string) ($item['features_json'] ?? '[]'), true) ?? [];
    unset($item['features_json']);
    json_response(['message' => 'تمت إضافة الخدمة.', 'item' => $item], 201);
}

if ($method === 'PUT') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = read_json_input();
    $statement = db()->prepare(
        'UPDATE services
         SET icon_key = :icon_key,
             title = :title,
             description = :description,
             details = :details,
             features_json = :features_json,
             color_class = :color_class,
             bg_class = :bg_class,
             sort_order = :sort_order,
             is_active = :is_active
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'icon_key' => trim((string) ($payload['icon_key'] ?? 'heart')),
        'title' => trim((string) ($payload['title'] ?? '')),
        'description' => trim((string) ($payload['description'] ?? '')),
        'details' => trim((string) ($payload['details'] ?? '')),
        'features_json' => json_encode(array_values($payload['features'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'color_class' => trim((string) ($payload['color_class'] ?? 'from-green-500 to-emerald-600')),
        'bg_class' => trim((string) ($payload['bg_class'] ?? 'bg-green-50')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $fetch = db()->prepare('SELECT * FROM services WHERE id = :id');
    $fetch->execute(['id' => $id]);
    $item = $fetch->fetch();
    $item['features'] = json_decode((string) ($item['features_json'] ?? '[]'), true) ?? [];
    unset($item['features_json']);
    json_response(['message' => 'تم تحديث الخدمة.', 'item' => $item]);
}

if ($method === 'DELETE') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM services WHERE id = :id');
    $statement->execute(['id' => $id]);
    json_response(['message' => 'تم حذف الخدمة.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);
