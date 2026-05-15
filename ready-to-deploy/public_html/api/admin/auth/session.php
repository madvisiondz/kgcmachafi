<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

allow_methods(['GET']);

$admin = get_admin_session();

$csrf = '';
if ($admin !== null) {
    $csrf = (string) ($_SESSION['csrf_token'] ?? '');
    if ($csrf === '') {
        $csrf = csrf_issue_token();
    }
}

api_envelope_ok([
    'authenticated' => $admin !== null,
    'admin' => $admin,
    'csrf_token' => $csrf !== '' ? $csrf : null,
]);
