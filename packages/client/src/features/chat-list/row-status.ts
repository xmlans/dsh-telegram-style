/** What a chat row's second line says (spec 4.2). */
export type RowStatus =
  | { kind: 'waiting' }
  | { kind: 'typing' }
  | { kind: 'unread' }
  | { kind: 'workspace', name: string }
  | { kind: 'last-active', at: number }

export interface RowStatusInput {
  running: boolean
  pendingInteraction: boolean
  completionUnread: boolean
  /** The folder tab in force: `all`, or a workspace's key. */
  folder: string
  workspaceName: string | null
  updatedAt: number
}

/**
 * The row's state, most urgent first: a question or approval waiting on the
 * reader, then a turn running, then a reply not yet seen; an idle row names
 * its workspace under All and its last activity under a workspace's tab.
 */
export function rowStatus(input: RowStatusInput): RowStatus {
  if (input.pendingInteraction) return { kind: 'waiting' }
  if (input.running) return { kind: 'typing' }
  if (input.completionUnread) return { kind: 'unread' }
  if (input.folder === 'all' && input.workspaceName !== null) return { kind: 'workspace', name: input.workspaceName }
  return { kind: 'last-active', at: input.updatedAt }
}

/** The badge at the row's end: `!` while waiting on the reader, `1` for an unread reply. */
export function rowBadge(status: RowStatus): '!' | '1' | null {
  if (status.kind === 'waiting') return '!'
  if (status.kind === 'unread') return '1'
  return null
}

/** The session a tree row stands for: the listed id the row key is, or carries as a whole token (spec 6.1). */
export function sessionIdOfRowKey(key: string, ids: ReadonlySet<string>): string | null {
  if (ids.has(key)) return key
  const tokens = key.split(/[:/|#\s]+/)
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (ids.has(tokens[i])) return tokens[i]
  }
  return null
}
