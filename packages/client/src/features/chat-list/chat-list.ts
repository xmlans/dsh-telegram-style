import { installRipples } from '../../shared/ripple'
import { createSessionRows } from './session-rows'
import type { HostContext } from '@dsh-telegram-style/engine/host'
import type { FeatureUi } from '../../core/feature'
import type manifest from './chat-list.manifest'

export function install(ctx: HostContext, ui: FeatureUi<typeof manifest>) {
  const rows = createSessionRows(ctx)
  const stopRipples = installRipples()
  function sync() {
    rows.sync('all')
  }
  ui.chatList = { sync }
  return () => {
    rows.dispose()
    stopRipples()
    delete ui.chatList
  }
}
