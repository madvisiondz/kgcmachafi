<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    allow_methods(['POST']);
    $payload = read_json_input();

    $hp = trim((string) ($payload['company'] ?? ''));
    if ($hp !== '') {
        api_envelope_error('spam', 'Rejected.', 400);
    }

    $name = trim((string) ($payload['name'] ?? ''));
    $email = trim((string) ($payload['email'] ?? ''));
    $phone = trim((string) ($payload['phone'] ?? ''));
    $subject = trim((string) ($payload['subject'] ?? ''));
    $message = trim((string) ($payload['message'] ?? ''));

    if ($name === '' || $email === '' || $subject === '' || $message === '') {
        api_envelope_error('validation', 'Missing required fields.', 422);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        api_envelope_error('validation', 'Invalid email.', 422);
    }

    if (strlen($message) > 8000) {
        api_envelope_error('validation', 'Message too long.', 422);
    }

    $stmt = db()->prepare(
        'INSERT INTO contact_messages (name, email, phone, subject, message, honeypot)
         VALUES (:name, :email, :phone, :subject, :message, NULL)'
    );
    $stmt->execute([
        'name' => $name,
        'email' => $email,
        'phone' => $phone !== '' ? $phone : null,
        'subject' => $subject,
        'message' => $message,
    ]);

    api_envelope_ok(['id' => (int) db()->lastInsertId(), 'received' => true]);
}

api_envelope_error('method_not_allowed', 'Use POST.', 405);
