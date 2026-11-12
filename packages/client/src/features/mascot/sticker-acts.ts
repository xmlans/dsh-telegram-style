/** What the sticker shows (spec 4.6), written on its node as `data-dsh-tg-mascot-state`. */
export type StickerState = 'idle' | 'thinking' | 'working' | 'notification' | 'sweeping' | 'error' | 'happy' | 'sleeping' | 'waking' | 'hearts' | 'hop'

/** The duration tokens of the acts that play once; literal types, so the build can read which tokens the player asks for (D9). */
export type StickerOnceToken = '--dsh-tg-duration-sticker-wake' | '--dsh-tg-duration-sticker-hearts' | '--dsh-tg-duration-sticker-hop'

/** One act: the state the stylesheet animates, whether the working bounce runs fast, and the duration token of an act that plays once. */
export interface StickerAct {
  state: StickerState
  fast: boolean
  onceToken: StickerOnceToken | null
}

const ACTS: Readonly<Record<string, StickerAct>> = {
  'idle': { state: 'idle', fast: false, onceToken: null },
  'thinking': { state: 'thinking', fast: false, onceToken: null },
  'working': { state: 'working', fast: false, onceToken: null },
  'working-fast': { state: 'working', fast: true, onceToken: null },
  'notification': { state: 'notification', fast: false, onceToken: null },
  'sweeping': { state: 'sweeping', fast: false, onceToken: null },
  'error': { state: 'error', fast: false, onceToken: null },
  'happy': { state: 'happy', fast: false, onceToken: null },
  'sleeping': { state: 'sleeping', fast: false, onceToken: null },
  'waking': { state: 'waking', fast: false, onceToken: '--dsh-tg-duration-sticker-wake' },
  'hearts': { state: 'hearts', fast: false, onceToken: '--dsh-tg-duration-sticker-hearts' },
  'hop': { state: 'hop', fast: false, onceToken: '--dsh-tg-duration-sticker-hop' },
}

/** Every key the table holds: the state machine's animations, its moments, its sleep and wake, and the two reactions. */
export const STICKER_KEYS = Object.keys(ACTS)

/** The act for one key the state machine picked; a key the table does not hold is a bug, and fails here. */
export function stickerAct(key: string): StickerAct {
  const act = ACTS[key]
  if (act === undefined) throw new Error(`mascot: no sticker act for "${key}"`)
  return act
}
