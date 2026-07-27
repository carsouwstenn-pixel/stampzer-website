<?php
define('STAMPZER_APP', true);
require __DIR__ . '/api/db.php';
require __DIR__ . '/api/mail.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) { $data = $_POST; }

$email    = trim((string)($data['email'] ?? ''));
$business = substr(trim((string)($data['business'] ?? '')), 0, 255);
$branche  = substr(trim((string)($data['branche'] ?? '')), 0, 100);
$page     = substr(trim((string)($data['page'] ?? '')), 0, 255);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_email']);
    exit;
}

try {
    $stmt = db()->prepare("INSERT INTO pilots (email, business, branche, page, user_agent) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$email, $business, $branche, $page, substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255)]);

    notify_signup(
        'Nieuwe PILOT-aanmelding: ' . ($business !== '' ? $business : $email),
        [
            'Er is een nieuwe PILOT-aanmelding op stampzer.com. 🚀',
            '',
            'Zaak:     ' . ($business !== '' ? $business : '-'),
            'Branche:  ' . ($branche !== '' ? $branche : '-'),
            'E-mail:   ' . $email,
            'Datum:    ' . date('d-m-Y H:i'),
            '',
            'Reageren kan direct op deze mail (gaat naar de aanmelder).',
            'Alle pilot-aanmeldingen: https://stampzer.com/admin/ (tab Pilots)',
        ],
        $email
    );

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'server']);
}
