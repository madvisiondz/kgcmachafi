<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/admin/bootstrap.php';

allow_methods(['POST']);

$payload = read_json_input();

$firstName = trim((string) ($payload['first_name'] ?? ''));
$lastName = trim((string) ($payload['last_name'] ?? ''));
$email = mb_strtolower(trim((string) ($payload['email'] ?? '')));
$password = (string) ($payload['password'] ?? '');
$phone = trim((string) ($payload['phone'] ?? ''));
$gender = trim((string) ($payload['gender'] ?? ''));
$wilayaId = trim((string) ($payload['wilaya_id'] ?? ''));
$commune = trim((string) ($payload['commune'] ?? ''));

if ($firstName === '' || $lastName === '' || $email === '' || $password === '' || $phone === '' || $gender === '' || $wilayaId === '' || $commune === '') {
    json_response(['message' => 'جميع بيانات التسجيل مطلوبة.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['message' => 'البريد الإلكتروني غير صالح.'], 422);
}

if (mb_strlen($password) < 6) {
    json_response(['message' => 'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.'], 422);
}

if (!in_array($gender, ['male', 'female'], true)) {
    json_response(['message' => 'قيمة الجنس غير صالحة.'], 422);
}

$fullName = trim($firstName . ' ' . $lastName);

$existsStatement = db()->prepare('SELECT id FROM public_users WHERE email = :email LIMIT 1');
$existsStatement->execute(['email' => $email]);

if ($existsStatement->fetch()) {
    json_response(['message' => 'هذا البريد الإلكتروني مسجل بالفعل.'], 409);
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$insertStatement = db()->prepare(
    'INSERT INTO public_users (email, password_hash, first_name, last_name, full_name, phone, gender, wilaya_id, commune, role, is_active)
     VALUES (:email, :password_hash, :first_name, :last_name, :full_name, :phone, :gender, :wilaya_id, :commune, :role, 1)'
);

$insertStatement->execute([
    'email' => $email,
    'password_hash' => $passwordHash,
    'first_name' => $firstName,
    'last_name' => $lastName,
    'full_name' => $fullName,
    'phone' => $phone,
    'gender' => $gender,
    'wilaya_id' => $wilayaId,
    'commune' => $commune,
    'role' => 'member',
]);

$userId = (int) db()->lastInsertId();

session_regenerate_id(true);

$_SESSION['public_user'] = [
    'id' => $userId,
    'email' => $email,
    'user_metadata' => [
        'first_name' => $firstName,
        'last_name' => $lastName,
        'full_name' => $fullName,
        'phone' => $phone,
        'gender' => $gender,
        'wilaya_id' => $wilayaId,
        'commune' => $commune,
        'role' => 'member',
    ],
];

json_response([
    'message' => 'تم إنشاء الحساب بنجاح.',
    'user' => $_SESSION['public_user'],
], 201);