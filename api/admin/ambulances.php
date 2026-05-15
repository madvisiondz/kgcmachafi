<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function ambulance_payload(): array
{
    return read_json_input();
}

if ($method === 'GET') {
    require_admin();
    require_editor_or_admin();
    $statement = db()->query('SELECT * FROM ambulances ORDER BY is_active DESC, wilaya_id ASC, city ASC, owner_name ASC');
    api_envelope_ok(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin_write();
    require_editor_or_admin();
    $payload = ambulance_payload();

    $statement = db()->prepare(
        'INSERT INTO ambulances (owner_name, phone, wilaya_id, city, is_free, price_description, vehicle_type, latitude, longitude, is_active)
         VALUES (:owner_name, :phone, :wilaya_id, :city, :is_free, :price_description, :vehicle_type, :latitude, :longitude, :is_active)'
    );
    $statement->execute([
        'owner_name' => trim((string) ($payload['owner_name'] ?? '')),
        'phone' => trim((string) ($payload['phone'] ?? '')),
        'wilaya_id' => trim((string) ($payload['wilaya_id'] ?? '')),
        'city' => trim((string) ($payload['city'] ?? '')),
        'is_free' => normalize_flag($payload['is_free'] ?? false),
        'price_description' => trim((string) ($payload['price_description'] ?? '')),
        'vehicle_type' => trim((string) ($payload['vehicle_type'] ?? 'standard')),
        'latitude' => ($payload['latitude'] ?? '') !== '' ? (float) $payload['latitude'] : null,
        'longitude' => ($payload['longitude'] ?? '') !== '' ? (float) $payload['longitude'] : null,
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM ambulances WHERE id = :id');
    $fetch->execute(['id' => $id]);

    api_envelope_ok([
        'message' => 'تمت إضافة سيارة الإسعاف.',
        'item' => $fetch->fetch(),
    ], 201);
}

if ($method === 'PUT') {
    require_admin_write();
    require_editor_or_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = ambulance_payload();

    $statement = db()->prepare(
        'UPDATE ambulances
         SET owner_name = :owner_name,
             phone = :phone,
             wilaya_id = :wilaya_id,
             city = :city,
             is_free = :is_free,
             price_description = :price_description,
             vehicle_type = :vehicle_type,
             latitude = :latitude,
             longitude = :longitude,
             is_active = :is_active
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'owner_name' => trim((string) ($payload['owner_name'] ?? '')),
        'phone' => trim((string) ($payload['phone'] ?? '')),
        'wilaya_id' => trim((string) ($payload['wilaya_id'] ?? '')),
        'city' => trim((string) ($payload['city'] ?? '')),
        'is_free' => normalize_flag($payload['is_free'] ?? false),
        'price_description' => trim((string) ($payload['price_description'] ?? '')),
        'vehicle_type' => trim((string) ($payload['vehicle_type'] ?? 'standard')),
        'latitude' => ($payload['latitude'] ?? '') !== '' ? (float) $payload['latitude'] : null,
        'longitude' => ($payload['longitude'] ?? '') !== '' ? (float) $payload['longitude'] : null,
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $fetch = db()->prepare('SELECT * FROM ambulances WHERE id = :id');
    $fetch->execute(['id' => $id]);

    api_envelope_ok([
        'message' => 'تم تحديث سيارة الإسعاف.',
        'item' => $fetch->fetch(),
    ]);
}

if ($method === 'DELETE') {
    require_admin_write();
    require_editor_or_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM ambulances WHERE id = :id');
    $statement->execute(['id' => $id]);
    api_envelope_ok(['message' => 'تم حذف سيارة الإسعاف.']);
}

api_envelope_error('method_not_allowed', 'الطريقة غير مدعومة.', 405);