<?php
if (!defined('STAMPZER_APP')) { http_response_code(403); exit('Forbidden'); }

if (session_status() === PHP_SESSION_NONE) {
    // Alleen sessie-id's die de server zelf heeft uitgegeven, alleen via een cookie, en dat cookie
    // gaat alleen mee naar /admin/ (niet naar de rest van de site).
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name('stampzer_admin');
    session_set_cookie_params(['path' => '/admin/', 'httponly' => true, 'samesite' => 'Lax', 'secure' => true]);
    session_start();
}

// Rem op wachtwoord raden: na 10 mislukte pogingen binnen 15 minuten gaat inloggen een kwartier dicht.
function admin_login_locked() {
    return (int) db()->query("SELECT COUNT(*) AS c FROM admin_login_failures WHERE created_at > (NOW() - INTERVAL 15 MINUTE)")->fetch()['c'] >= 10;
}

function admin_login_failed() {
    db()->exec("INSERT INTO admin_login_failures () VALUES ()");
    db()->exec("DELETE FROM admin_login_failures WHERE created_at < (NOW() - INTERVAL 1 DAY)");
}

function admin_logged_in() {
    return !empty($_SESSION['admin_id']);
}

function admin_count() {
    return (int) db()->query("SELECT COUNT(*) AS c FROM admin_users")->fetch()['c'];
}

function require_admin() {
    if (admin_count() === 0) { header('Location: /admin/setup.php'); exit; }
    if (!admin_logged_in()) { header('Location: /admin/login.php'); exit; }
}

function adm_h($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}
