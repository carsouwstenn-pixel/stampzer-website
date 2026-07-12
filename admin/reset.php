<?php
// One-time admin reset. Guarded by a secret key stored in api/config.php
// (which is gitignored, so the key is never in the public repo).
// Remove this file after use.
define('STAMPZER_APP', true);
require __DIR__ . '/../api/db.php';
require __DIR__ . '/auth.php';

$cfg   = require __DIR__ . '/../api/config.php';
$key   = (string)($cfg['reset_key'] ?? '');
$given = (string)($_GET['key'] ?? $_POST['key'] ?? '');

// Require a configured, non-empty key and an exact, timing-safe match.
if ($key === '' || !hash_equals($key, $given)) {
    http_response_code(403);
    exit('Forbidden');
}

$done = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    db()->exec("DELETE FROM admin_users");
    $_SESSION = [];
    $done = true;
}
$count = admin_count();
?><!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Beheerder resetten — Stampzer dashboard</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/admin/admin.css" />
</head>
<body>
  <div class="adm-auth">
    <div class="adm-auth__card">
      <img class="adm-auth__logo" src="/assets/logo-dark.png" alt="stampzer.com" width="150" height="54" />
      <?php if ($done): ?>
        <h1>Gelukt — account gewist</h1>
        <p>Je oude beheerder is verwijderd. Maak nu een nieuw account aan voor het dashboard.</p>
        <a class="btn btn--green" href="/admin/setup.php" style="width:100%;margin-top:6px">Nieuw account aanmaken →</a>
      <?php else: ?>
        <h1>Beheerder resetten</h1>
        <p>Hiermee verwijder je het huidige dashboard-account (<?= $count ?> beheerder<?= $count === 1 ? '' : 's' ?>), zodat je een nieuw account kunt aanmaken. Je leads, pilots en instellingen blijven gewoon staan.</p>
        <form method="post">
          <input type="hidden" name="key" value="<?= adm_h($given) ?>" />
          <button class="btn btn--green" type="submit" style="width:100%">Ja, wis het oude account</button>
        </form>
        <p style="margin-top:14px"><a href="/admin/login.php" style="color:var(--muted)">Toch inloggen met bestaand wachtwoord →</a></p>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>
