<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    $limit = max(1, min(500, (int) ($_GET['limit'] ?? 200)));
    $stmt = db()->prepare('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT :lim');
    $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
    $stmt->execute();
    api_envelope_ok(['items' => $stmt->fetchAll()]);
}

if ($method === 'PATCH') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        api_envelope_error('validation', 'Invalid id.', 422);
    }
    $payload = read_json_input();
    $isRead = normalize_flag($payload['is_read'] ?? false);
    try {
        $stmt = db()->prepare('UPDATE contact_messages SET is_read = :r WHERE id = :id');
        $stmt->execute(['r' => $isRead, 'id' => $id]);
    } catch (Throwable $e) {
        api_envelope_error('schema', 'Run database/health_services_admin_optional.sql to add is_read column.', 500);
    }
    $f = db()->prepare('SELECT * FROM contact_messages WHERE id = :id');
    $f->execute(['id' => $id]);
    api_envelope_ok(['item' => $f->fetch()]);
}

if ($method === 'DELETE') {
    require_admin_write();
    require_role('admin');
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        api_envelope_error('validation', 'Invalid id.', 422);
    }
    db()->prepare('DELETE FROM contact_messages WHERE id = :id')->execute(['id' => $id]);
    api_envelope_ok(['deleted' => true]);
}

api_envelope_error('method_not_allowed', 'Method not allowed.', 405);
