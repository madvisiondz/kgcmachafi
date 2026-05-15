<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    require_editor_or_admin();
    $status = trim((string) ($_GET['status'] ?? ''));
    $params = [];
    $where = '1=1';
    if ($status !== '') {
        $where .= ' AND b.status = :st';
        $params['st'] = $status;
    }
    $sql = "SELECT b.*, d.name AS doctor_name FROM consultation_bookings b JOIN consultation_doctors d ON d.id = b.doctor_id WHERE $where ORDER BY b.created_at DESC LIMIT 500";
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    api_envelope_ok(['items' => $stmt->fetchAll()]);
}

if ($method === 'PATCH') {
    require_admin_write();
    require_editor_or_admin();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        api_envelope_error('validation', 'Invalid id.', 422);
    }
    $payload = read_json_input();
    $status = trim((string) ($payload['status'] ?? ''));
    $allowed = ['pending', 'confirmed', 'cancelled', 'done'];
    if (!in_array($status, $allowed, true)) {
        api_envelope_error('validation', 'Invalid status.', 422);
    }
    $stmt = db()->prepare('UPDATE consultation_bookings SET status = :s WHERE id = :id');
    $stmt->execute(['s' => $status, 'id' => $id]);
    $f = db()->prepare('SELECT * FROM consultation_bookings WHERE id = :id');
    $f->execute(['id' => $id]);
    api_envelope_ok(['item' => $f->fetch(), 'message' => 'Updated.']);
}

if ($method === 'DELETE') {
    require_admin_write();
    require_super_admin();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        api_envelope_error('validation', 'Invalid id.', 422);
    }
    db()->prepare('DELETE FROM consultation_bookings WHERE id = :id')->execute(['id' => $id]);
    api_envelope_ok(['deleted' => true]);
}

api_envelope_error('method_not_allowed', 'Method not allowed.', 405);
