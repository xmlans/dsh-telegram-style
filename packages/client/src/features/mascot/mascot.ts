import { MASCOT_SCOPE_ALL } from '../../constants'
import { readPrefs } from '../../core/prefs'
import { createSticker } from './sticker'
import type { HostContext } from '@dsh-telegram-style/engine/host'
import type { FeatureUi } from '../../core/feature'
import type manifest from './mascot.manifest'

export function install(ctx: HostContext, ui: FeatureUi<typeof manifest>) {
  const sticker = createSticker(ctx, ui)
  function sync() {
    sticker.sync(readPrefs().mascotScope === MASCOT_SCOPE_ALL)
  }
  ui.mascot = { sync, onActivity: sticker.onActivity }
  return () => {
    sticker.dispose()
    delete ui.mascot
  }
}
