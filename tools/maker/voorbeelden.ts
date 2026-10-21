// Stampzer · vaste voorbeeldkaarten voor de pagina's (statisch in de HTML, dus ook zonder JavaScript
// zichtbaar en leesbaar voor zoekmachines). tools/bouw-maker.mjs zet ze tussen
// <!-- kaart:<naam> --> en <!-- /kaart --> in de pagina's.
import { BRANCHES, kaartHtml, type Ontwerp } from './kaart-html.ts'

const b = (id: string) => BRANCHES.find((x) => x.id === id)!
const ontwerp = (id: string, zaak: string, nu: number, platform: Ontwerp['platform'], sleutel: string): string => {
  const x = b(id)
  return kaartHtml({ zaak, kaartNaam: x.kaartNaam, beloning: x.beloning, stempels: x.stempels, kleur: x.kleur, nu, platform, id: sleutel })
}

export const VOORBEELDEN: Record<string, string> = {
  'maker-start': ontwerp('koffie', 'Jouw zaak', 3, 'google', 'vb0'),
  'pijler-google': ontwerp('koffie', 'Koffiebar De Hoek', 7, 'google', 'vb1'),
  'pijler-apple': ontwerp('kapper', 'Barbershop Noord', 4, 'apple', 'vb2'),
  'klantenkaart-apple': ontwerp('nagels', 'Studio Bloom', 5, 'apple', 'vb3'),
  'klantenkaart-google': ontwerp('bakker', 'Bakkerij Van Dam', 6, 'google', 'vb4'),
}
