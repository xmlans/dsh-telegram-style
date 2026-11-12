/**
 * The studio case: the registered home panel rendered per tab the way its dock
 * seat would, the sticker on the hero card with its click and its reduced-motion
 * frame, the cold start screen without a dock, and where the studio stylesheet
 * lets a panel draw.
 */
(function () {
  var probe = window.__dshSmokeProbe
  var sleep = probe.sleep
  var r = probe.report

  probe.step(async function () {
    await probe.onlyFor(['studio'], async function () {
      // Render the registered panel on the hero page, once per tab, the way
      // the dock seat would: a throw here is the slot's error boundary on the
      // live page, which leaves the new-conversation page without its panel.
      var heroRoot = document.createElement('div')
      heroRoot.className = '_root_x_1'
      heroRoot.setAttribute('data-phase', 'hero')
      // The host's conversation anchor sits inside the hero root on the home
      // page, and the composer stack and the panel seat are read inside it (D3).
      var heroScroll = document.createElement('div')
      heroScroll.setAttribute('data-conversation-scroll', '')
      heroRoot.appendChild(heroScroll)
      // Arriving on the hero draws the yardstick book; the draw is pinned to the
      // last book on the shelf, which no window here has passed, so the line has
      // to step down to the longest book each window did pass.
      var random = Math.random
      Math.random = function () { return 0.999 }
      document.body.appendChild(heroRoot)
      await sleep(200)
      Math.random = random
      // The studio hero draws its composer in the conversation's form, so the
      // permission control there is the conversation's trigger and card: the
      // segment group belongs to the classic hero alone.
      var heroModes = document.querySelector('[data-composer-card] [data-dsh-tg-part~="modes"]')
      var heroTrigger = heroModes === null ? null : heroModes.querySelector('.dsh-tg-perm-btn')
      var heroLabel = heroTrigger === null ? null : heroTrigger.querySelector('.dsh-tg-perm-label')
      r.heroPerm = {
        trigger: heroTrigger !== null,
        segments: heroModes === null ? -1 : heroModes.querySelectorAll('.dsh-tg-segments').length,
        label: heroLabel === null ? null : heroLabel.textContent,
        disabled: heroTrigger === null ? null : heroTrigger.disabled,
      }
      r.panelRenders = {}
      // The Overview tab twice — all time, and the 7d pill picked — and the
      // Models tab folded and open; each state is keyed by the initial value it
      // replaces.
      var tabs = {
        overview: null,
        'overview-7d': { all: '7d' },
        models: { overview: 'models' },
        'models-open': { overview: 'models', false: true },
      }
      for (var tab in tabs) {
        var react = window.__react
        react.rendering = true
        react.states = tabs[tab]
        try {
          var classes = []
          var texts = []
          var tips = []
          ;(function collect(node) {
            if (typeof node === 'string') { if (node) texts.push(node); return }
            if (node === null || typeof node !== 'object') return
            if (Array.isArray(node)) { node.forEach(collect); return }
            if (node.props && typeof node.props.className === 'string') classes.push(node.props.className)
            if (node.props && typeof node.props['data-tip'] === 'string') tips.push(node.props['data-tip'])
            if (node.props) collect(node.props.children)
          })(window.__slotComponents['telegram-style-usage']({}))
          r.panelRenders[tab] = { error: null, classes: classes, texts: texts, tips: tips }
        } catch (e) {
          r.panelRenders[tab] = { error: String((e && e.stack) || e), classes: [], texts: [], tips: [] }
        } finally {
          react.rendering = false
          react.states = null
        }
      }
      // The sticker stands on the hero card, idling, drawn from its image. A
      // click lets hearts float up, and the act plays back to idle on the
      // stylesheet's keyframes. With the animation choice on "reduced" it
      // holds still; a click still names its act.
      var stickerState = 'data-dsh-tg-mascot-state'
      var stickerSelector = '.dsh-tg-sticker'
      var sticker = document.querySelector('[data-composer-card] > ' + stickerSelector)
      r.mascot = { mounted: sticker !== null }
      if (sticker !== null) {
        var stickerBody = sticker.firstElementChild
        r.mascot.state = sticker.getAttribute(stickerState)
        r.mascot.image = /\.webp/.test(getComputedStyle(stickerBody).backgroundImage)
        // A real click has to reach the sticker: nothing on the page may cover it.
        sticker.scrollIntoView({ block: 'center' })
        var stickerBox = stickerBody.getBoundingClientRect()
        var topmost = document.elementFromPoint(stickerBox.left + stickerBox.width / 2, stickerBox.top + stickerBox.height / 2)
        r.mascot.reachable = topmost === stickerBody
        stickerBody.click()
        await sleep(300)
        r.mascot.clicked = sticker.getAttribute(stickerState)
        await sleep(1150)
        r.mascot.afterClick = sticker.getAttribute(stickerState)
        // The choice is pushed through the host form, which is what the
        // settings row does.
        window.__pushForm({ motion: 'reduced' })
        await sleep(150)
        r.mascot.reducedAttr = document.body.getAttribute('data-dsh-tg-motion')
        r.mascot.stillAnimations = stickerBody.getAnimations().length
        stickerBody.click()
        await sleep(150)
        r.mascot.reducedClick = sticker.getAttribute(stickerState)
        await sleep(1300)
        window.__pushForm({ motion: 'full' })
      }
      // The cold start screen: no session yet, so the host renders no dock
      // under the hero stack and no access button, and the card is the
      // workspace picker with an empty mode strip, which the skin's permission
      // trigger takes inert. The page's own access button stands for a session,
      // so it leaves the page for the length of this.
      var access = document.querySelector('button[aria-label^="Access mode"]')
      var accessParent = access.parentElement
      access.remove()
      var coldStack = document.createElement('div')
      coldStack.className = '_composerStack_x_1 _composerHero_x_1'
      coldStack.innerHTML = '<div data-composer-card class="_card_x_1 _cardWorkspaceTrigger_x_1">' +
        '<div class="_row_x_1"><div class="_tools_x_1"><div class="_modes_x_1"></div></div></div></div>'
      heroScroll.appendChild(coldStack)
      await sleep(200)
      var coldSeat = coldStack.querySelector(':scope > .dsh-tg-home-seat')
      var coldRoot = window.__roots.filter(function (root) { return root.element === coldSeat })[0]
      var coldTrigger = coldStack.querySelector('._modes_x_1 > .dsh-tg-perm-container > .dsh-tg-perm-btn')
      var coldLabel = coldTrigger === null ? null : coldTrigger.querySelector('.dsh-tg-perm-label')
      r.coldStart = {
        seat: coldSeat !== null,
        rendered: coldRoot !== undefined && coldRoot.renders > 0,
        segments: coldStack.querySelectorAll('._modes_x_1 > .dsh-tg-segments').length,
        trigger: coldTrigger === null ? null : { label: coldLabel === null ? null : coldLabel.textContent, disabled: coldTrigger.disabled },
        openCard: document.querySelectorAll('.dsh-tg-perm-popover[data-open="true"]').length,
      }
      // The session arrives: the host renders its dock, and the skin's seat
      // gives the panel back.
      var coldDock = document.createElement('div')
      coldDock.setAttribute('data-slot', 'conversation.input.dock')
      coldStack.insertBefore(coldDock, coldStack.firstChild)
      await sleep(200)
      r.coldStart.seatAfterDock = coldStack.querySelector('.dsh-tg-home-seat') !== null
      r.coldStart.unmountedAfterDock = coldRoot !== undefined && coldRoot.unmounted
      coldStack.remove()
      accessParent.appendChild(access)
      await sleep(200)
      r.homeHero = { onHero: heroRoot.hasAttribute('data-dsh-tg-home-hero') }
      // The panel reads the roll-up again rather than standing on the figures it
      // opened with, and the two asks are told apart by the page's own clock: the
      // window's focus reads once the numbers have aged past the floor, and the
      // page's periodic pass reads once they age past the period. The clock is
      // moved forward instead of waiting out the stretches, which is the input
      // the policy names; both are restored before the rest of the case runs.
      var realNow = Date.now
      var skew = 0
      Date.now = function () { return realNow.call(Date) + skew }
      var readsAtStart = window.__usageReads || 0
      var waitForRead = async function (before) {
        for (var readWait = 0; readWait < 40 && (window.__usageReads || 0) === before; readWait++) await sleep(50)
        return window.__usageReads || 0
      }
      // A window taking the focus back inside the floor keeps the figures it has.
      window.dispatchEvent(new Event('focus'))
      await sleep(300)
      var readsAtWake = window.__usageReads || 0
      // Past the floor the returning reader's numbers are read again.
      skew = 12000
      window.dispatchEvent(new Event('focus'))
      readsAtWake = await waitForRead(readsAtWake)
      // The answer stamps itself on the page's clock, so the next stretch is
      // measured from the moment it landed rather than from the ask.
      await sleep(300)
      // A panel standing on the hero reads on the page's periodic pass, which is
      // the one that reaches a window nobody touches; a node appended to the page
      // is what asks the scheduler for one.
      var readsBeforeTick = window.__usageReads || 0
      skew = 60000
      document.body.appendChild(document.createElement('i'))
      var readsAfterTick = await waitForRead(readsBeforeTick)
      Date.now = realNow
      r.homeRefresh = { atStart: readsAtStart, afterWake: readsAtWake, afterTick: readsAfterTick }
      // The studio rules reach the hero stack through that mark: the stack
      // takes the studio column's 720px cap.
      var studioStack = document.createElement('div')
      studioStack.className = '_composerStack_x_1 _composerHero_x_1'
      heroScroll.appendChild(studioStack)
      // The stack's parts land on the pass after it arrives (D3).
      for (var studioWait = 0; studioWait < 40 && !studioStack.hasAttribute('data-dsh-tg-part'); studioWait++) await sleep(50)
      r.homeHero.stackMaxWidth = getComputedStyle(studioStack).maxWidth
      studioStack.remove()
      heroRoot.remove()
      await sleep(200)
      r.homeHero.offHero = document.querySelector('[data-dsh-tg-home-hero]') !== null
      r.mascot.afterHero = document.querySelector(stickerSelector) !== null
      // The stylesheet alone decides where a panel may draw: under the hero
      // stack's dock it shows, and the moment the host drops the stack's hero
      // class (the first message sent) it is gone, before any pass runs. The
      // stack's parts land on the pass after the subtree arrives, so each state
      // is read once they are there (D3).
      async function panelDisplay(stackClass, coldStart) {
        var holder = document.createElement('div')
        holder.setAttribute('data-conversation-scroll', '')
        var stack = document.createElement('div')
        stack.className = stackClass
        var dock = document.createElement('div')
        if (coldStart) dock.className = 'dsh-tg-home-seat'
        else dock.setAttribute('data-slot', 'conversation.input.dock')
        var panel = document.createElement('section')
        panel.className = 'dsh-tg-home-panel'
        dock.appendChild(panel)
        stack.appendChild(dock)
        holder.appendChild(stack)
        document.body.appendChild(holder)
        for (var wait = 0; wait < 40 && !stack.hasAttribute('data-dsh-tg-part'); wait++) await sleep(50)
        var display = getComputedStyle(panel).display
        holder.remove()
        return display
      }
      r.panelDisplay = {
        hero: await panelDisplay('_composerStack_x_1 _composerHero_x_1'),
        coldStart: await panelDisplay('_composerStack_x_1 _composerHero_x_1', true),
        conversation: await panelDisplay('_composerStack_x_1'),
      }
    })
  })
})()


