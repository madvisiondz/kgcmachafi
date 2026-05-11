<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$statement = db()->query('SELECT * FROM programs ORDER BY day_of_week ASC, time_slot ASC, created_at DESC');

json_response(['items' => $statement->fetchAll()]);
