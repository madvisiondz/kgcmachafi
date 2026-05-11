<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $wilayaId = trim((string) ($_GET['wilaya'] ?? ''));

    if ($wilayaId !== '') {
        $statement = db()->prepare(
            'SELECT * FROM patient_accommodations
             WHERE is_active = 1 AND wilaya_id = :wilaya_id
             ORDER BY is_free DESC, wilaya_id ASC, city ASC, title ASC'
        );
        $statement->execute(['wilaya_id' => $wilayaId]);
        json_response(['items' => $statement->fetchAll()]);
    }

    $statement = db()->query(
        'SELECT * FROM patient_accommodations
         WHERE is_active = 1
         ORDER BY is_free DESC, wilaya_id ASC, city ASC, title ASC'
    );
    json_response(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    $payload = read_json_input();

    $statement = db()->prepare(
        'INSERT INTO patient_accommodations (title, owner_name, phone, wilaya_id, city, address, is_free, price_per_night, capacity, description, latitude, longitude, is_active)
         VALUES (:title, :owner_name, :phone, :wilaya_id, :city, :address, :is_free, :price_per_night, :capacity, :description, :latitude, :longitude, 1)'
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
    ]);

    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM patient_accommodations WHERE id = :id');
    $fetch->execute(['id' => $id]);

    json_response([
        'message' => 'تمت إضافة مكان الإيواء.',
        'item' => $fetch->fetch(),
    ], 201);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);