<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function accommodation_payload(): array
{
    return read_json_input();
}

if ($method === 'GET') {
    require_admin();
    $statement = db()->query('SELECT * FROM patient_accommodations ORDER BY is_active DESC, is_free DESC, wilaya_id ASC, city ASC, title ASC');
    json_response(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin();
    $payload = accommodation_payload();

    $statement = db()->prepare(
        'INSERT INTO patient_accommodations (title, owner_name, phone, wilaya_id, city, address, is_free, price_per_night, capacity, description, latitude, longitude, is_active)
         VALUES (:title, :owner_name, :phone, :wilaya_id, :city, :address, :is_free, :price_per_night, :capacity, :description, :latitude, :longitude, :is_active)'
    );
    $statement->execute([
        'title' => trim((string) ($payload['title'] ?? '')),
        'owner_name' => trim((string) ($payload['owner_name'] ?? '')),
        'phone' => trim((string) ($payload['phone'] ?? '')),
        'wilaya_id' => trim((string) ($payload['wilaya_id'] ?? '')),
        'city' => trim((string) ($payload['city'] ?? '')),
        'address' => trim((string) ($payload['address'] ?? '')),
        'is_free' => normalize_flag($payload['is_free'] ?? false),
        'price_per_night' => ($payload['price_per_night'] ?? '') !== '' ? (float) $payload['price_per_night'] : 0,
        'capacity' => max(1, (int) ($payload['capacity'] ?? 1)),
        'description' => trim((string) ($payload['description'] ?? '')),
        'latitude' => ($payload['latitude'] ?? '') !== '' ? (float) $payload['latitude'] : null,
        'longitude' => ($payload['longitude'] ?? '') !== '' ? (float) $payload['longitude'] : null,
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM patient_accommodations WHERE id = :id');
    $fetch->execute(['id' => $id]);

    json_response([
        'message' => 'تمت إضافة مكان الإيواء.',
        'item' => $fetch->fetch(),
    ], 201);
}

if ($method === 'PUT') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = accommodation_payload();

    $statement = db()->prepare(
        'UPDATE patient_accommodations
         SET title = :title,
             owner_name = :owner_name,
             phone = :phone,
             wilaya_id = :wilaya_id,
             city = :city,
             address = :address,
             is_free = :is_free,
             price_per_night = :price_per_night,
             capacity = :capacity,
             description = :description,
             latitude = :latitude,
             longitude = :longitude,
             is_active = :is_active
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'title' => trim((string) ($payload['title'] ?? '')),
        'owner_name' => trim((string) ($payload['owner_name'] ?? '')),
        'phone' => trim((string) ($payload['phone'] ?? '')),
        'wilaya_id' => trim((string) ($payload['wilaya_id'] ?? '')),
        'city' => trim((string) ($payload['city'] ?? '')),
        'address' => trim((string) ($payload['address'] ?? '')),
        'is_free' => normalize_flag($payload['is_free'] ?? false),
        'price_per_night' => ($payload['price_per_night'] ?? '') !== '' ? (float) $payload['price_per_night'] : 0,
        'capacity' => max(1, (int) ($payload['capacity'] ?? 1)),
        'description' => trim((string) ($payload['description'] ?? '')),
        'latitude' => ($payload['latitude'] ?? '') !== '' ? (float) $payload['latitude'] : null,
        'longitude' => ($payload['longitude'] ?? '') !== '' ? (float) $payload['longitude'] : null,
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $fetch = db()->prepare('SELECT * FROM patient_accommodations WHERE id = :id');
    $fetch->execute(['id' => $id]);

    json_response([
        'message' => 'تم تحديث مكان الإيواء.',
        'item' => $fetch->fetch(),
    ]);
}

if ($method === 'DELETE') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM patient_accommodations WHERE id = :id');
    $statement->execute(['id' => $id]);
    json_response(['message' => 'تم حذف مكان الإيواء.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);