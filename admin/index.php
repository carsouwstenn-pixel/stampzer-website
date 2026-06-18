<?php
define('STAMPZER_APP', true);
require __DIR__ . '/../api/db.php';
require __DIR__ . '/auth.php';
require_admin();

$pdo = db();
$leads = $pdo->query("SELECT email, page, created_at FROM leads ORDER BY created_at DESC LIMIT 500")->fetchAll();
$total = (int) $pdo->query("SELECT COUNT(*) AS c FROM leads")->fetch()['c'];
$week  = (int) $pdo->query("SELECT COUNT(*) AS c FROM leads WHERE created_at >= (NOW() - INTERVAL 7 DAY)")->fetch()['c'];

function lead_page_label($p) {
    $p = (string)$p;
    if ($p === '' || $p === '/') return 'Homepage';
    if (strpos($p, '/kapper') === 0) return 'Kapper';
    return trim($p, '/');
}
?><!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Stampzer — CEO dashboard</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/seatren.woff2" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/admin/admin.css" />
</head>
<body>
  <div class="adm">

    <aside class="adm-side">
      <div class="adm-logo"><img src="/assets/logo-cream.png" alt="stampzer" width="130" height="47" /></div>
      <nav class="adm-nav" aria-label="Dashboard">
        <button data-section="overzicht" class="is-active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg><span>Overzicht</span></button>
        <button data-section="leads"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5M21 20a6 6 0 0 0-5-5.9"/></svg><span>Leads</span></button>
        <button data-section="heatmaps"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM16 8h.01"/></svg><span>Heatmaps</span></button>
        <button data-section="seo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><span>SEO</span></button>
        <button data-section="branding"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 17.5 7.1 21.2 8 15.7l-4-3.9 5.5-.8z"/></svg><span>Branding &amp; teksten</span></button>
        <button data-section="financien"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg><span>Bedrijven &amp; financiën</span></button>
        <button data-section="instellingen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2.2-1.3L13.9 2h-3.8l-.3 2.2a7 7 0 0 0-2.2 1.3l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.6l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2.2 1.3l.3 2.2h3.8l.3-2.2a7 7 0 0 0 2.2-1.3l2.3 1 2-3.4-2-1.5A7 7 0 0 0 19 12z"/></svg><span>Instellingen</span></button>
      </nav>
      <div class="adm-side__foot">
        <div class="adm-side__av">S</div>
        <div><strong>Stampzer</strong><a class="adm-logout" href="/admin/logout.php">Uitloggen</a></div>
      </div>
    </aside>

    <main class="adm-main">
      <div class="adm-top">
        <div>
          <h1 id="adm-title">Overzicht</h1>
          <p>Welkom terug. Hier komt alles samen — leads, gedrag, SEO en straks je omzet.</p>
        </div>
        <span class="adm-pill" style="--dot:#29c700">Databron verbonden</span>
      </div>

      <!-- OVERZICHT -->
      <section class="adm-section is-active" data-panel="overzicht">
        <div class="kpi-grid">
          <div class="kpi"><span class="kpi__label">Leads totaal</span><div class="kpi__num"><?= $total ?></div><span class="kpi__sub">wachtlijst-aanmeldingen</span></div>
          <div class="kpi"><span class="kpi__label">Aanmeldingen deze week</span><div class="kpi__num"><?= $week ?></div><span class="kpi__sub">laatste 7 dagen</span></div>
          <div class="kpi"><span class="kpi__label">Bezoekers</span><div class="kpi__num">—</div><span class="kpi__sub">via Microsoft Clarity</span></div>
          <div class="kpi"><span class="kpi__label">Conversie</span><div class="kpi__num">—</div><span class="kpi__sub">bezoekers → leads</span></div>
        </div>

        <div class="panel">
          <div class="panel__title">Verbindingen</div>
          <div class="conn">
            <span class="conn__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4zM4 7l8 6 8-6"/></svg></span>
            <div class="conn__meta"><strong>Databron — leads &amp; instellingen</strong><span>MySQL op Hostinger — slaat aanmeldingen op</span></div>
            <div class="conn__right"><span class="badge badge--on">Verbonden</span></div>
          </div>
          <div class="conn">
            <span class="conn__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/></svg></span>
            <div class="conn__meta"><strong>Microsoft Clarity — heatmaps</strong><span>Zien waar bezoekers kijken en klikken</span></div>
            <div class="conn__right"><span class="badge badge--off">Niet verbonden</span></div>
          </div>
          <div class="conn">
            <span class="conn__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></span>
            <div class="conn__meta"><strong>Google Search Console — SEO</strong><span>Posities, vertoningen en klikken in Google</span></div>
            <div class="conn__right"><span class="badge badge--off">Niet verbonden</span></div>
          </div>
          <div class="conn">
            <span class="conn__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
            <div class="conn__meta"><strong>Stripe of Mollie — omzet</strong><span>Abonnementen en betalingen van stampzer-bedrijven</span></div>
            <div class="conn__right"><span class="badge badge--soon">Later</span></div>
          </div>
        </div>
      </section>

      <!-- LEADS -->
      <section class="adm-section" data-panel="leads">
        <div class="adm-section__head"><h2>Leads</h2><p>Elke wachtlijst-aanmelding op de site komt hier binnen — met e-mail, vanaf welke pagina en wanneer.</p></div>
        <div class="panel">
          <div class="panel__title">Wachtlijst-aanmeldingen (<?= $total ?>)</div>
          <table class="dtable">
            <thead><tr><th>E-mail</th><th>Pagina</th><th>Datum</th></tr></thead>
            <tbody>
              <?php if (!$leads): ?>
                <tr><td colspan="3" class="dtable__empty">Nog geen aanmeldingen. Zodra iemand zich op de site inschrijft, verschijnt het hier automatisch.</td></tr>
              <?php else: foreach ($leads as $l): ?>
                <tr>
                  <td><strong style="color:var(--ink)"><?= adm_h($l['email']) ?></strong></td>
                  <td><?= adm_h(lead_page_label($l['page'])) ?></td>
                  <td><?= adm_h(date('d-m-Y H:i', strtotime($l['created_at']))) ?></td>
                </tr>
              <?php endforeach; endif; ?>
            </tbody>
          </table>
        </div>
      </section>

      <!-- HEATMAPS -->
      <section class="adm-section" data-panel="heatmaps">
        <div class="adm-section__head"><h2>Heatmaps &amp; gedrag</h2><p>Zie precies waar bezoekers kijken, klikken en afhaken — zo weet je wat werkt en wat je moet aanpassen.</p></div>
        <div class="connect">
          <span class="connect__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM16 8h.01"/></svg></span>
          <div>
            <h3>Verbind Microsoft Clarity</h3>
            <p style="color:var(--muted);font-size:.92rem;margin-top:4px">Gratis, en geeft heatmaps én sessie-opnames van echte bezoekers.</p>
            <ol>
              <li>Maak een gratis project aan op <strong>clarity.microsoft.com</strong> met je site <strong>stampzer.com</strong>.</li>
              <li>Kopieer je <strong>Project ID</strong> (een code als <em>abcd1234</em>).</li>
              <li>Stuur 'm naar mij — ik plaats de tracking op alle pagina's. Vanaf dat moment vullen je heatmaps zich.</li>
            </ol>
            <a href="https://clarity.microsoft.com/" class="btn btn--green" target="_blank" rel="noopener">Open Microsoft Clarity ↗</a>
          </div>
        </div>
      </section>

      <!-- SEO -->
      <section class="adm-section" data-panel="seo">
        <div class="adm-section__head"><h2>SEO</h2><p>Hoe vindbaar is stampzer in Google? Hier zie je straks je posities per pagina.</p></div>
        <div class="panel">
          <div class="panel__title">Basis op orde</div>
          <div class="conn"><span class="conn__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span><div class="conn__meta"><strong>sitemap.xml</strong><span>Live — vertelt Google welke pagina's er zijn</span></div><div class="conn__right"><span class="badge badge--on">Actief</span></div></div>
          <div class="conn"><span class="conn__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span><div class="conn__meta"><strong>robots.txt</strong><span>Live — stuurt zoekmachines goed aan</span></div><div class="conn__right"><span class="badge badge--on">Actief</span></div></div>
          <div class="conn"><span class="conn__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span><div class="conn__meta"><strong>Structured data &amp; meta-tags</strong><span>Per pagina ingericht (o.a. /kapper voor de kappers-niche)</span></div><div class="conn__right"><span class="badge badge--on">Actief</span></div></div>
        </div>
        <div class="connect">
          <span class="connect__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></span>
          <div>
            <h3>Verbind Google Search Console</h3>
            <ol>
              <li>Voeg stampzer.com toe op <strong>search.google.com/search-console</strong> en verifieer (ik help met de verificatie).</li>
              <li>Daarna tonen we hier je zoekposities, klikken en vertoningen per pagina.</li>
            </ol>
            <a href="https://search.google.com/search-console" class="btn btn--ghost" target="_blank" rel="noopener">Open Search Console ↗</a>
          </div>
        </div>
      </section>

      <!-- BRANDING -->
      <section class="adm-section" data-panel="branding">
        <div class="adm-section__head"><h2>Branding &amp; teksten</h2><p>Pas je logo, links en kleine teksten zelf aan. Klik opslaan en het staat overal op de site.</p></div>
        <div class="panel">
          <div class="panel__title">Snel bewerkbaar</div>
          <div class="field"><label>Aankondigingsbalk (bovenaan de site)</label><input type="text" value="Stampzer is in besloten bèta — schrijf je gratis in voor vroege toegang" /></div>
          <div class="field"><label>Contact e-mail</label><input type="email" value="hallo@stampzer.com" /></div>
          <div class="field--row">
            <div class="field"><label>Instagram</label><input type="url" placeholder="https://instagram.com/stampzer" /></div>
            <div class="field"><label>TikTok</label><input type="url" placeholder="https://tiktok.com/@stampzer" /></div>
          </div>
          <div class="field--row">
            <div class="field"><label>Facebook</label><input type="url" placeholder="https://facebook.com/stampzer" /></div>
            <div class="field"><label>LinkedIn</label><input type="url" placeholder="https://linkedin.com/company/stampzer" /></div>
          </div>
          <button class="btn btn--green" disabled style="opacity:.55;cursor:not-allowed">Opslaan</button>
          <div class="note-soon">Opslaan koppel ik als volgende stap aan de database — dan worden deze velden direct live doorgevoerd, inclusief het vervangen van logo's met één klik.</div>
        </div>
        <div class="panel">
          <div class="panel__title">SEO-kernteksten</div>
          <p style="color:var(--muted);font-size:.92rem">Koppen en SEO-teksten van pagina's regenereren we als echte HTML (niet via JavaScript), zodat je Google-ranking niet daalt. Wil je zo'n tekst wijzigen? Geef het door — dat is voor mij een wijziging van seconden.</p>
        </div>
      </section>

      <!-- FINANCIEN -->
      <section class="adm-section" data-panel="financien">
        <div class="adm-section__head"><h2>Bedrijven &amp; financiën</h2><p>Zodra stampzer live gaat en betalingen lopen via Stripe of Mollie, zie je hier je omzet, abonnementen en aangesloten bedrijven.</p></div>
        <div class="kpi-grid">
          <div class="kpi"><span class="kpi__label">Actieve bedrijven</span><div class="kpi__num">0</div><span class="kpi__sub">nog niet gelanceerd</span></div>
          <div class="kpi"><span class="kpi__label">MRR</span><div class="kpi__num">€0</div><span class="kpi__sub">maandelijkse omzet</span></div>
          <div class="kpi"><span class="kpi__label">Proefaccounts</span><div class="kpi__num">0</div><span class="kpi__sub">—</span></div>
          <div class="kpi"><span class="kpi__label">Opzeggingen</span><div class="kpi__num">0</div><span class="kpi__sub">—</span></div>
        </div>
        <div class="connect">
          <span class="connect__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
          <div>
            <h3>Koppel Stripe of Mollie — later</h3>
            <p style="color:var(--muted);font-size:.92rem;margin-top:4px">Wanneer je de eerste betalende kappers en zaken hebt, koppelen we je betaalprovider en vullen deze cijfers zich automatisch.</p>
          </div>
        </div>
      </section>

      <!-- INSTELLINGEN -->
      <section class="adm-section" data-panel="instellingen">
        <div class="adm-section__head"><h2>Instellingen</h2><p>Beveiliging en toegang tot dit dashboard.</p></div>
        <div class="panel">
          <div class="panel__title">Beveiliging</div>
          <div class="conn"><span class="conn__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span><div class="conn__meta"><strong>Dashboard-login</strong><span>Actief — beveiligd met je eigen e-mail en wachtwoord (PHP-sessie).</span></div><div class="conn__right"><span class="badge badge--on">Beveiligd</span></div></div>
          <p style="color:var(--muted);font-size:.9rem;margin-top:14px"><a href="/admin/logout.php" style="color:var(--green-700);font-weight:600">Uitloggen →</a></p>
        </div>
      </section>

    </main>
  </div>

  <script src="/admin/admin.js"></script>
</body>
</html>
