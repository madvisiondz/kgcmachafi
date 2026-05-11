<?php
/**
 * Local dev — created by automated setup. DB runs on port 3307 (see .tools/mysql-data).
 * Root password: webapidev (change in production).
 */

return [
    'session_name' => 'kgc_admin_session',
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3307,
        'database' => 'web_app',
        'username' => 'root',
        'password' => 'webapidev',
        'charset' => 'utf8mb4',
    ],
];
