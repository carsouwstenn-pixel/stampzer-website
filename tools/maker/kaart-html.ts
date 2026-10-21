// Stampzer · de wallet-kaart als HTML voor stampzer.com: dezelfde opbouw als de preview in de app
// (WalletPreview.tsx) en dezelfde beelden, want strook en hero komen uit kaart-svg.ts van de
// dashboard-repo. Zo ziet een bezoeker precies wat zijn klanten straks in hun Wallet krijgen.
// Gebruikt door de stempelkaart-maker (browser) en door voorbeelden.ts (statische kaarten).
import { GRENS_GOOGLE, heroSvg, kaartKleuren, onderQr, strookSvg } from '../../../stampzer-dashboard/supabase/functions/_shared/kaart-svg.ts'

export type Platform = 'google' | 'apple'
export type Ontwerp = {
  zaak: string
  kaartNaam: string
  beloning: string
  stempels: number
  kleur: string
  nu: number
  platform: Platform
  id: string // unieke masker-ID's als er meer kaarten op één pagina staan
}

// Dezelfde voorstellen als de snelstart in de app (src/lib/snelstart.ts), zodat een ontwerp uit de
// maker na het aanmelden precies zo klaarstaat.
export const BRANCHES = [
  { id: 'koffie', label: 'Koffiebar', kaartNaam: 'Koffiekaart', beloning: 'Gratis koffie', stempels: 10, kleur: '#b5651d' },
  { id: 'lunch', label: 'Lunchroom', kaartNaam: 'Lunchkaart', beloning: 'Gratis lunch', stempels: 8, kleur: '#ff7a45' },
  { id: 'restaurant', label: 'Restaurant', kaartNaam: 'Spaarkaart', beloning: 'Gratis dessert', stempels: 8, kleur: '#181f10' },
  { id: 'bakker', label: 'Bakker', kaartNaam: 'Broodkaart', beloning: 'Gratis brood', stempels: 10, kleur: '#e0ec32' },
  { id: 'kapper', label: 'Kapper', kaartNaam: 'Knipkaart', beloning: 'Halve prijs op je knipbeurt', stempels: 6, kleur: '#0ea5a3' },
  { id: 'nagels', label: 'Nagelstudio', kaartNaam: 'Beautykaart', beloning: 'Gratis behandeling', stempels: 8, kleur: '#e23b6d' },
  { id: 'sport', label: 'Sportschool', kaartNaam: 'Trainingskaart', beloning: 'Gratis les', stempels: 10, kleur: '#2d7ff9' },
  { id: 'anders', label: 'Iets anders', kaartNaam: 'Spaarkaart', beloning: 'Een gratis extra', stempels: 10, kleur: '#29c700' },
] as const

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const QR = `<svg class="wcard__qr" viewBox="0 0 48 48" aria-hidden="true"><rect x="2" y="2" width="14" height="14" rx="2" fill="none" stroke="#111" stroke-width="3"/><rect x="7" y="7" width="4" height="4" fill="#111"/><rect x="32" y="2" width="14" height="14" rx="2" fill="none" stroke="#111" stroke-width="3"/><rect x="37" y="7" width="4" height="4" fill="#111"/><rect x="2" y="32" width="14" height="14" rx="2" fill="none" stroke="#111" stroke-width="3"/><rect x="7" y="37" width="4" height="4" fill="#111"/><g fill="#111"><rect x="22" y="4" width="3" height="3"/><rect x="22" y="10" width="3" height="3"/><rect x="22" y="22" width="3" height="3"/><rect x="28" y="22" width="3" height="3"/><rect x="34" y="22" width="3" height="3"/><rect x="40" y="22" width="3" height="3"/><rect x="22" y="28" width="3" height="3"/><rect x="22" y="40" width="3" height="3"/><rect x="28" y="34" width="3" height="3"/><rect x="34" y="40" width="3" height="3"/><rect x="40" y="34" width="3" height="3"/><rect x="34" y="28" width="3" height="3"/><rect x="40" y="40" width="3" height="3"/><rect x="28" y="40" width="3" height="3"/></g></svg>`

/** De kaart zoals hij in Google Wallet of Apple Wallet staat. */
export function kaartHtml(o: Ontwerp): string {
  const nodig = Math.max(1, Math.round(o.stempels) || 1)
  const nu = Math.min(Math.max(0, o.nu), nodig)
  const rest = nodig - nu
  const vol = rest === 0
  const k = kaartKleuren(o.kleur, o.platform === 'google' ? GRENS_GOOGLE : undefined)
  const beloning = o.beloning.trim() || 'Je beloning'
  const invoer = { kleur: k.achter, donker: k.donker, labelKleur: k.label, beloning, nu, nodig, idPrefix: o.id }
  const label = esc(`Jouw beloning: ${beloning}. ${nu} van ${nodig} stempels.`)
  const zaak = esc(o.zaak.trim() || 'Jouw zaak')
  const kaart = esc(o.kaartNaam.trim() || 'Stempelkaart')
  const powered = `<span class="wcard__powered">${esc(onderQr(null))}</span>`

  if (o.platform === 'apple') {
    return `<div class="wcard wcard--apple" style="background:${k.achter};color:${k.voor}">`
      + `<div class="wa__head"><span class="wa__merk" style="background:${k.voor}" aria-hidden="true"></span>`
      + `<span class="wa__logotext">${zaak}</span>`
      + `<span class="wa__field wa__field--head"><small style="color:${k.label}">STEMPELS</small><b class="wcard__num">${nu}/${nodig}</b></span></div>`
      + `<div class="wa__strook" role="img" aria-label="${label}">${strookSvg(invoer)}</div>`
      + `<div class="wa__sec"><span class="wa__field"><small style="color:${k.label}">${vol ? 'STATUS' : 'NOG'}</small>`
      + `<b class="wcard__num">${vol ? 'Laat inwisselen' : `${rest} stempel${rest === 1 ? '' : 's'}`}</b></span>`
      + `<span class="wa__field wa__field--rechts"><small style="color:${k.label}">KAART</small><b>${kaart}</b></span></div>`
      + `<div class="wa__barcode">${QR}${powered}</div></div>`
  }
  return `<div class="wcard wcard--google" style="background:${k.achter};color:${k.voor}">`
    + `<div class="wg__kop"><span class="wg__logo" style="background:${k.donker ? '#f7f2e7' : '#181f10'}" aria-hidden="true">`
    + `<span class="wg__logomerk" style="background:${k.achter}"></span></span><span class="wg__issuer">${zaak}</span></div>`
    + `<div class="wg__prog">${kaart}</div>`
    + `<div class="wg__points"><span class="wg__pt"><small style="color:${k.label}">Stempels</small><b class="wcard__num">${nu} / ${nodig}</b></span>`
    + `<span class="wg__pt"><small style="color:${k.label}">Nog te gaan</small><b class="wcard__num">${vol ? 'Vol!' : rest}</b></span></div>`
    + `<div class="wg__qr">${QR}${powered}</div>`
    + `<div class="wg__hero" role="img" aria-label="${label}">${heroSvg(invoer)}</div></div>`
}

/** Een papieren stempelkaart op visitekaartformaat (85 × 55 mm), om te printen. */
export function printKaartSvg(o: Ontwerp): string {
  const k = kaartKleuren(o.kleur)
  const nodig = Math.min(Math.max(1, Math.round(o.stempels) || 1), 12)
  const perRij = nodig <= 6 ? nodig : Math.ceil(nodig / 2)
  const rijen = Math.ceil(nodig / perRij)
  const r = rijen === 1 ? 4.6 : 3.9
  const breedte = 85 - 14
  const stap = breedte / perRij
  const yStart = rijen === 1 ? 31 : 27.5
  const cirkels: string[] = []
  for (let i = 0; i < nodig; i++) {
    const rij = Math.floor(i / perRij)
    const kol = i % perRij
    const cx = 7 + stap * kol + stap / 2
    const cy = yStart + rij * (r * 2 + 2.2)
    const laatste = i === nodig - 1
    cirkels.push(
      `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r}" fill="${laatste ? k.voor : 'none'}" fill-opacity="${laatste ? 0.16 : 1}" stroke="${k.voor}" stroke-width="0.45" stroke-dasharray="${laatste ? '0' : '1.1 0.9'}"/>`,
    )
  }
  const beloning = esc(o.beloning.trim() || 'Je beloning')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 55" width="85mm" height="55mm" role="img" aria-label="Stempelkaart van ${esc(o.zaak || 'je zaak')}">`
    + `<rect width="85" height="55" rx="3" fill="${k.achter}"/>`
    + `<text x="7" y="10.5" font-family="Seatren, Georgia, serif" font-size="5.6" fill="${k.voor}">${esc(o.zaak.trim() || 'Jouw zaak')}</text>`
    + `<text x="7" y="16" font-family="Inter, Arial, sans-serif" font-size="2.6" letter-spacing="0.25" fill="${k.label}">${esc((o.kaartNaam || 'Stempelkaart').toUpperCase())}</text>`
    + cirkels.join('')
    + `<text x="7" y="50" font-family="Inter, Arial, sans-serif" font-size="2.7" fill="${k.voor}">Vol = <tspan font-weight="600">${beloning}</tspan></text>`
    + `<text x="78" y="50" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="1.9" fill="${k.label}">stampzer.com</text>`
    + `</svg>`
}
