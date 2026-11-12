/**
 * The chat list floats as a card on the wallpaper: 8px off the window's edges
 * with 16px corners on a wide window, and flush with the edges on a window
 * under 760px.
 *
 * @capability floating-cards
 * @features wallpaper
 * @risk The sidebar overlaps the conversation or the window edge, or the narrow layout leaves a gap that steals width from the conversation.
 */
'use strict'
const { spec } = require('../../fixtures/behaviour.cjs')

/** The card the sidebar column stands: the sidebar's own box (chrome.css). */
const card = (t) => t.host('shell.sidebar-root')

module.exports = spec({ page: 'floating-cards', bands: ['wide', 'compact'] }, ({ test }) => {
  test('the sidebar card stands 8px off a wide window, flush on a narrow one', async (t) => {
    const narrow = t.page.viewportSize().width < 760
    const box = await t.read.box(card(t))
    t.expectThat.visible(box, 'the sidebar card is on the page')
    t.expectThat.equal(Math.round(box.left), narrow ? 0 : 8, 'left gap')
    t.expectThat.equal(Math.round(box.top), narrow ? 0 : 8, 'top gap')
  })

  test('the card has 16px corners on a wide window and none on a narrow one', async (t) => {
    const narrow = t.page.viewportSize().width < 760
    t.expectThat.equal(await t.read.computed(card(t), 'border-top-left-radius'), narrow ? '0px' : '16px', 'corner')
  })
})
