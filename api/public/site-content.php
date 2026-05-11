<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$lang = trim((string) ($_GET['lang'] ?? 'ar'));
if ($lang === '') {
    $lang = 'ar';
}
if (!in_array($lang, ['ar', 'en', 'fr'], true)) {
    $lang = 'ar';
}

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

// Apply stored translations (Plan B)
if ($lang !== 'ar') {
    // site_settings translations stored under entity_id=0 with dotted fields
    $siteFields = i18n_get_map('site_settings', [0], $lang)['0'] ?? [];
    if ($siteFields !== []) {
        foreach ($siteFields as $field => $text) {
            $field = (string) $field;
            if ($field === '') continue;
            $parts = explode('.', $field);
            if (count($parts) < 2) continue;
            $root = array_shift($parts);
            if (!isset($settings[$root]) || !is_array($settings[$root])) continue;
            $ref = &$settings[$root];
            foreach ($parts as $idx => $p) {
                if ($p === '') break;
                if ($idx === count($parts) - 1) {
                    $ref[$p] = $text;
                } else {
                    if (!isset($ref[$p]) || !is_array($ref[$p])) {
                        $ref[$p] = [];
                    }
                    $ref = &$ref[$p];
                }
            }
            unset($ref);
        }
    }

    // hero_stats labels
    $heroMap = i18n_get_map('hero_stats', array_map(static fn($r) => (int) $r['id'], $heroStats), $lang);
    foreach ($heroStats as &$row) {
        $id = (string) ((int) ($row['id'] ?? 0));
        if (isset($heroMap[$id]['label']) && $heroMap[$id]['label'] !== '') {
            $row['label'] = $heroMap[$id]['label'];
        }
    }
    unset($row);

    // services: title/description/details + features (as JSON string field name "features_json")
    $serviceIds = array_map(static fn($r) => (int) $r['id'], $services);
    $serviceMap = i18n_get_map('services', $serviceIds, $lang);
    foreach ($services as &$row) {
        $id = (string) ((int) ($row['id'] ?? 0));
        $tr = $serviceMap[$id] ?? [];
        foreach (['title', 'description', 'details'] as $fieldName) {
            if (isset($tr[$fieldName]) && $tr[$fieldName] !== '') {
                $row[$fieldName] = $tr[$fieldName];
            }
        }
        if (isset($tr['features_json']) && $tr['features_json'] !== '') {
            $row['features'] = json_decode($tr['features_json'], true) ?? $row['features'];
        }
    }
    unset($row);

    // video programs
    $videoIds = array_map(static fn($r) => (int) $r['id'], $videoPrograms);
    $videoMap = i18n_get_map('video_programs', $videoIds, $lang);
    foreach ($videoPrograms as &$row) {
        $id = (string) ((int) ($row['id'] ?? 0));
        $tr = $videoMap[$id] ?? [];
        foreach (['title', 'description'] as $fieldName) {
            if (isset($tr[$fieldName]) && $tr[$fieldName] !== '') {
                $row[$fieldName] = $tr[$fieldName];
            }
        }
    }
    unset($row);

    // specialties + doctors
    $specIds = array_map(static fn($r) => (int) $r['id'], $specialties);
    $specMap = i18n_get_map('consultation_specialties', $specIds, $lang);
    foreach ($specialties as &$row) {
        $id = (string) ((int) ($row['id'] ?? 0));
        $tr = $specMap[$id] ?? [];
        if (isset($tr['name']) && $tr['name'] !== '') {
            $row['name'] = $tr['name'];
        }
    }
    unset($row);

    $doctorIds = array_map(static fn($r) => (int) $r['id'], $doctors);
    $doctorMap = i18n_get_map('consultation_doctors', $doctorIds, $lang);
    foreach ($doctors as &$row) {
        $id = (string) ((int) ($row['id'] ?? 0));
        $tr = $doctorMap[$id] ?? [];
        foreach (['name', 'hospital', 'specialty_name'] as $fieldName) {
            if (isset($tr[$fieldName]) && $tr[$fieldName] !== '') {
                $row[$fieldName] = $tr[$fieldName];
            }
        }
    }
    unset($row);
}

json_response([
    'settings' => $settings,
    'hero_stats' => $heroStats,
    'services' => $services,
    'video_programs' => $videoPrograms,
    'consultation_specialties' => $specialties,
    'consultation_doctors' => $doctors,
]);
