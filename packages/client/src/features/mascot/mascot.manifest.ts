import type { FeatureManifest } from '../../core/feature'

export default {
  id: 'mascot',
  order: 40,
  load: 'deferred',
  reads: ['composer'],
  contracts: ['chat.think-running', 'composer.fallback-panel', 'composer.seat', 'composer.stack', 'conversation.session', 'conversation.session-attribute'],
  pref: 'mascot',
  stylesheets: [{ file: 'sticker.css', rank: 350 }],
  settingsRows: [{
    tab: 'appearance',
    rank: 30,
    pref: 'mascot',
    title: 'mascotTitle',
    desc: 'mascotDesc',
  }, {
    // It belongs to the mascot switch above it.
    tab: 'appearance',
    rank: 40,
    pref: 'mascotScope',
    parent: 'mascot',
    title: 'mascotScopeTitle',
    choiceLabels: { home: 'mascotScopeHome', all: 'mascotScopeAll' },
  }],
  cases: ['sticker']
} satisfies FeatureManifest
