<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$settingsRows = db()->query('SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key ASC')->fetchAll();
$settings = [];

foreach ($settingsRows as $row) {
    $settings[$row['setting_key']] = json_decode($row['setting_value'], true) ?? [];
}

$heroStats = db()->query('SELECT * FROM hero_stats WHERE is_active = 1 ORDER BY sort_order ASC, id ASC')->fetchAll();

$services = array_map(static function (array $item): array {
    $item['features'] = json_decode((string) ($item['features_json'] ?? '[]'), true) ?? [];
    unset($item['features_json']);
    return $item;
}, db()->query('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC')->fetchAll());

$videoPrograms = db()->query('SELECT * FROM video_programs WHERE is_active = 1 ORDER BY sort_order ASC, id ASC')->fetchAll();

$specialties = db()->query(
    'SELECT s.*, COUNT(d.id) AS doctors_count
     FROM consultation_specialties s
     LEFT JOIN consultation_doctors d ON d.specialty_id = s.id AND d.is_active = 1
     WHERE s.is_active = 1
     GROUP BY s.id
     ORDER BY s.sort_order ASC, s.id ASC'
)->fetchAll();

$doctors = db()->query(
    'SELECT d.*, s.name AS specialty_name
     FROM consultation_doctors d
     JOIN consultation_specialties s ON s.id = d.specialty_id
     WHERE d.is_active = 1 AND s.is_active = 1
     ORDER BY s.sort_order ASC, d.sort_order ASC, d.id ASC'
)->fetchAll();

json_response([
    'settings' => $settings,
    'hero_stats' => $heroStats,
    'services' => $services,
    'video_programs' => $videoPrograms,
    'consultation_specialties' => $specialties,
    'consultation_doctors' => $doctors,
]);
