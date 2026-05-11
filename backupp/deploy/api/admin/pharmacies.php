<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function pharmacy_payload(): array
{
    return read_json_input();
}

if ($method === 'GET') {
    require_admin();
    $statement = db()->query('SELECT * FROM pharmacies ORDER BY is_night_duty DESC, wilaya ASC, commune ASC, name ASC');
    json_response(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin();
    $payload = pharmacy_payload();

    $statement = db()->prepare(
        'INSERT INTO pharmacies (name, wilaya, commune, phone, latitude, longitude, is_night_duty, is_active)
         VALUES (:name, :wilaya, :commune, :phone, :latitude, :longitude, :is_night_duty, :is_active)'
    );
    $statement->execute([
        'name' => trim((string) ($payload['name'] ?? '')),
        'wilaya' => trim((string) ($payload['wilaya'] ?? '')),
        'commune' => trim((string) ($payload['commune'] ?? '')),
        'phone' => trim((string) ($payload['phone'] ?? '')),
        'latitude' => ($payload['latitude'] ?? '') !== '' ? (float) $payload['latitude'] : null,
        'longitude' => ($payload['longitude'] ?? '') !== '' ? (float) $payload['longitude'] : null,
        'is_night_duty' => normalize_flag($payload['is_night_duty'] ?? false),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM pharmacies WHERE id = :id');
    $fetch->execute(['id' => $id]);

    json_response([
        'message' => 'تمت إضافة الصيدلية.',
        'item' => $fetch->fetch(),
    ], 201);
}

if ($method === 'PUT') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = pharmacy_payload();

    $statement = db()->prepare(
        'UPDATE pharmacies
         SET name = :name,
             wilaya = :wilaya,
             commune = :commune,
             phone = :phone,
             latitude = :latitude,
             longitude = :longitude,
             is_night_duty = :is_night_duty,
             is_active = :is_active
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'name' => trim((string) ($payload['name'] ?? '')),
        'wilaya' => trim((string) ($payload['wilaya'] ?? '')),
        'commune' => trim((string) ($payload['commune'] ?? '')),
        'phone' => trim((string) ($payload['phone'] ?? '')),
        'latitude' => ($payload['latitude'] ?? '') !== '' ? (float) $payload['latitude'] : null,
        'longitude' => ($payload['longitude'] ?? '') !== '' ? (float) $payload['longitude'] : null,
        'is_night_duty' => normalize_flag($payload['is_night_duty'] ?? false),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $fetch = db()->prepare('SELECT * FROM pharmacies WHERE id = :id');
    $fetch->execute(['id' => $id]);

    json_response([
        'message' => 'تم تحديث الصيدلية.',
        'item' => $fetch->fetch(),
    ]);
}

if ($method === 'DELETE') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM pharmacies WHERE id = :id');
    $statement->execute(['id' => $id]);
    json_response(['message' => 'تم حذف الصيدلية.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);
