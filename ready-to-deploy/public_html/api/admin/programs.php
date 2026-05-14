<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function programs_upload_root(): string
{
    return dirname(__DIR__, 2) . '/uploads/programs';
}

function public_program_upload_path(string $type, string $filename): string
{
    return '/uploads/programs/' . $type . '/' . $filename;
}

function filesystem_program_upload_path(string $type, string $filename): string
{
    return programs_upload_root() . '/' . $type . '/' . $filename;
}

function ensure_programs_directory(string $path): void
{
    if (!is_dir($path) && !mkdir($path, 0775, true) && !is_dir($path)) {
        json_response(['message' => 'تعذر إنشاء مجلد الرفع.'], 500);
    }
}

function sanitize_program_filename(string $originalName, string $fallbackBase = 'file'): string
{
    $extension = strtolower((string) pathinfo($originalName, PATHINFO_EXTENSION));
    $baseName = pathinfo($originalName, PATHINFO_FILENAME);
    $baseName = preg_replace('/[^a-zA-Z0-9_-]+/', '-', $baseName ?? '');
    $baseName = trim((string) $baseName, '-');

    if ($baseName === '') {
        $baseName = $fallbackBase;
    }

    return $baseName . '-' . bin2hex(random_bytes(6)) . ($extension !== '' ? '.' . $extension : '');
}

function upload_program_file(array $file, string $type, array $allowedExtensions, string $message, string $fallbackBase): string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        json_response(['message' => $message], 422);
    }

    $filename = sanitize_program_filename((string) ($file['name'] ?? ''), $fallbackBase);
    $extension = strtolower((string) pathinfo($filename, PATHINFO_EXTENSION));

    if (!in_array($extension, $allowedExtensions, true)) {
        json_response(['message' => $message], 422);
    }

    $targetDir = programs_upload_root() . '/' . $type;
    ensure_programs_directory($targetDir);
    $targetPath = filesystem_program_upload_path($type, $filename);

    if (!move_uploaded_file((string) $file['tmp_name'], $targetPath)) {
        json_response(['message' => 'تعذر حفظ الملف المرفوع.'], 500);
    }

    return public_program_upload_path($type, $filename);
}

function upload_program_video(array $file): string
{
    return upload_program_file($file, 'videos', ['mp4', 'webm', 'mov', 'm4v'], 'يجب رفع ملف فيديو صالح.', 'video');
}

function upload_program_image(array $file): string
{
    return upload_program_file($file, 'covers', ['jpg', 'jpeg', 'png', 'webp'], 'يجب رفع صورة برنامج صالحة.', 'cover');
}

function remove_program_asset(?string $publicPath): void
{
    if (!$publicPath || !str_starts_with($publicPath, '/uploads/programs/')) {
        return;
    }

    $absolutePath = dirname(__DIR__, 2) . $publicPath;
    if (is_file($absolutePath)) {
        @unlink($absolutePath);
    }
}

function programs_payload(): array
{
    if (str_starts_with((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'multipart/form-data')) {
        return $_POST;
    }

    return read_json_input();
}

if ($method === 'GET') {
    require_admin();

    $statement = db()->query('SELECT * FROM programs ORDER BY time_slot ASC, created_at DESC');
    json_response(['items' => $statement->fetchAll()]);
}

if ($method === 'POST') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);
    $payload = programs_payload();
    $overrideMethod = strtoupper(trim((string) ($payload['_method'] ?? '')));
    $isUpdate = $id > 0 && $overrideMethod === 'PUT';

    $title = trim((string) ($payload['title'] ?? ''));
    $timeSlot = trim((string) ($payload['time_slot'] ?? ''));
    $dayType = trim((string) ($payload['day_type'] ?? 'daily'));
    $category = trim((string) ($payload['category'] ?? 'general'));
    $description = trim((string) ($payload['description'] ?? ''));
    $videoUrl = trim((string) ($payload['video_url'] ?? ''));
    $imageUrl = trim((string) ($payload['image_url'] ?? ''));
    $videoDurationSeconds = (int) ($payload['video_duration_seconds'] ?? 0);
    $videoDurationLabel = trim((string) ($payload['video_duration_label'] ?? ''));
    $daysOfWeek = trim((string) ($payload['days_of_week'] ?? ''));

    if ($title === '' || $timeSlot === '') {
        json_response(['message' => 'اسم البرنامج والتوقيت مطلوبان.'], 422);
    }

    if (isset($_FILES['video_file']) && ($_FILES['video_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
        $videoUrl = upload_program_video($_FILES['video_file']);
    }

    if (isset($_FILES['image_file']) && ($_FILES['image_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
        $imageUrl = upload_program_image($_FILES['image_file']);
    }

    if ($videoUrl === '') {
        $videoDurationSeconds = 0;
        $videoDurationLabel = '';
    }

    $normalizedDays = array_values(array_unique(array_filter(array_map(
        static fn ($value) => trim((string) $value),
        explode(',', $daysOfWeek)
    ), static fn ($value) => $value !== '')));
    $serializedDays = implode(',', $normalizedDays);
    $primaryDay = $normalizedDays !== [] ? (int) $normalizedDays[0] : null;

    if (!$isUpdate) {
        $statement = db()->prepare(
            'INSERT INTO programs (title, time_slot, day_of_week, days_of_week, day_type, category, description, video_url, image_url, video_duration_seconds, video_duration_label)
             VALUES (:title, :time_slot, :day_of_week, :days_of_week, :day_type, :category, :description, :video_url, :image_url, :video_duration_seconds, :video_duration_label)'
        );
        $statement->execute([
            'title' => $title,
            'time_slot' => $timeSlot,
            'day_of_week' => $primaryDay,
            'days_of_week' => $serializedDays !== '' ? $serializedDays : null,
            'day_type' => $dayType !== '' ? $dayType : 'daily',
            'category' => $category !== '' ? $category : 'general',
            'description' => $description !== '' ? $description : null,
            'video_url' => $videoUrl !== '' ? $videoUrl : null,
            'image_url' => $imageUrl !== '' ? $imageUrl : null,
            'video_duration_seconds' => $videoDurationSeconds > 0 ? $videoDurationSeconds : null,
            'video_duration_label' => $videoDurationLabel !== '' ? $videoDurationLabel : null,
        ]);

        $newId = (int) db()->lastInsertId();
        $fetchStatement = db()->prepare('SELECT * FROM programs WHERE id = :id');
        $fetchStatement->execute(['id' => $newId]);

        json_response([
            'message' => 'تمت إضافة البرنامج.',
            'item' => $fetchStatement->fetch(),
        ], 201);
    }

    $fetchCurrent = db()->prepare('SELECT * FROM programs WHERE id = :id');
    $fetchCurrent->execute(['id' => $id]);
    $currentProgram = $fetchCurrent->fetch();

    if (!$currentProgram) {
        json_response(['message' => 'البرنامج غير موجود.'], 404);
    }

    if (
        isset($_FILES['video_file']) &&
        ($_FILES['video_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE &&
        ($currentProgram['video_url'] ?? '') !== $videoUrl
    ) {
        remove_program_asset($currentProgram['video_url'] ?? null);
    }

    if (
        isset($_FILES['image_file']) &&
        ($_FILES['image_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE &&
        ($currentProgram['image_url'] ?? '') !== $imageUrl
    ) {
        remove_program_asset($currentProgram['image_url'] ?? null);
    }

    $statement = db()->prepare(
        'UPDATE programs
         SET title = :title,
             time_slot = :time_slot,
             day_of_week = :day_of_week,
             days_of_week = :days_of_week,
             day_type = :day_type,
             category = :category,
             description = :description,
             video_url = :video_url,
             image_url = :image_url,
             video_duration_seconds = :video_duration_seconds,
             video_duration_label = :video_duration_label
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $id,
        'title' => $title,
        'time_slot' => $timeSlot,
        'day_of_week' => $primaryDay,
        'days_of_week' => $serializedDays !== '' ? $serializedDays : null,
        'day_type' => $dayType !== '' ? $dayType : 'daily',
        'category' => $category !== '' ? $category : 'general',
        'description' => $description !== '' ? $description : null,
        'video_url' => $videoUrl !== '' ? $videoUrl : null,
        'image_url' => $imageUrl !== '' ? $imageUrl : null,
        'video_duration_seconds' => $videoDurationSeconds > 0 ? $videoDurationSeconds : null,
        'video_duration_label' => $videoDurationLabel !== '' ? $videoDurationLabel : null,
    ]);

    $fetchStatement = db()->prepare('SELECT * FROM programs WHERE id = :id');
    $fetchStatement->execute(['id' => $id]);

    json_response([
        'message' => 'تم تحديث البرنامج.',
        'item' => $fetchStatement->fetch(),
    ]);
}

if ($method === 'PUT') {
    require_admin_write();
    json_response(['message' => 'استخدم النموذج لرفع الفيديو وتحديث البرنامج.'], 405);
}

if ($method === 'DELETE') {
    require_admin_write();
    $id = (int) ($_GET['id'] ?? 0);

    if ($id <= 0) {
        json_response(['message' => 'معرّف البرنامج غير صالح.'], 422);
    }

    $fetchStatement = db()->prepare('SELECT * FROM programs WHERE id = :id');
    $fetchStatement->execute(['id' => $id]);
    $program = $fetchStatement->fetch();

    $statement = db()->prepare('DELETE FROM programs WHERE id = :id');
    $statement->execute(['id' => $id]);

    if ($program) {
        remove_program_asset($program['video_url'] ?? null);
        remove_program_asset($program['image_url'] ?? null);
    }

    json_response(['message' => 'تم حذف البرنامج.']);
}

json_response(['message' => 'الطريقة غير مدعومة.'], 405);
