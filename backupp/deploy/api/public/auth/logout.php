<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/admin/bootstrap.php';

allow_methods(['POST']);

unset($_SESSION['public_user']);

json_response(['message' => 'تم تسجيل الخروج.']);