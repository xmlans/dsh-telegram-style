import { COMPOSER_STACK, conversationSessionId, findComposerCard, findComposerSeat, findConversationSession, findHeroRoot } from '@dsh-telegram-style/engine/host'
import type { HostContext } from '@dsh-telegram-style/engine/host'
import { buildElement, setAttributeIfChanged } from '@dsh-telegram-style/engine/dom'
import { CHAIN_OVERLAY_FALLBACK_ATTRIBUTE } from '@dsh-telegram-style/contracts/dom'
import { MASCOT_PLACE_ATTR, MASCOT_STAND_ATTR, MASCOT_STATE_ATTR, MASCOT_TEMPO_ATTR } from '../../constants'
import { motionReduced } from '../../core/prefs'
import { motionMs } from '../../shared/motion'
import { iconElement } from '../../shared/icons'
import { createMascotSignals } from './mascot-signals'
import type { MascotMoment } from './mascot-signals'
import { decideStage, finishStage, freshStage, nextDecisionAt, switchSettles, takeMoment } from './mascot-stage'
import type { MascotPick, PlayMode } from './mascot-stage'
import { stickerAct } from './sticker-acts'
import type { FeatureUi } from '../../core/feature'
import type manifest from './mascot.manifest'

/**
 * The sticker mascot (spec 4.6): the reader's own image standing on the input
 * bar's top edge. The state machine is the upstream one (mascot-stage.ts,
 * mascot-signals.ts); this player only names the act on the node, and
 * sticker.css draws it with keyframes. A click lets hearts float up, a double
 * click asks for a hop; there is no dragging.
 */
export function createSticker(ctx: HostContext, ui: FeatureUi<typeof manifest>) {
  let root: HTMLElement | null = null
  let stand: Element | null = null
  /** The pending frame of show(): the state attribute goes on in it, and release() cancels it. */
  let frame: number | null = null
  let signals: ReturnType<typeof createMascotSignals> | null = null
  let stage = freshStage(Date.now())
  const around = () => ({ extras: [], extrasAllowed: false, random: Math.random })
  const playMs = (key: string) => {
    const token = stickerAct(key).onceToken
    return token === null ? 0 : motionMs(token)
  }

  function build() {
    const node = buildElement('span', 'dsh-tg-sticker')
    node.setAttribute('aria-hidden', 'true')
    const thought = buildElement('span', 'dsh-tg-sticker-thought')
    thought.append(buildElement('i', ''), buildElement('i', ''), buildElement('i', ''), iconElement('loop'), buildElement('b', ''))
    const badge = buildElement('span', 'dsh-tg-sticker-badge')
    badge.textContent = '!'
    const hearts = buildElement('span', 'dsh-tg-sticker-hearts')
    hearts.append(iconElement('heart'), iconElement('heart'), iconElement('heart'))
    const body = buildElement('span', 'dsh-tg-sticker-body')
    node.append(body, thought, badge, hearts)
    body.addEventListener('click', (event) => {
      event.stopPropagation()
      react('hearts')
    })
    body.addEventListener('dblclick', (event) => {
      event.stopPropagation()
      react('hop')
    })
    return node
  }

  /** Where the sticker stands: the home page's input card, or the conversation's stack or the panel that replaces it. */
  function findStand(conversation: boolean): { element: Element, session: string | null, place: string } | null {
    const heroCard = ui.composer ? ui.composer.heroCard() : findHeroRoot() === null ? null : findComposerCard()
    if (heroCard !== null) return { element: heroCard, session: null, place: 'card' }
    if (!conversation) return null
    if (ui.composer !== undefined && ui.composer.isChatHidden()) return null
    const content = findConversationSession()
    const seat = content === null ? null : findComposerSeat(content)
    if (seat === null) return null
    const session = conversationSessionId(content)
    const fallback = seat.querySelector<HTMLElement>(`[${CHAIN_OVERLAY_FALLBACK_ATTRIBUTE}="conversation.composer"]`)
    if (fallback !== null && fallback.style.display === 'none') {
      const panel = fallback.nextElementSibling
      return panel === null ? null : { element: panel, session, place: 'panel' }
    }
    const stack = seat.querySelector(COMPOSER_STACK)
    return stack === null ? null : { element: stack, session, place: 'stack' }
  }

  function sync(conversation: boolean) {
    const found = findStand(conversation)
    if (found === null) {
      release()
      return
    }
    if (root === null) root = build()
    if (signals === null) {
      stage.quietSince = Date.now()
      signals = createMascotSignals(ctx, onMoment, refresh)
    }
    if (root.parentNode !== found.element) found.element.appendChild(root)
    if (stand !== null && stand !== found.element) stand.removeAttribute(MASCOT_STAND_ATTR)
    stand = found.element
    setAttributeIfChanged(stand, MASCOT_STAND_ATTR, found.place)
    setAttributeIfChanged(root, MASCOT_PLACE_ATTR, found.place)
    if (found.session !== stage.sessionId) {
      stage.sessionId = found.session
      stage.moment = null
      stage.queued = null
    }
    signals.follow(stage.sessionId)
    refresh()
  }

  function refresh() {
    if (signals === null) return
    stage.level = signals.read(stage.sessionId)
    step()
  }

  function onMoment(name: MascotMoment) {
    if (takeMoment(stage, name, Date.now())) step()
  }

  function react(key: 'hearts' | 'hop') {
    stage.reaction = { key, mode: 'once', fresh: true }
    step()
  }

  function step() {
    if (root === null || stage.level === null) return
    const now = Date.now()
    const current = stage.current
    if (current !== null && current.mode === 'once' && current.done !== true && now - current.start >= playMs(current.key)) {
      current.done = true
      finishStage(stage, current.key, now, Math.random)
    }
    const next = decideStage(stage, now, stage.level, around())
    const switching = stage.current === null || next.key !== stage.current.key || (stage.reaction !== null && stage.reaction.fresh)
    const settled = switchSettles(stage, next, now)
    if (switching && settled) show(root, next, now)
    schedule(now, switching && !settled)
  }

  function show(node: HTMLElement, next: MascotPick, now: number) {
    const act = stickerAct(next.key)
    stage.current = { key: next.key, mode: next.mode as PlayMode, priority: next.priority, start: now }
    if (stage.reaction !== null && stage.reaction.key === next.key) stage.reaction.fresh = false
    // A repeated once-act restarts its keyframes: the attribute comes off for one frame.
    if (next.mode === 'once' && node.getAttribute(MASCOT_STATE_ATTR) === act.state) node.removeAttribute(MASCOT_STATE_ATTR)
    if (frame !== null) cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      frame = null
      setAttributeIfChanged(node, MASCOT_STATE_ATTR, act.state)
    })
    setAttributeIfChanged(node, MASCOT_TEMPO_ATTR, act.fast ? 'fast' : 'normal')
  }

  function schedule(now: number, waitSettle: boolean) {
    if (stage.timer !== null) clearTimeout(stage.timer)
    stage.timer = null
    const at = nextDecisionAt(stage, now, waitSettle, playMs)
    if (at === Infinity) return
    stage.timer = setTimeout(() => {
      stage.timer = null
      step()
    }, Math.max(at - now, 0))
  }

  function onActivity() {
    stage.quietSince = Date.now()
    if (!stage.asleep) return
    stage.asleep = false
    stage.waking = !motionReduced()
    step()
  }

  function release() {
    if (stage.timer !== null) clearTimeout(stage.timer)
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
    if (root !== null && root.parentNode !== null) root.parentNode.removeChild(root)
    if (stand !== null) stand.removeAttribute(MASCOT_STAND_ATTR)
    stand = null
    if (signals !== null) signals.dispose()
    signals = null
    stage = freshStage(Date.now())
  }

  function dispose() {
    release()
    root = null
  }

  return { sync, release, onActivity, dispose, standing: () => stand }
}
