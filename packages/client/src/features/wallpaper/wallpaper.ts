import type { HostContext } from '@dsh-telegram-style/engine/host'
import type { FeatureUi } from '../../core/feature'
import type manifest from './wallpaper.manifest'

/**
 * The wallpaper is wallpaper.css alone: the plain colour and the pattern layer hang
 * off the skin's stamp and the `doodle` mirror on <body>, which the preference
 * core writes and takes back. The install owns no node and no listener.
 */
export function install(_ctx: HostContext, _ui: FeatureUi<typeof manifest>) {}
