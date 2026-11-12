import type { UiLanguage } from '../../shared/ui-language'

const ZH_WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const EN_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_MS = 86400000

function pad(value: number) {
  return String(value).padStart(2, '0')
}

/** Whole calendar days from `at` to `now` in local time: 0 the same day, negative a later day. Daylight-saving shifts do not count. */
function calendarDaysBetween(at: Date, now: Date) {
  return Math.round((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(at.getFullYear(), at.getMonth(), at.getDate())) / DAY_MS)
}

/**
 * The chat list's time column (spec 4.2): `HH:mm` today, the day's name for
 * the six days before, the month and day earlier this year, and `YYYY/M/D`
 * before that.
 */
export function formatChatTime(atMs: number, nowMs: number, language: UiLanguage): string {
  const at = new Date(atMs)
  const now = new Date(nowMs)
  const days = calendarDaysBetween(at, now)
  if (days === 0) return `${pad(at.getHours())}:${pad(at.getMinutes())}`
  if (days > 0 && days < 7) return (language === 'zh' ? ZH_WEEKDAYS : EN_WEEKDAYS)[at.getDay()]
  if (at.getFullYear() === now.getFullYear()) {
    return language === 'zh' ? `${at.getMonth() + 1}月${at.getDate()}日` : `${EN_MONTHS[at.getMonth()]} ${at.getDate()}`
  }
  return `${at.getFullYear()}/${at.getMonth() + 1}/${at.getDate()}`
}
