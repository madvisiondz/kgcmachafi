<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    require_editor_or_admin();
    $rows = db()->query('SELECT * FROM donation_campaigns ORDER BY sort_order ASC')->fetchAll();
    api_envelope_ok(['items' => $rows]);
}

if ($method === 'POST') {
    require_admin_write();
    require_editor_or_admin();
    $p = read_json_input();
    $id = trim((string) ($p['id'] ?? ''));
    if ($id === '') {
        api_envelope_error('validation', 'id required.', 422);
    }
    $stmt = db()->prepare(
        'INSERT INTO donation_campaigns (id, title_json, description_json, raised_eur, goal_eur, donors, theme, sort_order, is_active)
         VALUES (:id, :title_json, :description_json, :raised, :goal, :donors, :theme, :sort, :active)
         ON DUPLICATE KEY UPDATE title_json = VALUES(title_json), description_json = VALUES(description_json),
            raised_eur = VALUES(raised_eur), goal_eur = VALUES(goal_eur), donors = VALUES(donors), theme = VALUES(theme),
            sort_order = VALUES(sort_order), is_active = VALUES(is_active)'
    );
    $stmt->execute([
        'id' => $id,
        'title_json' => json_encode($p['title'] ?? $p['title_json'] ?? [], JSON_UNESCAPED_UNICODE),
        'description_json' => json_encode($p['description'] ?? $p['description_json'] ?? [], JSON_UNESCAPED_UNICODE),
        'raised' => (float) ($p['raised_eur'] ?? 0),
        'goal' => max(1.0, (float) ($p['goal_eur'] ?? 1)),
        'donors' => max(0, (int) ($p['donors'] ?? 0)),
        'theme' => trim((string) ($p['theme'] ?? 'emerald')) ?: 'emerald',
        'sort' => (int) ($p['sort_order'] ?? 0),
        'active' => normalize_flag($p['is_active'] ?? true),
    ]);
    $f = db()->prepare('SELECT * FROM donation_campaigns WHERE id = :id');
    $f->execute(['id' => $id]);
    api_envelope_ok(['item' => $f->fetch()]);
}

if ($method === 'DELETE') {
    require_admin_write();
    require_editor_or_admin();
    $id = trim((string) ($_GET['id'] ?? ''));
    if ($id === '') {
        api_envelope_error('validation', 'id required.', 422);
    }
    db()->prepare('DELETE FROM donation_campaigns WHERE id = :id')->execute(['id' => $id]);
    api_envelope_ok(['deleted' => true]);
}

api_envelope_error('method_not_allowed', 'Method not allowed.', 405);
