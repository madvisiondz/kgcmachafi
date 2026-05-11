<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/admin/bootstrap.php';

allow_methods(['POST']);

$payload = read_json_input();
$email = mb_strtolower(trim((string) ($payload['email'] ?? '')));
$password = (string) ($payload['password'] ?? '');

if ($email === '' || $password === '') {
    json_response(['message' => 'البريد الإلكتروني وكلمة المرور مطلوبان.'], 422);
}

$statement = db()->prepare(
    'SELECT id, email, password_hash, first_name, last_name, full_name, phone, gender, wilaya_id, commune, role, is_active
     FROM public_users
     WHERE email = :email
     LIMIT 1'
);
$statement->execute(['email' => $email]);
$user = $statement->fetch();

if (!$user || (int) $user['is_active'] !== 1 || !password_verify($password, $user['password_hash'])) {
    json_response(['message' => 'بيانات الدخول غير صحيحة.'], 401);
}

session_regenerate_id(true);

$_SESSION['public_user'] = [
    'id' => (int) $user['id'],
    'email' => $user['email'],
    'user_metadata' => [
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'full_name' => $user['full_name'],
        'phone' => $user['phone'],
        'gender' => $user['gender'],
        'wilaya_id' => $user['wilaya_id'],
        'commune' => $user['commune'],
        'role' => $user['role'],
    ],
];

json_response([
    'message' => 'تم تسجيل الدخول بنجاح.',
    'user' => $_SESSION['public_user'],
]);