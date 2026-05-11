<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$config = require dirname(__DIR__, 3) . '/admin-config.php';

session_name($config['session_name'] ?? 'kgc_admin_session');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
]);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function admin_config(): array
{
    global $config;

    return $config;
}

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dbConfig = admin_config()['db'];
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $dbConfig['host'],
        $dbConfig['database'],
        $dbConfig['charset'] ?? 'utf8mb4'
    );

    $pdo = new PDO($dsn, $dbConfig['username'], $dbConfig['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function json_response(array $payload, int $statusCode = 200): never
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function allow_methods(array $allowedMethods): void
{
    if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', $allowedMethods, true)) {
        header('Allow: ' . implode(', ', $allowedMethods));
        json_response(['message' => 'الطريقة غير مدعومة.'], 405);
    }
}

function read_json_input(): array
{
    $rawBody = file_get_contents('php://input');

    if ($rawBody === false || trim($rawBody) === '') {
        return [];
    }

    $decoded = json_decode($rawBody, true);

    if (!is_array($decoded)) {
        json_response(['message' => 'بيانات الطلب غير صالحة.'], 400);
    }

    return $decoded;
}

function get_admin_session(): ?array
{
    return isset($_SESSION['admin']) && is_array($_SESSION['admin']) ? $_SESSION['admin'] : null;
}

function get_public_user_session(): ?array
{
    return isset($_SESSION['public_user']) && is_array($_SESSION['public_user']) ? $_SESSION['public_user'] : null;
}

function require_admin(): array
{
    $admin = get_admin_session();

    if ($admin === null) {
        json_response(['message' => 'يجب تسجيل الدخول للوصول إلى لوحة التحكم.'], 401);
    }

    return $admin;
}

function require_public_user(): array
{
    $user = get_public_user_session();

    if ($user === null) {
        json_response(['message' => 'يجب تسجيل الدخول أولاً.'], 401);
    }

    return $user;
}

function normalize_flag(mixed $value): int
{
    return filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
}
