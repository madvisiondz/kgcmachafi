<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    $limit = max(1, min(200, (int) ($_GET['limit'] ?? 80)));
    $offset = max(0, (int) ($_GET['offset'] ?? 0));
    $q = trim((string) ($_GET['q'] ?? ''));

    $where = '1=1';
    $params = [];
    if ($q !== '') {
        $where .= ' AND (donor_name LIKE :q OR donor_email LIKE :q OR campaign_id LIKE :q OR CAST(id AS CHAR) LIKE :q)';
        $params['q'] = '%' . $q . '%';
    }

    $totalStmt = db()->prepare("SELECT COUNT(*) AS c FROM donation_intents WHERE $where");
    $totalStmt->execute($params);
    $total = (int) ($totalStmt->fetch()['c'] ?? 0);

    $sql = "SELECT * FROM donation_intents WHERE $where ORDER BY created_at DESC LIMIT :lim OFFSET :off";
    $stmt = db()->prepare($sql);
    foreach ($params as $k => $v) {
        $stmt->bindValue(':' . $k, $v);
    }
    $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $items = $stmt->fetchAll();

    api_envelope_ok([
        'items' => $items,
        'pagination' => ['total' => $total, 'limit' => $limit, 'offset' => $offset],
    ]);
}

if ($method === 'PATCH') {
    require_admin_write();
    require_role('admin');
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        api_envelope_error('validation', 'Invalid id.', 422);
    }
    $payload = read_json_input();
    $hasNote = array_key_exists('admin_note', $payload);
    $hasStatus = array_key_exists('status', $payload);
    if (!$hasNote && !$hasStatus) {
        api_envelope_error('validation', 'Send admin_note and/or status.', 422);
    }
    $note = $hasNote ? trim((string) $payload['admin_note']) : null;
    $status = $hasStatus ? trim((string) $payload['status']) : null;
    if ($hasStatus) {
        if ($status === '') {
            api_envelope_error('validation', 'status cannot be empty when provided.', 422);
        }
        $allowed = ['new', 'contacted', 'completed', 'cancelled'];
        if (!in_array($status, $allowed, true)) {
            api_envelope_error('validation', 'Invalid status.', 422);
        }
    }
    $sets = [];
    $params = ['id' => $id];
    if ($hasNote) {
        $sets[] = 'admin_note = :n';
        $params['n'] = $note !== '' ? $note : null;
    }
    if ($hasStatus) {
        $sets[] = 'status = :s';
        $params['s'] = $status;
    }
    $sql = 'UPDATE donation_intents SET ' . implode(', ', $sets) . ' WHERE id = :id';
    try {
        $stmt = db()->prepare($sql);
        $stmt->execute($params);
    } catch (Throwable $e) {
        api_envelope_error(
            'schema',
            'Run database/health_services_admin_optional.sql (admin_note / status columns).',
            500
        );
    }
    $f = db()->prepare('SELECT * FROM donation_intents WHERE id = :id');
    $f->execute(['id' => $id]);
    api_envelope_ok(['item' => $f->fetch()]);
}

api_envelope_error('method_not_allowed', 'Method not allowed.', 405);
