<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function international_hospital_payload(): array
{
    return read_json_input();
}

function normalize_international_list(mixed $value): array
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

    return array_values(array_filter(array_map('trim', preg_split('/[,\n]+/u', $text) ?: []), static fn ($item) => $item !== ''));
}

function format_international_hospital(array $item): array
{
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
    $statement = db()->query('SELECT * FROM international_hospitals ORDER BY is_active DESC, sort_order ASC, country ASC, name ASC');
    json_response(['items' => array_map('format_international_hospital', $statement->fetchAll())]);
}

if ($method === 'POST') {
    require_admin_write();
    $payload = international_hospital_payload();

    $statement = db()->prepare(
        'INSERT INTO international_hospitals (name, country, city, specialty, description, rating, reviews_count, hours, phone, website, payment_methods_json, insurance_providers_json, features_json, sort_order, is_active)
         VALUES (:name, :country, :city, :specialty, :description, :rating, :reviews_count, :hours, :phone, :website, :payment_methods_json, :insurance_providers_json, :features_json, :sort_order, :is_active)'
    );
    $statement->execute([
        'name' => trim((string) ($payload['name'] ?? '')),
        'country' => trim((string) ($payload['country'] ?? 'turkey')),
        'city' => trim((string) ($payload['city'] ?? '')),
        'specialty' => trim((string) ($payload['specialty'] ?? 'oncology')),
        'description' => trim((string) ($payload['description'] ?? '')),
        'rating' => (float) ($payload['rating'] ?? 0),
        'reviews_count' => max(0, (int) ($payload['reviews_count'] ?? 0)),
        'hours' => trim((string) ($payload['hours'] ?? '24/7')),
        'phone' => trim((string) ($payload['phone'] ?? '')),
        'website' => trim((string) ($payload['website'] ?? '')),
        'payment_methods_json' => json_encode(normalize_international_list($payload['payment_methods'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'insurance_providers_json' => json_encode(normalize_international_list($payload['insurance_providers'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'features_json' => json_encode(normalize_international_list($payload['features'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $id = (int) db()->lastInsertId();
    $fetch = db()->prepare('SELECT * FROM international_hospitals WHERE id = :id');
    $fetch->execute(['id' => $id]);

    json_response([
        'message' => 'تمت إضافة المستشفى الخارجي.',
        'item' => format_international_hospital($fetch->fetch() ?: []),
    ], 201);
}

if ($method === 'PUT') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = international_hospital_payload();

    $statement = db()->prepare(
        'UPDATE international_hospitals
         SET name = :name,
             country = :country,
             city = :city,
             specialty = :specialty,
             description = :description,
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
        'country' => trim((string) ($payload['country'] ?? 'turkey')),
        'city' => trim((string) ($payload['city'] ?? '')),
        'specialty' => trim((string) ($payload['specialty'] ?? 'oncology')),
        'description' => trim((string) ($payload['description'] ?? '')),
        'rating' => (float) ($payload['rating'] ?? 0),
        'reviews_count' => max(0, (int) ($payload['reviews_count'] ?? 0)),
        'hours' => trim((string) ($payload['hours'] ?? '24/7')),
        'phone' => trim((string) ($payload['phone'] ?? '')),
        'website' => trim((string) ($payload['website'] ?? '')),
        'payment_methods_json' => json_encode(normalize_international_list($payload['payment_methods'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'insurance_providers_json' => json_encode(normalize_international_list($payload['insurance_providers'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'features_json' => json_encode(normalize_international_list($payload['features'] ?? []), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'sort_order' => (int) ($payload['sort_order'] ?? 0),
        'is_active' => normalize_flag($payload['is_active'] ?? true),
    ]);

    $fetch = db()->prepare('SELECT * FROM international_hospitals WHERE id = :id');
    $fetch->execute(['id' => $id]);

    json_response([
        'message' => 'تم تحديث المستشفى الخارجي.',
        'item' => format_international_hospital($fetch->fetch() ?: []),
    ]);
}

if ($method === 'DELETE') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    $statement = db()->prepare('DELETE FROM international_hospitals WHERE id = :id');
    $statement->execute(['id' => $id]);
    json_response(['message' => 'تم حذف المستشفى الخارجي.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);