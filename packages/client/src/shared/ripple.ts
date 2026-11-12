import { RIPPLE_ATTR } from '../constants'
import { motionMs } from './motion'
import { motionReduced } from '../core/prefs'

/**
 * Telegram's press ripple (spec 4.10) on every element carrying the ripple
 * mark: one listener on the document, a circle spreading from the press and
 * fading out. Reduced motion draws nothing.
 *
 * @returns stop: the listener goes, and any ripple still showing with it.
 */
export function installRipples() {
  const live = new Set<HTMLElement>()
  function onPress(event: PointerEvent) {
    if (event.button !== 0 || motionReduced()) return
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>(`[${RIPPLE_ATTR}]`) : null
    if (target === null) return
    const box = target.getBoundingClientRect()
    const size = Math.hypot(box.width, box.height) * 2
    const wave = document.createElement('span')
    wave.className = 'dsh-tg-ripple'
    wave.style.width = `${size}px`
    wave.style.height = `${size}px`
    wave.style.left = `${event.clientX - box.left - size / 2}px`
    wave.style.top = `${event.clientY - box.top - size / 2}px`
    target.appendChild(wave)
    live.add(wave)
    setTimeout(() => {
      wave.remove()
      live.delete(wave)
    }, motionMs('--dsh-tg-duration-ripple'))
  }
  document.addEventListener('pointerdown', onPress, true)
  return () => {
    document.removeEventListener('pointerdown', onPress, true)
    for (const wave of live) wave.remove()
    live.clear()
  }
}
