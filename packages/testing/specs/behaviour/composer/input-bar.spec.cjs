/**
 * The composer reads as Telegram's input bar: a rounded card with the send
 * button standing apart as a 48px circle in the accent, which goes quiet while
 * the draft is empty.
 *
 * @capability composer
 * @features composer
 * @risk The send button disappears into the card, or an empty draft looks sendable.
 */
'use strict'
const { spec } = require('../../fixtures/behaviour.cjs')

module.exports = spec({ page: 'input-bar' }, ({ test }) => {
  // The bar is the draft's own scroll box: the conversation's card is a plain column
  // around it and the toolbar row, and the box is what the reader sees as the card.
  test('the bar has 16px corners and room for the send button', async (t) => {
    const bar = t.host('composer.scroll')
    t.expectThat.equal(await t.read.computed(bar, 'border-top-left-radius'), '16px', 'rounded card')
    const send = await t.read.box(t.surface('composer.send'))
    const box = await t.read.box(bar)
    t.expectThat.equal(Math.round(send.width), 48, 'a 48px button')
    t.expectThat.equal(send.left >= box.right, true, 'the button stands outside the bar')
  })

  test('an empty draft leaves the send button on the card ground', async (t) => {
    const background = await t.read.computed(t.surface('composer.send'), 'background-color')
    const bar = await t.read.computed(t.host('composer.scroll'), 'background-color')
    t.expectThat.equal(background, bar, 'the quiet button matches the card')
  })
})
