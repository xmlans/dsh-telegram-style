import { SEGMENTS_CLASS } from '../../shared/segment-control'

/**
 * The permission control's nodes in the document. A client reload drops the
 * previous generation's disposals and leaves its nodes standing, so the first
 * pass of an install reads the whole document for them to adopt or sweep; once
 * a pass has settled the scan, later passes work from the nodes the feature holds.
 */
export function createStrayScan() {
  let due = true
  return {
    /**
     * The containers and segment groups to adopt or sweep, and the popover a
     * previous generation left (null once the scan has settled).
     */
    existing(container: HTMLElement | null, segments: HTMLElement | null) {
      if (!due) {
        return {
          containers: container !== null && container.isConnected ? [container] : [],
          segments: segments !== null && segments.isConnected ? [segments] : [],
          popover: null,
        }
      }
      return {
        containers: [...document.querySelectorAll<HTMLElement>('.dsh-tg-perm-container')],
        segments: [...document.querySelectorAll<HTMLElement>(`.${SEGMENTS_CLASS}[data-composer-segments]`)],
        popover: document.querySelector<HTMLElement>('.dsh-tg-perm-popover'),
      }
    },
    /** A pass adopted or swept what `existing` read: the scan is done for this install. */
    settle() {
      due = false
    },
  }
}

/**
 * Put `node` first in `host`, unless `node` is `host` or holds it: the strip
 * can be an element another skin wraps around the host's trigger, and
 * insertBefore throws HierarchyRequestError for a child that contains its
 * parent, which switched the whole feature off. The skin yields that pass.
 */
export function placeFirst(host: Element, node: Element) {
  if (node.contains(host)) return
  host.insertBefore(node, host.firstChild)
}
