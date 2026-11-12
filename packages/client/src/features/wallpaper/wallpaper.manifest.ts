import type { FeatureManifest } from '../../core/feature'

/** The wallpaper under the whole window (spec 4.1): the palette's plain colour, the pattern, and the hand-over to a wallpaper plugin. */
export default {
  id: 'wallpaper',
  order: 8,
  contracts: [],
  ungated: '墙纸是整套版式的底，随皮肤一起在；涂鸦层跟随 doodle 偏好写在 body 上的属性',
  stylesheets: [{ file: 'wallpaper.css', rank: 12 }],
  settingsRows: [{
    tab: 'appearance',
    rank: 15,
    pref: 'doodle',
    title: 'doodleTitle',
    desc: 'doodleDesc',
  }],
  cases: ['wallpaper'],
} satisfies FeatureManifest
