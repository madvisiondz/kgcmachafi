<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/admin/bootstrap.php';

allow_methods(['GET']);

$user = get_public_user_session();

json_response([
    'authenticated' => $user !== null,
    'user' => $user,
]);