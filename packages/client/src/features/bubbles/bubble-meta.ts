import { CHAT_TURN_ATTRIBUTE, MESSAGE_BUBBLE_SELECTOR, PENDING_STEERING_SELECTOR, SUBMISSION_ECHO_SELECTOR } from '@dsh-telegram-style/contracts/dom'
import { conversationSessionId, findChatTarget, findConversationSession } from '@dsh-telegram-style/engine/host'
import type { HostContext } from '@dsh-telegram-style/engine/host'
import { buildElement, setAttributeIfChanged } from '@dsh-telegram-style/engine/dom'
import { iconElement } from '../../shared/icons'
import { bubbleTick } from './bubble-tick'
import type { BubbleTick } from './bubble-tick'

const TICK_ICON = { clock: 'clock', read: 'check-double' } as const

/** The reader's bubble in the submission echo: the same host bubble, before its row settles. */
const ECHO_BUBBLE_SELECTOR = `${SUBMISSION_ECHO_SELECTOR} [data-dsh-tg-part~="message-bubble"]`
const BUBBLES_SELECTOR = `${MESSAGE_BUBBLE_SELECTOR}, ${ECHO_BUBBLE_SELECTOR}, ${PENDING_STEERING_SELECTOR}`

/** The meta line one bubble carries: its time and its tick, built once and updated in place. */
interface Meta {
  node: HTMLElement
  time: HTMLElement
  tick: BubbleTick | null
}

/**
 * The time and ticks at the bottom right of the reader's bubbles (spec 4.4).
 * The time is the turn's own (the session's chat snapshot, read through the
 * engine's accessor); a pending steering message or the submission echo shows
 * the current time, whatever turn it sits in; the tick follows bubbleTick. The host's DOM carries no
 * time of its own in the bubble, so the snapshot is the source.
 */
export function createBubbleMeta(ctx: HostContext) {
  const metas = new Map<HTMLElement, Meta>()

  function clock(at: number | undefined) {
    if (at === undefined) return ''
    const date = new Date(at)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  function sync() {
    const column = findConversationSession()
    const sessionId = column === null ? null : conversationSessionId(column)
    const snapshot = sessionId === null ? null : findChatTarget(ctx, sessionId)?.getSnapshot() ?? null
    const seen = new Set<HTMLElement>()
    for (const bubble of column === null ? [] : column.querySelectorAll<HTMLElement>(BUBBLES_SELECTOR)) {
      seen.add(bubble)
      const pending = !bubble.matches(MESSAGE_BUBBLE_SELECTOR)
      const turnId = bubble.closest(`[${CHAT_TURN_ATTRIBUTE}]`)?.getAttribute(CHAT_TURN_ATTRIBUTE) ?? null
      const turn = turnId === null ? undefined : snapshot?.timeline.turns.get(Number(turnId))
      const tick = bubbleTick({ pending })
      let meta = metas.get(bubble)
      if (meta === undefined) {
        const node = buildElement('span', 'dsh-tg-bubble-meta')
        const time = buildElement('span', 'dsh-tg-bubble-time')
        node.append(time)
        bubble.append(node)
        meta = { node, time, tick: null }
        metas.set(bubble, meta)
      } else if (!bubble.contains(meta.node)) {
        // The host re-rendered the bubble's content and swept the line away: hang the same node back.
        bubble.append(meta.node)
      }
      const text = clock(pending ? Date.now() : turn?.start?.time)
      if (meta.time.textContent !== text) meta.time.textContent = text
      if (meta.tick !== tick) {
        meta.node.querySelector('.dsh-tg-icon')?.remove()
        meta.node.append(iconElement(TICK_ICON[tick]))
        meta.tick = tick
        setAttributeIfChanged(meta.node, 'data-tick', tick)
      }
    }
    for (const [bubble, meta] of metas) {
      if (seen.has(bubble)) continue
      meta.node.remove()
      metas.delete(bubble)
    }
  }

  function dispose() {
    for (const meta of metas.values()) meta.node.remove()
    metas.clear()
  }

  return { sync, dispose }
}
