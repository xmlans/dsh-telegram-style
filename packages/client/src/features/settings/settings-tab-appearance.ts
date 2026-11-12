import * as React from 'react'
import { PALETTE_GLASS, PALETTE_TELEGRAM, PALETTE_TRANS } from '../../constants'
import { copy } from './copy'
import type { Prefs } from '../../constants'
import type { SegmentOption, SettingsTab, SettingsView } from './settings-controls'

/**
 * The settings page's Appearance tab: the palette. The home layout, the mascot and where
 * it stands are the features' own rows, placed here by their manifests (D72).
 */
export function createSettingsAppearanceTab(): SettingsTab {
  function rows(view: SettingsView) {
    const prefs = view.prefs
    const write = view.write
    const controls = view.controls
    const paletteOptions: SegmentOption<Prefs['palette']>[] = [
      { value: PALETTE_TELEGRAM, label: copy('paletteTelegram') },
      { value: PALETTE_GLASS, label: copy('paletteGlass') },
      { value: PALETTE_TRANS, label: copy('paletteTrans') },
    ]
    return [
      {
        rank: 10,
        node: controls.row(
          'palette',
          copy('paletteTitle'),
          copy('paletteDesc'),
          controls.segment(paletteOptions, prefs.palette, value => { write({ palette: value }) }),
        ),
      },
    ]
  }
  return { id: 'appearance', label: () => copy('tabAppearance'), rows }
}
