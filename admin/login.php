<?php
define('STAMPZER_APP', true);
require __DIR__ . '/../api/db.php';
require __DIR__ . '/auth.php';

if (admin_count() === 0) { header('Location: /admin/setup.php'); exit; }
if (admin_logged_in()) { header('Location: /admin/'); exit; }

$err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim((string)($_POST['email'] ?? ''));
    $pass  = (string)($_POST['password'] ?? '');
    $stmt = db()->prepare("SELECT * FROM admin_users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $u = $stmt->fetch();
    if ($u && password_verify($pass, $u['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $u['id'];
        header('Location: /admin/');
        exit;
    }
    $err = 'Onjuiste inloggegevens. Probeer het opnieuw.';
}
?><!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Inloggen — Stampzer dashboard</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/admin/admin.css" />
</head>
<body>
  <div class="adm-auth">
    <div class="adm-auth__card">
      <img class="adm-auth__logo" src="/assets/logo-dark.png" alt="stampzer.com" width="150" height="54" />
      <h1>CEO dashboard</h1>
      <p>Log in om verder te gaan.</p>
      <?php if ($err): ?><div class="adm-auth__err"><?= adm_h($err) ?></div><?php endif; ?>
      <form method="post" novalidate>
        <div class="field"><label for="email">E-mail</label><input type="email" id="email" name="email" required autocomplete="username" /></div>
        <div class="field"><label for="password">Wachtwoord</label><input type="password" id="password" name="password" required autocomplete="current-password" /></div>
        <button class="btn btn--green" type="submit" style="width:100%">Inloggen</button>
      </form>
    </div>
  </div>
</body>
</html>
