import { activeLocale } from '../core/i18n'

/** The two languages the skin's own copy and formats come in. */
export type UiLanguage = 'zh' | 'en'

/** The shell's language as the skin formats for it: any Chinese locale is `zh`, everything else `en`. */
export function uiLanguage(): UiLanguage {
  return activeLocale().toLowerCase().startsWith('zh') ? 'zh' : 'en'
}
