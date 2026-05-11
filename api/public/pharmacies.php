<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$statement = db()->query(
    'SELECT * FROM pharmacies
     WHERE is_active = 1
     ORDER BY is_night_duty DESC, wilaya ASC, commune ASC, name ASC'
);

json_response(['items' => $statement->fetchAll()]);
