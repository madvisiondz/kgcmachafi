<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function books_upload_root(): string
{
    return dirname(__DIR__, 2) . '/uploads/books';
}

function ensure_directory(string $path): void
{
    if (!is_dir($path) && !mkdir($path, 0775, true) && !is_dir($path)) {
        json_response(['message' => 'تعذر إنشاء مجلد الرفع.'], 500);
    }
}

function sanitize_upload_name(string $originalName): string
{
    $extension = strtolower((string) pathinfo($originalName, PATHINFO_EXTENSION));
    $baseName = pathinfo($originalName, PATHINFO_FILENAME);
    $baseName = preg_replace('/[^a-zA-Z0-9_-]+/', '-', $baseName ?? '');
    $baseName = trim((string) $baseName, '-');

    if ($baseName === '') {
        $baseName = 'file';
    }

    return $baseName . '-' . bin2hex(random_bytes(6)) . ($extension !== '' ? '.' . $extension : '');
}

function public_upload_path(string $type, string $filename): string
{
    return '/uploads/books/' . $type . '/' . $filename;
}

function filesystem_upload_path(string $type, string $filename): string
{
    return books_upload_root() . '/' . $type . '/' . $filename;
}

function upload_file(array $file, string $type, array $allowedExtensions, string $message): string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        json_response(['message' => $message], 422);
    }

    $filename = sanitize_upload_name((string) ($file['name'] ?? ''));
    $extension = strtolower((string) pathinfo($filename, PATHINFO_EXTENSION));

    if (!in_array($extension, $allowedExtensions, true)) {
      json_response(['message' => $message], 422);
    }

    ensure_directory(books_upload_root() . '/' . $type);

    $targetPath = filesystem_upload_path($type, $filename);

    if (!move_uploaded_file((string) $file['tmp_name'], $targetPath)) {
        json_response(['message' => 'تعذر حفظ الملف المرفوع.'], 500);
    }

    return public_upload_path($type, $filename);
}

function remove_local_book_file(?string $publicPath): void
{
    if (!$publicPath || !str_starts_with($publicPath, '/uploads/books/')) {
        return;
    }

    $absolutePath = dirname(__DIR__, 2) . $publicPath;
    if (is_file($absolutePath)) {
        @unlink($absolutePath);
    }
}

function generate_cover_from_pdf(string $pdfPublicPath): ?string
{
    $convertBinary = trim((string) shell_exec('command -v convert'));
    if ($convertBinary === '') {
        return null;
    }

    $pdfAbsolutePath = dirname(__DIR__, 2) . $pdfPublicPath;
    if (!is_file($pdfAbsolutePath)) {
        return null;
    }

    ensure_directory(books_upload_root() . '/covers');

    $coverFilename = sanitize_upload_name(pathinfo($pdfAbsolutePath, PATHINFO_FILENAME) . '.jpg');
    $coverAbsolutePath = filesystem_upload_path('covers', $coverFilename);
    $coverPublicPath = public_upload_path('covers', $coverFilename);

    $command = sprintf(
        '%s -density 150 %s[0] -background white -alpha remove -alpha off -flatten -resize 600x900 %s 2>/dev/null',
        escapeshellarg($convertBinary),
        escapeshellarg($pdfAbsolutePath),
        escapeshellarg($coverAbsolutePath)
    );

    exec($command, $output, $exitCode);

    if ($exitCode !== 0 || !is_file($coverAbsolutePath)) {
        return null;
    }

    return $coverPublicPath;
}

function request_payload(): array
{
    if (str_starts_with((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'multipart/form-data')) {
        return $_POST;
    }

    return read_json_input();
}

if ($method === 'GET') {
    require_admin();

    $statement = db()->query('SELECT * FROM books ORDER BY created_at DESC');
    json_response(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = request_payload();
    $overrideMethod = strtoupper(trim((string) ($payload['_method'] ?? '')));
    $isUpdate = $id > 0 && $overrideMethod === 'PUT';

    $title = trim((string) ($payload['title'] ?? ''));
    $author = trim((string) ($payload['author'] ?? ''));
    $category = trim((string) ($payload['category'] ?? ''));
    $bookType = trim((string) ($payload['book_type'] ?? 'standard'));
    $filePath = trim((string) ($payload['file_path'] ?? ''));
    $imageUrl = trim((string) ($payload['image_url'] ?? ''));
    $pages = (int) ($payload['pages'] ?? 0);
    $rating = (float) ($payload['rating'] ?? 0);

    if ($title === '' || $author === '') {
        json_response(['message' => 'عنوان الكتاب والمؤلف مطلوبان.'], 422);
    }

    if (!in_array($bookType, ['ebook', 'standard'], true)) {
        $bookType = 'standard';
    }

    if (isset($_FILES['pdf_file']) && ($_FILES['pdf_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
        $filePath = upload_file($_FILES['pdf_file'], 'pdfs', ['pdf'], 'يجب رفع ملف PDF صالح.');
    }

    if (isset($_FILES['cover_file']) && ($_FILES['cover_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
        $imageUrl = upload_file($_FILES['cover_file'], 'covers', ['jpg', 'jpeg', 'png', 'webp'], 'يجب رفع صورة غلاف صالحة.');
    } elseif ($imageUrl === '' && $filePath !== '') {
        $generatedCover = generate_cover_from_pdf($filePath);
        if ($generatedCover !== null) {
            $imageUrl = $generatedCover;
        }
    }

    if (!$isUpdate) {
        $statement = db()->prepare(
            'INSERT INTO books (title, author, category, book_type, file_path, image_url, pages, rating)
             VALUES (:title, :author, :category, :book_type, :file_path, :image_url, :pages, :rating)'
        );
        $statement->execute([
            'title' => $title,
            'author' => $author,
            'category' => $category,
            'book_type' => $bookType,
            'file_path' => $filePath !== '' ? $filePath : '#',
            'image_url' => $imageUrl !== '' ? $imageUrl : null,
            'pages' => $pages > 0 ? $pages : null,
            'rating' => $rating > 0 ? $rating : 0,
        ]);

        $newId = (int) db()->lastInsertId();
        $fetchStatement = db()->prepare('SELECT * FROM books WHERE id = :id');
        $fetchStatement->execute(['id' => $newId]);

        json_response([
            'message' => 'تمت إضافة الكتاب.',
            'item' => $fetchStatement->fetch(),
        ], 201);
    }

    $fetchCurrent = db()->prepare('SELECT * FROM books WHERE id = :id');
    $fetchCurrent->execute(['id' => $id]);
    $currentBook = $fetchCurrent->fetch();

    if (!$currentBook) {
        json_response(['message' => 'الكتاب غير موجود.'], 404);
    }

    if (
        isset($_FILES['pdf_file']) &&
        ($_FILES['pdf_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE &&
        ($currentBook['file_path'] ?? '') !== $filePath
    ) {
        remove_local_book_file($currentBook['file_path'] ?? null);
    }

    if (
        isset($_FILES['cover_file']) &&
        ($_FILES['cover_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE &&
        ($currentBook['image_url'] ?? '') !== $imageUrl
    ) {
        remove_local_book_file($currentBook['image_url'] ?? null);
    }

    $statement = db()->prepare(
        'UPDATE books
         SET title = :title,
             author = :author,
             category = :category,
             book_type = :book_type,
             file_path = :file_path,
             image_url = :image_url,
             pages = :pages,
             rating = :rating
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'title' => $title,
        'author' => $author,
        'category' => $category,
        'book_type' => $bookType,
        'file_path' => $filePath !== '' ? $filePath : '#',
        'image_url' => $imageUrl !== '' ? $imageUrl : null,
        'pages' => $pages > 0 ? $pages : null,
        'rating' => $rating > 0 ? $rating : 0,
    ]);

    $fetchStatement = db()->prepare('SELECT * FROM books WHERE id = :id');
    $fetchStatement->execute(['id' => $id]);

    json_response([
        'message' => 'تم تحديث الكتاب.',
        'item' => $fetchStatement->fetch(),
    ]);
}

if ($method === 'PUT') {
    require_admin();
    json_response(['message' => 'استخدم الرفع عبر النموذج لإرسال الملفات.'], 405);
}

if ($method === 'DELETE') {
    require_admin();
    $id = (int) ($_GET['id'] ?? 0);

    if ($id <= 0) {
        json_response(['message' => 'معرّف الكتاب غير صالح.'], 422);
    }

    $fetchStatement = db()->prepare('SELECT * FROM books WHERE id = :id');
    $fetchStatement->execute(['id' => $id]);
    $book = $fetchStatement->fetch();

    $statement = db()->prepare('DELETE FROM books WHERE id = :id');
    $statement->execute(['id' => $id]);

    if ($book) {
        remove_local_book_file($book['file_path'] ?? null);
        remove_local_book_file($book['image_url'] ?? null);
    }

    json_response(['message' => 'تم حذف الكتاب.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);
