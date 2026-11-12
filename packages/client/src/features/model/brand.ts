import { modelCopy, resolveModelBrand } from './model-copy'
import { buildElement } from '@dsh-telegram-style/engine/dom'
import { avatarSlot } from '../chat-list/avatar'

/**
 * The brand mark for one model: the vendor that made it, not the route it is
 * resold through — an OpenRouter group listing Claude models shows Anthropic
 * marks on the rows, never OpenRouter's own.
 *
 * Rules are ordered and anchored in the document; the first match wins over the
 * model's id and then over its display name (D79). There is deliberately **no
 * fallback to the provider route**: a model no rule claims draws no avatar at
 * all.
 *
 * @param modelId - catalog model id.
 * @param modelName - catalog display name, the second string a rule reads.
 * @returns the vendor id, or null when no rule claims it.
 */
export function modelBrand(modelId: unknown, modelName: unknown) {
  return resolveModelBrand(modelCopy, modelId, modelName)
}

/**
 * One row's label: the vendor's first letter on a round avatar, then the model's
 * name. A model no rule claims gets the name alone.
 *
 * The avatar is decoration, so it stays out of the accessibility tree.
 *
 * @param name - the catalog's display name.
 * @param brand - resolved brand id, or null.
 * @returns the label element.
 */
export function buildModelLabel(name: unknown, brand: string | null) {
  const el = buildElement('span', 'dsh-tg-model-name')
  const text = typeof name === 'string' ? name : ''
  if (brand !== null && brand !== '') {
    const initial = buildElement('span', 'dsh-tg-model-initial', brand.charAt(0).toUpperCase())
    initial.setAttribute('data-avatar', String(avatarSlot(brand)))
    initial.setAttribute('aria-hidden', 'true')
    el.appendChild(initial)
  }
  el.appendChild(document.createTextNode(text))
  return el
}
