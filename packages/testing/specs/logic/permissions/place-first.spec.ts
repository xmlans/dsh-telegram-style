/**
 * The permission control puts its node first in the strip beside the host's
 * access trigger. When another skin has wrapped that strip around the trigger,
 * the node would contain its own parent, and the browser refuses the insert.
 *
 * @capability permissions
 * @features permissions
 * @risk With a second skin enabled the permission control throws HierarchyRequestError on every pass and is switched off, so the composer shows no permission picker.
 */
import { expect, test } from 'vitest'
import { placeFirst } from '@dsh-telegram-style/client/pure'

test('a node is placed first in the strip', () => {
  const strip = document.createElement('div')
  strip.append(document.createElement('button'))
  const node = document.createElement('div')
  placeFirst(strip, node)
  expect(strip.firstChild).toBe(node)
})

test('a node that holds the strip, or is the strip, is left alone instead of throwing', () => {
  const outer = document.createElement('div')
  const strip = document.createElement('div')
  outer.append(strip)
  expect(() => placeFirst(strip, outer)).not.toThrow()
  expect(() => placeFirst(strip, strip)).not.toThrow()
  expect(outer.parentElement).toBeNull()
  expect(strip.parentElement).toBe(outer)
})
