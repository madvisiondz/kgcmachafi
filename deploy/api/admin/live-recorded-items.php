<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    require_editor_or_admin();
    $rows = db()->query('SELECT * FROM live_recorded_items ORDER BY sort_order ASC, id ASC')->fetchAll();
    api_envelope_ok(['items' => $rows]);
}

if ($method === 'POST') {
    require_admin_write();
    require_editor_or_admin();
    $p = read_json_input();
    $id = trim((string) ($p['id'] ?? ''));
    if ($id === '') {
        api_envelope_error('validation', 'id is required (short code, e.g. vod-1).', 422);
    }
    $stmt = db()->prepare(
        'INSERT INTO live_recorded_items (id, program_key, category, duration_min, video_url, sort_order)
         VALUES (:id, :pk, :cat, :dm, :vu, :so)
         ON DUPLICATE KEY UPDATE program_key = VALUES(program_key), category = VALUES(category),
            duration_min = VALUES(duration_min), video_url = VALUES(video_url), sort_order = VALUES(sort_order)'
    );
    $stmt->execute([
        'id' => $id,
        'pk' => trim((string) ($p['program_key'] ?? '')),
        'cat' => trim((string) ($p['category'] ?? 'awareness')),
        'dm' => max(1, (int) ($p['duration_min'] ?? 30)),
        'vu' => trim((string) ($p['video_url'] ?? '')),
        'so' => (int) ($p['sort_order'] ?? 0),
    ]);
    $f = db()->prepare('SELECT * FROM live_recorded_items WHERE id = :id');
    $f->execute(['id' => $id]);
    api_envelope_ok(['item' => $f->fetch()]);
}

if ($method === 'DELETE') {
    require_admin_write();
    require_editor_or_admin();
    $id = trim((string) ($_GET['id'] ?? ''));
    if ($id === '') {
        api_envelope_error('validation', 'Invalid id.', 422);
    }
    db()->prepare('DELETE FROM live_recorded_items WHERE id = :id')->execute(['id' => $id]);
    api_envelope_ok(['deleted' => true]);
}

api_envelope_error('method_not_allowed', 'Method not allowed.', 405);
