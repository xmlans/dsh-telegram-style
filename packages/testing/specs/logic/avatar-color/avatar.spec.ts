/**
 * A chat's avatar: one session id always gets the same of the seven colours,
 * the colours are spread evenly, and the letter is the title's first character
 * — upper-cased for letters, an emoji kept whole.
 *
 * @capability avatar-color
 * @features chat-list, model
 * @risk A chat changes colour between visits, most chats share one colour, or a title starting with an emoji shows half a glyph.
 */
import fc from 'fast-check'
import { expect, test } from 'vitest'
import { AVATAR_SLOTS, avatarInitial, avatarSlot } from '@dsh-telegram-style/client/pure'

test('one id always lands on the same slot, inside 1–7', () => {
  fc.assert(fc.property(fc.string(), (id) => {
    const slot = avatarSlot(id)
    expect(slot).toBe(avatarSlot(id))
    expect(slot).toBeGreaterThanOrEqual(1)
    expect(slot).toBeLessThanOrEqual(AVATAR_SLOTS)
  }))
})

test('7000 session ids spread evenly over the seven colours', () => {
  const counts = new Array(AVATAR_SLOTS + 1).fill(0)
  for (let i = 0; i < 7000; i++) counts[avatarSlot(`session-${i}`)] += 1
  for (let slot = 1; slot <= AVATAR_SLOTS; slot++) {
    expect(counts[slot]).toBeGreaterThan(850)
    expect(counts[slot]).toBeLessThan(1150)
  }
})

test('the initial is the first character, letters upper-cased', () => {
  expect(avatarInitial('  hello world')).toBe('H')
  expect(avatarInitial('éclair')).toBe('É')
  expect(avatarInitial('你好')).toBe('你')
  expect(avatarInitial('1984')).toBe('1')
})

test('an emoji stays whole, joined sequences included', () => {
  expect(avatarInitial('🎉 party')).toBe('🎉')
  expect(avatarInitial('👨‍👩‍👧 family')).toBe('👨‍👩‍👧')
})

test('a letter that upper-cases into two keeps its own form', () => {
  expect(avatarInitial('ßtraße')).toBe('ß')
})

test('a title with nothing to show gets #', () => {
  expect(avatarInitial('')).toBe('#')
  expect(avatarInitial('   ')).toBe('#')
})
