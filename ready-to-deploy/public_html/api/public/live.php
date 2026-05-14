<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$stmt = db()->query('SELECT * FROM live_page_settings WHERE id = 1 LIMIT 1');
$settings = $stmt->fetch() ?: [
    'stream_url' => '',
    'poster_url' => '/home/hero.jpg',
    'viewer_count_label' => '0',
    'broadcast_state' => 'offline',
];

$rec = db()->query('SELECT * FROM live_recorded_items ORDER BY sort_order ASC, id ASC')->fetchAll();
$up = db()->query('SELECT * FROM live_up_next ORDER BY sort_order ASC, id ASC')->fetchAll();

api_envelope_ok([
    'player' => $settings,
    'recorded' => $rec,
    'up_next' => $up,
]);
