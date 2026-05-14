<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    allow_methods(['GET']);

    $stats = db()->query('SELECT * FROM donation_stats WHERE id = 1 LIMIT 1')->fetch() ?: [];
    $campaigns = db()->query(
        'SELECT * FROM donation_campaigns WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    )->fetchAll();

    api_envelope_ok(['stats' => $stats, 'campaigns' => $campaigns]);
}

if ($method === 'POST') {
    allow_methods(['POST']);
    $payload = read_json_input();

    $hp = trim((string) ($payload['website'] ?? ''));
    if ($hp !== '') {
        api_envelope_error('spam', 'Rejected.', 400);
    }

    $campaignId = trim((string) ($payload['campaign_id'] ?? ''));
    $amount = (float) ($payload['amount'] ?? 0);
    $currency = strtoupper(trim((string) ($payload['currency'] ?? 'DZD')));
    $isMonthly = normalize_flag($payload['is_monthly'] ?? false);
    $donorName = trim((string) ($payload['donor_name'] ?? ''));
    $donorEmail = trim((string) ($payload['donor_email'] ?? ''));
    $message = trim((string) ($payload['message'] ?? ''));

    if ($campaignId === '' || $amount < 1 || $amount > 500000) {
        api_envelope_error('validation', 'Invalid campaign or amount.', 422);
    }

    if (!in_array($currency, ['DZD', 'EUR', 'USD'], true)) {
        api_envelope_error('validation', 'Invalid currency.', 422);
    }

    $check = db()->prepare('SELECT id FROM donation_campaigns WHERE id = :id AND is_active = 1 LIMIT 1');
    $check->execute(['id' => $campaignId]);
    if (!$check->fetch()) {
        api_envelope_error('validation', 'Unknown campaign.', 422);
    }

    $stmt = db()->prepare(
        'INSERT INTO donation_intents (campaign_id, amount, currency, donor_name, donor_email, is_monthly, message, honeypot)
         VALUES (:campaign_id, :amount, :currency, :donor_name, :donor_email, :is_monthly, :message, :honeypot)'
    );
    $stmt->execute([
        'campaign_id' => $campaignId,
        'amount' => $amount,
        'currency' => $currency,
        'donor_name' => $donorName !== '' ? $donorName : null,
        'donor_email' => $donorEmail !== '' ? $donorEmail : null,
        'is_monthly' => $isMonthly,
        'message' => $message !== '' ? $message : null,
        'honeypot' => null,
    ]);

    api_envelope_ok(['id' => (int) db()->lastInsertId(), 'received' => true]);
}

api_envelope_error('method_not_allowed', 'Unsupported method.', 405);
