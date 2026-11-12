'use strict'
const { same, check, basicChecks, commonChecks } = require('./_shared.cjs')

/** The classic palette's wallpaper colour (tokens.json wallpaper entry), which the skin paints on <body> */
const CLASSIC_WALLPAPER = 'rgb(200, 218, 174)'
const CLEAR = 'rgba(0, 0, 0, 0)'

module.exports = {
  // The skin's classic palette: the white and near-black canvases, read from
  // the live custom properties.
  brand(r) {
    basicChecks(r)
    const palette = r.claudePalette || {}
    check('the classic palette paints a white canvas in light and a near-black one in dark',
      palette.canvas === 'rgb(255, 255, 255)' && !!palette.dark &&
        palette.dark.raised === '#212121',
      JSON.stringify(palette))
    commonChecks(r)
  },
  // The wallpaper: the palette's plain colour on <body> with the pattern layer over it.
  wallpaper(r) {
    basicChecks(r)
    const wall = r.wallpaper || {}
    check('the window carries the palette colour and the pattern layer, masked with the pattern',
      wall.layer !== 'none' && wall.plain === true && wall.mask === true, JSON.stringify(wall))
    commonChecks(r)
  },
  // The classic hero: the welcome is drawn on arrival and held between passes,
  // and the sticker stands on that page's card too.
  hero(r) {
    basicChecks(r)
    const greeting = r.greeting || {}
    check('the classic hero draws its welcome on arrival and keeps it between passes',
      typeof greeting.low === 'string' && greeting.low !== 'Host greeting' && greeting.low !== '' &&
        greeting.held === greeting.low && typeof greeting.high === 'string' && greeting.high !== 'Host greeting' &&
        greeting.high !== greeting.low,
      JSON.stringify(greeting))
    check('the classic hero draws the permission segments in the card\'s mode strip',
      JSON.stringify(r.classicSegments) === JSON.stringify(['Read', 'Edit', 'Auto', 'Yolo']) && r.classicPermTrigger === false,
      JSON.stringify({ segments: r.classicSegments, trigger: r.classicPermTrigger }))
    check('the classic hero page carries the sticker too', r.classicSticker === true, JSON.stringify(r.classicSticker))
    commonChecks(r)
  },
  // The conversation header's tab strip: the pill is drawn under the active tab
  // without sliding in, slides to the tab a switch selects, and the teardown
  // takes it back off.
  'view-tabs'(r) {
    basicChecks(r)
    const pill = r.viewPill || {}
    const under = (s) => !!s && s.attr && s.content !== 'none' && Math.abs(s.x - s.itemX) < 0.5 &&
      Math.abs(s.w - s.itemW) < 0.5 && s.itemFill === 'rgba(0, 0, 0, 0)'
    check('the conversation header\'s tab strip is stamped for the stylesheet', pill.stamped === true, JSON.stringify(pill.stamped))
    check('the view tabs draw their pill under the active tab without sliding in',
      under(pill.first) && pill.first.slides.length === 0, JSON.stringify(pill.first))
    check('a view switch slides the pill to the newly active tab',
      under(pill.switched) && pill.switched.slides.indexOf('transform') !== -1 && pill.switched.x > pill.first.x,
      JSON.stringify(pill.switched), 'timing')
    check('the pill slides whatever the system motion setting: no reduced-motion rule reaches it',
      pill.reducedMotionRules === 0, `${pill.reducedMotionRules} rules`)
    check('teardown takes the pill, its placement and the strip stamp off the view tabs', pill.left === false, JSON.stringify(pill.left))
    commonChecks(r)
  },
  // The composer's host controls, marked by structure, the marks their teardown
  // leaves behind, and the host's own Enter on an open menu.
  composer(r) {
    basicChecks(r)
    const controls = r.controls || {}
    check('the composer\'s host controls are marked by structure: commands, access, send',
      controls.commands === 'commands' && controls.access === 'access' && controls.send === 'send', JSON.stringify(controls))
    check('the submit button\'s mark follows its glyph to stop and back',
      controls.stopping === 'stop' && controls.back === 'send', JSON.stringify(controls))
    const glyph = r.stopGlyph || {}
    check('the stop mark is drawn by the skin: the stop icon, a 24px mask filled with the button\'s ink and not the send plane, the host\'s glyph unpainted',
      glyph.hostGlyph === 'none' && glyph.icon === '24px' && glyph.swapped === true && glyph.fill === glyph.ink,
      JSON.stringify(glyph))
    check('teardown takes the draft marks off the composer cards', r.leftDraftMarks === 0, `${r.leftDraftMarks} left`)
    check('teardown takes the control marks off the host controls', r.leftControlMarks === 0, `${r.leftControlMarks} left`)
    check('Enter on an open composer menu reaches the host', same(r.keys, ['host picked the menu item']), JSON.stringify(r.keys))
    commonChecks(r)
  },
  // The sidebar's search box: placed by the style preference — in the brand
  // row resting hidden, in a row of its own below it, or not drawn at all
  // while the host's own button stands — and opening the host's modal through
  // a root of the skin's own.
  search(r) {
    basicChecks(r)
    const search = r.search || {}
    check('the search box goes in the brand row beside the brand, and rests hidden until the sidebar is hovered',
      search.placed === true && search.rowMarked === true && search.resting === 'hidden', JSON.stringify(search))
    check('pressing the search box renders the host modal through a root of the skin\'s own', search.modalRendered === true, JSON.stringify(search))
    const standalone = search.standalone || {}
    check('the Standalone style gives the box a row of its own under the brand row, shown without a hover, and the brand row keeps the host\'s layout',
      standalone.barAfterRow === true && standalone.triggerInBar === true && standalone.triggerVisibility === 'visible' &&
        standalone.rowMarked === false && standalone.hostSlotPosition === 'absolute',
      JSON.stringify(standalone))
    // The rows under it span the column's own padding, so the box's border has
    // to stand on those two edges: its row may add no inline padding of its own.
    check('the Standalone box is exactly as wide as the rows under it',
      standalone.boxWidth !== null && standalone.boxWidth === standalone.barWidth && standalone.boxWidth > 0,
      JSON.stringify({ boxWidth: standalone.boxWidth, barWidth: standalone.barWidth }))
    const icon = search.icon || {}
    check('the Icon style draws no box of the skin\'s, puts the host\'s own search slot back in the header, and takes its click over',
      icon.triggerInRow === false && icon.rowMarked === false && icon.barAfterRow === false &&
        icon.hostSlotPosition !== 'absolute' && icon.hostSlotWidth > 10 && icon.hostClicksReachingHost === 0,
      JSON.stringify(icon))
    const back = search.back || {}
    check('switching the style back to Cover the brand seats the box in the brand row again, live',
      back.triggerInRow === true && back.rowMarked === true && back.triggerVisibility === 'hidden' && back.hostSlotPosition === 'absolute',
      JSON.stringify(back))
    // The New session row carries the same host markup the box's own caps are
    // cut for; both are read field by field, so the hints cannot drift apart.
    const caps = search.keycaps || {}
    const cap = Array.isArray(caps.search) && caps.search.length === 1 ? caps.search[0] : null
    check('the New session row wears the search box\'s own key caps, and the `+` between them is gone',
      cap !== null && Array.isArray(caps.shortcut) && caps.shortcut.length === 2 &&
        caps.shortcut.every((entry) => same(entry, cap)) &&
        caps.separators.length === 1 && caps.separators.every((display) => display === 'none'),
      JSON.stringify(caps))
    check('teardown takes the search box, its row mark and its root away',
      search.left === 0 && search.rootUnmounted === true, JSON.stringify(search))
    commonChecks(r)
  },
  // The account row's self-built drawer: the header, the plugin rows, the
  // settings row, the nickname and the avatar.
  account(r) {
    basicChecks(r)
    check('synthetic path: the popover carries the header, the plugin rows and the settings row',
      r.drawer !== null && same(r.drawer, ['embed', 'action', 'embed', 'settings']) && r.syntheticHeader === true,
      JSON.stringify({ drawer: r.drawer, header: r.syntheticHeader }))
    check('synthetic path injects nothing into a host menu', r.syntheticInject === 0, `${r.syntheticInject} containers`)
    check('a custom nickname outranks the signed-in profile', r.accountUser === 'Tester', JSON.stringify(r.accountUser))
    check('avatar is an <img> sent without a referrer', r.photo !== null && r.photo.referrerPolicy === 'no-referrer', JSON.stringify(r.photo))
    check('the self-built drawer matches the account row box',
      r.syntheticBox !== null && r.syntheticBox.popoverLeft === r.syntheticBox.buttonLeft &&
        r.syntheticBox.popoverWidth === r.syntheticBox.buttonWidth,
      JSON.stringify(r.syntheticBox))
    check('the closed drawer takes its parked rows out of the paint tree',
      r.syntheticVisibility === 'hidden' && r.syntheticRowVisibility === 'hidden',
      JSON.stringify({ panel: r.syntheticVisibility, row: r.syntheticRowVisibility }))
    // The account area's switch is live: its teardown takes the row and the
    // drawer away and hands the host's own footer back.
    const footerSwitch = r.footerSwitch || {}
    check('switching the sidebar account area off takes its row and drawer off the page, and on builds them again',
      footerSwitch.before !== undefined && footerSwitch.before.row === true && footerSwitch.before.drawer === true &&
        footerSwitch.before.takeover === true && footerSwitch.off !== undefined &&
        footerSwitch.off.row === false && footerSwitch.off.drawer === false && footerSwitch.off.takeover === false &&
        footerSwitch.back !== undefined && footerSwitch.back.row === true && footerSwitch.back.drawer === true,
      JSON.stringify(footerSwitch))
    commonChecks(r)
  },
  // The permission control's ladder: the catalog in the skin order, with the
  // Auto review tier offered while the catalog carries that preset.
  permissions(r) {
    basicChecks(r)
    check('the permission ladder is the catalog, in the skin order',
      same(r.permRows.map(function (row) { return row.preset }), ['read-only', 'workspace-write', 'auto', 'danger-full-access']),
      JSON.stringify(r.permRows))
    check('the Auto review tier is offered while the catalog carries the preset',
      r.permAutoRowDisplay !== null && r.permAutoRowDisplay !== 'none' &&
        r.permRows[2].text.indexOf('Auto review') === 0,
      JSON.stringify({ popoverRow: r.permAutoRowDisplay, row: r.permRows[2] }))
    commonChecks(r)
  },
  popovers(r) {
    basicChecks(r)
    check('a pointer crossing a trigger opens nothing before the dwell elapses',
      r.permOpenAtDwell === 0, `${r.permOpenAtDwell} open at 50 ms`)
    check('a pointer that stays the dwell out opens the card',
      r.permOpenPastDwell === 1, `${r.permOpenPastDwell} open past the dwell`)
    check('an open card answers the host\'s menu role',
      r.permCardRole === 'menu', JSON.stringify(r.permCardRole))
    check('opening the account drawer folds the permission card',
      r.drawerUp === 1 && r.permFoldedByDrawer === 0,
      JSON.stringify({ drawer: r.drawerUp, permission: r.permFoldedByDrawer }))
    check('with the hover preference on, a press on the open drawer keeps it open',
      r.drawerAfterPress === 1 && r.drawerOpenAttrAfterPress === 'true',
      JSON.stringify({ open: r.drawerAfterPress, marker: r.drawerOpenAttrAfterPress }))
    check("opening the hero row's host menu folds the drawer",
      r.heroUp === true && r.drawerFoldedByHero === 0,
      JSON.stringify({ hero: r.heroUp, drawer: r.drawerFoldedByHero }))
    check('opening the permission card folds the hero menu',
      r.permReopened === 1 && r.heroFoldedByPerm === false,
      JSON.stringify({ permission: r.permReopened, hero: r.heroFoldedByPerm }))
    check('with the hover preference on, a press on the open permission card keeps it up',
      r.permUpAfterPress === 1, JSON.stringify(r.permUpAfterPress))
    check('with the hover preference on, a press on the open hero menu keeps it up and the leave closes it',
      r.heroUpBeforePress === true && r.heroUpAfterPress === true && r.heroLeftAfterPress === 0,
      JSON.stringify({ before: r.heroUpBeforePress, after: r.heroUpAfterPress, left: r.heroLeftAfterPress }))
    check("the row's other picker opens over the permission card and folds it",
      r.presetUp === true && r.permFoldedByPreset === 0,
      JSON.stringify({ preset: r.presetUp, permission: r.permFoldedByPreset }))
    check('crossing to the row\'s other trigger folds the picker left behind',
      r.workspaceUpAfterCrossing === true && r.presetFoldedBySibling === false && r.heroCardsUp === 1,
      JSON.stringify({ workspace: r.workspaceUpAfterCrossing, preset: r.presetFoldedBySibling, cards: r.heroCardsUp }))
    check('the preset card is stamped as the preset picker and keeps its row glyph',
      r.presetCard !== null && r.presetCard.kind === 'preset' && r.presetCard.iconsShown === 1 && r.presetCard.rowHeight === 32,
      JSON.stringify(r.presetCard))
    check('the workspace card is drawn as a folder menu: plain text rows, the add row included, set closer together',
      r.workspaceCard !== null && r.workspaceCard.kind === 'workspace' && r.workspaceCard.iconsShown === 0 &&
        r.workspaceCard.rowHeight === 26,
      JSON.stringify(r.workspaceCard))
    check('the hero card opens above its trigger, right-aligned with it, by the skin\'s 6px air',
      r.workspacePlacement !== null && r.workspacePlacement.side === 'above' &&
        r.workspacePlacement.airAbove === 6 && Math.abs(r.workspacePlacement.rightDelta) <= 1,
      JSON.stringify(r.workspacePlacement))
    check('with no room above, the hero card flips below its trigger',
      r.workspacePlacementTight !== null && r.workspacePlacementTight.side === 'below' &&
        r.workspacePlacementTight.airBelow === 6,
      JSON.stringify(r.workspacePlacementTight))
    check('leaving the row leaves no hero picker up',
      r.heroMenusLeft === 0, `${r.heroMenusLeft} open`)
    check('leaving every trigger leaves no card up',
      r.cardsLeftAfterLeave === 0, `${r.cardsLeftAfterLeave} open`)
    commonChecks(r)
  },
  'host-palette'(r) {
    basicChecks(r)
    const hp = r.hostPalette || {}
    const classic = hp.classic || {}
    // Without a wallpaper plugin the skin lays its own wallpaper: the palette's
    // plain colour on <body>, the conversation left clear over it, the sidebar
    // and the cards on the palette's card colour, no mask layer.
    check('the classic palette paints the wallpaper colour, the cards and the sidebar',
      classic.base === '#FFFFFF' && classic.body === CLASSIC_WALLPAPER && classic.conversation === CLEAR &&
        classic.sidebar === 'rgb(255, 255, 255)' && classic.account === 'rgb(255, 255, 255)' &&
        classic.popover === 'rgb(255, 255, 255)' && classic.html === 'rgb(255, 255, 255)',
      JSON.stringify(classic))
    // A wallpaper plugin under the classic palette. The skin's own wallpaper
    // yields: <body> is clear and no mask layer lies over the plugin's picture.
    // The cards turn opaque (the sidebar's fill is the card colour, and the
    // base canvas, the popovers, the account drawer and the search box keep their
    // fill); the document element's canvas stays behind the layer.
    const wallClassic = hp.classicWallpaper || {}
    check('with a wallpaper plugin up the own wallpaper of the skin stands down and no mask is laid',
      wallClassic.body === CLEAR && wallClassic.conversation === CLEAR &&
        wallClassic.mask === CLEAR && wallClassic.maskPosition === 'static' &&
        wallClassic.html === 'rgb(255, 255, 255)',
      JSON.stringify(wallClassic))
    check('and the base canvas, the sidebar and the own faces of the skin keep an opaque fill',
      wallClassic.base === '#FFFFFF' && wallClassic.sidebar === 'rgb(255, 255, 255)' && wallClassic.sidebarFill === '#FFFFFF' &&
        wallClassic.popover === classic.popover && wallClassic.account === classic.account &&
        wallClassic.search === classic.search,
      JSON.stringify({ wallpaper: wallClassic, classic }))
    check('with the plugin wallpaper gone the own wallpaper colour of the skin is back and there is still no mask',
      classic.body === CLASSIC_WALLPAPER && wallClassic.body !== classic.body &&
        classic.sidebarFill === '#FFFFFF' && classic.mask === CLEAR && classic.maskPosition === 'static',
      JSON.stringify({ wallpaper: wallClassic, classic }))
    commonChecks(r)
  },
}
