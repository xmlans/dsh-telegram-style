/**
 * The sticker stands on the home page's input bar idling, breathes while
 * motion plays, holds perfectly still under reduced motion, and lets hearts
 * float up when clicked.
 *
 * @capability mascot
 * @features mascot
 * @risk A reader who asked for reduced motion still gets a bouncing sticker, the sticker covers the send button, it shows the wrong state on a conversation page, or it stays when the reader turns it off.
 */
'use strict'
const { spec } = require('../../fixtures/behaviour.cjs')

/**
 * Seat the stand-in's composer the way the host seats a conversation's: the
 * stack inside the composer seat inside the active phase's session column, the
 * card no longer the hero.
 */
async function seatConversation(t) {
  await t.prefs({ mascotScope: 'all' })
  await t.page.evaluate(([card, phase, session, seatAttribute]) => {
    const element = document.querySelector(card)
    const stack = element.parentElement
    const seat = document.createElement('div')
    seat.setAttribute(seatAttribute, '')
    element.removeAttribute(phase)
    const wrapper = document.createElement('div')
    wrapper.setAttribute(phase, 'active')
    const column = document.createElement('div')
    column.setAttribute(session, 'smoke-mascot')
    stack.parentElement.insertBefore(wrapper, stack)
    wrapper.append(column)
    column.append(seat)
    seat.append(stack)
  }, [t.host('composer.card'), t.host('shell.phase'), t.host('conversation.session-attribute'), t.host.attribute('composer.seat')])
  await t.settle()
}

/** Wait for the sticker to show `state` (and `tempo`, when named); the acts come on the page's own clock. */
async function untilState(t, state, tempo) {
  await t.page.waitForFunction(([selector, stateName, tempoName, wanted, wantedTempo]) => {
    const node = document.querySelector(selector)
    return node !== null && node.getAttribute(stateName) === wanted && (wantedTempo === undefined || node.getAttribute(tempoName) === wantedTempo)
  }, [t.surface('mascot.sticker'), t.surface.attribute('mascot.state'), t.surface.attribute('mascot.tempo'), state, tempo], { timeout: 5000 })
}

module.exports = spec({ page: 'sticker' }, ({ test }) => {
  test('the sticker idles on the home card and breathes', async (t) => {
    t.expectThat.equal(await t.read.attribute(t.surface('mascot.sticker'), t.surface.attribute('mascot.state')), 'idle', 'idle')
    t.expectThat.moving(await t.read.animations(t.surface('mascot.sticker-body')), 'the breath plays')
  })

  test('under reduced motion nothing moves', async (t) => {
    await t.prefs({ motion: 'reduced' })
    t.expectThat.still(await t.read.animations(t.surface('mascot.sticker-body')), 'the sticker holds still')
  })

  test('a click lets hearts float up', async (t) => {
    // The idle breath keeps the body moving, so the click skips Playwright's wait for it to stand still.
    await t.page.click(t.surface('mascot.sticker-body'), { force: true })
    // The act is short and plays back to idle on its own, so the page is waited on for it, not settled.
    await t.page.waitForFunction(([selector, attribute]) => document.querySelector(selector)?.getAttribute(attribute) === 'hearts',
      [t.surface('mascot.sticker'), t.surface.attribute('mascot.state')], { timeout: 2000 })
    t.expectThat.equal(await t.read.attribute(t.surface('mascot.sticker'), t.surface.attribute('mascot.state')), 'hearts', 'the hearts act')
  })

  test('the sticker stays clear of the send button', async (t) => {
    t.expectThat.boxesApart(await t.read.box(t.surface('mascot.sticker')), await t.read.box(t.surface('composer.send')), 'the sticker and the send circle of the card do not overlap')
  })

  test('on the home card the sticker stands above the top edge, not over it', async (t) => {
    const sticker = await t.read.box(t.surface('mascot.sticker'))
    const card = await t.read.box(t.host('composer.card'))
    t.expectThat.equal(sticker !== null && card !== null && sticker.bottom <= card.top, true, 'the feet are on or above the top edge of the card')
  })

  test('on a conversation page the stack it stands on holds it wherever the numbers stand', async (t) => {
    // The inline position of the numbers is the one that leaves the stack without a position of its own.
    await t.prefs({ statsPosition: 'inline' })
    await seatConversation(t)
    const held = await t.page.evaluate(([sticker, place]) => {
      const node = document.querySelector(sticker)
      return node === null ? null : { place: node.getAttribute(place), position: getComputedStyle(node.parentElement).position, contained: node.offsetParent === node.parentElement }
    }, [t.surface('mascot.sticker'), t.surface.attribute('mascot.place')])
    t.expectThat.equal(held, { place: 'stack', position: 'relative', contained: true }, 'the stack is the containing block')
  })

  test('on a conversation page it shows what the session is doing', async (t) => {
    await seatConversation(t)
    await untilState(t, 'idle')
    await t.page.evaluate(() => window.__mascot.setTurn('none'))
    await untilState(t, 'thinking')
    await t.page.evaluate(() => window.__mascot.setTurn('text'))
    await untilState(t, 'working', 'normal')
    await t.page.evaluate(() => {
      window.__mascot.addSessions(['smoke-other'])
      window.__mascot.setStatus('smoke-mascot', { running: true })
      window.__mascot.setStatus('smoke-other', { running: true })
    })
    await untilState(t, 'working', 'fast')
    await t.page.evaluate(() => window.__mascot.setStatus('smoke-mascot', { running: true, pendingInteraction: { kind: 'approval' } }))
    await untilState(t, 'notification')
    await t.page.evaluate(() => {
      window.__mascot.setStatus('smoke-mascot', { running: false })
      window.__mascot.setStatus('smoke-other', { running: false })
      window.__mascot.setTurn(null)
      window.__mascot.emit({ type: 'turn/end', data: { reason: { kind: 'error' } } })
    })
    await untilState(t, 'error')
  })

  test('switching the mascot off takes the sticker away and on brings it back', async (t) => {
    await t.prefs({ mascot: false })
    t.expectThat.equal(await t.read.count(t.surface('mascot.sticker')), 0, 'no sticker with the mascot off')
    await t.prefs({ mascot: true })
    t.expectThat.equal(await t.read.count(t.surface('mascot.sticker')), 1, 'the sticker is back')
  })
})
