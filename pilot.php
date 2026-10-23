<?php
define('STAMPZER_APP', true);
require __DIR__ . '/api/db.php';
require __DIR__ . '/api/mail.php';
header('Content-Type: application/json');
header('X-Robots-Tag: noindex');

function pilot_reply($code, array $body) {
    http_response_code($code);
    echo json_encode($body);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    pilot_reply(405, ['ok' => false, 'error' => 'method']);
}

// Alleen aanmeldingen vanaf onze eigen pagina. Browsers sturen bij een POST altijd een Origin mee;
// scripts die dit adres rechtstreeks bestoken meestal niet.
$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
if (!in_array($origin, ['https://stampzer.com', 'https://www.stampzer.com'], true)) {
    pilot_reply(403, ['ok' => false, 'error' => 'origin']);
}

// Het formulier stuurt een klein JSON-bericht; al het andere weigeren we.
$type = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
if (strpos($type, 'application/json') !== 0) {
    pilot_reply(415, ['ok' => false, 'error' => 'type']);
}
$raw = file_get_contents('php://input', false, null, 0, 4097);
if ($raw === false || strlen($raw) > 4096) {
    pilot_reply(413, ['ok' => false, 'error' => 'size']);
}
$data = json_decode($raw, true);
if (!is_array($data)) {
    pilot_reply(400, ['ok' => false, 'error' => 'json']);
}

// Honeypot: een veld dat mensen niet zien en bots wel invullen. We doen alsof het gelukt is.
if (trim((string)($data['website'] ?? '')) !== '') {
    pilot_reply(200, ['ok' => true]);
}

$email    = trim((string)($data['email'] ?? ''));
$business = substr(trim((string)($data['business'] ?? '')), 0, 255);
$branche  = substr(trim((string)($data['branche'] ?? '')), 0, 100);
$page     = substr(trim((string)($data['page'] ?? '')), 0, 255);

if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    pilot_reply(422, ['ok' => false, 'error' => 'invalid_email']);
}

try {
    $pdo = db();

    // Rem op volspammen: hetzelfde adres telt één keer per dag, en meer dan 20 aanmeldingen in een
    // uur is geen echt verkeer. Zo loopt de database niet vol en blijft onze inbox bruikbaar.
    $dup = $pdo->prepare("SELECT COUNT(*) AS c FROM pilots WHERE email = ? AND created_at > (NOW() - INTERVAL 1 DAY)");
    $dup->execute([$email]);
    if ((int)$dup->fetch()['c'] > 0) {
        pilot_reply(200, ['ok' => true]);
    }
    $recent = (int)$pdo->query("SELECT COUNT(*) AS c FROM pilots WHERE created_at > (NOW() - INTERVAL 1 HOUR)")->fetch()['c'];
    if ($recent >= 20) {
        pilot_reply(429, ['ok' => false, 'error' => 'busy']);
    }

    $stmt = $pdo->prepare("INSERT INTO pilots (email, business, branche, page, user_agent) VALUES (?, ?, ?, ?, ?)");
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
