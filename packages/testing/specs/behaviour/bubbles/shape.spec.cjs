/**
 * The conversation reads as Telegram bubbles: the reader's on the right in the
 * outgoing colour with the time and two ticks once taken in, the answer on the
 * left in a rounded bubble of its own.
 *
 * @capability bubbles
 * @features bubbles
 * @risk The reader's own messages and the answers look the same, or a long code block pushes the answer bubble past the column.
 */
'use strict'
const { spec } = require('../../fixtures/behaviour.cjs')

module.exports = spec({ page: 'bubbles' }, ({ test }) => {
  test('the reader\'s bubble sits right with 16/16/4/16 corners', async (t) => {
    const bubble = t.host('chat.message-bubble')
    const box = await t.read.box(bubble)
    const column = await t.read.box(t.host('chat.flow'))
    t.expectThat.equal(Math.round(column.right - box.right) <= 12, true, 'flush right, the tail aside')
    t.expectThat.equal(await t.read.computed(bubble, 'border-bottom-right-radius'), '4px', 'the tail corner')
    t.expectThat.equal(await t.read.computed(bubble, 'border-top-left-radius'), '16px', 'the round corner')
  })

  test('a taken-in message carries two ticks and a time', async (t) => {
    t.expectThat.equal(await t.read.attribute(t.surface('bubbles.meta'), t.surface.attribute('bubbles.tick')), 'read', 'two ticks')
    t.expectThat.equal(/^\d{2}:\d{2}$/.test(await t.read.text(t.surface('bubbles.meta'))), true, 'a clock time')
  })

  test('a wide code block scrolls inside the answer, the page does not', async (t) => {
    t.expectThat.noHorizontalOverflow(await t.read.overflow(t.host('chat.flow')), 'the chat column does not scroll sideways')
  })

  test('a taken-in message has two ticks even in the running turn and an unsent echo a clock', async (t) => {
    const meta = t.surface('bubbles.meta')
    const tick = t.surface.attribute('bubbles.tick')
    t.expectThat.equal(await t.read.count(`${meta}[${tick}="read"]`), 2, 'the answered message and the one in the running turn')
    t.expectThat.equal(await t.read.count(`${meta}[${tick}="clock"]`), 1, 'the echo waiting to be taken in')
  })
})
