/**
 * sticker.mjs — export the sticker mascot from its source image (spec 4.6).
 *
 * Crops the transparent margin by the alpha channel's bounding box, scales the
 * content to 192px tall (the 72px sticker at a 2x-and-more density) and writes
 * packages/assets/src/mascot/sticker/sticker.webp with its alpha kept, at
 * quality 90. The source is copied beside it, so a later export starts from
 * the copy the repository keeps.
 *
 * Usage: node scripts/sticker.mjs [<source.png>]
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT_DIR = path.join(ROOT, 'packages', 'assets', 'src', 'mascot', 'sticker')
const KEPT_SOURCE = path.join(OUT_DIR, 'sticker-source.png')
const FIRST_SOURCE = path.join(ROOT, 'design-assets', 'sticker-source.png')
const HEIGHT = 192

/** The smallest box holding every pixel whose alpha is above zero. */
async function alphaBox(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let left = info.width
  let top = info.height
  let right = -1
  let bottom = -1
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] === 0) continue
      if (x < left) left = x
      if (x > right) right = x
      if (y < top) top = y
      if (y > bottom) bottom = y
    }
  }
  if (right < 0) throw new Error(`sticker: ${file} has no visible pixel`)
  return { left, top, width: right - left + 1, height: bottom - top + 1, sourceWidth: info.width, sourceHeight: info.height }
}

const source = path.resolve(process.argv[2] ?? (fs.existsSync(KEPT_SOURCE) ? KEPT_SOURCE : FIRST_SOURCE))
const box = await alphaBox(source)
fs.mkdirSync(OUT_DIR, { recursive: true })
const webp = path.join(OUT_DIR, 'sticker.webp')
await sharp(source)
  .extract({ left: box.left, top: box.top, width: box.width, height: box.height })
  .resize({ height: HEIGHT })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(webp)
if (path.resolve(source) !== KEPT_SOURCE) fs.copyFileSync(source, KEPT_SOURCE)
const out = await sharp(webp).metadata()
console.log(`sticker: source ${box.sourceWidth}x${box.sourceHeight}, content ${box.width}x${box.height} at (${box.left},${box.top})`)
console.log(`sticker: wrote ${path.relative(ROOT, webp)} ${out.width}x${out.height}, ${fs.statSync(webp).size} bytes`)
