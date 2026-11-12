/** The mark at the end of the reader's bubble (spec 4.4). */
export type BubbleTick = 'clock' | 'read'

/**
 * A clock while the message is on its way (the host's submission echo or a
 * steering message not taken in yet), two ticks as soon as it has been taken in.
 */
export function bubbleTick(state: { pending: boolean }): BubbleTick {
  return state.pending ? 'clock' : 'read'
}
