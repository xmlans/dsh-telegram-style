import type { SettingsRow, SettingsTab, SettingsView } from './settings-controls'
import { copy } from './copy'

/**
 * The settings page's Sidebar tab: the right sidebar's docked panels and the
 * sidebar's own spacing, whose looks belong to no feature
 * (packages/client/src/theme/sidebar.css, theme/chrome.css), so the tab writes
 * those two rows itself. The footer takeover, the account-hold language, the
 * search box with its style and the In progress / Archived view are the
 * features' own rows, placed here by their manifests (D72).
 */
export function createSettingsSidebarTab(): SettingsTab {
  const rows = (view: SettingsView): SettingsRow[] => {
    const controls = view.controls
    return [
      {
        rank: 40,
        node: controls.row(
          'dockCards',
          copy('dockCardsTitle'),
          null,
          view.controls.toggle(view.prefs.dockCards !== false, value => { view.write({ dockCards: value }) }),
        ),
      },
    ]
  }
  return { id: 'sidebar', label: () => copy('tabSidebar'), rows }
}
