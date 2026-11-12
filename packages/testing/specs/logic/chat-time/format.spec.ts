/**
 * The chat list's time column: today's rows show the clock, this week's the
 * day's name, this year's the month and day, and older rows the full date —
 * in Chinese and in English.
 *
 * @capability chat-time
 * @features chat-list
 * @risk The list shows yesterday's chat with a bare clock time, or a date in the wrong language, so the reader misjudges how recent a chat is.
 */
import fc from 'fast-check'
import { expect, test } from 'vitest'
import { formatChatTime } from '@dsh-telegram-style/client/pure'

// 2026-11-05 is a Thursday; every date below is local time, so the zone the run happens in does not matter.
const NOW = new Date(2026, 10, 5, 14, 52).getTime()
const at = (...parts: [number, number, number, number?, number?]) => new Date(parts[0], parts[1], parts[2], parts[3] ?? 12, parts[4] ?? 0).getTime()

test('today shows the clock, zero-padded, in both languages', () => {
  expect(formatChatTime(at(2026, 10, 5, 9, 7), NOW, 'zh')).toBe('09:07')
  expect(formatChatTime(at(2026, 10, 5, 0, 0), NOW, 'en')).toBe('00:00')
})

test('the six days before today show the day\'s name', () => {
  expect(formatChatTime(at(2026, 10, 4, 23, 59), NOW, 'zh')).toBe('周三')
  expect(formatChatTime(at(2026, 10, 4), NOW, 'en')).toBe('Wed')
  expect(formatChatTime(at(2026, 9, 30), NOW, 'zh')).toBe('周五')
  expect(formatChatTime(at(2026, 9, 30), NOW, 'en')).toBe('Fri')
})

test('a week back and earlier this year show the month and day', () => {
  expect(formatChatTime(at(2026, 9, 29), NOW, 'zh')).toBe('10月29日')
  expect(formatChatTime(at(2026, 9, 29), NOW, 'en')).toBe('Oct 29')
  expect(formatChatTime(at(2026, 2, 3), NOW, 'zh')).toBe('3月3日')
  expect(formatChatTime(at(2026, 2, 3), NOW, 'en')).toBe('Mar 3')
})

test('last year and earlier show the full date', () => {
  expect(formatChatTime(at(2025, 11, 31), NOW, 'zh')).toBe('2025/12/31')
  expect(formatChatTime(at(2019, 0, 9), NOW, 'en')).toBe('2019/1/9')
})

test('just past midnight, a minute before midnight is yesterday', () => {
  const justAfter = new Date(2026, 10, 5, 0, 1).getTime()
  expect(formatChatTime(at(2026, 10, 4, 23, 59), justAfter, 'zh')).toBe('周三')
})

test('any moment of today reads as a clock time', () => {
  fc.assert(fc.property(fc.integer({ min: 0, max: 14 * 60 + 52 }), (minute) => {
    const moment = new Date(2026, 10, 5, 0, minute).getTime()
    expect(formatChatTime(moment, NOW, 'en')).toMatch(/^\d{2}:\d{2}$/)
  }))
})
