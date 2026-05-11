<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function hospital_payload(): array
{
    return read_json_input();
}

function normalize_list(mixed $value): array
{
    if (is_array($value)) {
        return array_values(array_filter(array_map(
            static fn ($item) => trim((string) $item),
            $value
        ), static fn ($item) => $item !== ''));
    }

    $text = trim((string) $value);
    if ($text === '') {
        return [];
    }

    return array_values(array_filter(array_map(
        'trim',
        preg_split('/[,\n]+/u', $text) ?: []
    ), static fn ($item) => $item !== ''));
}

function format_hospital(array $item): array
{
    $item['specialties'] = json_decode((string) ($item['specialties_json'] ?? '[]'), true) ?: [];
    $item['payment_methods'] = json_decode((string) ($item['payment_methods_json'] ?? '[]'), true) ?: [];
    $item['insurance_providers'] = json_decode((string) ($item['insurance_providers_json'] ?? '[]'), true) ?: [];
    $item['features'] = json_decode((string) ($item['features_json'] ?? '[]'), true) ?: [];
    $item['rating'] = isset($item['rating']) ? (float) $item['rating'] : 0.0;
    $item['reviews_count'] = isset($item['reviews_count']) ? (int) $item['reviews_count'] : 0;
    $item['is_active'] = isset($item['is_active']) ? (int) $item['is_active'] : 0;

    return $item;
}

if ($method === 'GET') {
    require_admin();
    $statement = db()->query('SELECT * FROM hospitals ORDER BY is_active DESC, sort_order ASC, wilaya_id ASC, city ASC, name ASC');
    $items = array_map('format_hospital', $statement->fetchAll());
    json_response(['items' => $items]);
}

if ($method === 'POST') {
    require_admin();
    $payload = hospital_payload();

    $statement = db()->prepare(
        'INSERT INTO hospitals (name, type, wilaya_id, city, address, specialties_json, rating, reviews_count, hours, phone, website, payment_methods_json, insurance_providers_json, features_json, sort_order, is_active)
         VALUES (:name, :type, :wilaya_id, :city, :address, :specialties_json, :rating, :reviews_count, :hours, :phone, :website, :payment_methods_json, :insurance_providers_json, :features_json, :sort_order, :is_active)'
    );
    $statement->execute([
        'name' => trim((string) ($payload['name'] ?? '')),
        'type' => trim((string) ($payload['type'] ?? 'public')),
        'wilaya_id' => trim((string) ($payload['wilaya_id'] ?? '')),
        'city' => trim((string) ($payload['city'] ?? '')),
        'address' => trim((string) ($payload['address'] ?? '')),
        'specialties_json' => json_encode(normalize_list($payload['specialties'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'rating' => (float) ($payload['rating'] ?? 0),
        'reviews_count' => max(0, (int) ($payload['reviews_count'] ?? 0)),
        'hours' => trim((string) ($payload['hours'] ?? '24/7')),
        'phone' => trim((string) ($payload['phone'] ?? '')),
        'website' => trim((string) ($payload['website'] ?? '')),
        'payment_methods_json' => json_encode(normalize_list($payload['payment_methods'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'insurance_providers_json' => json_encode(normalize_list($payload['insurance_providers'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'features_json' => json_encode(normalize_list($payload['features'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM hospitals WHERE id = :id');
    $fetch->execute(['id' => $id]);

    json_response([
        'message' => 'تمت إضافة المستشفى.',
        'item' => format_hospital($fetch->fetch() ?: []),
    ], 201);
}

if ($method === 'PUT') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = hospital_payload();

    $statement = db()->prepare(
        'UPDATE hospitals
         SET name = :name,
             type = :type,
             wilaya_id = :wilaya_id,
             city = :city,
             address = :address,
             specialties_json = :specialties_json,
             rating = :rating,
             reviews_count = :reviews_count,
             hours = :hours,
             phone = :phone,
             website = :website,
             payment_methods_json = :payment_methods_json,
             insurance_providers_json = :insurance_providers_json,
             features_json = :features_json,
             sort_order = :sort_order,
             is_active = :is_active
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'name' => trim((string) ($payload['name'] ?? '')),
        'type' => trim((string) ($payload['type'] ?? 'public')),
        'wilaya_id' => trim((string) ($payload['wilaya_id'] ?? '')),
        'city' => trim((string) ($payload['city'] ?? '')),
        'address' => trim((string) ($payload['address'] ?? '')),
        'specialties_json' => json_encode(normalize_list($payload['specialties'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'rating' => (float) ($payload['rating'] ?? 0),
        'reviews_count' => max(0, (int) ($payload['reviews_count'] ?? 0)),
        'hours' => trim((string) ($payload['hours'] ?? '24/7')),
        'phone' => trim((string) ($payload['phone'] ?? '')),
        'website' => trim((string) ($payload['website'] ?? '')),
        'payment_methods_json' => json_encode(normalize_list($payload['payment_methods'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'insurance_providers_json' => json_encode(normalize_list($payload['insurance_providers'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'features_json' => json_encode(normalize_list($payload['features'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $fetch = db()->prepare('SELECT * FROM hospitals WHERE id = :id');
    $fetch->execute(['id' => $id]);

    json_response([
        'message' => 'تم تحديث المستشفى.',
        'item' => format_hospital($fetch->fetch() ?: []),
    ]);
}

if ($method === 'DELETE') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM hospitals WHERE id = :id');
    $statement->execute(['id' => $id]);
    json_response(['message' => 'تم حذف المستشفى.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);