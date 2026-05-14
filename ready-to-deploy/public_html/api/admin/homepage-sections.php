<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    $rows = db()->query('SELECT * FROM homepage_sections ORDER BY sort_order ASC')->fetchAll();
    json_response(['items' => $rows]);
}

if ($method === 'POST') {
    require_admin_write();
    $p = read_json_input();
    $stmt = db()->prepare(
        'INSERT INTO homepage_sections (section_key, title, subtitle, payload_json, sort_order, is_active)
         VALUES (:k, :t, :st, :pj, :so, :ac)'
    );
    $stmt->execute([
        'k' => trim((string) ($p['section_key'] ?? '')),
        't' => trim((string) ($p['title'] ?? '')),
        'st' => trim((string) ($p['subtitle'] ?? '')) ?: null,
        'pj' => json_encode($p['payload'] ?? $p['payload_json'] ?? new stdClass(), JSON_UNESCAPED_UNICODE),
        'so' => (int) ($p['sort_order'] ?? 0),
        'ac' => normalize_flag($p['is_active'] ?? true),
    ]);
    $id = (int) db()->lastInsertId();
    $f = db()->prepare('SELECT * FROM homepage_sections WHERE id = :id');
    $f->execute(['id' => $id]);
    json_response(['item' => $f->fetch()], 201);
}

if ($method === 'PUT') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_response(['message' => 'Invalid id.'], 422);
    }
    $p = read_json_input();
    $stmt = db()->prepare(
        'UPDATE homepage_sections SET section_key = :k, title = :t, subtitle = :st, payload_json = :pj, sort_order = :so, is_active = :ac WHERE id = :id'
    );
    $stmt->execute([
        'id' => $id,
        'k' => trim((string) ($p['section_key'] ?? '')),
        't' => trim((string) ($p['title'] ?? '')),
        'st' => trim((string) ($p['subtitle'] ?? '')) ?: null,
        'pj' => json_encode($p['payload'] ?? $p['payload_json'] ?? new stdClass(), JSON_UNESCAPED_UNICODE),
        'so' => (int) ($p['sort_order'] ?? 0),
        'ac' => normalize_flag($p['is_active'] ?? true),
    ]);
    $f = db()->prepare('SELECT * FROM homepage_sections WHERE id = :id');
    $f->execute(['id' => $id]);
    json_response(['item' => $f->fetch()]);
}

if ($method === 'DELETE') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    db()->prepare('DELETE FROM homepage_sections WHERE id = :id')->execute(['id' => $id]);
    json_response(['message' => 'Deleted.']);
}

json_response(['message' => 'Method not allowed.'], 405);
