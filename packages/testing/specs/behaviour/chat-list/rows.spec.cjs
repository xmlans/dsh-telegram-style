/**
 * The sidebar reads as Telegram's chat list: each chat has a round avatar with
 * its first letter, the time of its last activity, and a second line that says
 * whether it is typing, waiting on the reader or has an unread reply.
 *
 * @capability chat-list
 * @features chat-list
 * @risk The reader cannot tell which chat waits on their approval, or the rows lose their titles behind the skin's own nodes.
 */
'use strict'
const { spec } = require('../../fixtures/behaviour.cjs')

/** The row standing for one session. */
const rowOf = (t, id) => `[${t.surface.attribute('chat-list.row')}="${id}"]`

module.exports = spec({ page: 'chat-list', bands: ['wide', 'phone'] }, ({ test }) => {
  test('every session row has an avatar with one character and a time', async (t) => {
    const avatars = await t.read.count(t.surface('chat-list.avatar'))
    t.expectThat.equal(avatars >= 3, true, 'three rows carry an avatar')
    const letter = await t.read.text(`${rowOf(t, 's-done')} ${t.surface('chat-list.avatar')}`)
    t.expectThat.equal([...letter].length, 1, 'one character in the avatar')
    const time = await t.read.text(`${rowOf(t, 's-done')} ${t.surface('chat-list.time')}`)
    t.expectThat.equal(time.length > 0, true, 'the time shows')
    const status = await t.read.text(`${rowOf(t, 's-done')} ${t.surface('chat-list.status')}`)
    t.expectThat.equal(status.length > 0, true, 'the second line says something')
  })

  test('the second line follows the session state, most urgent first', async (t) => {
    t.expectThat.equal(await t.read.attribute(rowOf(t, 's-ask'), t.surface.attribute('chat-list.row-state')), 'waiting', 'a question waits')
    t.expectThat.equal(await t.read.attribute(rowOf(t, 's-run'), t.surface.attribute('chat-list.row-state')), 'typing', 'a running chat types')
    t.expectThat.equal(await t.read.attribute(rowOf(t, 's-done'), t.surface.attribute('chat-list.row-state')), 'unread', 'a finished chat has news')
    t.expectThat.equal(await t.read.text(`${rowOf(t, 's-ask')} ${t.surface('chat-list.badge')}`), '!', 'the ! badge')
    t.expectThat.equal(await t.read.text(`${rowOf(t, 's-done')} ${t.surface('chat-list.badge')}`), '1', 'the 1 badge')
  })

  test('rows are 48px tall and the title stays on one line', async (t) => {
    const box = await t.read.box(rowOf(t, 's-done'))
    t.expectThat.equal(Math.round(box.height), 48, 'row height')
  })

  test('avatars are 36px, and 32px once the sidebar is narrower than 260px', async (t) => {
    const row = await t.read.box(rowOf(t, 's-done'))
    const avatar = await t.read.box(`${rowOf(t, 's-done')} ${t.surface('chat-list.avatar')}`)
    const narrow = row.width < 260
    t.expectThat.equal(Math.round(avatar.width), narrow ? 32 : 36, `avatar width in a ${Math.round(row.width)}px row`)
    t.expectThat.equal(Math.round(avatar.height), narrow ? 32 : 36, 'avatar height')
  })
})
