<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    allow_methods(['POST']);
    $payload = read_json_input();
    $hp = trim((string) ($payload['fax'] ?? ''));
    if ($hp !== '') {
        api_envelope_error('spam', 'Rejected.', 400);
    }
    $doctorId = (int) ($payload['doctor_id'] ?? 0);
    $patientName = trim((string) ($payload['patient_name'] ?? ''));
    $patientPhone = trim((string) ($payload['patient_phone'] ?? ''));
    $preferredDate = trim((string) ($payload['preferred_date'] ?? ''));
    $notes = trim((string) ($payload['notes'] ?? ''));
    if ($doctorId <= 0 || $patientName === '' || $patientPhone === '') {
        api_envelope_error('validation', 'Missing required fields.', 422);
    }
    $chk = db()->prepare('SELECT id FROM consultation_doctors WHERE id = :id AND is_active = 1 LIMIT 1');
    $chk->execute(['id' => $doctorId]);
    if (!$chk->fetch()) {
        api_envelope_error('validation', 'Unknown doctor.', 422);
    }
    $dateVal = null;
    if ($preferredDate !== '') {
        $dt = DateTime::createFromFormat('Y-m-d', $preferredDate);
        if ($dt && $dt->format('Y-m-d') === $preferredDate) {
            $dateVal = $preferredDate;
        }
    }
    $stmt = db()->prepare(
        'INSERT INTO consultation_bookings (doctor_id, patient_name, patient_phone, preferred_date, notes, status)
         VALUES (:did, :pn, :pp, :pd, :no, \'pending\')'
    );
    $stmt->execute([
        'did' => $doctorId,
        'pn' => $patientName,
        'pp' => $patientPhone,
        'pd' => $dateVal,
        'no' => $notes !== '' ? $notes : null,
    ]);
    api_envelope_ok(['id' => (int) db()->lastInsertId(), 'received' => true]);
}

if ($method === 'GET') {
    allow_methods(['GET']);
    $lang = trim((string) ($_GET['lang'] ?? 'ar'));
    if (!in_array($lang, ['ar', 'fr', 'en'], true)) {
        $lang = 'ar';
    }

    $specialties = db()->query(
        'SELECT s.*, COUNT(d.id) AS doctors_count
         FROM consultation_specialties s
         LEFT JOIN consultation_doctors d ON d.specialty_id = s.id AND d.is_active = 1
         WHERE s.is_active = 1
         GROUP BY s.id
         ORDER BY s.sort_order ASC, s.id ASC'
    )->fetchAll();

    $doctors = db()->query(
        'SELECT d.*, s.specialty_key, s.name AS specialty_name
         FROM consultation_doctors d
         JOIN consultation_specialties s ON s.id = d.specialty_id
         WHERE d.is_active = 1 AND s.is_active = 1
         ORDER BY s.sort_order ASC, d.sort_order ASC, d.id ASC'
    )->fetchAll();

    if ($lang !== 'ar') {
        $specIds = array_map(static fn ($r) => (int) $r['id'], $specialties);
        $specMap = i18n_get_map('consultation_specialties', $specIds, $lang);
        foreach ($specialties as &$row) {
            $id = (string) ((int) ($row['id'] ?? 0));
            if (isset($specMap[$id]['name']) && $specMap[$id]['name'] !== '') {
                $row['name'] = $specMap[$id]['name'];
            }
        }
        unset($row);

        $doctorIds = array_map(static fn ($r) => (int) $r['id'], $doctors);
        $doctorMap = i18n_get_map('consultation_doctors', $doctorIds, $lang);
        foreach ($doctors as &$row) {
            $id = (string) ((int) ($row['id'] ?? 0));
            $tr = $doctorMap[$id] ?? [];
            foreach (['name', 'hospital', 'specialty_name', 'clinic_name'] as $f) {
                if (isset($tr[$f]) && $tr[$f] !== '') {
                    $row[$f] = $tr[$f];
                }
            }
        }
        unset($row);
    }

    api_envelope_ok([
        'specialties' => $specialties,
        'doctors' => $doctors,
        'lang' => $lang,
    ]);
}

api_envelope_error('method_not_allowed', 'Use GET or POST.', 405);
