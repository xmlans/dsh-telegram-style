/**
 * The host-palette case: what a wallpaper plugin's cleared canvas reaches under
 * the skin's palette. Then the settings case: the section rendered through the stand-in
 * React, tab by tab, with the sub-rows that grey out behind a parent, and the
 * heading's link to the plugin's repository.
 */
(function () {
  var probe = window.__dshSmokeProbe
  var sleep = probe.sleep
  var r = probe.report

  probe.step(async function () {
    // A wallpaper plugin's cleared canvas and glass over the skin's own
    // palette: the shell stands down under one mask, the base canvas and the
    // skin's own faces keep their fill, and taking the wallpaper away brings
    // the fills back.
    await probe.onlyFor(['host-palette'], async function () {
      var hostProbe = function (html) {
        var holder = document.createElement('div')
        holder.innerHTML = html
        document.body.appendChild(holder.firstChild)
        return document.body.lastChild
      }
      var hostNodes = {
        sidebar: hostProbe('<div data-pane="sidebar">s</div>'),
        conversation: hostProbe('<div data-pane="conversation">c</div>'),
        popover: hostProbe('<div class="dsh-tg-popover-card" data-open="true">p</div>'),
        search: hostProbe('<div class="dsh-tg-search-dialog">q</div>'),
        group: hostProbe('<span class="dsh-tg-model-group">g</span>'),
      }
      var readHost = async function (patch, wallpaper) {
        if (patch !== null) window.__pushForm(patch)
        if (wallpaper) document.body.setAttribute('data-we-wallpaper', '')
        else document.body.removeAttribute('data-we-wallpaper')
        await sleep(120)
        var bodyStyle = getComputedStyle(document.body)
        return {
          base: bodyStyle.getPropertyValue('--dsw-alias-bg-base').trim(),
          body: bodyStyle.backgroundColor,
          // The mask the palette lays over a wallpaper
          mask: getComputedStyle(document.body, '::after').backgroundColor,
          maskPosition: getComputedStyle(document.body, '::after').position,
          html: getComputedStyle(document.documentElement).backgroundColor,
          sidebar: getComputedStyle(hostNodes.sidebar).backgroundColor,
          // The sidebar element carries this token itself: the skin's canvas
          // while the palette paints it, cleared while a wallpaper is up.
          sidebarFill: getComputedStyle(hostNodes.sidebar).getPropertyValue('--dsw-specific-sidebar-fill').trim(),
          conversation: getComputedStyle(hostNodes.conversation).backgroundColor,
          popover: getComputedStyle(hostNodes.popover).backgroundColor,
          popoverBlur: getComputedStyle(hostNodes.popover).backdropFilter,
          // The account drawer the footer feature built (it sweeps any other copy).
          account: getComputedStyle(document.querySelector('.dsh-tg-account-popover')).backgroundColor,
          search: getComputedStyle(hostNodes.search).backgroundColor,
          group: getComputedStyle(hostNodes.group).backgroundColor,
          groupInk: getComputedStyle(hostNodes.group).color,
        }
      }
      await sleep(300)
      r.hostPalette = {
        classic: await readHost(null, false),
        // The wallpaper plugin showing one under the classic palette: the
        // shell stands down, one mask lies over the wallpaper, and the base
        // canvas and the skin's own faces keep their fill.
        classicWallpaper: await readHost(null, true),
      }
      document.body.removeAttribute('data-we-wallpaper')
      await sleep(120)
      for (var hostKey in hostNodes) hostNodes[hostKey].remove()
    })
    // The settings page, rendered through the stand-in React into a plain tree:
    // the tab strip, which rows each tab carries, and the sub-rows that grey
    // out while their parent is off. A tab is opened by standing the tab state
    // in for a click (the stand-in's `states`).
    await probe.onlyFor(['settings'], async function () {
      var Section = (window.__slotComponents || {})['telegram-style']
      var walk = function (node, visit) {
        if (node === null || node === undefined || typeof node !== 'object') return
        if (Array.isArray(node)) { node.forEach(function (child) { walk(child, visit) }); return }
        visit(node)
        walk(node.props && node.props.children, visit)
      }
      var renderTab = function (tabId) {
        var react = window.__react
        react.rendering = true
        react.states = tabId === 'general' ? null : { general: tabId }
        var tree = Section({})
        react.rendering = false
        react.states = null
        var out = { tabs: [], selected: null, rows: [], disabled: [], notes: [], notice: null, link: null }
        walk(tree, function (node) {
          var props = node.props || {}
          if (props.role === 'tab') {
            out.tabs.push(props.key)
            if (props['aria-selected'] === 'true') out.selected = props.key
          }
          if (typeof props.className === 'string' && /(^| )dsh-tg-settings-row( |$)/.test(props.className)) {
            var rowKey = props.key
            out.rows.push(rowKey)
            if (props['data-disabled'] === '') out.disabled.push(rowKey)
            walk(props.children, function (child) {
              if (((child.props || {}).className || '') === 'dsh-tg-settings-row-note' && out.notes.indexOf(rowKey) < 0) out.notes.push(rowKey)
            })
          }
          if (typeof props.className === 'string' && /(^| )dsh-tg-settings-tab-notice( |$)/.test(props.className)) {
            out.notice = [].concat(props.children).filter(function (child) { return typeof child === 'string' }).join('')
          }
          if (props.className === 'dsh-tg-settings-repo') {
            out.link = { href: props.href, target: props.target, rel: props.rel, label: props['aria-label'], text: props.children }
          }
        })
        return out
      }
      // The Motion tab's tree, for the two kinds of preview card read off it.
      var renderMotion = function () {
        var react = window.__react
        react.rendering = true
        react.states = { general: 'motion' }
        var tree = Section({})
        react.rendering = false
        react.states = null
        return tree
      }
      r.settings = { registered: typeof Section === 'function', pages: {} }
      if (r.settings.registered) {
        var tabIds = ['general', 'appearance', 'composer', 'sidebar', 'conversation', 'motion']
        for (var ti = 0; ti < tabIds.length; ti++) r.settings.pages[tabIds[ti]] = renderTab(tabIds[ti])
        r.settings.link = r.settings.pages.general.link
        // The heading's link is plain text: the rendered pseudo-element must
        // carry no mask icon.
        var linkNode = document.createElement('a')
        linkNode.className = 'dsh-tg-settings-repo'
        document.body.appendChild(linkNode)
        var markStyle = getComputedStyle(linkNode, '::before')
        r.settings.mark = {
          mask: (markStyle.maskImage === 'none' ? markStyle.webkitMaskImage : markStyle.maskImage).slice(0, 48),
          size: markStyle.width + '×' + markStyle.height,
          ink: markStyle.backgroundColor,
        }
        linkNode.remove()
        // The waiting line's paint cards: the stand-in renders the page as a
        // plain tree, so the two previews are stood up here with the classes and
        // the wordings the cards carry, and read through their own boxes — the
        // layer count is how many radial washes a paint really holds, and the
        // two wordings' animation names, delays and places are the taking-turns.
        r.settings.paintCards = (function () {
          var out = { cards: [], previews: {} }
          var tree = renderMotion()
          walk(tree, function (node) {
            var props = node.props || {}
            if (typeof props.className === 'string' && /(^| )dsh-tg-motion-card( |$)/.test(props.className)) {
              var kids = [].concat(props.children || [])
              var sample = kids[0] || {}
              var sampleProps = sample.props || {}
              // The two wordings, read through the tree: the sample's children
              // arrive nested (the module passes the mapped array as one child,
              // as React flattens it), so the walk is what finds the words.
              var words = []
              // The band a wording carries under the sweep (shared/sweep-band.ts):
              // its window and the copy inside it, as the tree holds them.
              var bands = []
              walk(sampleProps.children, function (word) {
                var wordProps = word.props || {}
                if (!/(^| )dsh-tg-motion-word( |$)/.test(wordProps.className || '')) return
                var parts = [].concat(wordProps.children || [])
                words.push(parts.filter(function (part) { return typeof part === 'string' }).join(''))
                var band = parts.filter(function (part) { return part !== null && typeof part === 'object' })[0]
                if (band === undefined) return
                var glyphs = [].concat((band.props || {}).children || [])[0] || {}
                bands.push({ window: band.props.className, glyphs: (glyphs.props || {}).className, text: (glyphs.props || {})['data-text'] })
              })
              out.cards.push({
                label: props['aria-label'],
                active: props['data-active'] === '',
                pressed: props['aria-pressed'],
                // The card's only content is its sample: the choice carries no
                // text of its own, and the sample is the words taking turns.
                sample: kids.length === 1 && /(^| )dsh-tg-motion-sample( |$)/.test(sampleProps.className || ''),
                words: words,
                bands: bands,
                sampleHidden: sampleProps['aria-hidden'] === 'true',
              })
            }
          })
          var kinds = ['sweep', 'wash']
          var wordings = (out.cards[0] || {}).words || []
          for (var ki = 0; ki < kinds.length; ki += 1) {
            // Inside a card, where the sample is a flex item: its box then takes
            // the room the card gives it, as it does on the page.
            var card = document.createElement('button')
            card.className = 'dsh-tg-motion-card'
            var box = document.createElement('span')
            box.className = 'dsh-tg-motion-sample'
            for (var wi = 0; wi < wordings.length; wi += 1) {
              var word = document.createElement('span')
              word.className = 'dsh-tg-motion-word dsh-tg-' + kinds[ki]
              word.setAttribute('data-text', wordings[wi])
              word.textContent = wordings[wi]
              // The band stands up the way the card's own tree carries it.
              var carried = ((out.cards[ki] || {}).bands || [])[wi]
              if (carried !== undefined) {
                var bandNode = document.createElement('span')
                bandNode.className = carried.window
                var glyphsNode = document.createElement('span')
                glyphsNode.className = carried.glyphs
                glyphsNode.setAttribute('data-text', carried.text)
                bandNode.appendChild(glyphsNode)
                word.appendChild(bandNode)
              }
              box.appendChild(word)
            }
            card.appendChild(box)
            document.body.appendChild(card)
            var nodes = [].slice.call(box.children)
            var style = nodes.length === 0 ? null : getComputedStyle(nodes[0])
            var paint = nodes.length === 0 ? null : getComputedStyle(nodes[0], '::before')
            var bandOf = nodes.length === 0 ? null : nodes[0].querySelector('.dsh-tg-sweep-band')
            var round = function (value) { return Math.round(value) }
            var centreOf = function (node) {
              var rect = node.getBoundingClientRect()
              return round((rect.left + rect.right) / 2)
            }
            out.previews[kinds[ki]] = {
              words: nodes.map(function (node) { return node.textContent }),
              // The band's two halves, and whether its copy reads the words it lies over.
              band: bandOf === null ? null : {
                animation: getComputedStyle(bandOf).animationName + ', ' + getComputedStyle(bandOf.firstElementChild).animationName,
                matches: bandOf.firstElementChild.getAttribute('data-text') === nodes[0].getAttribute('data-text'),
              },
              wordAnimations: nodes.map(function (node) { return getComputedStyle(node).animationName }),
              wordDelays: nodes.map(function (node) { return getComputedStyle(node).animationDelay }),
              wordCentres: nodes.map(centreOf),
              wordWidths: nodes.map(function (node) { return round(node.getBoundingClientRect().width) }),
              width: round(box.getBoundingClientRect().width),
              animation: paint === null ? null : paint.animationName,
              washes: paint === null ? 0 : (paint.backgroundImage.match(/url\("data:image\/svg/g) || []).length,
              ink: style === null ? null : style.color,
            }
            card.remove()
          }
          return out
        })()
        // The caret row's preview cards: one line is typed out in both cards,
        // character by character, with the caret standing where the last typed
        // character ends — lit for the whole time the line is being typed and
        // blinking on the native cycle once the line stands whole, the on card's
        // caret gliding to each new place and the off card's arriving there at
        // once. The stand-in renders the page as a plain tree and the cards'
        // clock lives in a component, so the cards are stood up here with the
        // classes and the attributes they carry and read through their own
        // boxes.
        var caretHost = document.createElement('div')
        caretHost.style.cssText = 'position:absolute;left:-10000px;top:-10000px'
        var caretCard = function (kind, typing) {
          var card = document.createElement('span')
          card.className = 'dsh-tg-caret-card'
          var sample = document.createElement('span')
          sample.className = 'dsh-tg-caret-sample'
          sample.style.setProperty('--dsh-tg-caret-x', '34px')
          var text = document.createElement('span')
          text.className = 'dsh-tg-caret-sample-text'
          var typed = document.createElement('span')
          typed.className = 'dsh-tg-caret-piece'
          typed.setAttribute('data-in', '')
          typed.textContent = 'H'
          var waiting = document.createElement('span')
          waiting.className = 'dsh-tg-caret-piece'
          waiting.textContent = 'i'
          text.appendChild(typed)
          text.appendChild(waiting)
          var bar = document.createElement('span')
          bar.className = 'dsh-tg-caret-sample-bar dsh-tg-caret-' + kind
          if (typing) bar.setAttribute('data-typing', '')
          sample.appendChild(text)
          sample.appendChild(bar)
          card.appendChild(sample)
          caretHost.appendChild(card)
          return { card: card, sample: sample, bar: bar, typed: typed, waiting: waiting }
        }
        document.body.appendChild(caretHost)
        var typingCaret = caretCard('typing', true)
        var standingCaret = caretCard('typing', false)
        var offCaret = caretCard('off', false)
        var caretRead = function (one) {
          var barStyle = getComputedStyle(one.bar)
          return {
            typed: getComputedStyle(one.typed).visibility,
            waiting: getComputedStyle(one.waiting).visibility,
            x: Math.round(one.bar.getBoundingClientRect().left - one.sample.getBoundingClientRect().left),
            animation: barStyle.animationName,
            transition: barStyle.transitionDuration,
          }
        }
        r.settings.caretPreview = {
          typing: caretRead(typingCaret),
          standing: caretRead(standingCaret),
          off: caretRead(offCaret),
        }
        caretHost.remove()
        // The new-text fade row's cards: the fade card hands each character its
        // turn and lets it land faint, settling over the reveal's own duration,
        // while the other card's characters stand solid the moment they arrive
        // and a character still waiting for its turn is unseen. The stand-in
        // renders the page as a plain tree and the cards' clock lives in a
        // component, so the pieces are stood up here with the classes and the
        // attributes the cards carry and read through their own boxes.
        var revealHost = document.createElement('div')
        revealHost.style.cssText = 'position:absolute;left:-10000px;top:-10000px'
        var revealCard = function (fade) {
          var card = document.createElement('button')
          card.className = 'dsh-tg-reveal-card'
          if (fade) card.setAttribute('data-fade', '')
          var piece = function (inTurn) {
            var span = document.createElement('span')
            span.className = 'dsh-tg-reveal-piece'
            if (inTurn) span.setAttribute('data-in', '')
            span.textContent = 'x'
            card.appendChild(span)
            return span
          }
          revealHost.appendChild(card)
          return piece
        }
        var fadePiece = revealCard(true)(true)
        var waitingPiece = revealCard(true)(false)
        var plainPiece = revealCard(false)(true)
        document.body.appendChild(revealHost)
        var readPiece = function (piece) {
          var style = getComputedStyle(piece)
          return { opacity: style.opacity, animation: style.animationName, duration: style.animationDuration, fill: style.animationFillMode }
        }
        r.settings.revealPreview = { fade: readPiece(fadePiece), waiting: readPiece(waitingPiece), plain: readPiece(plainPiece) }
        revealHost.remove()
        window.__pushForm({ modelPicker: false, mascot: false, sidebarSearch: false })
        r.settings.parentsOff = { appearance: renderTab('appearance'), composer: renderTab('composer'), sidebar: renderTab('sidebar') }
        window.__pushForm({ modelPicker: true, mascot: true, sidebarSearch: true })
        // The rows that wait for another setting: the composer restyle off greys
        // the picker, its sub-rows, the permission control and the statistics'
        // position; the footer takeover off greys the easter egg under it. Home
        // only still leaves the statistics without a conversation to stand in.
        window.__pushForm({ composerScope: 'off', collapseFooter: false })
        r.settings.requirementsOff = { composer: renderTab('composer'), conversation: renderTab('conversation'), sidebar: renderTab('sidebar') }
        window.__pushForm({ composerScope: 'hero', collapseFooter: true })
        r.settings.heroOnly = { composer: renderTab('composer'), conversation: renderTab('conversation') }
        window.__pushForm({ composerScope: 'all' })
      }
    })
  })
})()
