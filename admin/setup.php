<?php
define('STAMPZER_APP', true);
require __DIR__ . '/../api/db.php';
require __DIR__ . '/auth.php';

$exists = admin_count() > 0;
$err = '';
if (!$exists && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim((string)($_POST['email'] ?? ''));
    $pass  = (string)($_POST['password'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 8) {
        $err = 'Vul een geldig e-mailadres en een wachtwoord van minstens 8 tekens in.';
    } else {
        $stmt = db()->prepare("INSERT INTO admin_users (email, password_hash) VALUES (?, ?)");
        $stmt->execute([$email, password_hash($pass, PASSWORD_DEFAULT)]);
        session_regenerate_id(true);
        $_SESSION['admin_id'] = db()->lastInsertId();
        header('Location: /admin/');
        exit;
    }
}
?><!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Account aanmaken — Stampzer dashboard</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/admin/admin.css" />
</head>
<body>
  <div class="adm-auth">
    <div class="adm-auth__card">
      <img class="adm-auth__logo" src="/assets/logo-dark.png" alt="stampzer.com" width="150" height="54" />
      <?php if ($exists): ?>
        <h1>Al ingesteld</h1>
        <p>Er is al een beheerder. <a href="/admin/login.php" style="color:var(--green-700);font-weight:600">Ga naar inloggen →</a></p>
      <?php else: ?>
        <h1>Maak je beheerder aan</h1>
        <p>Dit is eenmalig — kies je eigen inloggegevens voor het dashboard.</p>
        <?php if ($err): ?><div class="adm-auth__err"><?= adm_h($err) ?></div><?php endif; ?>
        <form method="post" novalidate>
          <div class="field"><label for="email">E-mail</label><input type="email" id="email" name="email" required autocomplete="username" /></div>
          <div class="field"><label for="password">Wachtwoord (min. 8 tekens)</label><input type="password" id="password" name="password" required minlength="8" autocomplete="new-password" /></div>
          <button class="btn btn--green" type="submit" style="width:100%">Account aanmaken &amp; inloggen</button>
        </form>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>
