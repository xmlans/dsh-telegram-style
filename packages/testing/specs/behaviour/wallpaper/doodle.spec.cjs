/**
 * The window shows the palette's plain-colour wallpaper with the pattern over it, and
 * the doodle switch in settings takes the pattern away and puts it back.
 *
 * @capability wallpaper
 * @features wallpaper
 * @risk The chat area loses its wallpaper (a flat block of colour), or the doodle switch does nothing.
 */
'use strict'
const { spec } = require('../../fixtures/behaviour.cjs')

module.exports = spec({ page: 'wallpaper' }, ({ test }) => {
  test('the wallpaper and its doodles are on by default', async (t) => {
    t.expectThat.equal(await t.read.attribute('body', t.surface.attribute('skin.doodle')), 'on', 'the doodle mirror reads on')
    const image = await t.read.computed('body', 'background-image')
    t.expectThat.equal(image, 'none', 'the body is a plain colour')
    const mask = await t.read.computed('body', 'mask-image', '::before')
    t.expectThat.equal(/url\(/.test(mask), true, 'the doodle layer masks with the pattern')
  })

  test('turning the doodles off leaves only the plain colour', async (t) => {
    await t.prefs({ doodle: false })
    t.expectThat.equal(await t.read.attribute('body', t.surface.attribute('skin.doodle')), 'off', 'the doodle mirror reads off')
    t.expectThat.equal(await t.read.computed('body', 'content', '::before'), 'none', 'no doodle layer')
    t.expectThat.equal(await t.read.computed('body', 'background-image'), 'none', 'the body still has no image')
    t.expectThat.equal(await t.read.computed('body', 'background-color') !== 'rgba(0, 0, 0, 0)', true, 'the plain wallpaper colour stays')
  })
})
