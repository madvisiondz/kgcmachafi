<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

allow_methods(['GET']);

$admin = get_admin_session();

json_response([
    'authenticated' => $admin !== null,
    'admin' => $admin,
]);
