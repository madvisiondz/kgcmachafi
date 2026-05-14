<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

allow_methods(['GET']);
require_admin();

function count_table(string $table): int
{
    $n = db()->query('SELECT COUNT(*) AS c FROM ' . $table)->fetch();
    return (int) ($n['c'] ?? 0);
}

$counts = [
    'news' => count_table('news_articles'),
    'pharmacies' => count_table('pharmacies'),
    'hospitals' => count_table('hospitals'),
    'international_hospitals' => count_table('international_hospitals'),
    'ambulances' => count_table('ambulances'),
    'accommodations' => count_table('patient_accommodations'),
    'consultation_bookings' => count_table('consultation_bookings'),
    'donation_intents' => count_table('donation_intents'),
];

$recentContacts = db()
    ->query('SELECT id, name, email, subject, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 8')
    ->fetchAll();

api_envelope_ok([
    'counts' => $counts,
    'recent_contacts' => $recentContacts,
]);
