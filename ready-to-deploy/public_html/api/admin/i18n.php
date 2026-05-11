<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    ensure_i18n_schema();

    $entityType = trim((string) ($_GET['entity_type'] ?? ''));
    $entityId = (int) ($_GET['entity_id'] ?? 0);
    $lang = trim((string) ($_GET['lang'] ?? ''));

    if ($entityType === '' || $entityId < 0 || $lang === '') {
        json_response(['message' => 'بيانات الطلب غير صالحة.'], 422);
    }

    $stmt = db()->prepare('SELECT field, text FROM content_i18n WHERE entity_type = :t AND entity_id = :id AND lang = :lang');
    $stmt->execute(['t' => $entityType, 'id' => $entityId, 'lang' => $lang]);
    $fields = [];
    foreach ($stmt->fetchAll() as $row) {
        $fields[(string) $row['field']] = (string) $row['text'];
    }

    json_response(['fields' => $fields]);
}

if ($method === 'PUT') {
    require_admin();
    ensure_i18n_schema();

    $payload = read_json_input();
    $entityType = trim((string) ($payload['entity_type'] ?? ''));
    $entityId = (int) ($payload['entity_id'] ?? 0);
    $lang = trim((string) ($payload['lang'] ?? ''));
    $fields = $payload['fields'] ?? null;

    if ($entityType === '' || $entityId < 0 || $lang === '' || !is_array($fields)) {
        json_response(['message' => 'بيانات الطلب غير صالحة.'], 422);
    }

    $stmt = db()->prepare(
        'INSERT INTO content_i18n (entity_type, entity_id, field, lang, text)
         VALUES (:t, :id, :field, :lang, :text)
         ON DUPLICATE KEY UPDATE text = VALUES(text)'
    );

    $count = 0;
    foreach ($fields as $field => $text) {
        $field = trim((string) $field);
        if ($field === '') continue;
        $stmt->execute([
            't' => $entityType,
            'id' => $entityId,
            'field' => $field,
            'lang' => $lang,
            'text' => (string) $text,
        ]);
        $count += 1;
    }

    json_response(['message' => 'تم حفظ الترجمات.', 'saved' => $count]);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);

