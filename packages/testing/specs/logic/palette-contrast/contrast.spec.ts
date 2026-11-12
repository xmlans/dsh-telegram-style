/**
 * Every text colour the palettes put on a ground keeps the contrast spec 1.1
 * asks for: body text, labels and buttons 4.5:1, timestamps and meaningful
 * icons 3:1. A translucent ground is first laid over the palette's brightest
 * wallpaper colour, and a gradient fill is held to its worst stop.
 *
 * @capability palette-contrast
 * @features settings
 * @risk A reader with low vision cannot read the chat list, the bubbles or the buttons under one of the six palette × theme combinations.
 */
import { expect, test } from 'vitest'
import { TOKEN_DOCUMENT } from '@dsh-telegram-style/client/pure'

type Rgba = [number, number, number, number]
const PALETTES = ['telegram', 'glass', 'trans'] as const
const THEMES = ['light', 'dark'] as const
/** The leading part every token name shares, read off the document so the skin's prefix is spelled once, there. */
const PREFIX = /^--[a-z]+-[a-z]+-/.exec(TOKEN_DOCUMENT.palette[0].token)![0]

/** Every hex or rgba() colour in a CSS value, in order. */
function colours(value: string): Rgba[] {
  const found: Rgba[] = []
  for (const match of value.matchAll(/#([0-9a-f]{6})\b|rgba?\(([^)]+)\)/gi)) {
    if (match[1] !== undefined) {
      const hex = match[1]
      found.push([parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), 1])
    } else {
      const parts = match[2].split(',').map((part) => Number(part.trim()))
      found.push([parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1])
    }
  }
  if (found.length === 0) throw new Error(`palette-contrast: no colour in "${value}"`)
  return found
}

function over(top: Rgba, under: Rgba): Rgba {
  const alpha = top[3]
  return [0, 1, 2].map((i) => top[i] * alpha + under[i] * (1 - alpha)).concat(1) as Rgba
}

function luminance(colour: Rgba) {
  const channel = (value: number) => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(colour[0]) + 0.7152 * channel(colour[1]) + 0.0722 * channel(colour[2])
}

function ratio(a: Rgba, b: Rgba) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high + 0.05) / (low + 0.05)
}

function value(name: string, palette: typeof PALETTES[number], theme: typeof THEMES[number]): string {
  const token = PREFIX + name
  const item = TOKEN_DOCUMENT.palette.find((entry) => entry.token === token)
  if (item !== undefined) return item[palette][theme]
  const shared = TOKEN_DOCUMENT.shared.find((entry) => entry.token === token)
  if (shared !== undefined) return shared[theme]
  throw new Error(`palette-contrast: ${token} is no palette or shared token`)
}

/** The opaque grounds a fill stands for: each stop of it laid over the brightest wallpaper colour, or over a given ground. */
function grounds(token: string, palette: typeof PALETTES[number], theme: typeof THEMES[number], under?: Rgba[]): Rgba[] {
  const base = under ?? [colours(value('wallpaper', palette, theme)).sort((a, b) => luminance(b) - luminance(a))[0]]
  return colours(value(token, palette, theme)).flatMap((stop) => base.map((ground) => over(stop, ground)))
}

/** The worst ratio of a text colour over any of the grounds. */
function worst(textToken: string, groundList: Rgba[], palette: typeof PALETTES[number], theme: typeof THEMES[number]) {
  const text = colours(value(textToken, palette, theme))[0]
  return Math.min(...groundList.map((ground) => ratio(over(text, ground), ground)))
}

/** [text token, ground token, minimum, optional ground the ground token lies on]. */
const PAIRS: [string, string, number, string?][] = [
  ['ink', 'card', 4.5],
  ['ink-secondary', 'card', 4.5],
  ['accent-text', 'card', 4.5],
  ['accent', 'card', 3],
  ['ink', 'menu', 4.5],
  ['ink-secondary', 'menu', 4.5],
  ['ink', 'hover-bg', 4.5, 'card'],
  ['ink-secondary', 'hover-bg', 4.5, 'card'],
  ['accent-text', 'hover-bg', 4.5, 'card'],
  ['on-accent', 'accent-fill', 4.5],
  ['bubble-out-ink', 'bubble-out', 4.5],
  ['bubble-out-meta', 'bubble-out', 3],
  ['ink', 'bubble-in', 4.5],
  ['accent-text', 'bubble-in', 4.5],
  ['bubble-in-meta', 'bubble-in', 3],
  ['ink', 'inline-code-bg', 4.5, 'bubble-in'],
  ['ink', 'code-block', 4.5, 'bubble-in'],
  ['service-ink', 'service', 4.5],
  ['selected-ink', 'selected', 4.5],
  ['accent-text', 'settings-page', 4.5],
  ['ink', 'settings-page', 4.5],
]

for (const palette of PALETTES) {
  for (const theme of THEMES) {
    for (const [text, ground, minimum, beneath] of PAIRS) {
      test(`${palette} ${theme}: ${text} on ${ground} keeps ${minimum}:1`, () => {
        const under = beneath === undefined ? undefined : grounds(beneath, palette, theme)
        expect(worst(text, grounds(ground, palette, theme, under), palette, theme)).toBeGreaterThanOrEqual(minimum)
      })
    }
  }
}

test('a white initial keeps 3:1 on every avatar colour', () => {
  const white: Rgba = [255, 255, 255, 1]
  for (let slot = 1; slot <= 7; slot++) {
    for (const theme of THEMES) {
      const fill = colours(value(`avatar-${slot}`, 'telegram', theme))[0]
      expect(ratio(white, fill)).toBeGreaterThanOrEqual(3)
    }
  }
})
