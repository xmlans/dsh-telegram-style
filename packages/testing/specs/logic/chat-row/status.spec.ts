/**
 * A chat row's second line: waiting on the reader outranks typing, typing
 * outranks an unread reply, and an idle row names its workspace under the All
 * tab and its last activity under a workspace's own tab. The row key resolves
 * to the session it carries whatever separators the host puts around it.
 *
 * @capability chat-row
 * @features chat-list
 * @risk The reader misses a chat waiting on their approval because its row says "typing…", or a row shows another chat's state.
 */
import { expect, test } from 'vitest'
import { rowBadge, rowStatus, sessionIdOfRowKey } from '@dsh-telegram-style/client/pure'

const base = { running: false, pendingInteraction: false, completionUnread: false, folder: 'all', workspaceName: 'blog', updatedAt: 1000 }

test('waiting on the reader comes first, with the ! badge', () => {
  const status = rowStatus({ ...base, running: true, pendingInteraction: true, completionUnread: true })
  expect(status).toEqual({ kind: 'waiting' })
  expect(rowBadge(status)).toBe('!')
})

test('a running chat is typing, with no badge', () => {
  const status = rowStatus({ ...base, running: true, completionUnread: true })
  expect(status).toEqual({ kind: 'typing' })
  expect(rowBadge(status)).toBeNull()
})

test('an unread reply shows the 1 badge', () => {
  const status = rowStatus({ ...base, completionUnread: true })
  expect(status).toEqual({ kind: 'unread' })
  expect(rowBadge(status)).toBe('1')
})

test('an idle row names its workspace under All, its last activity under a workspace tab', () => {
  expect(rowStatus(base)).toEqual({ kind: 'workspace', name: 'blog' })
  expect(rowStatus({ ...base, folder: 'ws-1' })).toEqual({ kind: 'last-active', at: 1000 })
  expect(rowStatus({ ...base, workspaceName: null })).toEqual({ kind: 'last-active', at: 1000 })
})

test('a row key resolves to the listed session it carries', () => {
  const ids = new Set(['s-1', 's-22'])
  expect(sessionIdOfRowKey('s-22', ids)).toBe('s-22')
  expect(sessionIdOfRowKey('session:s-1', ids)).toBe('s-1')
  expect(sessionIdOfRowKey('ws-9/s-22', ids)).toBe('s-22')
  expect(sessionIdOfRowKey('project:ws-9', ids)).toBeNull()
})
