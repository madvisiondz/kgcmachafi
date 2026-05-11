<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    $statement = db()->query(
        'SELECT d.*, s.name AS specialty_name
         FROM consultation_doctors d
         JOIN consultation_specialties s ON s.id = d.specialty_id
         ORDER BY s.sort_order ASC, d.sort_order ASC, d.id ASC'
    );
    json_response(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin();
    $payload = read_json_input();
    $statement = db()->prepare(
        'INSERT INTO consultation_doctors (specialty_id, name, hospital, experience_years, rating, price, currency, sort_order, is_active)
         VALUES (:specialty_id, :name, :hospital, :experience_years, :rating, :price, :currency, :sort_order, :is_active)'
    );
    $statement->execute([
        'specialty_id' => (int) ($payload['specialty_id'] ?? 0),
        'name' => trim((string) ($payload['name'] ?? '')),
        'hospital' => trim((string) ($payload['hospital'] ?? '')),
        'experience_years' => (int) ($payload['experience_years'] ?? 0),
        'rating' => (float) ($payload['rating'] ?? 0),
        'price' => (float) ($payload['price'] ?? 0),
        'currency' => trim((string) ($payload['currency'] ?? 'EUR')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);
    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM consultation_doctors WHERE id = :id');
    $fetch->execute(['id' => $id]);
    json_response(['message' => 'تمت إضافة الطبيب.', 'item' => $fetch->fetch()], 201);
}

if ($method === 'PUT') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = read_json_input();
    $statement = db()->prepare(
        'UPDATE consultation_doctors
         SET specialty_id = :specialty_id,
             name = :name,
             hospital = :hospital,
             experience_years = :experience_years,
             rating = :rating,
             price = :price,
             currency = :currency,
             sort_order = :sort_order,
             is_active = :is_active
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'specialty_id' => (int) ($payload['specialty_id'] ?? 0),
        'name' => trim((string) ($payload['name'] ?? '')),
        'hospital' => trim((string) ($payload['hospital'] ?? '')),
        'experience_years' => (int) ($payload['experience_years'] ?? 0),
        'rating' => (float) ($payload['rating'] ?? 0),
        'price' => (float) ($payload['price'] ?? 0),
        'currency' => trim((string) ($payload['currency'] ?? 'EUR')),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);
    $fetch = db()->prepare('SELECT * FROM consultation_doctors WHERE id = :id');
    $fetch->execute(['id' => $id]);
    json_response(['message' => 'تم تحديث الطبيب.', 'item' => $fetch->fetch()]);
}

if ($method === 'DELETE') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM consultation_doctors WHERE id = :id');
    $statement->execute(['id' => $id]);
    json_response(['message' => 'تم حذف الطبيب.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);
