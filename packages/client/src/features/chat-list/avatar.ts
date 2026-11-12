/** How many avatar colours there are (`--dsh-tg-avatar-1` … `-7`, spec 4.12). */
export const AVATAR_SLOTS = 7

/** 1–7 from an id: FNV-1a over its UTF-16 code units, so one id always gets one colour. */
export function avatarSlot(id: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < id.length; i++) hash = Math.imul(hash ^ id.charCodeAt(i), 0x01000193) >>> 0
  return (hash % AVATAR_SLOTS) + 1
}

const PICTOGRAPH = /\p{Extended_Pictographic}/u
const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/**
 * The avatar's character (spec 4.2): the title's first grapheme, an emoji kept
 * whole, a letter upper-cased unless upper-casing turns it into two letters,
 * and `#` for a title with nothing in it.
 */
export function avatarInitial(title: string): string {
  const first = graphemes.segment(title.trim())[Symbol.iterator]().next()
  if (first.done === true) return '#'
  const grapheme = first.value.segment
  if (PICTOGRAPH.test(grapheme)) return grapheme
  const upper = grapheme.toLocaleUpperCase('en-US')
  return upper.length > grapheme.length ? grapheme : upper
}
