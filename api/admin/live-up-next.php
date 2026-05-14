<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    $rows = db()->query('SELECT * FROM live_up_next ORDER BY sort_order ASC, id ASC')->fetchAll();
    api_envelope_ok(['items' => $rows]);
}

if ($method === 'POST') {
    require_admin_write();
    $p = read_json_input();
    $id = trim((string) ($p['id'] ?? ''));
    if ($id === '') {
        api_envelope_error('validation', 'id is required.', 422);
    }
    $stmt = db()->prepare(
        'INSERT INTO live_up_next (id, program_key, start_time, sort_order)
         VALUES (:id, :pk, :st, :so)
         ON DUPLICATE KEY UPDATE program_key = VALUES(program_key), start_time = VALUES(start_time), sort_order = VALUES(sort_order)'
    );
    $stmt->execute([
        'id' => $id,
        'pk' => trim((string) ($p['program_key'] ?? '')),
        'st' => trim((string) ($p['start_time'] ?? '09:00')),
        'so' => (int) ($p['sort_order'] ?? 0),
    ]);
    $f = db()->prepare('SELECT * FROM live_up_next WHERE id = :id');
    $f->execute(['id' => $id]);
    api_envelope_ok(['item' => $f->fetch()]);
}

if ($method === 'DELETE') {
    require_admin_write();
    $id = trim((string) ($_GET['id'] ?? ''));
    if ($id === '') {
        api_envelope_error('validation', 'Invalid id.', 422);
    }
    db()->prepare('DELETE FROM live_up_next WHERE id = :id')->execute(['id' => $id]);
    api_envelope_ok(['deleted' => true]);
}

api_envelope_error('method_not_allowed', 'Method not allowed.', 405);
