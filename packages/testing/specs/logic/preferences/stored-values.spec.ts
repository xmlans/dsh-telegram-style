/**
 * What a stored preference reads back as: the settings namespace holds values
 * an earlier build, a hand-edited file or another client wrote, and the clamp
 * turns each into one the skin draws (packages/contracts/src/prefs.ts).
 *
 * @capability preferences
 * @features core, contracts, mascot
 * @risk A reader who upgrades keeps a choice they made under an earlier build, or a hand-edited settings file breaks the whole page instead of falling back to the defaults.
 */
import { expect, test } from 'vitest'
import fc from 'fast-check'
import {
  PALETTE_TELEGRAM, PALETTE_TRANS,
  CHAT_ANIMATIONS_OFF, PREFS, PREF_DEFAULTS,
  PROVIDER_ID_MAX, QUICK_PROVIDERS_MAX, STATUS_MOTION_WASH, USERNAME_MAX, clampPrefs,
} from '@dsh-telegram-style/contracts/prefs'
import { OFFICIAL_MODEL_GROUP } from '@dsh-telegram-style/contracts/services'

test('an empty or unreadable value reads as the defaults', () => {
  expect(clampPrefs({})).toEqual(PREF_DEFAULTS)
  expect(clampPrefs(null)).toEqual(PREF_DEFAULTS)
  expect(clampPrefs('nonsense')).toEqual(PREF_DEFAULTS)
})

/**
 * Stored values no build ever wrote that once broke the read: an object holding a
 * field with a built-in's name, and that name itself, which an earlier-shape
 * lookup took for one of its own entries.
 */
const ODD_VALUES = [{ palette: { toString: [] } }, { palette: 'toString' }, { statusDetail: 'constructor' }, { autoPopover: { valueOf: 1 } }]

test('a value no build ever wrote reads as the default instead of breaking the read', () => {
  for (const stored of ODD_VALUES) {
    const key = Object.keys(stored)[0] as keyof typeof PREF_DEFAULTS
    expect(clampPrefs(stored)[key]).toBe(PREF_DEFAULTS[key])
  }
})

test('whatever is stored, every key reads back as a value of its own kind', () => {
  fc.assert(fc.property(fc.dictionary(fc.constantFrom(...Object.keys(PREFS)), fc.anything()), (stored) => {
    const read = clampPrefs(stored)
    expect(Object.keys(read).sort()).toEqual(Object.keys(PREF_DEFAULTS).sort())
    for (const key of Object.keys(PREF_DEFAULTS) as (keyof typeof PREF_DEFAULTS)[]) {
      expect(Array.isArray(read[key])).toBe(Array.isArray(PREF_DEFAULTS[key]))
      if (!Array.isArray(PREF_DEFAULTS[key])) expect(typeof read[key]).toBe(typeof PREF_DEFAULTS[key])
    }
  }), { examples: ODD_VALUES.map((stored): [Record<string, unknown>] => [stored]) })
})

test('a value already read back reads back the same', () => {
  fc.assert(fc.property(fc.dictionary(fc.constantFrom(...Object.keys(PREFS)), fc.anything()), (stored) => {
    const once = clampPrefs(stored)
    expect(clampPrefs(once)).toEqual(once)
  }), { examples: ODD_VALUES.map((stored): [Record<string, unknown>] => [stored]) })
})

test('a switch stays on unless stored as false', () => {
  expect(clampPrefs({ turnNav: false }).turnNav).toBe(false)
  expect(clampPrefs({ turnNav: 0 }).turnNav).toBe(true)
  expect(clampPrefs({ turnNav: 'false' }).turnNav).toBe(true)
})

test('a choice outside its set reads as its default', () => {
  expect(clampPrefs({ motion: 'reduced' }).motion).toBe('reduced')
  expect(clampPrefs({ motion: 'sometimes' }).motion).toBe(PREF_DEFAULTS.motion)
  expect(clampPrefs({ motion: 1 }).motion).toBe(PREF_DEFAULTS.motion)
  expect(clampPrefs({ statusMotion: STATUS_MOTION_WASH }).statusMotion).toBe(STATUS_MOTION_WASH)
  expect(clampPrefs({ statusMotion: 'glow' }).statusMotion).toBe(PREF_DEFAULTS.statusMotion)
  expect(clampPrefs({ statusDetail: 'simple' }).statusDetail).toBe(false)
  expect(clampPrefs({ statusDetail: 'precise' }).statusDetail).toBe(true)
  expect(clampPrefs({ statusDetail: 'verbose' }).statusDetail).toBe(PREF_DEFAULTS.statusDetail)
})

test('the caret switch reads the retired explicit-moves tier as on', () => {
  expect(clampPrefs({ caretMotion: 'typing' }).caretMotion).toBe('typing')
  expect(clampPrefs({ caretMotion: 'off' }).caretMotion).toBe('off')
  expect(clampPrefs({ caretMotion: 'move' }).caretMotion).toBe(PREF_DEFAULTS.caretMotion)
})

test('the palette an earlier build stored lands on the classic one, a new one stands, anything else reads as the default', () => {
  expect(clampPrefs({ palette: 'claude' }).palette).toBe(PALETTE_TELEGRAM)
  expect(clampPrefs({ palette: 'host' }).palette).toBe(PALETTE_TELEGRAM)
  expect(clampPrefs({ palette: PALETTE_TRANS }).palette).toBe(PALETTE_TRANS)
  expect(clampPrefs({ palette: 'anthropic' }).palette).toBe(PREF_DEFAULTS.palette)
})

test('the hover-open preference takes its earlier boolean shape', () => {
  expect(clampPrefs({ autoPopover: true }).autoPopover).toBe('all')
  expect(clampPrefs({ autoPopover: false }).autoPopover).toBe('off')
  expect(clampPrefs({ autoPopover: 'account' }).autoPopover).toBe('account')
  expect(clampPrefs({ autoPopover: 'often' }).autoPopover).toBe(PREF_DEFAULTS.autoPopover)
})

test('the chat-area animation switch keeps its boolean shape, and a value stored under the retired choice reads as on', () => {
  expect(clampPrefs({ chatAnimations: true }).chatAnimations).toBe(true)
  expect(clampPrefs({ chatAnimations: false }).chatAnimations).toBe(false)
  expect(clampPrefs({ chatAnimations: CHAT_ANIMATIONS_OFF }).chatAnimations).toBe(false)
  expect(clampPrefs({ chatAnimations: 'enhanced' }).chatAnimations).toBe(true)
  expect(clampPrefs({ chatAnimations: 'redraw' }).chatAnimations).toBe(true)
  expect(clampPrefs({ chatAnimations: 7 }).chatAnimations).toBe(PREF_DEFAULTS.chatAnimations)
})

test('quick providers keep distinct ids in order, without the official group, within both limits', () => {
  const long = 'x'.repeat(PROVIDER_ID_MAX + 1)
  expect(clampPrefs({ quickProviders: ['a', 'b', 'a', '', 3, long, OFFICIAL_MODEL_GROUP, 'c'] }).quickProviders).toEqual(['a', 'b', 'c'])
  expect(clampPrefs({ quickProviders: 'a' }).quickProviders).toEqual([])
  const many = Array.from({ length: QUICK_PROVIDERS_MAX + 5 }, (_, index) => `p${index}`)
  expect(clampPrefs({ quickProviders: many }).quickProviders).toHaveLength(QUICK_PROVIDERS_MAX)
})

test('the username is trimmed and cut to its limit', () => {
  expect(clampPrefs({ username: '  Ada  ' }).username).toBe('Ada')
  expect(clampPrefs({ username: 'y'.repeat(USERNAME_MAX + 10) }).username).toHaveLength(USERNAME_MAX)
  expect(clampPrefs({ username: 42 }).username).toBe('')
})

test('the sticker mascot is on by default; the values an earlier build stored read as on, and `off` as off', () => {
  expect(clampPrefs({}).mascot).toBe(true)
  for (const earlier of ['brand', 'crab', 'deepy']) expect(clampPrefs({ mascot: earlier }).mascot).toBe(true)
  expect(clampPrefs({ mascot: 'off' }).mascot).toBe(false)
  expect(clampPrefs({ mascot: false }).mascot).toBe(false)
})
