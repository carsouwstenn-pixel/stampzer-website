<?php
$ALL = require __DIR__ . '/../niche/data.php';
$order = ['kapper', 'koffiebar', 'nagelstudio', 'lunchroom', 'sportschool', 'bakker', 'restaurant'];

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
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/seatren.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-400-latin.woff2" crossorigin />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <a class="skip-link" href="#main">Naar inhoud</a>
  <header class="nav" id="nav">
    <div class="container nav__inner">
      <a class="nav__logo" href="/" aria-label="Stampzer, naar de homepage"><img src="/assets/logo-dark.png" alt="Stampzer" width="150" height="54" /></a>
      <nav class="nav__links" id="nav-menu" aria-label="Hoofdmenu">
        <a href="/hoe-het-werkt/">Hoe het werkt</a>
        <a href="/voor-wie/" aria-current="page">Voor wie</a>
        <a href="/gids/">Gids</a>
        <a href="/prijzen/">Prijzen</a>
        <a class="nav__menu-login" href="https://app.stampzer.com">Inloggen</a>
      </nav>
      <div class="nav__actions">
        <a class="nav__login" href="https://app.stampzer.com">Inloggen</a>
        <a class="btn btn--green nav__cta" href="https://app.stampzer.com/registreren">Start gratis <span class="btn__arrow" aria-hidden="true">&rarr;</span></a>
        <button class="nav__burger" type="button" aria-label="Menu openen" aria-controls="nav-menu" aria-expanded="false">
          <svg class="nav__icon-open" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          <svg class="nav__icon-close" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
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
            <a class="hubcard__go" href="https://app.stampzer.com/registreren">Start gratis <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="/" aria-label="Stampzer, naar de homepage"><img src="/assets/logo-cream.png" alt="Stampzer" width="150" height="54" loading="lazy" /></a>
          <p>Digitale klantenkaarten in de Wallet van je klant. Meer terugkerende klanten, zonder app.</p>
          <a class="footer__mail" href="mailto:hello@stampzer.com">hello@stampzer.com</a>
        </div>
        <nav class="footer__col" aria-label="Product">
          <h2 class="footer__h">Product</h2>
          <a href="/hoe-het-werkt/">Hoe het werkt</a>
          <a href="/digitale-stempelkaart/">Digitale stempelkaart</a>
          <a href="/apple-wallet-spaarkaart/">Apple Wallet</a>
          <a href="/google-wallet-klantenkaart/">Google Wallet</a>
          <a href="/spaarkaart-zonder-app/">Zonder app</a>
          <a href="/prijzen/">Prijzen</a>
        </nav>
        <nav class="footer__col" aria-label="Voor wie">
          <h2 class="footer__h">Voor wie</h2>
          <a href="/voor-wie/">Alle branches</a>
          <a href="/koffiebar/">Koffiebars</a>
          <a href="/lunchroom/">Lunchrooms</a>
          <a href="/restaurant/">Restaurants</a>
          <a href="/bakker/">Bakkers</a>
          <a href="/kapper/">Kappers</a>
          <a href="/nagelstudio/">Nagelstudio's</a>
          <a href="/sportschool/">Sportscholen</a>
        </nav>
        <nav class="footer__col" aria-label="Stampzer">
          <h2 class="footer__h">Stampzer</h2>
          <a href="/gids/">Gids</a>
          <a href="/over-ons/">Over ons</a>
          <a href="/contact/">Contact</a>
          <a href="/privacy/">Privacy</a>
          <a href="/voorwaarden/">Voorwaarden</a>
          <a href="https://app.stampzer.com">Inloggen</a>
        </nav>
      </div>
      <div class="footer__bottom">
        <span>&copy; 2026 Stampzer</span>
        <span>Ontworpen door <a href="https://studioclear.nl" target="_blank" rel="noopener">Studio Clear</a></span>
        <span>Gemaakt in Nederland</span>
        <button class="footer__cookies" type="button" data-cookie-settings>Cookie-instellingen</button>
      </div>
    </div>
  </footer>
  <script src="/config.js"></script>
  <script src="/site.js"></script>
  <script src="/motion.js"></script>
</body>
</html>
