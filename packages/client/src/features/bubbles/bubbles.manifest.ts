import type { FeatureManifest } from '../../core/feature'

/** The conversation as Telegram bubbles (spec 4.4): the reader's and the answer's bubbles, with the reader's time and ticks. */
export default {
  id: 'bubbles',
  order: 195,
  contracts: ['chat.message-bubble', 'chat.user-clock', 'chat.pending-steering', 'composer.echo', 'chat.user-row', 'chat.user-kind', 'chat.turn-attribute', 'chat.assistant-step-kind', 'chat.group-part', 'chat.group-part-reasoning', 'process.group', 'conversation.session', 'conversation.session-attribute'],
  ungated: '气泡是皮肤对话页的版式本身',
  stylesheets: [
    { file: 'bubbles.css', rank: 165 },
    { file: 'markdown.css', rank: 166 },
  ],
  cases: ['bubbles'],
} satisfies FeatureManifest
