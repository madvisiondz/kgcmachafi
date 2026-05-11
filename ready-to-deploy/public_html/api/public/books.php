<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$statement = db()->query('SELECT * FROM books ORDER BY created_at DESC');

json_response(['items' => $statement->fetchAll()]);
