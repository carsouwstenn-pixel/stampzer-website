// Stampzer · bouwt de stempelkaart-maker en de voorbeeldkaarten op stampzer.com.
//
// Gebruik (vanuit de repo-map, met de dashboard-repo ernaast in ../stampzer-dashboard):
//   node tools/bouw-maker.mjs
//
// 1. assets/js/stempelkaart-maker.js: de maker voor /stempelkaart-maken/ (browser, geminificeerd).
// 2. In elke pagina komt tussen <!-- kaart:<naam> --> en <!-- /kaart --> de vaste voorbeeldkaart
//    uit tools/maker/voorbeelden.ts.
// Beide gebruiken kaart-svg.ts uit de dashboard-repo: dezelfde kaart als in de app en de Wallet.
// Deze map (tools/) hoort niet op de server.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ESBUILD = path.resolve(ROOT, '../stampzer-dashboard/node_modules/.bin/esbuild')
if (!fs.existsSync(ESBUILD)) throw new Error(`esbuild niet gevonden: ${ESBUILD} (staat de dashboard-repo ernaast, met npm install?)`)

const bouw = (...args) => execFileSync(ESBUILD, args, { cwd: ROOT, stdio: 'inherit' })
bouw('tools/maker/stempelkaart-maker.ts', '--bundle', '--format=iife', '--minify', '--target=es2019', '--legal-comments=none', '--outfile=assets/js/stempelkaart-maker.js')
const tijdelijk = path.join(ROOT, 'tools/maker/.voorbeelden.mjs')
bouw('tools/maker/voorbeelden.ts', '--bundle', '--platform=node', '--format=esm', `--outfile=${tijdelijk}`)
const { VOORBEELDEN } = await import(pathToFileURL(tijdelijk).href + `?t=${Date.now()}`)
fs.rmSync(tijdelijk)

const blok = /(<!-- kaart:([a-z0-9-]+) -->)[\s\S]*?(<!-- \/kaart -->)/g
let gewijzigd = 0
const loop = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || ['node_modules', 'admin', 'api', 'tools'].includes(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) loop(p)
    else if (/\.(html|php)$/.test(e.name)) {
      const oud = fs.readFileSync(p, 'utf8')
      const nieuw = oud.replace(blok, (m, open, naam, sluit) => {
        if (!VOORBEELDEN[naam]) throw new Error(`onbekende voorbeeldkaart "${naam}" in ${path.relative(ROOT, p)}`)
        return `${open}${VOORBEELDEN[naam]}${sluit}`
      })
      if (nieuw !== oud) { fs.writeFileSync(p, nieuw); gewijzigd++; console.log(`kaarten bijgewerkt: ${path.relative(ROOT, p)}`) }
    }
  }
}
loop(ROOT)
const kb = (fs.statSync(path.join(ROOT, 'assets/js/stempelkaart-maker.js')).size / 1024).toFixed(1)
console.log(`maker: ${kb} KB · ${gewijzigd} pagina('s) met voorbeeldkaarten bijgewerkt`)
