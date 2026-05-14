<?php
declare(strict_types=1);

/**
 * Public-safe settings (no secrets). For full CMS bundle use site-content.php with lang.
 */
require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$allowedKeys = ['about', 'branding', 'footer', 'social', 'seo'];

$rows = db()->query('SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key ASC')->fetchAll();
$out = [];
foreach ($rows as $row) {
    $k = (string) $row['setting_key'];
    if (!in_array($k, $allowedKeys, true)) {
        continue;
    }
    $out[$k] = json_decode((string) $row['setting_value'], true) ?? [];
}

api_envelope_ok(['settings' => $out]);
