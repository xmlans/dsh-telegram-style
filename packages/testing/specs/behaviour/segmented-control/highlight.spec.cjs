/**
 * A segmented control's highlight sits exactly under the chosen segment — the
 * one assistive technology reports as checked.
 *
 * @capability segmented-control
 * @features permissions, shared
 * @risk The highlight on the access-mode switch sits under a different choice than the one in force, so the reader believes the agent runs read-only while it has full access.
 */
'use strict'
const { spec } = require('../../fixtures/behaviour.cjs')
const { boxOf } = require('../../fixtures/boxes.cjs')

/**
 * The box the control's highlight paints, read off its computed style: the
 * pseudo-element is placed at the control's padding edge and moved by its
 * transform.
 */
function highlightBox(group) {
  return group.evaluate((control) => {
    const style = getComputedStyle(control, '::before')
    if (style.content === 'none' || style.content === 'normal') return null
    const matrix = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform)
    const box = control.getBoundingClientRect()
    const zoom = box.width / control.offsetWidth
    const left = box.left + (control.clientLeft + matrix.m41) * zoom
    const top = box.top + (control.clientTop + matrix.m42) * zoom
    return { left, top, right: left + parseFloat(style.width) * zoom, bottom: top + parseFloat(style.height) * zoom, width: parseFloat(style.width) * zoom, height: parseFloat(style.height) * zoom }
  })
}

/** The checked segment's own box. */
async function checkedBox(page) {
  return boxOf(page.getByRole('radio', { checked: true }))
}

/** Two boxes the same to a pixel on every edge. */
function sameBox(t, actual, expected, label) {
  t.expectThat.visible(actual, `${label}: the highlight is drawn`)
  t.expectThat.boxWithin(actual, expected, label, 1)
  t.expectThat.boxWithin(expected, actual, label, 1)
}

module.exports = spec({ page: 'automode-hero' }, ({ test }) => {
  test('the highlight sits under the checked choice', async (t) => {
    const group = t.page.getByRole('radiogroup')
    sameBox(t, await highlightBox(group), await checkedBox(t.page), 'the highlight covers the checked segment')
  })
})
