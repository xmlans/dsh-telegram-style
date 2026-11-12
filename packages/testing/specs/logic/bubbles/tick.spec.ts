/**
 * The ticks in the reader's bubble: a clock while the submission is on its
 * way, two ticks as soon as it has been taken in.
 *
 * @capability bubbles
 * @features bubbles
 * @risk A message that never reached the model shows as delivered, or a delivered one keeps a clock.
 */
import { expect, test } from 'vitest'
import { bubbleTick } from '@dsh-telegram-style/client/pure'

test('a submission echo or a steering message waits on a clock', () => {
  expect(bubbleTick({ pending: true })).toBe('clock')
})

test('a message that has been taken in has two ticks, whether or not its turn still runs', () => {
  expect(bubbleTick({ pending: false })).toBe('read')
})
