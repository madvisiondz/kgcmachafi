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
    $port = isset($dbConfig['port']) ? (int) $dbConfig['port'] : 3306;
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $dbConfig['host'],
        $port,
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
        api_envelope_error('method_not_allowed', 'الطريقة غير مدعومة.', 405);
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
        api_envelope_error('invalid_json', 'بيانات الطلب غير صالحة.', 400);
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
        api_envelope_error('auth', 'يجب تسجيل الدخول للوصول إلى لوحة التحكم.', 401);
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

/**
 * Plan B translations: store translations in DB (no external calls in production).
 * Table: content_i18n(entity_type, entity_id, field, lang, text)
 */
function ensure_i18n_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    try {
        db()->exec(
            'CREATE TABLE IF NOT EXISTS content_i18n (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                entity_type VARCHAR(64) NOT NULL,
                entity_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
                field VARCHAR(128) NOT NULL,
                lang VARCHAR(8) NOT NULL,
                text LONGTEXT NOT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY uniq_entity_field_lang (entity_type, entity_id, field, lang),
                KEY idx_entity_lang (entity_type, entity_id, lang)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
    } catch (Throwable $e) {
        // If DB user doesn't have permissions, ignore. API will just not translate.
    }
}

function i18n_get_map(string $entityType, array $entityIds, string $lang): array
{
    ensure_i18n_schema();
    $lang = trim($lang);
    if ($lang === '' || $lang === 'ar' || $entityIds === []) {
        return [];
    }

    $placeholders = implode(',', array_fill(0, count($entityIds), '?'));
    $sql = "SELECT entity_id, field, text FROM content_i18n WHERE entity_type = ? AND lang = ? AND entity_id IN ($placeholders)";
    $stmt = db()->prepare($sql);
    $stmt->execute(array_merge([$entityType, $lang], array_values($entityIds)));
    $rows = $stmt->fetchAll();

    $map = [];
    foreach ($rows as $row) {
        $id = (string) ($row['entity_id'] ?? '0');
        $field = (string) ($row['field'] ?? '');
        if ($field === '') continue;
        $map[$id][$field] = (string) ($row['text'] ?? '');
    }
    return $map;
}

function i18n_apply_row(string $entityType, array $row, string $lang, array $skipFields = []): array
{
    if ($lang === '' || $lang === 'ar') {
        return $row;
    }

    $id = (string) ((int) ($row['id'] ?? 0));
    if ($id === '0') {
        return $row;
    }

    $map = i18n_get_map($entityType, [(int) $id], $lang);
    $translations = $map[$id] ?? [];
    if ($translations === []) {
        return $row;
    }

    foreach ($row as $key => $value) {
        if (in_array($key, $skipFields, true)) {
            continue;
        }
        if (!is_string($value)) {
            continue;
        }
        if (isset($translations[$key]) && $translations[$key] !== '') {
            $row[$key] = $translations[$key];
        }
    }

    return $row;
}

/* ─────────────────────────────────────────────────────────────
 * Public API envelopes (Machafi Services `/api/public/*`)
 * ─────────────────────────────────────────────────────────── */

function api_envelope_ok(mixed $data = null, int $http = 200): never
{
    json_response(['ok' => true, 'data' => $data], $http);
}

/**
 * @param array<int, array<string, mixed>> $items
 * @param array{page:int,per_page:int,total:int,total_pages?:int} $pagination
 */
function api_envelope_list(array $items, array $pagination = []): never
{
    json_response(['ok' => true, 'data' => ['items' => $items, 'pagination' => $pagination]]);
}

function api_envelope_error(string $code, string $message, int $http = 400): never
{
    json_response([
        'ok' => false,
        'error' => ['code' => $code, 'message' => $message],
    ], $http);
}

/**
 * @return array{limit: int, offset: int, page: int}
 */
function request_pagination(int $defaultLimit = 50, int $maxLimit = 100): array
{
    $limit = (int) ($_GET['limit'] ?? $defaultLimit);
    $page = max(1, (int) ($_GET['page'] ?? 1));
    if ($limit < 1) {
        $limit = $defaultLimit;
    }
    if ($limit > $maxLimit) {
        $limit = $maxLimit;
    }
    $offset = ($page - 1) * $limit;

    return ['limit' => $limit, 'offset' => $offset, 'page' => $page];
}

function csrf_issue_token(): string
{
    $token = bin2hex(random_bytes(16));
    $_SESSION['csrf_token'] = $token;

    return $token;
}

function csrf_require_valid(): void
{
    $header = trim((string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? ''));
    $sessionToken = (string) ($_SESSION['csrf_token'] ?? '');
    if ($sessionToken === '' || $header === '' || !hash_equals($sessionToken, $header)) {
        api_envelope_error('csrf', 'CSRF token missing or invalid.', 419);
    }
}

/** Admin session + CSRF header (X-CSRF-Token) for mutating requests. */
function require_admin_write(): array
{
    $admin = require_admin();
    csrf_require_valid();

    return $admin;
}

function require_role(string ...$roles): void
{
    $admin = get_admin_session();
    if ($admin === null) {
        api_envelope_error('auth', 'Authentication required.', 401);
    }
    $role = (string) ($admin['role'] ?? '');
    if ($roles !== [] && !in_array($role, $roles, true)) {
        api_envelope_error('forbidden', 'Insufficient permissions.', 403);
    }
}

/** Content editors + super-admins (see PROJECT-EXPLAINER/HEALTH_SERVICES_ADMIN_RBAC.md). */
function require_editor_or_admin(): void
{
    require_role('admin', 'editor');
}

/** Site configuration and privileged data (users, intents, raw settings writes). */
function require_super_admin(): void
{
    require_role('admin');
}
