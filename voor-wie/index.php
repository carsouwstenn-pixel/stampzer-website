<?php
$ALL = require __DIR__ . '/../niche/data.php';
$order = ['kapper', 'koffiebar', 'nagelstudio', 'lunchroom', 'sportschool'];

function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function hub_icon($name) {
    $i = [
        'coffee' => '<path d="M4 8h11v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M15 9h2.4a2.4 2.4 0 0 1 0 4.8H15"/><path d="M7 3.4v1.6M11 3.4v1.6"/>',
        'scissors' => '<circle cx="6" cy="6.4" r="2.3"/><circle cx="6" cy="17.6" r="2.3"/><path d="M8 8l11.5 8M8 16L19.5 8"/>',
        'cutlery' => '<path d="M6 3v6a2 2 0 0 0 4 0V3"/><path d="M8 11v10"/><path d="M16 3c-1.2 1.2-1.8 3-1.8 5.2 0 1.7.8 3 1.8 3s1.8-1.3 1.8-3c0-2.2-.6-4-1.8-5.2z"/><path d="M16 11.2V21"/>',
        'dumbbell' => '<path d="M6.5 7.5v9M3.5 9.5v5M17.5 7.5v9M20.5 9.5v5M6.5 12h11"/>',
    ];
    if ($name === 'flower') return '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6.6" r="2.7"/><circle cx="17.4" cy="10.5" r="2.7"/><circle cx="15.3" cy="16.9" r="2.7"/><circle cx="8.7" cy="16.9" r="2.7"/><circle cx="6.6" cy="10.5" r="2.7"/></svg>';
    $p = $i[$name] ?? $i['coffee'];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' . $p . '</svg>';
}
?><!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Voor wie is stampzer? Digitale klantenkaarten per branche | Stampzer</title>
  <meta name="description" content="Stampzer maakt digitale klantenkaarten voor lokale ondernemers. Bekijk de pagina voor jouw branche — kappers, koffiebars, nagelstudio's, lunchrooms, sportscholen en meer." />
  <link rel="canonical" href="https://stampzer.com/voor-wie/" />
  <meta name="theme-color" content="#181f10" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://stampzer.com/voor-wie/" />
  <meta property="og:title" content="Voor wie is stampzer? Digitale klantenkaarten per branche" />
  <meta property="og:description" content="Bekijk de stampzer-pagina voor jouw branche en zie wat een digitale klantenkaart voor je zaak doet." />
  <meta property="og:image" content="https://stampzer.com/assets/og-image.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/seatren.woff2" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <a class="skip-link" href="#main">Naar inhoud</a>
  <header class="nav" id="nav">
    <div class="container nav__inner">
      <a class="nav__logo" href="/" aria-label="stampzer.com home"><img src="/assets/logo-dark.png" alt="stampzer.com" width="150" height="54" /></a>
      <nav class="nav__links" aria-label="Menu"><a href="/#hoe-het-werkt">Hoe het werkt</a><a href="/#kaarten">Voorbeelden</a><a href="/dashboard.html">Dashboard</a></nav>
      <a href="/#wachtlijst" class="btn btn--green nav__cta">Op de wachtlijst <span class="btn__arrow" aria-hidden="true">→</span></a>
    </div>
  </header>

  <main id="main">
    <section class="section">
      <div class="container">
        <div class="section__head" style="text-align:center;max-width:720px;margin:0 auto 52px">
          <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Voor wie</span>
          <h2>Een digitale klantenkaart voor jouw branche</h2>
          <p class="section__lead" style="margin-left:auto;margin-right:auto">Stampzer werkt voor elke zaak met vaste klanten. Kies je branche en zie precies wat een digitale spaarkaart voor jou doet.</p>
        </div>
        <div class="hub-grid">
          <?php foreach ($order as $slug): $x = $ALL[$slug]; ?>
          <a class="hubcard" href="/<?= e($slug) ?>/">
            <span class="hubcard__ic"><?= hub_icon($x['hubIcon']) ?></span>
            <strong>Voor <?= e(strtolower($x['name'])) ?>s</strong>
            <span class="hubcard__tag"><?= e($x['hubTagline']) ?></span>
            <span class="hubcard__go">Bekijk pagina <span aria-hidden="true">→</span></span>
          </a>
          <?php endforeach; ?>
          <div class="hubcard hubcard--soon">
            <span class="hubcard__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span>
            <strong>Jouw branche</strong>
            <span class="hubcard__tag">Bakker, bloemist, wasstraat of iets anders? Stampzer werkt voor elke zaak met vaste klanten.</span>
            <a class="hubcard__go" href="/#wachtlijst">Op de wachtlijst <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand"><img src="/assets/logo-cream.png" alt="stampzer.com" width="150" height="54" /><p>Digitale klantenkaarten in de Wallet van je klant. Meer terugkerende klanten, zonder app.</p></div>
      <nav class="footer__col" aria-label="Product"><h4>Product</h4><a href="/#hoe-het-werkt">Hoe het werkt</a><a href="/#kaarten">Voorbeelden</a><a href="/dashboard.html">Dashboard</a><a href="/#wachtlijst">Wachtlijst</a></nav>
      <nav class="footer__col" aria-label="Voor wie"><h4>Voor wie</h4><a href="/kapper/">Kappers</a><a href="/koffiebar/">Koffiebars</a><a href="/nagelstudio/">Nagelstudio's</a><a href="/sportschool/">Sportscholen</a></nav>
      <div class="footer__col"><h4>Blijf op de hoogte</h4><a href="mailto:hallo@stampzer.com">hallo@stampzer.com</a><a href="/#wachtlijst" class="btn btn--green footer__cta">Op de wachtlijst <span class="btn__arrow" aria-hidden="true">→</span></a></div>
    </div>
    <div class="container footer__bottom"><span>© 2026 stampzer.com — Alle rechten voorbehouden.</span><span>Gemaakt in Nederland 🇳🇱</span></div>
  </footer>
  <script src="/config.js"></script>
  <script src="/motion.js"></script>
</body>
</html>
