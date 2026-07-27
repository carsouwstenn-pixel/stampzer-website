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

$email = trim((string)($data['email'] ?? ''));
$page  = substr(trim((string)($data['page'] ?? '')), 0, 255);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_email']);
    exit;
}

try {
    $stmt = db()->prepare("INSERT INTO leads (email, page, source, user_agent) VALUES (?, ?, ?, ?)");
    $stmt->execute([$email, $page, 'waitlist', substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255)]);

    notify_signup(
        'Nieuwe wachtlijst-aanmelding: ' . $email,
        [
            'Er is een nieuwe WACHTLIJST-aanmelding op stampzer.com. 🎉',
            '',
            'E-mail:   ' . $email,
            'Pagina:   ' . ($page !== '' ? $page : '-'),
            'Datum:    ' . date('d-m-Y H:i'),
            '',
            'Reageren kan direct op deze mail (gaat naar de aanmelder).',
            'Alle aanmeldingen: https://stampzer.com/admin/',
        ],
        $email
    );

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'server']);
}
