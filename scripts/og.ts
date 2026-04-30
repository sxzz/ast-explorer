// Generate public/og.png from the live dev server.
// Captures the UI in dark mode at lg-layout viewport, then composes a
// 1280×640 OG card with a large screenshot floating on the right and a
// tight typographic title block on the left, on a deep slate background.
//
// Usage:
//   pnpm dev   # in another terminal — dev server must be on http://localhost:3000
//   node scripts/og.ts

import { Buffer } from 'node:buffer'
import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import puppeteer from 'puppeteer-core'

// State is encoded into the hash fragment (see app/state/url.ts and the
// Implementation section of README.md). Empty `c` falls through to the
// language's default code template, so the screenshot stays in sync with
// whatever sample the app ships.
function utoa(data: string): string {
  return Buffer.from(data, 'utf8').toString('base64')
}
const HASH = utoa(
  JSON.stringify({
    l: 'javascript',
    p: 'babel',
    c: '',
    o: '',
  }),
)
const BASE = process.env.BASE_URL || 'http://localhost:3000/'
const URL = process.env.URL || `${BASE}#${HASH}`
const OUT = path.resolve(process.argv[2] || 'public/og.png')

// Layout is designed at a 1280×640 base and then scaled up for the final
// raster — keeps the SVG/CSS-style numbers readable.
const SCALE = 1.5
const px = (n: number) => Math.round(n * SCALE)

// Logical (design) dimensions — used inside the SVG viewBox.
const LW = 1280
const LH = 640
// Raster (output) dimensions.
const W = px(LW)
const H = px(LH)

// Capture viewport stays at lg-layout proportions so the UI renders the
// same way it does on a normal laptop (no extra empty space). The 2×
// device scale keeps text crisp once the screenshot is scaled to the card.
const VIEW_W = 1024
const VIEW_H = 640
const CARD_W = px(700)
const CARD_H = Math.round((CARD_W * VIEW_H) / VIEW_W)

// Palette (matches app vars.css dark mode)
const BG = '#0a0c0e'
const FG = '#ece8dd'
const MUTE = '#75726a'
const ACCENT = '#5fc99a'
const ACCENT_DEEP = '#2e7d5b'
const BORDER = '#25292f'

const TMP = await fs.mkdtemp(path.join(os.tmpdir(), 'og-'))

const browser = await puppeteer.launch({
  channel: 'chrome',
  headless: true,
  defaultViewport: {
    width: VIEW_W,
    height: VIEW_H,
    deviceScaleFactor: 2,
  },
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
})

const page = await browser.newPage()
await page.evaluateOnNewDocument(() => {
  try {
    localStorage.setItem('vueuse-color-scheme', 'dark')
  } catch {}
})
await page.emulateMediaFeatures([
  { name: 'prefers-color-scheme', value: 'dark' },
])
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60_000 })
await new Promise((r) => setTimeout(r, 2000))

const rawShot = path.join(TMP, 'shot.png')
await page.screenshot({
  path: rawShot,
  type: 'png',
  clip: { x: 0, y: 0, width: VIEW_W, height: VIEW_H },
})
await page.close()
await browser.close()
console.info('  captured dark UI')

// --- Title block SVG (left side) ---
// Read the SVG logo and recolor to accent green; render as a fixed-size
// <svg> element so we don't have to fight its viewBox.
const logoSvgRaw = await fs.readFile(path.resolve('public/logo.svg'), 'utf8')
const logoNode = logoSvgRaw
  .replace(/^<\?xml[^>]*\?>/, '')
  .replaceAll('#329672', ACCENT)
  .replace(
    /<svg[^>]*?viewBox="([^"]+)"[^>]*>/,
    (_m, vb) =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="44" height="44">`,
  )

// SVG uses logical (1280×640) coordinates inside the viewBox; the rasterizer
// scales the whole thing up to W×H with a high density for crisp text.
const titleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${LW} ${LH}">
  <defs>
    <linearGradient id="title-fade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="${FG}"/>
      <stop offset="1" stop-color="${FG}" stop-opacity="0.92"/>
    </linearGradient>
    <radialGradient id="accent-glow" cx="100%" cy="0%" r="80%">
      <stop offset="0" stop-color="${ACCENT_DEEP}" stop-opacity="0.55"/>
      <stop offset="0.55" stop-color="${ACCENT_DEEP}" stop-opacity="0.10"/>
      <stop offset="1" stop-color="${ACCENT_DEEP}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bottom-glow" cx="0%" cy="100%" r="55%">
      <stop offset="0" stop-color="${ACCENT_DEEP}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${ACCENT_DEEP}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- base -->
  <rect width="${LW}" height="${LH}" fill="${BG}"/>
  <rect width="${LW}" height="${LH}" fill="url(#accent-glow)"/>
  <rect width="${LW}" height="${LH}" fill="url(#bottom-glow)"/>

  <!-- bottom hairline -->
  <line x1="0" y1="${LH - 1}" x2="${LW}" y2="${LH - 1}"
    stroke="${BORDER}" stroke-width="1" opacity="0.55"/>

  <!-- title block, vertically centered in left column (text fits before card) -->
  <g transform="translate(72, 178)">
    <!-- logo + eyebrow row -->
    <g transform="translate(0, 0)">${logoNode}</g>
    <text x="58" y="30"
      font-family="ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
      font-size="20" font-weight="600" letter-spacing="3.6"
      fill="${ACCENT}">AST EXPLORER</text>

    <!-- wordmark -->
    <text x="0" y="118"
      font-family="'Geist', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
      font-size="52" font-weight="700" letter-spacing="-1.6"
      fill="url(#title-fade)">Inspect any AST,</text>
    <text x="0" y="172"
      font-family="'Geist', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
      font-size="52" font-weight="300" letter-spacing="-1.6" font-style="italic"
      fill="${MUTE}">from any parser.</text>

    <!-- parser list -->
    <text x="0" y="226"
      font-family="'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
      font-size="18" font-weight="400" letter-spacing="0.5"
      fill="${MUTE}">babel · typescript · vue · 30+ parsers</text>
  </g>

  <!-- subtle dotted ring decoration in the corner -->
  <g transform="translate(${LW - 96}, ${LH - 96})" opacity="0.35">
    <circle r="42" fill="none" stroke="${ACCENT_DEEP}" stroke-width="1"/>
    <circle r="22" fill="none" stroke="${ACCENT_DEEP}" stroke-width="1"
      stroke-dasharray="2 4"/>
  </g>
</svg>
`.trim()

const titlePath = path.join(TMP, 'title.png')
await fs.writeFile(path.join(TMP, 'title.svg'), titleSvg)
execSync(
  `magick -background none -density ${px(144) * 2} ${JSON.stringify(path.join(TMP, 'title.svg'))} -resize ${W}x${H} ${JSON.stringify(titlePath)}`,
)

// --- Card: rounded screenshot with shadow + 1px border ---
const cardPath = path.join(TMP, 'card.png')
const cardMaskPath = path.join(TMP, 'card-mask.png')
const cardShadowPath = path.join(TMP, 'card-shadow.png')
const cardBorderPath = path.join(TMP, 'card-border.png')
const radius = px(14)
const shadowBleed = px(40)
const shadowBlur = px(24)

execSync(
  `magick -size ${CARD_W}x${CARD_H} xc:none -fill white -draw "roundrectangle 0,0 ${CARD_W - 1},${CARD_H - 1} ${radius},${radius}" ${JSON.stringify(cardMaskPath)}`,
)
execSync(
  String.raw`magick ${JSON.stringify(rawShot)} -resize ${CARD_W}x${CARD_H}^ -gravity northwest -extent ${CARD_W}x${CARD_H} ${JSON.stringify(cardMaskPath)} -alpha off -compose CopyOpacity -composite ${JSON.stringify(cardPath)}`,
)
execSync(
  String.raw`magick -size ${CARD_W + shadowBleed * 2}x${CARD_H + shadowBleed * 2} xc:none -fill "#000000" -draw "roundrectangle ${shadowBleed},${shadowBleed} ${CARD_W + shadowBleed - 1},${CARD_H + shadowBleed - 1} ${radius},${radius}" -channel A -blur 0x${shadowBlur} -evaluate multiply 0.7 +channel ${JSON.stringify(cardShadowPath)}`,
)
execSync(
  String.raw`magick -size ${CARD_W}x${CARD_H} xc:none -stroke "${BORDER}" -strokewidth 1 -fill none -draw "roundrectangle 0,0 ${CARD_W - 1},${CARD_H - 1} ${radius},${radius}" ${JSON.stringify(cardBorderPath)}`,
)

// --- Final composite ---
// Card vertically centered, anchored to the right edge.
const cardMargin = px(40)
const shadowOffsetY = px(24)
const cardX = W - CARD_W - cardMargin
const cardY = Math.round((H - CARD_H) / 2)
const shadowX = cardX - shadowBleed
const shadowY = cardY - shadowBleed + shadowOffsetY

execSync(
  String.raw`magick ${JSON.stringify(titlePath)} \
    \( ${JSON.stringify(cardShadowPath)} \) -geometry +${shadowX}+${shadowY} -compose over -composite \
    \( ${JSON.stringify(cardPath)} \) -geometry +${cardX}+${cardY} -compose over -composite \
    \( ${JSON.stringify(cardBorderPath)} \) -geometry +${cardX}+${cardY} -compose over -composite \
    ${JSON.stringify(OUT)}`,
)

console.info(`✓ wrote ${OUT}`)
await fs.rm(TMP, { recursive: true, force: true })
