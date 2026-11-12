/**
 * The sticker's acts: every key the mascot's state machine can hand over maps
 * to one sticker state, two or more sessions at work quicken the working bounce,
 * and an unknown key fails loudly instead of leaving the sticker frozen.
 *
 * @capability mascot
 * @features mascot
 * @risk The sticker keeps idling while a turn waits on the reader, or freezes on a state the table forgot.
 */
import { expect, test } from 'vitest'
import { MOMENTS, mascotLevel, stickerAct } from '@dsh-telegram-style/client/pure'
import type { MascotReading } from '@dsh-telegram-style/client/pure'

const KEYS = ['idle', 'thinking', 'working', 'working-fast', 'notification', 'sweeping', 'error', 'happy', 'sleeping', 'waking', 'hearts', 'hop']

test('every key the state machine hands over has an act', () => {
  for (const key of KEYS) expect(stickerAct(key).state).toBeTypeOf('string')
  expect(stickerAct('working-fast')).toEqual({ state: 'working', fast: true, onceToken: null })
  expect(stickerAct('waking').onceToken).toContain('sticker-wake')
})

test('the moments map to error and happy', () => {
  expect(stickerAct(MOMENTS.error.animation).state).toBe('error')
  expect(stickerAct(MOMENTS.attention.animation).state).toBe('happy')
})

test('one session at work bounces at the normal tempo, two at the fast one', () => {
  const list = (running: string[]) => ({ ids: running, byId: Object.fromEntries(running.map((id) => [id, { id, running: true, origin: 'user' }])), projectionsBySession: {} })
  const reading = (ids: string[]): MascotReading => ({ sessionId: null, status: null, list: list(ids) as unknown as MascotReading['list'], compacting: false, phase: null })
  expect(stickerAct(mascotLevel(reading(['a'])).animation)).toEqual({ state: 'working', fast: false, onceToken: null })
  expect(stickerAct(mascotLevel(reading(['a', 'b'])).animation).fast).toBe(true)
})

test('a key the table does not hold fails loudly', () => {
  expect(() => stickerAct('typing')).toThrow(/no sticker act/)
})
