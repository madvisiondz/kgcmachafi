<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

allow_methods(['POST']);
require_admin_write();
require_editor_or_admin();

const HSVC_MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const HSVC_MAX_PDF_BYTES = 15 * 1024 * 1024;

$allowedCategories = [
    'news',
    'hospitals',
    'international-hospitals',
    'accommodations',
    'services',
    'programs',
    'live',
    'homepage',
    'donations',
    'books',
    'general',
];

$kind = strtolower(trim((string) ($_POST['kind'] ?? 'image')));
$category = strtolower(trim((string) ($_POST['category'] ?? 'general')));
$category = preg_replace('/[^a-z0-9-]+/', '', $category) ?? 'general';

if ($category === '' || !in_array($category, $allowedCategories, true)) {
    api_envelope_error('validation', 'Invalid upload category.', 422);
}

if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
    api_envelope_error('validation', 'No file uploaded.', 422);
}

$file = $_FILES['file'];
$error = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);

if ($error === UPLOAD_ERR_NO_FILE) {
    api_envelope_error('validation', 'No file uploaded.', 422);
}

if ($error !== UPLOAD_ERR_OK) {
    api_envelope_error('validation', 'Upload failed. Try a smaller file.', 422);
}

$tmp = (string) ($file['tmp_name'] ?? '');
$original = (string) ($file['name'] ?? 'file');
$size = (int) ($file['size'] ?? 0);

if ($tmp === '' || !is_uploaded_file($tmp)) {
    api_envelope_error('validation', 'Invalid upload.', 422);
}

$extension = strtolower((string) pathinfo($original, PATHINFO_EXTENSION));
$extension = preg_replace('/[^a-z0-9]+/', '', $extension) ?? '';

$imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
$pdfExtensions = ['pdf'];

if ($kind === 'pdf') {
    if (!in_array($extension, $pdfExtensions, true)) {
        api_envelope_error('validation', 'Only PDF files are allowed.', 422);
    }
    if ($size > HSVC_MAX_PDF_BYTES) {
        api_envelope_error('validation', 'PDF exceeds maximum size (15 MB).', 422);
    }
    $subdir = 'documents';
    $allowedMime = ['application/pdf'];
} else {
    $kind = 'image';
    if (!in_array($extension, $imageExtensions, true)) {
        api_envelope_error('validation', 'Only JPG, PNG, or WebP images are allowed.', 422);
    }
    if ($size > HSVC_MAX_IMAGE_BYTES) {
        api_envelope_error('validation', 'Image exceeds maximum size (5 MB).', 422);
    }
    $subdir = 'images';
    $allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$detected = $finfo->file($tmp) ?: '';

if ($detected !== '' && !in_array($detected, $allowedMime, true)) {
    api_envelope_error('validation', 'File type is not allowed.', 422);
}

$baseName = pathinfo($original, PATHINFO_FILENAME);
$baseName = preg_replace('/[^a-zA-Z0-9_-]+/', '-', (string) $baseName);
$baseName = trim((string) $baseName, '-');
if ($baseName === '') {
    $baseName = 'file';
}

$filename = $baseName . '-' . bin2hex(random_bytes(6)) . '.' . $extension;

$root = dirname(__DIR__, 2) . '/uploads/healthservices';
$targetDir = $root . '/' . $category . '/' . $subdir;

if (!is_dir($targetDir) && !mkdir($targetDir, 0775, true) && !is_dir($targetDir)) {
    api_envelope_error('server', 'Could not create upload folder.', 500);
}

$targetPath = $targetDir . '/' . $filename;

if (!move_uploaded_file($tmp, $targetPath)) {
    api_envelope_error('server', 'Could not save uploaded file.', 500);
}

@chmod($targetPath, 0644);

$publicPath = '/uploads/healthservices/' . $category . '/' . $subdir . '/' . $filename;

api_envelope_ok([
    'url' => $publicPath,
    'path' => $publicPath,
    'filename' => $filename,
    'kind' => $kind,
    'category' => $category,
]);
