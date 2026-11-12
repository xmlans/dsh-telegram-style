import { ROW_SESSION_ATTR, ROW_STATE_ATTR, RIPPLE_ATTR } from '../../constants'
import { TREE_ROW_KEY_ATTRIBUTE } from '@dsh-telegram-style/contracts/dom'
import { hostSessions, hostUiSession } from '@dsh-telegram-style/engine/host'
import type { HostContext } from '@dsh-telegram-style/engine/host'
import { buildElement, setAttributeIfChanged } from '@dsh-telegram-style/engine/dom'
import { avatarInitial, avatarSlot } from './avatar'
import { formatChatTime } from './chat-time'
import { rowBadge, rowStatus, sessionIdOfRowKey } from './row-status'
import type { RowStatus } from './row-status'
import { uiLanguage } from '../../shared/ui-language'
import { copy } from './copy'

const ROW_SELECTOR = `[${TREE_ROW_KEY_ATTRIBUTE}][data-dsh-tg-part~="session-row"]`

/** The pieces the skin adds inside one host row, built once and updated in place. */
interface RowDress {
  avatar: HTMLElement
  time: HTMLElement
  status: HTMLElement
  badge: HTMLElement
}

/**
 * Dress the host's session rows as Telegram chat rows (spec 4.2): an avatar in
 * the session's colour, the time of its last activity, a second line saying
 * what it is doing, and a badge. The host keeps the row, its title, its menu
 * and its click; the skin adds four nodes and two attributes.
 */
export function createSessionRows(ctx: HostContext) {
  const dressed = new Map<HTMLElement, RowDress>()

  function dress(row: HTMLElement): RowDress {
    const held = dressed.get(row)
    if (held !== undefined) return held
    const piece: RowDress = {
      avatar: buildElement('span', 'dsh-tg-row-avatar'),
      time: buildElement('span', 'dsh-tg-row-time'),
      status: buildElement('span', 'dsh-tg-row-status'),
      badge: buildElement('span', 'dsh-tg-row-badge'),
    }
    piece.avatar.setAttribute('aria-hidden', 'true')
    row.prepend(piece.avatar)
    row.append(piece.time, piece.status, piece.badge)
    row.setAttribute(RIPPLE_ATTR, '')
    dressed.set(row, piece)
    return piece
  }

  function statusText(status: RowStatus) {
    switch (status.kind) {
      case 'waiting': return copy('rowWaiting')
      case 'typing': return copy('rowTyping')
      case 'unread': return copy('rowUnread')
      case 'workspace': return status.name
      case 'last-active': return copy('rowLastActive', { time: formatChatTime(status.at, Date.now(), uiLanguage()) })
    }
  }

  /** The workspace a row sits under, by its group's own project row (spec 6.1). */
  function workspaceOf(row: Element) {
    const group = row.closest('[data-dsh-tg-part~="group-section"]')
    const title = group?.querySelector('[data-dsh-tg-part~="project-row"] [data-dsh-tg-part~="row-title"]')
    return title?.textContent?.trim() || null
  }

  function sync(folder: string) {
    const list = hostSessions(ctx)?.list?.getSnapshot() ?? null
    const statuses = hostUiSession(ctx)?.sessionStatus?.getSnapshot() ?? null
    const ids = new Set(list === null ? [] : list.ids)
    const seen = new Set<HTMLElement>()
    for (const row of document.querySelectorAll<HTMLElement>(ROW_SELECTOR)) {
      const id = sessionIdOfRowKey(row.getAttribute(TREE_ROW_KEY_ATTRIBUTE) ?? '', ids)
      const entry = id === null || list === null ? undefined : list.byId[id]
      if (id === null || entry === undefined) continue
      seen.add(row)
      const piece = dress(row)
      const live = statuses?.get(id)
      const status = rowStatus({
        running: (live?.running ?? entry.running) === true,
        pendingInteraction: live?.pendingInteraction !== undefined,
        completionUnread: live?.completionUnread === true,
        folder,
        workspaceName: workspaceOf(row),
        updatedAt: entry.updatedAt,
      })
      setAttributeIfChanged(row, ROW_SESSION_ATTR, id)
      setAttributeIfChanged(row, ROW_STATE_ATTR, status.kind === 'workspace' || status.kind === 'last-active' ? 'idle' : status.kind)
      setAttributeIfChanged(piece.avatar, 'data-avatar', String(avatarSlot(id)))
      const initial = avatarInitial(entry.displayTitle ?? '')
      if (piece.avatar.textContent !== initial) piece.avatar.textContent = initial
      const time = formatChatTime(entry.updatedAt, Date.now(), uiLanguage())
      if (piece.time.textContent !== time) piece.time.textContent = time
      const text = statusText(status)
      if (piece.status.textContent !== text) piece.status.textContent = text
      const badge = rowBadge(status) ?? ''
      if (piece.badge.textContent !== badge) piece.badge.textContent = badge
    }
    for (const [row, piece] of dressed) {
      if (seen.has(row)) continue
      undress(row, piece)
    }
  }

  function undress(row: HTMLElement, piece: RowDress) {
    piece.avatar.remove()
    piece.time.remove()
    piece.status.remove()
    piece.badge.remove()
    row.removeAttribute(ROW_SESSION_ATTR)
    row.removeAttribute(ROW_STATE_ATTR)
    row.removeAttribute(RIPPLE_ATTR)
    dressed.delete(row)
  }

  function dispose() {
    for (const [row, piece] of [...dressed]) undress(row, piece)
  }

  return { sync, dispose }
}
