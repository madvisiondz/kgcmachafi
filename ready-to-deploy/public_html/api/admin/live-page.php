<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    $row = db()->query('SELECT * FROM live_page_settings WHERE id = 1')->fetch();
    json_response(['item' => $row]);
}

if ($method === 'PUT') {
    require_admin_write();
    $p = read_json_input();
    $stmt = db()->prepare(
        'INSERT INTO live_page_settings (id, stream_url, poster_url, viewer_count_label, broadcast_state)
         VALUES (1, :su, :pu, :vc, :bs)
         ON DUPLICATE KEY UPDATE stream_url = VALUES(stream_url), poster_url = VALUES(poster_url),
            viewer_count_label = VALUES(viewer_count_label), broadcast_state = VALUES(broadcast_state)'
    );
    $bs = trim((string) ($p['broadcast_state'] ?? 'offline'));
    if (!in_array($bs, ['live', 'offline'], true)) {
        $bs = 'offline';
    }
    $stmt->execute([
        'su' => trim((string) ($p['stream_url'] ?? '')),
        'pu' => trim((string) ($p['poster_url'] ?? '/home/hero.jpg')),
        'vc' => trim((string) ($p['viewer_count_label'] ?? '0')),
        'bs' => $bs,
    ]);
    $row = db()->query('SELECT * FROM live_page_settings WHERE id = 1')->fetch();
    json_response(['message' => 'Saved.', 'item' => $row]);
}

json_response(['message' => 'Method not allowed.'], 405);
