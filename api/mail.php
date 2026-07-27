<?php
if (!defined('STAMPZER_APP')) { http_response_code(403); exit('Forbidden'); }

/**
 * Stuurt een notificatie-mail (platte tekst) naar het Stampzer-adres.
 * Faalt stil: de aanmelding zelf mag hier nooit op stuklopen.
 *
 * @param string   $subject   Onderwerp (mag UTF-8 bevatten).
 * @param string[] $lines     Regels van de body.
 * @param string   $reply_to  Optioneel: e-mail van de aanmelder (Reply-To).
 * @return bool
 */
function notify_signup($subject, array $lines, $reply_to = '') {
    try {
        $cfg  = require __DIR__ . '/config.php';
        $to   = isset($cfg['notify_email']) ? trim((string)$cfg['notify_email']) : '';
        $from = isset($cfg['notify_from']) ? trim((string)$cfg['notify_from']) : $to;
        if (!$to || !function_exists('mail')) { return false; }

        $body = implode("\r\n", $lines) . "\r\n";

        $headers  = 'From: Stampzer <' . $from . ">\r\n";
        if ($reply_to !== '' && filter_var($reply_to, FILTER_VALIDATE_EMAIL)) {
            $headers .= 'Reply-To: ' . $reply_to . "\r\n";
        }
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: 8bit\r\n";
        $headers .= "X-Mailer: Stampzer\r\n";

        // RFC 2047 voor niet-ASCII in het onderwerp.
        $subj = '=?UTF-8?B?' . base64_encode($subject) . '?=';

        return @mail($to, $subj, $body, $headers, '-f' . $from);
    } catch (Throwable $e) {
        return false;
    }
}
