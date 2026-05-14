<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    $statement = db()->query('SELECT setting_key, setting_value, updated_at FROM site_settings ORDER BY setting_key ASC');
    $rows = $statement->fetchAll();
    $settings = [];

    foreach ($rows as $row) {
        $settings[$row['setting_key']] = json_decode($row['setting_value'], true) ?? [];
    }

    api_envelope_ok(['settings' => $settings]);
}

if ($method === 'PUT') {
    require_admin_write();
    $payload = read_json_input();
    $settings = $payload['settings'] ?? null;

    if (!is_array($settings) || $settings === []) {
        api_envelope_error('validation', 'بيانات الإعدادات غير صالحة.', 422);
    }

    $statement = db()->prepare(
        'INSERT INTO site_settings (setting_key, setting_value)
         VALUES (:setting_key, :setting_value)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );

    foreach ($settings as $key => $value) {
        $statement->execute([
            'setting_key' => (string) $key,
            'setting_value' => json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);
    }

    api_envelope_ok(['message' => 'تم حفظ إعدادات الموقع.']);
}

api_envelope_error('method_not_allowed', 'الطريقة غير مدعومة.', 405);
