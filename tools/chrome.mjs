// Stampzer · één bron voor het menu, de footer en de cookiemelding op stampzer.com.
//
// Gebruik (vanuit de repo-map):
//   node tools/chrome.mjs                  werkt alle pagina's bij
//   node tools/chrome.mjs --check          meldt alleen welke bestanden afwijken (exit 1)
//   node tools/chrome.mjs pad/naar/x.html  ook losse bestanden buiten de repo (bijv. blogconcepten)
//
// Per pagina:
//   - vervangt <header class="nav">…</header> en <footer class="footer">…</footer> door de vaste
//     versie hieronder, met aria-current op het menu-item van de huidige sectie;
//   - haalt de oude aankondigingsbalk boven het menu weg;
//   - zet oude sectielinks (/#hoe-het-werkt, /#kaarten, …) om naar echte pagina's;
//   - laat elke "Start gratis"-knop direct op het registratieformulier van de app landen;
//   - laadt /site.js (mobiel menu + cookiemelding) op elke pagina.
// Daarnaast komt de CSS voor menu, footer en cookiemelding tussen /* chrome:start */ en
// /* chrome:end */ in styles.css én in de inline CSS van de homepage (die laadt styles.css niet).
// De besloten pilotpagina en de 404 houden hun eigen kop en voet.
// Deze map (tools/) hoort niet op de server.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CHECK = process.argv.includes('--check')
const EXTRA = process.argv.slice(2).filter((a) => !a.startsWith('--'))

const APP = 'https://app.stampzer.com'
const REGISTREREN = `${APP}/registreren`

const MENU = [
  ['hoe', '/hoe-het-werkt/', 'Hoe het werkt'],
  ['voor', '/voor-wie/', 'Voor wie'],
  ['gids', '/gids/', 'Gids'],
  ['prijzen', '/prijzen/', 'Prijzen'],
]
const BRANCHES = [
  ['koffiebar', 'Koffiebars'],
  ['lunchroom', 'Lunchrooms'],
  ['restaurant', 'Restaurants'],
  ['bakker', 'Bakkers'],
  ['kapper', 'Kappers'],
  ['nagelstudio', "Nagelstudio's"],
  ['sportschool', 'Sportscholen'],
]
const EIGEN_KOP = new Set(['pilot/index.html', '404.html'])

// Menu-item van een URL: 'page' = precies die pagina, 'true' = een pagina eronder.
function actief(url) {
  for (const [key, href] of MENU) {
    if (url === href) return { key, waarde: 'page' }
    if (url.startsWith(href)) return { key, waarde: 'true' }
  }
  if (BRANCHES.some(([slug]) => url.startsWith(`/${slug}/`))) return { key: 'voor', waarde: 'true' }
  return null
}

// URL van een bestand: eerst de canonical, anders het pad in de repo (de PHP-sjablonen).
function urlVan(rel, html) {
  const canon = html.match(/<link rel="canonical" href="https:\/\/stampzer\.com(\/[^"<]*)"/)
  if (canon) return canon[1]
  return '/' + rel.replace(/index\.(html|php)$/, '')
}

function header(a) {
  const items = MENU.map(
    ([key, href, label]) => `<a href="${href}"${a && a.key === key ? ` aria-current="${a.waarde}"` : ''}>${label}</a>`,
  )
  return `<header class="nav" id="nav">
    <div class="container nav__inner">
      <a class="nav__logo" href="/" aria-label="Stampzer, naar de homepage"><img src="/assets/logo-dark.png" alt="Stampzer" width="150" height="54" /></a>
      <nav class="nav__links" id="nav-menu" aria-label="Hoofdmenu">
        ${items.join('\n        ')}
        <a class="nav__menu-login" href="${APP}">Inloggen</a>
      </nav>
      <div class="nav__actions">
        <a class="nav__login" href="${APP}">Inloggen</a>
        <a class="btn btn--green nav__cta" href="${REGISTREREN}">Start gratis <span class="btn__arrow" aria-hidden="true">&rarr;</span></a>
        <button class="nav__burger" type="button" aria-label="Menu openen" aria-controls="nav-menu" aria-expanded="false">
          <svg class="nav__icon-open" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          <svg class="nav__icon-close" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
    </div>
  </header>`
}

const FOOTER = `<footer class="footer">
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
          <a href="/digitale-klantenkaart/">Digitale klantenkaart</a>
          <a href="/stempelkaart-maken/">Stempelkaart maken</a>
          <a href="/apple-wallet-spaarkaart/">Apple Wallet</a>
          <a href="/google-wallet-klantenkaart/">Google Wallet</a>
          <a href="/spaarkaart-zonder-app/">Zonder app</a>
          <a href="/prijzen/">Prijzen</a>
        </nav>
        <nav class="footer__col" aria-label="Voor wie">
          <h2 class="footer__h">Voor wie</h2>
          <a href="/voor-wie/">Alle branches</a>
          ${BRANCHES.map(([slug, label]) => `<a href="/${slug}/">${label}</a>`).join('\n          ')}
        </nav>
        <nav class="footer__col" aria-label="Stampzer">
          <h2 class="footer__h">Stampzer</h2>
          <a href="/gids/">Gids</a>
          <a href="/over-ons/">Over ons</a>
          <a href="/contact/">Contact</a>
          <a href="/privacy/">Privacy</a>
          <a href="/voorwaarden/">Voorwaarden</a>
          <a href="${APP}">Inloggen</a>
        </nav>
      </div>
      <div class="footer__bottom">
        <span>&copy; 2026 Stampzer</span>
        <span>Ontworpen door <a href="https://studioclear.nl" target="_blank" rel="noopener">Studio Clear</a></span>
        <span>Gemaakt in Nederland</span>
        <button class="footer__cookies" type="button" data-cookie-settings>Cookie-instellingen</button>
      </div>
    </div>
  </footer>`

// Werkt op beide stylesheets (styles.css en de inline CSS van de homepage): alleen de
// gedeelde kleurtokens, lettertypes voluit, geen afhankelijkheid van .btn-varianten.
const FONT = `"Inter",system-ui,-apple-system,"Segoe UI",sans-serif`
const CSS = `/* chrome:start · menu, footer en cookiemelding. Gegenereerd door tools/chrome.mjs: pas het daar aan, niet hier. */
html{scroll-padding-top:88px}
.skip-link{position:absolute;left:-999px;top:0;z-index:200;background:var(--ink);color:var(--paper);padding:10px 16px;border-radius:0 0 8px 0}
.skip-link:focus{left:0}
.btn__arrow{display:inline-block;transition:transform .18s ease}
.btn:hover .btn__arrow{transform:translateX(4px)}
.nav{position:sticky;top:0;z-index:100;background:rgba(247,242,231,.92);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid rgba(24,31,16,.12);font-family:${FONT};line-height:1.2}
.nav__inner{display:flex;align-items:center;justify-content:space-between;gap:20px;height:70px}
.nav__logo{display:block;flex:0 0 auto}
.nav__logo img{display:block;width:auto;height:30px}
.nav__links{display:flex;align-items:center;gap:28px}
.nav__links a,.nav__login{font-size:.95rem;font-weight:500;color:var(--ink-2);text-decoration:none;transition:color .15s}
.nav__links a{padding:8px 0}
.nav__links a:hover,.nav__login:hover{color:var(--green-900)}
.nav__links a[aria-current]{color:var(--ink);text-decoration:underline;text-decoration-color:var(--green);text-decoration-thickness:2px;text-underline-offset:9px}
.nav__menu-login{display:none}
.nav__actions{display:flex;align-items:center;gap:20px}
.nav .nav__cta{gap:8px;padding:12px 20px;border-width:2px;font-family:${FONT};font-size:.95rem;font-weight:600;line-height:1;white-space:nowrap}
.nav .nav__cta:hover{color:var(--ink);transform:none}
.nav__burger{display:none;place-items:center;width:44px;height:44px;margin-right:-10px;padding:0;background:none;border:0;border-radius:10px;color:var(--ink);cursor:pointer}
.nav__links a:focus-visible,.nav__login:focus-visible,.nav__burger:focus-visible{outline:2px solid var(--green-700);outline-offset:3px}
.nav__burger[aria-expanded="true"] .nav__icon-open,.nav__burger:not([aria-expanded="true"]) .nav__icon-close{display:none}
@media (max-width:920px){
  .nav__inner{height:64px}
  .nav__links,.nav__login{display:none}
  .nav__burger{display:grid}
  .nav .nav__cta{padding:10px 16px;font-size:.9rem}
  .nav.open .nav__links{display:flex;position:absolute;top:100%;left:0;right:0;flex-direction:column;align-items:stretch;gap:0;padding:6px 0 12px;background:var(--paper);border-bottom:1px solid rgba(24,31,16,.12);box-shadow:0 18px 30px -18px rgba(24,31,16,.35)}
  .nav.open .nav__links a{display:block;padding:14px 4vw;font-size:1.05rem;text-underline-offset:6px}
  .nav.open .nav__links .nav__menu-login{margin-top:6px;border-top:1px solid rgba(24,31,16,.12)}
}
@media (max-width:560px){
  .nav__logo img{height:26px}
  .nav.open .nav__links a{padding-left:4.5vw;padding-right:4.5vw}
}
.footer{background:var(--ink);color:rgba(247,242,231,.7);padding:56px 0 30px;font-family:${FONT};line-height:1.5}
.footer__grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:30px}
.footer__brand img{display:block;width:auto;height:30px;margin-bottom:14px}
.footer__brand p{max-width:24em;margin:0;font-size:.92rem;line-height:1.6}
.footer__mail{display:inline-block;margin-top:12px}
.footer__h{margin:0 0 12px;font-family:${FONT};font-size:.8rem;font-weight:600;line-height:1.3;letter-spacing:.1em;text-transform:uppercase;color:#fff}
.footer a{color:rgba(247,242,231,.72);font-size:.92rem;text-decoration:none;transition:color .15s}
.footer__col a{display:block;padding:4px 0}
.footer a:hover,.footer__cookies:hover{color:#fff}
.footer a:focus-visible,.footer__cookies:focus-visible{outline:2px solid var(--green);outline-offset:3px}
.footer__bottom{display:flex;flex-wrap:wrap;align-items:center;gap:8px 28px;margin-top:40px;padding-top:22px;border-top:1px solid rgba(255,255,255,.12);font-size:.84rem;color:rgba(247,242,231,.55)}
.footer__bottom a{font-size:inherit;color:inherit;text-decoration:underline;text-underline-offset:2px}
.footer__cookies{margin-left:auto;padding:0;background:none;border:0;font:inherit;color:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}
@media (max-width:920px){.footer__grid{grid-template-columns:1fr 1fr}.footer__brand{grid-column:1/-1}}
@media (max-width:560px){.footer__cookies{margin-left:0}}
.cookie{position:fixed;z-index:300;left:16px;right:16px;bottom:16px;max-width:720px;margin:0 auto;padding:20px 24px;background:var(--ink);color:var(--paper);border-radius:18px;box-shadow:0 28px 60px -28px rgba(24,31,16,.45);font-family:${FONT};line-height:1.5;transform:translateY(160%);transition:transform .5s cubic-bezier(.16,.84,.44,1)}
.cookie.is-in{transform:none}
.cookie__inner{display:flex;flex-wrap:wrap;align-items:center;gap:22px}
.cookie__text{flex:1;min-width:240px}
.cookie__text strong{display:block;margin-bottom:5px;font-family:"Seatren",Georgia,serif;font-size:1.2rem;font-weight:400;color:#fff}
.cookie__text p{margin:0;font-size:.9rem;line-height:1.55;color:rgba(247,242,231,.78)}
.cookie__text a{color:var(--green);text-decoration:underline;text-underline-offset:2px}
.cookie__actions{display:flex;flex-shrink:0;gap:10px}
.cookie__btn{padding:11px 22px;border:1px solid transparent;border-radius:999px;font-family:${FONT};font-size:.92rem;font-weight:600;cursor:pointer;transition:background .16s ease,border-color .16s ease,transform .16s ease}
.cookie__btn:active{transform:translateY(1px)}
.cookie__btn--accept{background:var(--green);color:var(--ink)}
.cookie__btn--accept:hover{background:#34e000}
.cookie__btn--deny{background:transparent;color:var(--paper);border-color:rgba(247,242,231,.32)}
.cookie__btn--deny:hover{border-color:rgba(247,242,231,.6)}
@media (max-width:560px){.cookie{padding:18px}.cookie__actions{width:100%}.cookie__btn{flex:1}}
@media (prefers-reduced-motion:reduce){.cookie,.btn__arrow{transition:none}}
/* chrome:end */`

// Oude sectielinks → echte pagina's.
const LINKS = [
  ['href="/#hoe-het-werkt"', 'href="/hoe-het-werkt/"'],
  ['href="/#kaarten"', 'href="/hoe-het-werkt/#voorbeelden"'],
  ['href="/#roi"', 'href="/#opbrengst"'],
  ['href="/#faq"', 'href="/hoe-het-werkt/#vragen"'],
  ['href="/#dashboard"', 'href="/hoe-het-werkt/#dashboard"'],
  ['href="index.html#hoe-het-werkt"', 'href="/hoe-het-werkt/"'],
  ['href="index.html#kaarten"', 'href="/hoe-het-werkt/#voorbeelden"'],
  ['href="index.html#faq"', 'href="/hoe-het-werkt/#vragen"'],
  ['href="index.html"', 'href="/"'],
  ['href="dashboard.html"', 'href="/hoe-het-werkt/#dashboard"'],
  ['href="/dashboard.html"', 'href="/hoe-het-werkt/#dashboard"'],
  // Samengevoegde pagina's (SEO-plan oktober 2026, met 301 in .htaccess)
  ['href="/gids/digitale-klantenkaart-wallet/"', 'href="/digitale-klantenkaart/"'],
  ['href="/gids/klantenkaart-kapper/"', 'href="/gids/klantenkaart-kapper-barbershop/"'],
  ['href="/gids/spaarkaart-apple-google-wallet-zonder-app/"', 'href="/spaarkaart-zonder-app/"'],
]

function pagina(rel, html) {
  let uit = html
  if (!EIGEN_KOP.has(rel)) {
    uit = uit.replace(/[ \t]*<div class="announce">\s*<div class="container announce__inner">[\s\S]*?<\/div>\s*<\/div>\s*\n/, '')
    uit = uit.replace(/<header class="nav"[\s\S]*?<\/header>/, () => header(actief(urlVan(rel, html))))
    uit = uit.replace(/<footer class="footer">[\s\S]*?<\/footer>/, () => FOOTER)
  }
  for (const [oud, nieuw] of LINKS) uit = uit.split(oud).join(nieuw)
  // "Start gratis" en andere aanmeldknoppen: direct naar het registratieformulier.
  uit = uit.replace(/(<a\b[^>]*\bhref=")https:\/\/app\.stampzer\.com\/?("[^>]*>)(\s*)([^<]*)/g, (m, voor, na, ws, tekst) =>
    /gratis|begin met|vroege toegang/i.test(tekst) ? `${voor}${REGISTREREN}${na}${ws}${tekst}` : m,
  )
  if (!uit.includes('/site.js')) {
    uit = uit.replace(
      /<script src="\/?motion\.js"( defer)?><\/script>/,
      (m, defer = '') => `<script src="/site.js"${defer}></script>\n  <script src="/motion.js"${defer}></script>`,
    )
  }
  if (rel === 'index.html') {
    if (!uit.includes('/site.js')) uit = uit.replace(
      '<script src="/home.js" defer></script>',
      '<script src="/config.js" defer></script>\n<script src="/site.js" defer></script>\n<script src="/home.js" defer></script>',
    )
    uit = metCss(uit, '</style>')
  }
  return uit
}

// Zet het CSS-blok tussen de markers; staat het er nog niet, dan vóór `anker` (of aan het eind).
function metCss(tekst, anker) {
  const blok = /\/\* chrome:start[\s\S]*?\/\* chrome:end \*\//
  if (blok.test(tekst)) return tekst.replace(blok, () => CSS)
  if (!anker) return tekst.replace(/\s*$/, '\n\n') + CSS + '\n'
  const i = tekst.indexOf(anker)
  if (i < 0) throw new Error(`anker ${anker} niet gevonden`)
  return tekst.slice(0, i) + CSS + '\n' + tekst.slice(i)
}

function bestanden() {
  const lijst = []
  const loop = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.') || ['node_modules', 'admin', 'api', 'tools'].includes(e.name)) continue
      const p = path.join(dir, e.name)
      if (e.isDirectory()) loop(p)
      else if (e.name.endsWith('.html')) lijst.push(p)
    }
  }
  loop(ROOT)
  // Sinds oktober 2026 zijn alle publieke pagina's gewone HTML (tools/branches/bouw.mjs maakt de
  // branchepagina's en /voor-wie/); er is geen PHP-sjabloon meer om bij te werken.
  return lijst.concat(EXTRA.map((p) => path.resolve(p)))
}

let afwijkend = 0
const schrijf = (bestand, oud, nieuw) => {
  if (oud === nieuw) return
  afwijkend++
  console.log(`${CHECK ? 'wijkt af' : 'bijgewerkt'}: ${path.relative(ROOT, bestand)}`)
  if (!CHECK) fs.writeFileSync(bestand, nieuw)
}

for (const bestand of bestanden()) {
  const rel = path.relative(ROOT, bestand).split(path.sep).join('/')
  const html = fs.readFileSync(bestand, 'utf8')
  schrijf(bestand, html, pagina(rel, html))
}
const cssPad = path.join(ROOT, 'styles.css')
const css = fs.readFileSync(cssPad, 'utf8')
schrijf(cssPad, css, metCss(css))

console.log(afwijkend ? `${afwijkend} bestand(en) ${CHECK ? 'wijken af' : 'bijgewerkt'}.` : 'Alles is gelijk.')
if (CHECK && afwijkend) process.exit(1)
