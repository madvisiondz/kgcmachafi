<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$lang = trim((string) ($_GET['lang'] ?? 'ar'));
if (!in_array($lang, ['ar', 'fr', 'en'], true)) {
    $lang = 'ar';
}

$statement = db()->prepare(
    'SELECT id, title, description, details, features_json, sort_order
     FROM services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
);
$statement->execute();

$items = [];
foreach ($statement->fetchAll() as $row) {
    $row['features'] = json_decode((string) ($row['features_json'] ?? '[]'), true) ?? [];
    unset($row['features_json']);
    if ($lang !== 'ar') {
        $row = i18n_apply_row('services', $row, $lang, ['id', 'sort_order']);
    }
    $items[] = $row;
}

api_envelope_ok(['items' => $items, 'lang' => $lang]);
