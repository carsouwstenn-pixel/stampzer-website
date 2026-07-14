<?php
// Shared niche landing-page template. A /<slug>/index.php sets $NICHE then requires this.
$ALL = require __DIR__ . '/data.php';
$slug = isset($NICHE) ? $NICHE : '';
if (!isset($ALL[$slug]) || !empty($ALL[$slug]['hubOnly'])) {
    http_response_code(404);
    echo 'Pagina niet gevonden.';
    exit;
}
$n = $ALL[$slug];
$url = "https://stampzer.com/$slug/";

function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

function niche_icon($name) {
    $i = [
        'coffee' => '<path d="M4 8h11v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M15 9h2.4a2.4 2.4 0 0 1 0 4.8H15"/><path d="M7 3.4v1.6M11 3.4v1.6"/>',
        'percent' => '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
        'gift' => '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8C12 5 9 3 7.5 4.5S9 8 12 8zM12 8c0-3 3-5 4.5-3.5S15 8 12 8z"/>',
        'star' => '<path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 17.5 7.1 21.2 8 15.7l-4-3.9 5.5-.8z"/>',
        'scissors' => '<circle cx="6" cy="6.4" r="2.3"/><circle cx="6" cy="17.6" r="2.3"/><path d="M8 8l11.5 8M8 16L19.5 8"/>',
        'cutlery' => '<path d="M6 3v6a2 2 0 0 0 4 0V3"/><path d="M8 11v10"/><path d="M16 3c-1.2 1.2-1.8 3-1.8 5.2 0 1.7.8 3 1.8 3s1.8-1.3 1.8-3c0-2.2-.6-4-1.8-5.2z"/><path d="M16 11.2V21"/>',
        'dumbbell' => '<path d="M6.5 7.5v9M3.5 9.5v5M17.5 7.5v9M20.5 9.5v5M6.5 12h11"/>',
        'bread' => '<path d="M4 12.5C4 9.6 7.2 8 12 8s8 1.6 8 4.5c0 .8-.7 1.5-1.5 1.5h-13C4.7 14 4 13.3 4 12.5Z"/><path d="M5 14v2.5A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5V14"/><path d="m9.5 10.6-.8 1.8M12.4 10.4l-.8 1.8M15.3 10.6l-.8 1.8"/>',
    ];
    if ($name === 'flower') {
        return '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6.6" r="2.7"/><circle cx="17.4" cy="10.5" r="2.7"/><circle cx="15.3" cy="16.9" r="2.7"/><circle cx="8.7" cy="16.9" r="2.7"/><circle cx="6.6" cy="10.5" r="2.7"/></svg>';
    }
    $p = $i[$name] ?? $i['star'];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' . $p . '</svg>';
}

$place = $n['place'];
$visit = $n['visit'];

$steps = [
    ['Ontwerp je kaart', "Stel je spaarkaart samen in de huisstijl van je {$place}: jouw logo, kleuren en de beloning die jij kiest."],
    ["Klant voegt 'm toe", "Na het bezoek scant je klant één QR-code en de kaart staat meteen in z'n Apple of Google Wallet. Geen app, geen gedoe."],
    ["Stempel bij elke {$visit}", "Bij elke {$visit} zet jij of een collega met één tik een stempel. Volle kaart? Tijd voor de beloning — en een goede reden om terug te komen."],
];
$benefits = [
    ['feature--green', 'Meer herhaalbezoek', "Een spaardoel trekt klanten terug naar jouw {$place} — niet die van de concurrent."],
    ['', 'Jouw eigen huisstijl', 'De kaart voelt als die van jouw zaak, met je eigen logo, kleuren en beloning.'],
    ['', 'Ken je vaste klanten', 'Zie wie er vaak komt, wie bijna een beloning heeft en wie al even niet geweest is — simpel klantenbeheer, zonder extra systeem.'],
    ['feature--peach', 'Vul je rustige dagen', 'Stuur klanten een seintje bij een bijna volle kaart en trek ze juist op een stille dag binnen.'],
    ['', 'Niemand speelt vals', 'Alleen jij en je team delen stempels uit — klanten kunnen zichzelf niet stempelen.'],
    ['feature--ink', 'Geen app, nooit kwijt', 'Werkt direct in de Wallet die je klant al heeft. De kaart zit veilig in de telefoon.'],
];

$gidsPosts = [
    ['digitale-klantenkaart-wallet', 'Uitleg · 6 min', 'Digitale klantenkaart in Apple & Google Wallet: hoe werkt het?', 'Wat een digitale klantenkaart is, hoe hij zonder app in de Wallet komt en waarom klanten hem niet meer kwijtraken.'],
    ['papieren-vs-digitale-stempelkaart', 'Vergelijking · 7 min', 'Papieren stempelkaart vs. digitale klantenkaart', 'Kosten, gebruiksgemak, klantinzicht en herhaalbezoek van papier en digitaal, eerlijk naast elkaar in één tabel.'],
    ['klantenbinding-lokale-ondernemers', 'Strategie · 8 min', 'Klantenbinding: 7 manieren die écht werken', 'Zeven concrete manieren om van eenmalige bezoekers vaste klanten te maken — en hoe je meet wat werkt.'],
];

$faqLd = [];
foreach ($n['faq'] as $f) {
    $faqLd[] = ['@type' => 'Question', 'name' => $f[0], 'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f[1]]];
}
$ld = ['@context' => 'https://schema.org', '@graph' => [
    ['@type' => 'Service', 'name' => $n['title'], 'serviceType' => 'Digitale klantenkaart en loyaliteitsprogramma', 'provider' => ['@type' => 'Organization', 'name' => 'Stampzer', 'url' => 'https://stampzer.com/'], 'areaServed' => ['@type' => 'Country', 'name' => 'Nederland'], 'url' => $url, 'description' => $n['desc'], 'offers' => ['@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'EUR', 'description' => 'Gratis tijdens de bèta']],
    ['@type' => 'BreadcrumbList', 'itemListElement' => [
        ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => 'https://stampzer.com/'],
        ['@type' => 'ListItem', 'position' => 2, 'name' => 'Voor wie', 'item' => 'https://stampzer.com/voor-wie/'],
        ['@type' => 'ListItem', 'position' => 3, 'name' => 'Voor ' . $n['name'] . 's', 'item' => $url],
    ]],
    ['@type' => 'FAQPage', 'mainEntity' => $faqLd],
]];
?><!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= e($n['title']) ?></title>
  <meta name="description" content="<?= e($n['desc']) ?>" />
  <link rel="canonical" href="<?= e($url) ?>" />
  <meta name="keywords" content="<?= e($n['keywords']) ?>" />
  <meta name="theme-color" content="#181f10" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="<?= e($url) ?>" />
  <meta property="og:site_name" content="Stampzer" />
  <meta property="og:title" content="<?= e('Digitale klantenkaart voor ' . strtolower($n['name']) . 's — Stampzer') ?>" />
  <meta property="og:description" content="<?= e($n['sub']) ?>" />
  <meta property="og:image" content="https://stampzer.com/assets/og-<?= e($slug) ?>.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="nl_NL" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= e('Digitale klantenkaart voor ' . strtolower($n['name']) . 's — Stampzer') ?>" />
  <meta name="twitter:description" content="<?= e($n['sub']) ?>" />
  <meta name="twitter:image" content="https://stampzer.com/assets/og-<?= e($slug) ?>.png" />

  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="64x64" href="/assets/favicon-64.png" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />

  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/seatren.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-400-latin.woff2" crossorigin />
  <link rel="stylesheet" href="/styles.css" />

  <script type="application/ld+json"><?= json_encode($ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?></script>
</head>
<body>
  <a class="skip-link" href="#main">Naar inhoud</a>

  <div class="announce">
    <div class="container announce__inner">
      <span class="announce__dot" aria-hidden="true"></span>
      Speciaal voor <?= e(strtolower($n['name'])) ?>s — gratis tijdens de bèta. <a href="#wachtlijst">Schrijf je in voor vroege toegang →</a>
    </div>
  </div>

  <header class="nav" id="nav">
    <div class="container nav__inner">
      <a class="nav__logo" href="/" aria-label="stampzer.com home"><img src="/assets/logo-dark.png" alt="stampzer.com" width="150" height="54" /></a>
      <nav class="nav__links" aria-label="Menu">
        <a href="#hoe-het-werkt">Hoe het werkt</a>
        <a href="#voordelen">Voordelen</a>
        <a href="#faq">Vragen</a>
      </nav>
      <a href="#wachtlijst" class="btn btn--green nav__cta">Op de wachtlijst <span class="btn__arrow" aria-hidden="true">→</span></a>
    </div>
  </header>

  <main id="main">

  <section class="hero" id="top">
    <div class="container hero__grid">
      <div class="hero__copy">
        <span class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span> <?= e($n['eyebrow']) ?></span>
        <h1 class="hero__title"><?= e($n['h1a']) ?><span class="mark"><?= e($n['mark']) ?></span><?= e($n['h1b']) ?></h1>
        <p class="hero__sub"><?= e($n['sub']) ?></p>
        <form class="waitlist-form" novalidate>
          <label class="sr-only" for="n-email-hero">E-mailadres</label>
          <input class="waitlist-form__input" type="email" id="n-email-hero" name="email" placeholder="jouw@zaak.nl" required autocomplete="email" />
          <button class="btn btn--green" type="submit">Zet mij op de wachtlijst <span class="btn__arrow" aria-hidden="true">→</span></button>
          <p class="waitlist-form__note" role="status">Gratis tijdens de bèta · iOS &amp; Android · Geen app nodig</p>
        </form>
      </div>
      <div class="hero__visual">
        <div class="blob" aria-hidden="true"></div>
        <div class="phone">
          <div class="phone__screen">
            <div class="wallet-top"><span>Wallet</span><span class="wallet-top__dots">•••</span></div>
            <div class="pass pass--<?= e($n['pass']['theme']) ?>">
              <div class="pass__head">
                <div class="pass__avatar"><?= e(substr($n['pass']['biz'], 0, 1)) ?></div>
                <div class="pass__biz"><strong><?= e($n['pass']['biz']) ?></strong><span><?= e($n['pass']['sub']) ?></span></div>
              </div>
              <div class="pass__reward"><span class="pass__reward-label">Jouw beloning</span><span class="pass__reward-value"><?= e($n['pass']['reward']) ?></span></div>
              <div class="pass__stamps" data-on="<?= (int)$n['pass']['on'] ?>" data-total="<?= (int)$n['pass']['total'] ?>" data-icon="<?= e($n['pass']['icon']) ?>"></div>
              <div class="pass__progress"><?= e($n['pass']['progress']) ?></div>
              <div class="pass__barcode" aria-hidden="true"></div>
              <div class="pass__by"><img src="/assets/stamp-green.png" alt="" width="10" height="20" /> via stampzer</div>
            </div>
          </div>
        </div>
        <div class="float-card float-card--toast" aria-hidden="true"><span class="float-card__check">✓</span><div><strong>Stempel toegevoegd</strong><span><?= e($n['pass']['biz']) ?> · zojuist</span></div></div>
        <div class="float-card float-card--wallet" aria-hidden="true"><span class="float-card__pill">Apple Wallet</span><span class="float-card__pill">Google Wallet</span></div>
      </div>
    </div>
    <div class="container trust">
      <span class="trust__label"><?= e($n['trustLabel']) ?></span>
      <ul class="trust__list"><?php foreach ($n['trust'] as $t): ?><li><?= e($t) ?></li><?php endforeach; ?></ul>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Herken je dit?</span>
        <h2>De uitdaging: klanten die terugkomen</h2>
        <p class="section__lead">Het verschil zit niet in wat je verkoopt, maar in wie er volgende week weer binnenloopt. Dit kost je nu klanten:</p>
      </div>
      <div class="pains">
        <?php foreach ($n['pains'] as $p): ?>
        <article class="feature reveal"><h3><?= e($p[0]) ?></h3><p><?= e($p[1]) ?></p></article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="section section--paper2" id="hoe-het-werkt">
    <div class="container">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Hoe het werkt</span>
        <h2>Een spaarkaart voor je <?= e($place) ?> in drie stappen</h2>
        <p class="section__lead">Geen techniek nodig. Jij stelt je kaart samen, je klant voegt 'm toe, jij deelt de stempels uit.</p>
      </div>
      <div class="steps">
        <?php foreach ($steps as $i => $s): ?>
        <article class="step reveal"><span class="step__num">0<?= $i + 1 ?></span><h3><?= e($s[0]) ?></h3><p><?= e($s[1]) ?></p></article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="section" id="voordelen">
    <div class="container">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Voordelen</span>
        <h2>Gemaakt voor jouw <?= e($place) ?></h2>
      </div>
      <div class="features">
        <?php foreach ($benefits as $b): ?>
        <article class="feature <?= $b[0] ?> reveal"><h3><?= e($b[1]) ?></h3><p><?= e($b[2]) ?></p></article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="section section--paper2">
    <div class="container">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Inspiratie</span>
        <h2>Populaire beloningen</h2>
        <p class="section__lead">Kies wat bij jouw zaak past — je past het elk moment aan.</p>
      </div>
      <div class="rewardlist reveal">
        <?php foreach ($n['rewards'] as $r): ?>
        <div class="reward-chip"><span class="reward-chip__ico"><?= niche_icon($r[0]) ?></span><strong><?= e($r[1]) ?></strong><span><?= e($r[2]) ?></span></div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="statband reveal">
    <div class="container statband__grid">
      <div class="statband__num"><?= e($n['statNum']) ?></div>
      <div class="statband__body">
        <h2><?= e($n['statLine']) ?></h2>
        <p><?= e($n['statSub']) ?></p>
        <ul class="chips"><li>iOS &amp; Android</li><li>Geen app nodig</li><li>Klaar in 2 minuten</li><li>Eigen huisstijl</li></ul>
      </div>
    </div>
  </section>

  <section class="section" id="faq">
    <div class="container container--narrow">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Veelgestelde vragen</span>
        <h2>Digitale klantenkaart voor <?= e(strtolower($n['name'])) ?>s — goed om te weten</h2>
      </div>
      <div class="faq reveal">
        <?php foreach ($n['faq'] as $f): ?>
        <details class="faq__item"><summary><?= e($f[0]) ?></summary><p><?= e($f[1]) ?></p></details>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="section section--paper2">
    <div class="container">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Verder lezen</span>
        <h2>Meer weten over digitale klantenkaarten?</h2>
        <p class="section__lead">Praktische uitleg en tips uit onze gids — helder en zonder jargon.</p>
      </div>
      <div class="gids-grid reveal">
        <?php foreach ($gidsPosts as $g): ?>
        <a class="gidscard" href="/gids/<?= e($g[0]) ?>/">
          <span class="gidscard__cat"><?= e($g[1]) ?></span>
          <strong><?= e($g[2]) ?></strong>
          <span class="gidscard__excerpt"><?= e($g[3]) ?></span>
          <span class="gidscard__go">Lees de gids &rarr;</span>
        </a>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="cta reveal" id="wachtlijst">
    <div class="container cta__inner">
      <h2>Klaar voor meer vaste klanten?</h2>
      <p>Schrijf je <?= e(strtolower($n['name'])) ?> in op de wachtlijst en krijg als eerste toegang tot stampzer — plus een introkorting bij de lancering.</p>
      <form class="waitlist-form waitlist-form--center" novalidate>
        <label class="sr-only" for="n-email-cta">E-mailadres</label>
        <input class="waitlist-form__input" type="email" id="n-email-cta" name="email" placeholder="jouw@zaak.nl" required autocomplete="email" />
        <button class="btn btn--ink" type="submit">Zet mij op de wachtlijst <span class="btn__arrow" aria-hidden="true">→</span></button>
        <p class="waitlist-form__note" role="status">We mailen je zodra we live gaan. Geen spam, beloofd.</p>
      </form>
    </div>
  </section>

  </main>

  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand"><img src="/assets/logo-cream.png" alt="stampzer.com" width="150" height="54" /><p>Digitale klantenkaarten in de Wallet van je klant. Meer terugkerende klanten, zonder app.</p></div>
      <nav class="footer__col" aria-label="Product"><h4>Product</h4><a href="/#hoe-het-werkt">Hoe het werkt</a><a href="/#kaarten">Voorbeelden</a><a href="/gids/">Gids</a><a href="/over-ons/">Over ons</a><a href="/dashboard.html">Dashboard</a><a href="/#wachtlijst">Wachtlijst</a><a href="/privacy/">Privacybeleid</a></nav>
      <nav class="footer__col" aria-label="Voor wie"><h4>Voor wie</h4><a href="/voor-wie/">Alle branches</a><a href="/kapper/">Kappers</a><a href="/koffiebar/">Koffiebars</a></nav>
      <div class="footer__col"><h4>Blijf op de hoogte</h4><a href="mailto:hallo@stampzer.com">hallo@stampzer.com</a><a href="#wachtlijst" class="btn btn--green footer__cta">Op de wachtlijst <span class="btn__arrow" aria-hidden="true">→</span></a></div>
    </div>
    <div class="container footer__bottom"><span>© 2026 stampzer.com — Alle rechten voorbehouden.</span><span>Gemaakt in Nederland 🇳🇱</span></div>
  </footer>

  <script src="/config.js"></script>
  <script src="/motion.js"></script>
</body>
</html>
