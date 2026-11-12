import * as React from 'react'
import { buildElement } from '@dsh-telegram-style/engine/dom'

/** The line icons packages/assets/src/icons/tg/ carries (spec 4.13); shared/icons.css maps each to its mask. */
export type IconName = 'plane' | 'pencil' | 'archive' | 'menu' | 'search' | 'check' | 'check-double' | 'clock' | 'loop' | 'spark' | 'heart' | 'thought'
  | 'arrow-down' | 'arrow-left' | 'chevron-down' | 'stop' | 'file' | 'file-code' | 'file-image' | 'moon' | 'plug' | 'gear' | 'info'

/** One icon as a DOM node, hidden from assistive technology: the control around it carries the name. */
export function iconElement(name: IconName): HTMLElement {
  const icon = buildElement('span', 'dsh-tg-icon')
  icon.setAttribute('data-icon', name)
  icon.setAttribute('aria-hidden', 'true')
  return icon
}

/** The same icon as a React element, for the views features render through React. */
export function iconNode(name: IconName, key?: string) {
  return React.createElement('span', { key, className: 'dsh-tg-icon', 'data-icon': name, 'aria-hidden': 'true' })
}
