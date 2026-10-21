// Stampzer · de gratis stempelkaart-maker op /stempelkaart-maken/.
// Bouwen: node tools/bouw-maker.mjs → /assets/js/stempelkaart-maker.js (geen inline scripts: CSP).
// De bezoeker ontwerpt een kaart en ziet hem live zoals in Apple of Google Wallet. "Zet deze kaart
// live" geeft het ontwerp mee aan /registreren; de app maakt er na het aanmelden in één tik de
// echte kaart van (zie src/lib/herkomst.ts in de dashboard-repo). Printen kan ook: tien
// kaartjes op visitekaartformaat op een A4.
import { BRANCHES, kaartHtml, printKaartSvg, type Ontwerp, type Platform } from './kaart-html.ts'

// Slugs van de branchepagina's → id's van de voorstellen (voor links als ?branche=kapper).
const VAN_PAGINA: Record<string, string> = {
  koffiebar: 'koffie', lunchroom: 'lunch', restaurant: 'restaurant', bakker: 'bakker',
  kapper: 'kapper', nagelstudio: 'nagels', sportschool: 'sport',
}
const REGISTREREN = 'https://app.stampzer.com/registreren'

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null

function start() {
  const form = $<HTMLFormElement>('maker')
  const kaartVak = $('m-kaart')
  if (!form || !kaartVak) return

  const zaakIn = $<HTMLInputElement>('m-zaak')!
  const beloningIn = $<HTMLInputElement>('m-beloning')!
  const stempelsIn = $<HTMLInputElement>('m-stempels')!
  const stempelsUit = $('m-stempels-waarde')!
  const kleurIn = $<HTMLInputElement>('m-kleur')!
  const stempelKnop = $<HTMLButtonElement>('m-stempel')!
  const resetKnop = $<HTMLButtonElement>('m-reset')!
  const liveLink = $<HTMLAnchorElement>('m-live')!
  const printKnop = $<HTMLButtonElement>('m-print')!
  const printVel = $('m-printvel')!
  const status = $('m-status')!

  const gevraagd = new URLSearchParams(location.search).get('branche') || ''
  const startId = VAN_PAGINA[gevraagd] || (BRANCHES.some((b) => b.id === gevraagd) ? gevraagd : 'koffie')
  const appleToestel = /iPhone|iPad|Macintosh/.test(navigator.userAgent)

  let branche = BRANCHES.find((b) => b.id === startId) || BRANCHES[0]
  let beloningEigen = false
  let kleurEigen = false
  const s: Ontwerp = {
    zaak: '', kaartNaam: branche.kaartNaam, beloning: branche.beloning, stempels: branche.stempels,
    kleur: branche.kleur, nu: 3, platform: appleToestel ? 'apple' : 'google', id: 'mk',
  }

  const zetRadio = (naam: string, waarde: string) => {
    form.querySelectorAll<HTMLInputElement>(`input[name="${naam}"]`).forEach((r) => (r.checked = r.value === waarde))
  }

  function teken() {
    s.nu = Math.min(s.nu, s.stempels)
    kaartVak!.innerHTML = kaartHtml(s)
    stempelsUit.textContent = String(s.stempels)
    const vol = s.nu >= s.stempels
    stempelKnop.textContent = vol ? 'Kaart vol! Begin opnieuw' : 'Zet een stempel'
    status.textContent = vol
      ? `De kaart is vol: tijd voor ${s.beloning || 'de beloning'}.`
      : `${s.nu} van ${s.stempels} stempels.`
    const p = new URLSearchParams({
      zaak: s.zaak.trim(), branche: branche.id, beloning: s.beloning.trim(), stempels: String(s.stempels),
      kleur: s.kleur.replace('#', ''),
    })
    if (!s.zaak.trim()) p.delete('zaak')
    liveLink.href = `${REGISTREREN}?${p.toString()}`
  }

  function kiesBranche(id: string) {
    branche = BRANCHES.find((b) => b.id === id) || branche
    s.kaartNaam = branche.kaartNaam
    s.stempels = branche.stempels
    stempelsIn.value = String(branche.stempels)
    if (!beloningEigen) {
      s.beloning = branche.beloning
      beloningIn.value = branche.beloning
    }
    if (!kleurEigen) {
      s.kleur = branche.kleur
      kleurIn.value = branche.kleur
      zetRadio('kleur', branche.kleur)
    }
    s.nu = Math.min(3, s.stempels - 1)
  }

  form.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement
    if (t === zaakIn) s.zaak = t.value
    else if (t === beloningIn) { s.beloning = t.value; beloningEigen = t.value.trim() !== '' }
    else if (t === stempelsIn) s.stempels = Number(t.value)
    else if (t === kleurIn) { s.kleur = t.value; kleurEigen = true; zetRadio('kleur', '') }
    else if (t.name === 'kleur') { s.kleur = t.value; kleurIn.value = t.value; kleurEigen = true }
    else if (t.name === 'branche') kiesBranche(t.value)
    else if (t.name === 'platform') s.platform = t.value as Platform
    teken()
  })
  form.addEventListener('submit', (e) => e.preventDefault())

  stempelKnop.addEventListener('click', () => {
    s.nu = s.nu >= s.stempels ? 0 : s.nu + 1
    teken()
  })
  resetKnop.addEventListener('click', () => {
    s.nu = 0
    teken()
  })

  printKnop.addEventListener('click', () => {
    const een = printKaartSvg(s)
    printVel.innerHTML = `<div class="maker-print__vel">${Array.from({ length: 10 }, () => `<div class="maker-print__kaart">${een}</div>`).join('')}</div>`
    window.print()
  })

  // Begintoestand: de gevraagde branche en het toestel van de bezoeker.
  zetRadio('branche', branche.id)
  zetRadio('platform', s.platform)
  kiesBranche(branche.id)
  form.classList.add('maker--actief')
  teken()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start)
else start()
