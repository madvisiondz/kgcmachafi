<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $wilayaId = trim((string) ($_GET['wilaya'] ?? ''));

    if ($wilayaId !== '') {
        $statement = db()->prepare(
            'SELECT * FROM ambulances
             WHERE is_active = 1 AND wilaya_id = :wilaya_id
             ORDER BY is_free DESC, wilaya_id ASC, city ASC, owner_name ASC'
        );
        $statement->execute(['wilaya_id' => $wilayaId]);
        json_response(['items' => $statement->fetchAll()]);
    }

    $statement = db()->query(
        'SELECT * FROM ambulances
         WHERE is_active = 1
         ORDER BY is_free DESC, wilaya_id ASC, city ASC, owner_name ASC'
    );
    json_response(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    $payload = read_json_input();

    $statement = db()->prepare(
        'INSERT INTO ambulances (owner_name, phone, wilaya_id, city, is_free, price_description, vehicle_type, latitude, longitude, is_active)
         VALUES (:owner_name, :phone, :wilaya_id, :city, :is_free, :price_description, :vehicle_type, :latitude, :longitude, 1)'
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
    ]);

    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM ambulances WHERE id = :id');
    $fetch->execute(['id' => $id]);

    json_response([
        'message' => 'تمت إضافة سيارة الإسعاف.',
        'item' => $fetch->fetch(),
    ], 201);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);