<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

allow_methods(['POST']);
$admin = require_admin_write();
require_editor_or_admin();

$payload = read_json_input();
$current = (string) ($payload['current_password'] ?? '');
$new = (string) ($payload['new_password'] ?? '');
$confirm = (string) ($payload['confirm_password'] ?? '');

if ($current === '' || $new === '' || $confirm === '') {
    api_envelope_error('validation', 'All password fields are required.', 422);
}

if ($new !== $confirm) {
    api_envelope_error('validation', 'New password and confirmation do not match.', 422);
}

if (strlen($new) < 8) {
    api_envelope_error('validation', 'New password must be at least 8 characters.', 422);
}

$stmt = db()->prepare('SELECT password_hash FROM admin_users WHERE id = :id LIMIT 1');
$stmt->execute(['id' => (int) $admin['id']]);
$row = $stmt->fetch();
$hash = (string) ($row['password_hash'] ?? '');

if ($hash === '' || !password_verify($current, $hash)) {
    api_envelope_error('auth', 'Current password is incorrect.', 403);
}

$newHash = password_hash($new, PASSWORD_DEFAULT);
$upd = db()->prepare('UPDATE admin_users SET password_hash = :h WHERE id = :id');
$upd->execute(['h' => $newHash, 'id' => (int) $admin['id']]);

api_envelope_ok(['updated' => true]);
