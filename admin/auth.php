<?php
if (!defined('STAMPZER_APP')) { http_response_code(403); exit('Forbidden'); }

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'secure' => true]);
    session_start();
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
