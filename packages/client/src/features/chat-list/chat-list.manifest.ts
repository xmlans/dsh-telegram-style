import type { FeatureManifest } from '../../core/feature'

/** The sidebar as Telegram's chat list (spec 4.2): each session row dressed with an avatar, the time, a second line and a badge, and the press ripple. */
export default {
  id: 'chatList',
  order: 140,
  reads: ['workspace'],
  contracts: ['shell.tree-row-key', 'shell.toast'],
  ungated: '聊天列表就是皮肤的侧栏版式',
  stylesheets: [{ file: 'chat-list.css', rank: 125 }],
  cases: ['chat-list'],
} satisfies FeatureManifest
