<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();
    require_super_admin();

    $query = trim((string) ($_GET['q'] ?? ''));
    $limit = (int) ($_GET['limit'] ?? 200);
    $limit = max(1, min($limit, 500));

    if ($query !== '') {
        $like = '%' . $query . '%';
        $statement = db()->prepare(
            'SELECT id, email, full_name, phone, wilaya_id, commune, role, is_active, created_at
             FROM public_users
             WHERE email LIKE :q OR full_name LIKE :q OR phone LIKE :q
             ORDER BY created_at DESC
             LIMIT ' . $limit
        );
        $statement->execute(['q' => $like]);
    } else {
        $statement = db()->prepare(
            'SELECT id, email, full_name, phone, wilaya_id, commune, role, is_active, created_at
             FROM public_users
             ORDER BY created_at DESC
             LIMIT ' . $limit
        );
        $statement->execute();
    }

    api_envelope_ok(['items' => $statement->fetchAll()]);
}

if ($method === 'PUT') {
    require_admin_write();
    require_super_admin();

    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        api_envelope_error('validation', 'معرّف المستخدم غير صالح.', 422);
    }

    $payload = read_json_input();
    $role = trim((string) ($payload['role'] ?? ''));

    // Allowed roles for public users in this feature.
    $allowedRoles = ['member', 'editor', 'moderator'];
    if (!in_array($role, $allowedRoles, true)) {
        api_envelope_error('validation', 'الدور غير صالح.', 422);
    }

    $update = db()->prepare('UPDATE public_users SET role = :role WHERE id = :id');
    $update->execute(['role' => $role, 'id' => $id]);

    $fetch = db()->prepare(
        'SELECT id, email, full_name, phone, wilaya_id, commune, role, is_active, created_at
         FROM public_users
         WHERE id = :id
         LIMIT 1'
    );
    $fetch->execute(['id' => $id]);

    api_envelope_ok([
        'message' => 'تم تحديث دور المستخدم.',
        'user' => $fetch->fetch(),
    ]);
}

api_envelope_error('method_not_allowed', 'الطريقة غير مدعومة.', 405);

