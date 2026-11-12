import { createBubbleMeta } from './bubble-meta'
import type { HostContext } from '@dsh-telegram-style/engine/host'
import type { FeatureUi } from '../../core/feature'
import type manifest from './bubbles.manifest'

export function install(ctx: HostContext, ui: FeatureUi<typeof manifest>) {
  const meta = createBubbleMeta(ctx)
  ui.bubbles = { sync: meta.sync }
  return () => {
    meta.dispose()
    delete ui.bubbles
  }
}
