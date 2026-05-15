<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

allow_methods(['POST']);

require_admin_write();

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', $params['secure'], $params['httponly']);
}

session_destroy();

api_envelope_ok(['message' => 'تم تسجيل الخروج.']);
