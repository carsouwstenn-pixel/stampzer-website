// Stampzer · bouwt de branchepagina's (/koffiebar/, /nagelstudio/, ...) en /voor-wie/ als gewone
// HTML. Vroeger rendere PHP (niche/render.php) ze bij elk bezoek; sinds de PHP2Shell-lekken
// (oktober 2026) draait er op de publieke pagina's geen PHP meer.
//
// Gebruik (vanuit de repo-map):
//   node tools/branches/bouw.mjs && node tools/chrome.mjs
//
// Inhoud per branche staat in tools/branches/data.json. Kop en voet laat dit script leeg; die vult
// tools/chrome.mjs. Deze map (tools/) hoort niet op de server.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const ALL = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/branches/data.json'), 'utf8'))

// Zelfde als PHP htmlspecialchars(..., ENT_QUOTES).
const e = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')

const ICONEN = {
  coffee: '<path d="M4 8h11v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M15 9h2.4a2.4 2.4 0 0 1 0 4.8H15"/><path d="M7 3.4v1.6M11 3.4v1.6"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8C12 5 9 3 7.5 4.5S9 8 12 8zM12 8c0-3 3-5 4.5-3.5S15 8 12 8z"/>',
  star: '<path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 17.5 7.1 21.2 8 15.7l-4-3.9 5.5-.8z"/>',
  scissors: '<circle cx="6" cy="6.4" r="2.3"/><circle cx="6" cy="17.6" r="2.3"/><path d="M8 8l11.5 8M8 16L19.5 8"/>',
  cutlery: '<path d="M6 3v6a2 2 0 0 0 4 0V3"/><path d="M8 11v10"/><path d="M16 3c-1.2 1.2-1.8 3-1.8 5.2 0 1.7.8 3 1.8 3s1.8-1.3 1.8-3c0-2.2-.6-4-1.8-5.2z"/><path d="M16 11.2V21"/>',
  dumbbell: '<path d="M6.5 7.5v9M3.5 9.5v5M17.5 7.5v9M20.5 9.5v5M6.5 12h11"/>',
  bread: '<path d="M4 12.5C4 9.6 7.2 8 12 8s8 1.6 8 4.5c0 .8-.7 1.5-1.5 1.5h-13C4.7 14 4 13.3 4 12.5Z"/><path d="M5 14v2.5A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5V14"/><path d="m9.5 10.6-.8 1.8M12.4 10.4l-.8 1.8M15.3 10.6l-.8 1.8"/>',
}
function icoon(naam) {
  if (naam === 'flower') {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6.6" r="2.7"/><circle cx="17.4" cy="10.5" r="2.7"/><circle cx="15.3" cy="16.9" r="2.7"/><circle cx="8.7" cy="16.9" r="2.7"/><circle cx="6.6" cy="10.5" r="2.7"/></svg>'
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONEN[naam] ?? ICONEN.star}</svg>`
}

// Gidsen die bij een branche horen (data.json: 'gids'); zonder lijst de algemene drie.
const GIDS = {
  'spaarkaart-koffiebar': ['Branche · 6 min', 'Spaarkaart voor je koffiebar', 'Van losse koffiedrinkers naar vaste klanten, met een kaart in de Wallet.'],
  'meer-stamgasten-cafe': ['Strategie · 6 min', 'Meer stamgasten in je café', 'Zo maak je van een losse bezoeker een vaste gast.'],
  'vaste-gasten-horeca': ['Strategie · 7 min', 'Vaste gasten in de horeca', 'Zo bouw je aan gasten die steeds terugkomen.'],
  'klantenkaart-voor-nagelstylisten': ['Branche · 6 min', 'Klantenkaart voor nagelstylisten', 'Meer vaste klanten en minder gaten in je agenda, ook als je aan huis werkt.'],
  'klantenbeheer-nagelstudio-salon': ['Praktisch · 6 min', 'Klantenbeheer voor je nagelsalon', 'Wat je bijhoudt over je vaste klanten, en wat niet.'],
  'meer-klanten-nagelstudio': ['Strategie · 7 min', 'Meer klanten in je nagelstudio', 'Van eerste afspraak tot vaste klant.'],
  'klantenkaart-lunchroom': ['Branche · 6 min', 'Klantenkaart voor je lunchroom', 'Waarop je laat sparen en welke beloning echt rendeert.'],
  'voller-terras-meer-klanten': ['Strategie · 5 min', 'Voller terras, meer klanten', 'Hoe je gasten vaker laat terugkomen, ook buiten het seizoen.'],
  'ledenbinding-sportschool': ['Branche · 6 min', 'Ledenbinding voor je sportschool', 'Zo blijven leden langer en zeggen ze minder snel op.'],
  'klanten-belonen-beloningen-spaarkaart': ['Beloningen · 7 min', 'Klanten belonen: beloningen die werken', 'Welke beloning past bij jouw zaak, met voorbeelden.'],
  'wat-is-een-vaste-klant-waard': ['Rekensom · 5 min', 'Wat is een vaste klant waard?', 'De rekensom achter klantwaarde en klantbehoud.'],
  'spaarkaart-bakkerij': ['Branche · 6 min', 'Spaarkaart voor de bakkerij', 'Meer vaste klanten voor je brood en gebak.'],
  'papieren-vs-digitale-stempelkaart': ['Vergelijking · 7 min', 'Papieren stempelkaart of digitaal?', 'Kosten, gemak en klantinzicht eerlijk naast elkaar.'],
  'klantenbinding-lokale-ondernemers': ['Strategie · 8 min', 'Klantenbinding voor lokale ondernemers', 'Zeven manieren om van bezoekers vaste klanten te maken.'],
}

const KOP = (titel, omschrijving, url, ogTitel, ogOmschrijving, ogBeeld, ld, extraMeta = '') => `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${e(titel)}</title>
  <meta name="description" content="${e(omschrijving)}" />
  <link rel="canonical" href="${e(url)}" />${extraMeta}
  <meta name="theme-color" content="#181f10" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="${e(url)}" />
  <meta property="og:site_name" content="Stampzer" />
  <meta property="og:title" content="${e(ogTitel)}" />
  <meta property="og:description" content="${e(ogOmschrijving)}" />
  <meta property="og:image" content="${e(ogBeeld)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="nl_NL" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${e(ogTitel)}" />
  <meta name="twitter:description" content="${e(ogOmschrijving)}" />
  <meta name="twitter:image" content="${e(ogBeeld)}" />

  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="64x64" href="/assets/favicon-64.png" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />

  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/seatren.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-400-latin.woff2" crossorigin />
  <link rel="stylesheet" href="/styles.css" />

  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
  <a class="skip-link" href="#main">Naar inhoud</a>

  <header class="nav" id="nav"></header>

  <main id="main">
`

const VOET = `
  </main>

  <footer class="footer"></footer>

  <script src="/config.js"></script>
  <script src="/site.js"></script>
  <script src="/motion.js"></script>
</body>
</html>
`

function branchePagina(slug, n) {
  const url = `https://stampzer.com/${slug}/`
  const { place, visit } = n
  const steps = [
    ['Ontwerp je kaart', `Stel je spaarkaart samen in de huisstijl van je ${place}: jouw logo, kleuren en de beloning die jij kiest.`],
    ["Klant voegt 'm toe", "Na het bezoek scant je klant één QR-code en de kaart staat meteen in z'n Apple of Google Wallet. Geen app, geen gedoe."],
    [`Stempel bij elke ${visit}`, `Bij elke ${visit} zet jij of een collega met één tik een stempel. Volle kaart? Tijd voor de beloning, en een goede reden om terug te komen.`],
  ]
  const benefits = [
    ['feature--green', 'Meer herhaalbezoek', `Een spaardoel trekt klanten terug naar jouw ${place}, niet naar die van de concurrent.`],
    ['', 'Jouw eigen huisstijl', 'De kaart voelt als die van jouw zaak, met je eigen logo, kleuren en beloning.'],
    ['', 'Ken je vaste klanten', 'Zie wie er vaak komt, wie bijna een beloning heeft en wie al even niet geweest is. Simpel klantenbeheer, zonder extra systeem.'],
    ['feature--peach', 'Vul je rustige dagen', 'Stuur klanten een seintje bij een bijna volle kaart en trek ze juist op een stille dag binnen.'],
    ['', 'Niemand speelt vals', 'Alleen jij en je team delen stempels uit. Klanten kunnen zichzelf niet stempelen.'],
    ['feature--ink', 'Geen app, nooit kwijt', 'Werkt direct in de Wallet die je klant al heeft. De kaart zit veilig in de telefoon.'],
  ]
  const gidsSlugs = n.gids ?? ['papieren-vs-digitale-stempelkaart', 'klanten-belonen-beloningen-spaarkaart', 'klantenbinding-lokale-ondernemers']
  const gidsPosts = gidsSlugs.filter((g) => GIDS[g]).map((g) => [g, ...GIDS[g]])
  const alleFaq = [...n.faq, ...(n.extraFaq ?? [])]
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service', name: n.title, serviceType: 'Digitale klantenkaart en loyaliteitsprogramma',
        provider: { '@type': 'Organization', name: 'Stampzer', url: 'https://stampzer.com/' },
        areaServed: [{ '@type': 'Country', name: 'Nederland' }, { '@type': 'Country', name: 'België' }],
        url, description: n.desc,
        offers: { '@type': 'AggregateOffer', lowPrice: '24', highPrice: '49', priceCurrency: 'EUR', offerCount: '2', description: 'Starter of Pro, per maand of voordeliger per jaar. Eerst gratis proberen, zonder creditcard.' },
      },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://stampzer.com/' },
        { '@type': 'ListItem', position: 2, name: 'Voor wie', item: 'https://stampzer.com/voor-wie/' },
        { '@type': 'ListItem', position: 3, name: `Voor ${n.meervoud}`, item: url },
      ] },
      { '@type': 'FAQPage', mainEntity: alleFaq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  }
  const p = n.pass
  return KOP(n.title, n.desc, url, `Digitale klantenkaart voor ${n.meervoud} | Stampzer`, n.sub, `https://stampzer.com/assets/og-${slug}.png`, ld,
    `\n  <meta name="keywords" content="${e(n.keywords)}" />`) + `
  <section class="hero" id="top">
    <div class="container hero__grid">
      <div class="hero__copy">
        <span class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span> ${e(n.eyebrow)}</span>
        <h1 class="hero__title">${e(n.h1a)}<span class="mark">${e(n.mark)}</span>${e(n.h1b)}</h1>
        <p class="hero__sub">${e(n.sub)}</p>
        <div class="hero__cta">
          <a class="btn btn--green" href="https://app.stampzer.com/registreren">Start gratis <span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--ghost" href="/stempelkaart-maken/?branche=${e(slug)}">Ontwerp je kaart</a>
          <p class="waitlist-form__note" role="status">Gratis · iOS &amp; Android · Geen app nodig</p>
        </div>
      </div>
      <div class="hero__visual">
        <div class="blob" aria-hidden="true"></div>
        <div class="phone">
          <div class="phone__screen">
            <div class="wallet-top"><span>Wallet</span><span class="wallet-top__dots">•••</span></div>
            <div class="pass pass--${e(p.theme)}">
              <div class="pass__head">
                <div class="pass__avatar">${e([...p.biz][0] ?? '')}</div>
                <div class="pass__biz"><strong>${e(p.biz)}</strong><span>${e(p.sub)}</span></div>
              </div>
              <div class="pass__reward"><span class="pass__reward-label">Jouw beloning</span><span class="pass__reward-value">${e(p.reward)}</span></div>
              <div class="pass__stamps" data-on="${Number(p.on) | 0}" data-total="${Number(p.total) | 0}" data-icon="${e(p.icon)}"></div>
              <div class="pass__progress">${e(p.progress)}</div>
              <div class="pass__barcode" aria-hidden="true"></div>
              <div class="pass__by"><img src="/assets/stamp-green.png" alt="" width="10" height="20" /> via stampzer</div>
            </div>
          </div>
        </div>
        <div class="float-card float-card--toast" aria-hidden="true"><span class="float-card__check">✓</span><div><strong>Stempel toegevoegd</strong><span>${e(p.biz)} · zojuist</span></div></div>
        <div class="float-card float-card--wallet" aria-hidden="true"><span class="float-card__pill">Apple Wallet</span><span class="float-card__pill">Google Wallet</span></div>
      </div>
    </div>
    <div class="container trust">
      <span class="trust__label">${e(n.trustLabel)}</span>
      <ul class="trust__list">${n.trust.map((t) => `<li>${e(t)}</li>`).join('')}</ul>
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
${n.pains.map(([t, x]) => `        <article class="feature reveal"><h3>${e(t)}</h3><p>${e(x)}</p></article>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section section--paper2" id="hoe-het-werkt">
    <div class="container">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Hoe het werkt</span>
        <h2>Een spaarkaart voor je ${e(place)} in drie stappen</h2>
        <p class="section__lead">Geen techniek nodig. Jij stelt je kaart samen, je klant voegt 'm toe, jij deelt de stempels uit.</p>
      </div>
      <div class="steps">
${steps.map(([t, x], i) => `        <article class="step reveal"><span class="step__num">0${i + 1}</span><h3>${e(t)}</h3><p>${e(x)}</p></article>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section" id="voordelen">
    <div class="container">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Voordelen</span>
        <h2>Gemaakt voor jouw ${e(place)}</h2>
      </div>
      <div class="features">
${benefits.map(([k, t, x]) => `        <article class="feature ${k} reveal"><h3>${e(t)}</h3><p>${e(x)}</p></article>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="atmos">
    <div class="container atmos__grid">
      <div class="atmos__art reveal">
        <img class="hand-cut" src="/assets/hand/${e(slug)}-scene.webp" width="1100" height="817" loading="lazy" alt="Handgetekende illustratie van een ${e(place)} in de sfeer van Stampzer" />
      </div>
      <div class="atmos__copy reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Zo voelt het</span>
        <h2>Een ${e(place)} waar klanten graag terugkomen</h2>
        <ul class="atmos__points">
          <li><span class="tick" aria-hidden="true">&#10003;</span> Je klanten sparen voor een beloning die jij zelf kiest.</li>
          <li><span class="tick" aria-hidden="true">&#10003;</span> De kaart zit in hun Apple of Google Wallet: geen app, nooit kwijt.</li>
          <li><span class="tick" aria-hidden="true">&#10003;</span> Jij ziet wie je vaste klanten zijn en wie bijna een volle kaart heeft.</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section section--paper2">
    <div class="container">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Inspiratie</span>
        <h2>Populaire beloningen</h2>
        <p class="section__lead">Kies wat bij jouw zaak past. Je past het elk moment aan.</p>
      </div>
      <div class="rewardlist reveal">
${n.rewards.map(([ic, t, x]) => `        <div class="reward-chip"><span class="reward-chip__ico">${icoon(ic)}</span><strong>${e(t)}</strong><span>${e(x)}</span></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="statband reveal">
    <div class="container statband__grid">
      <div class="statband__num">${e(n.statNum)}</div>
      <div class="statband__body">
        <h2>${e(n.statLine)}</h2>
        <p>${e(n.statSub)}</p>
        <ul class="chips"><li>iOS &amp; Android</li><li>Geen app nodig</li><li>Klaar in 2 minuten</li><li>Eigen huisstijl</li></ul>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="lp-tekst reveal">
        <h2 style="font-size:clamp(1.8rem,3.6vw,2.6rem);margin-bottom:16px">Klantenkaart, stempelkaart of spaarkaart voor je ${e(place)}?</h2>
        <p>Het heeft veel namen: klantenkaart, stempelkaart, spaarkaart of klantenpas. Het idee is hetzelfde. Bij elke ${e(visit)} krijgt je klant een stempel, en een volle kaart levert een beloning op. Met Stampzer staat die kaart in de Apple Wallet of Google Wallet van je klant, in plaats van in een portemonnee.</p>
        <p>Wil je eerst zien hoe jouw kaart eruitziet? <a href="/stempelkaart-maken/?branche=${e(slug)}">Ontwerp hem gratis met de stempelkaart-maker</a>, of lees hoe de <a href="/digitale-stempelkaart/">digitale stempelkaart</a> werkt.</p>
      </div>
    </div>
  </section>

  <section class="section section--paper2" id="faq">
    <div class="container container--narrow">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Veelgestelde vragen</span>
        <h2>Vragen over de klantenkaart voor ${e(n.meervoud)}</h2>
      </div>
      <div class="faq reveal">
${alleFaq.map(([q, a]) => `        <details class="faq__item"><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Verder lezen</span>
        <h2>Meer weten over digitale klantenkaarten?</h2>
        <p class="section__lead">Praktische uitleg en tips uit onze gids, helder en zonder jargon.</p>
      </div>
      <div class="gids-grid reveal">
${gidsPosts.map(([g, c, t, x]) => `        <a class="gidscard" href="/gids/${e(g)}/">
          <span class="gidscard__cat">${e(c)}</span>
          <strong>${e(t)}</strong>
          <span class="gidscard__excerpt">${e(x)}</span>
          <span class="gidscard__go">Lees de gids &rarr;</span>
        </a>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="cta reveal" id="start-gratis">
    <div class="container cta__inner">
      <h2>Klaar voor meer vaste klanten?</h2>
      <p>Stampzer is nu gratis te proberen, zonder app en zonder creditcard. Zet vandaag je eerste spaarkaart klaar.</p>
      <a href="https://app.stampzer.com/registreren" class="btn btn--green">Start gratis <span class="btn__arrow" aria-hidden="true">→</span></a>
    </div>
  </section>
` + VOET
}

const hubIcoon = (naam) =>
  naam === 'flower' ? icoon('flower') : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONEN[naam] ?? ICONEN.coffee}</svg>`

function voorWie() {
  const order = ['kapper', 'koffiebar', 'nagelstudio', 'lunchroom', 'sportschool', 'bakker', 'restaurant']
  const titel = 'Voor wie is Stampzer? Klantenkaart per branche | Stampzer'
  const omschrijving = "Stampzer werkt voor elke zaak met vaste klanten: koffiebars, lunchrooms, bakkers, restaurants, kappers, nagelstudio's en sportscholen. Bekijk wat bij jouw zaak past."
  const namen = { kapper: 'Klantenkaart voor kappers', koffiebar: 'Klantenkaart voor koffiebars', nagelstudio: "Klantenkaart voor nagelstudio's", lunchroom: 'Klantenkaart voor lunchrooms', sportschool: 'Klantenkaart voor sportscholen', bakker: 'Klantenkaart voor bakkers', restaurant: 'Klantenkaart voor restaurants' }
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', name: 'Voor wie is Stampzer?', url: 'https://stampzer.com/voor-wie/', inLanguage: 'nl-NL', description: omschrijving, isPartOf: { '@type': 'WebSite', name: 'Stampzer', url: 'https://stampzer.com/' } },
      { '@type': 'ItemList', itemListElement: order.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://stampzer.com/${s}/`, name: namen[s] })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://stampzer.com/' },
        { '@type': 'ListItem', position: 2, name: 'Voor wie', item: 'https://stampzer.com/voor-wie/' },
      ] },
    ],
  }
  const kaarten = order.map((slug) => {
    const x = ALL[slug]
    return `          <a class="hubcard" href="/${e(slug)}/">
            <span class="hubcard__ic">${hubIcoon(x.hubIcon)}</span>
            <strong>Voor ${e(x.meervoud ?? x.name.toLowerCase() + 's')}</strong>
            <span class="hubcard__tag">${e(x.hubTagline)}</span>
            <span class="hubcard__go">Bekijk pagina <span aria-hidden="true">&rarr;</span></span>
          </a>`
  }).join('\n')
  return KOP(titel, omschrijving, 'https://stampzer.com/voor-wie/', 'Voor wie is Stampzer? Klantenkaart per branche',
    'Bekijk de Stampzer-pagina voor jouw branche en zie wat een digitale klantenkaart voor je zaak doet.', 'https://stampzer.com/assets/og-image.png', ld) + `
    <section class="section" style="padding-top:48px">
      <div class="container">
        <nav class="breadcrumb" aria-label="Kruimelpad"><a href="/">Home</a> <span aria-hidden="true">/</span> <span>Voor wie</span></nav>
        <div class="section__head" style="max-width:760px;margin-bottom:40px">
          <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Voor wie</span>
          <h1 class="hero__title" style="font-size:clamp(2.4rem,5.4vw,3.9rem);margin-top:10px">Een digitale klantenkaart voor jouw branche</h1>
          <p class="section__lead">Stampzer werkt voor elke zaak waar klanten vaker dan &eacute;&eacute;n keer komen. Per branche verschilt vooral de beloning en het aantal stempels. Kies je branche en zie wat bij jouw zaak past.</p>
        </div>
        <div class="hub-grid">
${kaarten}
          <div class="hubcard hubcard--soon">
            <span class="hubcard__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span>
            <strong>Jouw branche</strong>
            <span class="hubcard__tag">Bloemist, slager, wasstraat of studio? Stampzer werkt voor elke zaak met vaste klanten.</span>
            <a class="hubcard__go" href="/stempelkaart-maken/">Ontwerp je kaart <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--paper2">
      <div class="container">
        <div class="section__head">
          <span class="eyebrow eyebrow--dark"><span class="eyebrow__dot" aria-hidden="true"></span> Instellingen</span>
          <h2>Welke beloning past bij jouw zaak?</h2>
          <p class="section__lead">Hoe vaker klanten komen, hoe meer stempels je kunt vragen. Hiermee beginnen de meeste zaken; aanpassen kan altijd.</p>
        </div>
        <div class="lp-tabelwrap">
          <table class="lp-tabel">
            <thead><tr><th>Branche</th><th>Hoe vaak komt een klant?</th><th>Stempels</th><th>Beloning</th></tr></thead>
            <tbody>
              <tr><td><a href="/koffiebar/">Koffiebar</a></td><td>Een paar keer per week</td><td>10</td><td>Gratis koffie</td></tr>
              <tr><td><a href="/bakker/">Bakker</a></td><td>Een of meer keer per week</td><td>10</td><td>Gratis brood</td></tr>
              <tr><td><a href="/lunchroom/">Lunchroom</a></td><td>Wekelijks</td><td>8</td><td>Gratis lunch</td></tr>
              <tr><td><a href="/sportschool/">Sportschool</a></td><td>Per les of training</td><td>10</td><td>Gratis les</td></tr>
              <tr><td><a href="/restaurant/">Restaurant</a></td><td>Een of twee keer per maand</td><td>8</td><td>Gratis dessert</td></tr>
              <tr><td><a href="/nagelstudio/">Nagelstudio</a></td><td>Eens per drie tot vier weken</td><td>8</td><td>Gratis behandeling</td></tr>
              <tr><td><a href="/kapper/">Kapper</a></td><td>Eens per vier tot zes weken</td><td>6</td><td>Halve prijs op je knipbeurt</td></tr>
            </tbody>
          </table>
        </div>
        <p class="lp-links" style="margin-top:18px">Wil je zien hoe dat eruitziet? Probeer het met de <a href="/stempelkaart-maken/">gratis stempelkaart-maker</a>, of lees hoe de <a href="/digitale-stempelkaart/">digitale stempelkaart</a> werkt.</p>
      </div>
    </section>

    <section class="cta" id="start-gratis">
      <div class="container cta__inner">
        <h2>Jouw zaak, jouw kaart</h2>
        <p>Zet vandaag je eerste spaarkaart klaar. Geen app, geen creditcard, en je eerste klant spaart binnen een paar minuten.</p>
        <a href="https://app.stampzer.com/registreren" class="btn btn--green">Start gratis <span class="btn__arrow" aria-hidden="true">&rarr;</span></a>
      </div>
    </section>
` + VOET
}

const schrijf = (rel, html) => {
  const p = path.join(ROOT, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, html)
  console.log('geschreven:', rel)
}
for (const [slug, n] of Object.entries(ALL)) {
  if (n.hubOnly) continue // eigen pagina (kapper/index.html)
  schrijf(`${slug}/index.html`, branchePagina(slug, n))
}
schrijf('voor-wie/index.html', voorWie())
