<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

allow_methods(['POST']);

$payload = read_json_input();
$username = trim((string) ($payload['username'] ?? ''));
$password = (string) ($payload['password'] ?? '');

if ($username === '' || $password === '') {
    json_response(['message' => 'اسم المستخدم وكلمة المرور مطلوبان.'], 422);
}

$statement = db()->prepare(
    'SELECT id, username, password_hash, full_name, role, is_active FROM admin_users WHERE username = :username LIMIT 1'
);
$statement->execute(['username' => $username]);
$admin = $statement->fetch();

if (!$admin || (int) $admin['is_active'] !== 1 || !password_verify($password, $admin['password_hash'])) {
    json_response(['message' => 'بيانات الدخول غير صحيحة.'], 401);
}

session_regenerate_id(true);

$_SESSION['admin'] = [
    'id' => (int) $admin['id'],
    'username' => $admin['username'],
    'full_name' => $admin['full_name'],
    'role' => $admin['role'],
];

$csrf = csrf_issue_token();

json_response([
    'message' => 'تم تسجيل الدخول بنجاح.',
    'admin' => $_SESSION['admin'],
    'csrf_token' => $csrf,
]);
