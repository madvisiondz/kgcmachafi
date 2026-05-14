<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();

    $statement = db()->query('SELECT * FROM news_articles ORDER BY date DESC, created_at DESC');
    json_response(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin_write();
    $payload = read_json_input();

    $title = trim((string) ($payload['title'] ?? ''));
    $description = trim((string) ($payload['description'] ?? ''));
    $content = trim((string) ($payload['content'] ?? ''));
    $tag = trim((string) ($payload['tag'] ?? 'وطني'));
    $source = trim((string) ($payload['source'] ?? 'محلي'));
    $date = trim((string) ($payload['date'] ?? ''));
    $isArchived = normalize_flag($payload['is_archived'] ?? false);

    if ($title === '' || $description === '' || $date === '') {
        json_response(['message' => 'العنوان والوصف والتاريخ حقول مطلوبة.'], 422);
    }

    $statement = db()->prepare(
        'INSERT INTO news_articles (title, description, content, tag, source, date, is_archived)
         VALUES (:title, :description, :content, :tag, :source, :date, :is_archived)'
    );
    $statement->execute([
        'title' => $title,
        'description' => $description,
        'content' => $content !== '' ? $content : null,
        'tag' => $tag !== '' ? $tag : 'وطني',
        'source' => $source !== '' ? $source : 'محلي',
        'date' => $date,
        'is_archived' => $isArchived,
    ]);

    $id = (int) db()->lastInsertId();
    $fetchStatement = db()->prepare('SELECT * FROM news_articles WHERE id = :id');
    $fetchStatement->execute(['id' => $id]);

    json_response([
        'message' => 'تمت إضافة الخبر.',
        'item' => $fetchStatement->fetch(),
    ], 201);
}

if ($method === 'PUT') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = read_json_input();

    if ($id <= 0) {
        json_response(['message' => 'معرّف الخبر غير صالح.'], 422);
    }

    $title = trim((string) ($payload['title'] ?? ''));
    $description = trim((string) ($payload['description'] ?? ''));
    $content = trim((string) ($payload['content'] ?? ''));
    $tag = trim((string) ($payload['tag'] ?? 'وطني'));
    $source = trim((string) ($payload['source'] ?? 'محلي'));
    $date = trim((string) ($payload['date'] ?? ''));
    $isArchived = normalize_flag($payload['is_archived'] ?? false);

    if ($title === '' || $description === '' || $date === '') {
        json_response(['message' => 'العنوان والوصف والتاريخ حقول مطلوبة.'], 422);
    }

    $statement = db()->prepare(
        'UPDATE news_articles
         SET title = :title,
             description = :description,
             content = :content,
             tag = :tag,
             source = :source,
             date = :date,
             is_archived = :is_archived
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'title' => $title,
        'description' => $description,
        'content' => $content !== '' ? $content : null,
        'tag' => $tag !== '' ? $tag : 'وطني',
        'source' => $source !== '' ? $source : 'محلي',
        'date' => $date,
        'is_archived' => $isArchived,
    ]);

    $fetchStatement = db()->prepare('SELECT * FROM news_articles WHERE id = :id');
    $fetchStatement->execute(['id' => $id]);

    json_response([
        'message' => 'تم تحديث الخبر.',
        'item' => $fetchStatement->fetch(),
    ]);
}

if ($method === 'DELETE') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);

    if ($id <= 0) {
        json_response(['message' => 'معرّف الخبر غير صالح.'], 422);
    }

    $statement = db()->prepare('DELETE FROM news_articles WHERE id = :id');
    $statement->execute(['id' => $id]);

    json_response(['message' => 'تم حذف الخبر.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);
