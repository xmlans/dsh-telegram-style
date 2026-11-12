# Style Guide · 设计令牌

Design tokens and rules for `dsh-telegram-style`, which recreates the look of Telegram Web.

## Palette · 配色

Three palettes, each with a light and a dark side that follow the host's own light/dark switch: **Classic** (`telegram`: Telegram's default colours), **Glass** (`glass`: translucent, blurred cards) and **Pink** (`trans`: a light pink wallpaper with deeper pink patterns, blue bubbles and buttons). The settings page picks one with a segmented control; there is no "follow the host" option.

The wallpaper is a plain colour (`--dsh-tg-wallpaper`) with a pattern laid over it. The pattern is a supplied image, tinted per palette (`--dsh-tg-doodle-ink`, `--dsh-tg-doodle-opacity`), and the settings page can turn it off to leave the plain colour.

How the three accent tokens divide the work:

- **Accent** (`--dsh-tg-accent`): icons, underlines and progress lines only.
- **Accent text** (`--dsh-tg-accent-text`): links, accent-coloured text and labels; it holds 4.5:1 against its surface.
- **Accent fill** (`--dsh-tg-accent-fill`, with `--dsh-tg-on-accent` on top): anything that carries white text, such as the selected row, badges, the selected segment and the send button; the text on it holds 4.5:1.
- **Primary text** is `#111111` in Classic light, never pure black.
- The token table is the single source for every value; a private colour token needs a value for each of the six palette sides (the build refuses a missing one).
- Every "text colour on surface" pair is checked by the contrast spec under `packages/testing/specs/logic/palette-contrast/`; a translucent surface is composited over the palette's lightest wallpaper colour before it is measured.


The table below is generated from `packages/client/src/theme/tokens.json` by `npm run build`;
edit the JSON, not the table. `—` is a token that palette leaves unset.

<!-- generated:tokens (packages/client/src/theme/tokens.json) -->
| Token | 经典 亮 | 经典 暗 | 玻璃 亮 | 玻璃 暗 | 粉色 亮 | 粉色 暗 | Use |
|---|---|---|---|---|---|---|---|
| `--dsh-tg-wallpaper` | `#C8DAAE` | `#231F36` | `#D8E0FB` | `#121530` | `#FCE4EC` | `#2A1F33` | the window's wallpaper: the plain colour under the pattern (spec 4.1) |
| `--dsh-tg-doodle-ink` | `#557E43` | `#FFFFFF` | `#4F5FB8` | `#A9B2FF` | `#D94F8C` | `#F59AC2` | the doodles' line colour |
| `--dsh-tg-doodle-opacity` | `0.42` | `0.08` | `0.32` | `0.12` | `0.45` | `0.14` | the doodle layer's opacity |
| `--dsh-tg-surface` | `#FFFFFF` | `#212121` | `#F4F8FF` | `#172130` | `#FCFDFF` | `#223246` | an opaque surface: host dialogs, the host's base layers |
| `--dsh-tg-card` | `#FFFFFF` | `#212121` | `rgba(255, 255, 255, 0.55)` | `rgba(23, 33, 46, 0.58)` | `#FCFDFF` | `#223246` | the floating cards: the chat list, the right panel, the input bar, the header pill |
| `--dsh-tg-menu` | `#FFFFFF` | `#2A2A2A` | `rgba(255, 255, 255, 0.82)` | `rgba(28, 40, 55, 0.78)` | `#FFFFFF` | `#26374A` | dropdown menus and popover cards |
| `--dsh-tg-card-blur` | `none` | `none` | `blur(26px) saturate(1.8)` | `blur(26px) saturate(1.8)` | `none` | `none` | the backdrop filter a card, a menu and an incoming bubble take |
| `--dsh-tg-card-shadow` | `0 0 4px rgba(0, 0, 0, 0.10)` | `0 0 4px rgba(0, 0, 0, 0.35)` | `inset 0 1px 0 rgba(255, 255, 255, 0.75), inset 0 0 0 1px rgba(255, 255, 255, 0.28), 0 8px 24px rgba(31, 64, 110, 0.10)` | `inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 24px rgba(0, 0, 0, 0.35)` | `0 0 4px rgba(0, 0, 0, 0.10)` | `0 0 4px rgba(0, 0, 0, 0.35)` | a floating card's shadow, with the glass palettes' inner highlight |
| `--dsh-tg-menu-shadow` | `0 4px 16px rgba(0, 0, 0, 0.16)` | `0 4px 16px rgba(0, 0, 0, 0.45)` | `0 4px 16px rgba(0, 0, 0, 0.16)` | `0 4px 16px rgba(0, 0, 0, 0.45)` | `0 4px 16px rgba(0, 0, 0, 0.16)` | `0 4px 16px rgba(0, 0, 0, 0.45)` | a dropdown menu's shadow (spec 4.10) |
| `--dsh-tg-ink` | `#111111` | `#F5F5F5` | `#0D1B2A` | `#F2F6FA` | `#16212F` | `#F1F6FC` | primary text |
| `--dsh-tg-ink-secondary` | `#686C70` | `#AAAAAA` | `rgba(13, 27, 42, 0.68)` | `rgba(226, 236, 244, 0.66)` | `#526779` | `#BCCBDB` | secondary text: the list's second line, descriptions |
| `--dsh-tg-line` | `#E6E8EA` | `#303030` | `rgba(13, 27, 42, 0.10)` | `rgba(255, 255, 255, 0.08)` | `#D2E1EC` | `rgba(255, 255, 255, 0.09)` | hairlines and borders |
| `--dsh-tg-hover-bg` | `rgba(0, 0, 0, 0.05)` | `rgba(255, 255, 255, 0.06)` | `rgba(13, 27, 42, 0.06)` | `rgba(255, 255, 255, 0.06)` | `rgba(23, 100, 137, 0.06)` | `rgba(255, 255, 255, 0.06)` | the wash under a hovered row or button |
| `--dsh-tg-accent` | `#3390EC` | `#8774E1` | `#0A84FF` | `#6AB3F3` | `#176489` | `#80D8FB` | the accent for icons, underlines and progress lines only |
| `--dsh-tg-accent-text` | `#1C6CBE` | `#A896FF` | `#0063CC` | `#8FC6FF` | `#176489` | `#80D8FB` | accent text: links, accent labels, group titles (4.5:1) |
| `--dsh-tg-accent-fill` | `#2176D2` | `#7461D6` | `linear-gradient(135deg, #1677C9, #0060C9)` | `linear-gradient(135deg, #1D6FA8, #4B3BC4)` | `#176489` | `#80D8FB` | the fill white text sits on: the selected row, badges, the selected segment, the send button, the new-chat button |
| `--dsh-tg-accent-solid` | `#2176D2` | `#7461D6` | `#1677C9` | `#1D6FA8` | `#176489` | `#80D8FB` | the accent fill as one colour, where a gradient cannot go: borders, outlines, color-mix() |
| `--dsh-tg-on-accent` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#16212F` | text and icons on the accent fill |
| `--dsh-tg-bubble-out` | `#EEFFDE` | `#766AC8` | `linear-gradient(135deg, #1677C9, #0060C9)` | `linear-gradient(135deg, #1D6FA8, #4B3BC4)` | `#FCE9EF` | `#493247` | the reader's own bubbles |
| `--dsh-tg-bubble-out-tail` | `#EEFFDE` | `#766AC8` | `#0060C9` | `#4B3BC4` | `#FCE9EF` | `#493247` | the outgoing bubble's tail, the colour the bubble ends in at its bottom right |
| `--dsh-tg-bubble-out-solid` | `#EEFFDE` | `#766AC8` | `#1677C9` | `#1D6FA8` | `#FCE9EF` | `#493247` | the outgoing bubble as one colour, for the host's own bubble token |
| `--dsh-tg-bubble-out-ink` | `#111111` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#16212F` | `#F1F6FC` | text in an outgoing bubble |
| `--dsh-tg-bubble-out-meta` | `#3A8238` | `#E4DFFF` | `rgba(255, 255, 255, 0.8)` | `rgba(255, 255, 255, 0.8)` | `#9B4A63` | `#F5A9B8` | the time and ticks in an outgoing bubble (3:1) |
| `--dsh-tg-bubble-in` | `#FFFFFF` | `#212121` | `rgba(255, 255, 255, 0.62)` | `rgba(26, 39, 54, 0.62)` | `#FFFFFF` | `#223246` | the answer's bubble |
| `--dsh-tg-bubble-in-meta` | `#707579` | `#AAAAAA` | `rgba(13, 27, 42, 0.5)` | `rgba(226, 236, 244, 0.66)` | `#526779` | `#BCCBDB` | the time and usage around an incoming bubble (3:1) |
| `--dsh-tg-service` | `rgba(25, 45, 18, 0.60)` | `rgba(0, 0, 0, 0.45)` | `rgba(255, 255, 255, 0.45)` | `rgba(10, 18, 28, 0.5)` | `rgba(23, 100, 137, 0.85)` | `rgba(0, 0, 0, 0.4)` | the service-message pill's fill |
| `--dsh-tg-service-ink` | `#FFFFFF` | `#FFFFFF` | `#0D1B2A` | `#DBE7F0` | `#FFFFFF` | `#F1F6FC` | text on the service pill |
| `--dsh-tg-selected` | `#2176D2` | `#7461D6` | `linear-gradient(135deg, #1677C9, #0060C9)` | `linear-gradient(135deg, #1D6FA8, #4B3BC4)` | `#D9F2FE` | `#80D8FB` | the selected chat row's fill |
| `--dsh-tg-selected-solid` | `#2176D2` | `#7461D6` | `#1677C9` | `#1D6FA8` | `#D9F2FE` | `#80D8FB` | the selected fill as one colour, for the host's selector token |
| `--dsh-tg-selected-ink` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#16212F` | `#16212F` | both lines of the selected chat row |
| `--dsh-tg-inline-code-bg` | `#F1F3F5` | `#2B2B2B` | `rgba(13, 27, 42, 0.06)` | `rgba(255, 255, 255, 0.08)` | `#EEF4F8` | `#2C3E54` | inline code |
| `--dsh-tg-code-block` | `#F4F6F8` | `#181818` | `rgba(255, 255, 255, 0.5)` | `rgba(0, 0, 0, 0.25)` | `#F3F7FA` | `#1B2838` | a code block inside a bubble |
| `--dsh-tg-table-head` | `#F1F3F5` | `#2B2B2B` | `rgba(13, 27, 42, 0.05)` | `rgba(255, 255, 255, 0.06)` | `#EEF4F8` | `#2C3E54` | a table's header row inside a bubble |
| `--dsh-tg-deco-blue` | `#3390EC` | `#8774E1` | `#0A84FF` | `#6AB3F3` | `#5BCEFA` | `#5BCEFA` | decoration only: underlines, ticks |
| `--dsh-tg-deco-pink` | `#FF5C8A` | `#FF5C8A` | `#FF5C8A` | `#FF5C8A` | `#F5A9B8` | `#F5A9B8` | decoration only: the folder tab's underline second stop, small accents |
| `--dsh-tg-settings-page` | `#F6F7F8` | `#181818` | `rgba(255, 255, 255, 0.35)` | `rgba(10, 18, 28, 0.35)` | `#EEF3F8` | `#1A2738` | the settings page's ground, one step deeper than a card |
| `--dsh-tg-scrollbar` | `rgba(0, 0, 0, 0.18)` | `rgba(255, 255, 255, 0.18)` | `rgba(13, 27, 42, 0.20)` | `rgba(255, 255, 255, 0.18)` | `rgba(23, 100, 137, 0.22)` | `rgba(255, 255, 255, 0.18)` | a scrollbar thumb |
| `--dsh-tg-scrollbar-hover` | `rgba(0, 0, 0, 0.32)` | `rgba(255, 255, 255, 0.32)` | `rgba(13, 27, 42, 0.34)` | `rgba(255, 255, 255, 0.32)` | `rgba(23, 100, 137, 0.38)` | `rgba(255, 255, 255, 0.32)` | a hovered scrollbar thumb |
| `--dsh-tg-avatar-1` | `#E06F75` | `#E06F75` | `#E06F75` | `#E06F75` | `#E06F75` | `#E06F75` | avatar colour 1 (white initial, 3:1) |
| `--dsh-tg-avatar-2` | `#C4835B` | `#C4835B` | `#C4835B` | `#C4835B` | `#C4835B` | `#C4835B` | avatar colour 2 |
| `--dsh-tg-avatar-3` | `#9788D2` | `#9788D2` | `#9788D2` | `#9788D2` | `#9788D2` | `#9788D2` | avatar colour 3 |
| `--dsh-tg-avatar-4` | `#63A14F` | `#63A14F` | `#63A14F` | `#63A14F` | `#63A14F` | `#63A14F` | avatar colour 4 |
| `--dsh-tg-avatar-5` | `#569D9E` | `#569D9E` | `#569D9E` | `#569D9E` | `#569D9E` | `#569D9E` | avatar colour 5 |
| `--dsh-tg-avatar-6` | `#5A98C6` | `#5A98C6` | `#5A98C6` | `#5A98C6` | `#5A98C6` | `#5A98C6` | avatar colour 6 |
| `--dsh-tg-avatar-7` | `#D96F9E` | `#D96F9E` | `#D96F9E` | `#D96F9E` | `#D96F9E` | `#D96F9E` | avatar colour 7 |
| `--dsh-tg-heat-0` | `#EBEDF0` | `#2A2F36` | `#EBEDF0` | `#2A2F36` | `#EBEDF0` | `#2A2F36` | a heat cell with no usage |
| `--dsh-tg-heat-1` | `#C6E2FF` | `#0E3A66` | `#C6E2FF` | `#0E3A66` | `#C6E2FF` | `#0E3A66` | heat level 1 |
| `--dsh-tg-heat-2` | `#79B8FF` | `#1565C0` | `#79B8FF` | `#1565C0` | `#79B8FF` | `#1565C0` | heat level 2 |
| `--dsh-tg-heat-3` | `#2F80ED` | `#3D8FE0` | `#2F80ED` | `#3D8FE0` | `#2F80ED` | `#3D8FE0` | heat level 3 |
| `--dsh-tg-heat-4` | `#0B4F9C` | `#8EC5FF` | `#0B4F9C` | `#8EC5FF` | `#0B4F9C` | `#8EC5FF` | heat level 4 |
| `--dsh-tg-heart` | `#FF5C8A` | `#FF5C8A` | `#FF5C8A` | `#FF5C8A` | `#FF5C8A` | `#FF5C8A` | the pink of the mascot's hearts |

| Alias | Value | Use |
|---|---|---|
| `--dsw-alias-bg-base` | `var(--dsh-tg-surface)` | the host's base layer |
| `--dsw-alias-bg-layer-1` | `var(--dsh-tg-surface)` | the host's first raised layer |
| `--dsw-alias-bg-layer-2` | `color-mix(in srgb, var(--dsh-tg-surface) 94%, var(--dsh-tg-ink))` | the host's second layer |
| `--dsw-alias-bg-layer-3` | `color-mix(in srgb, var(--dsh-tg-surface) 90%, var(--dsh-tg-ink))` | the host's third layer |
| `--dsw-alias-bg-overlay` | `var(--dsh-tg-menu)` | the host's floating surfaces (menus, popovers, dialogs); opaque, as upstream had it |
| `--dsw-alias-border-l1` | `var(--dsh-tg-line)` | the host's strongest border |
| `--dsw-alias-border-l2` | `color-mix(in srgb, var(--dsh-tg-line) 70%, transparent)` | the host's middle border |
| `--dsw-alias-border-l3` | `color-mix(in srgb, var(--dsh-tg-line) 45%, transparent)` | the host's faintest border |
| `--dsw-alias-brand-primary` | `var(--dsh-tg-accent)` | the host's brand colour |
| `--dsw-alias-brand-text` | `var(--dsh-tg-accent-text)` | the host's brand-coloured text |
| `--dsw-alias-brand-primary-new-colorprimary-new-color` | `var(--dsh-tg-accent)` | the host's newer brand colour token |
| `--dsw-alias-button-primary-fill` | `var(--dsh-tg-accent-solid)` | the host's primary button |
| `--dsw-alias-button-primary-hover` | `color-mix(in srgb, var(--dsh-tg-accent-solid) 88%, var(--dsh-tg-ink))` | the host's primary button, hovered |
| `--dsw-alias-button-elevated-fill` | `var(--dsh-tg-surface)` | the host's elevated button |
| `--dsw-alias-button-floating-fill` | `var(--dsh-tg-surface)` | the host's floating button |
| `--dsw-alias-button-floating-hover` | `color-mix(in srgb, var(--dsh-tg-surface) 94%, var(--dsh-tg-ink))` | the host's floating button, hovered |
| `--dsw-alias-button-info-fill` | `color-mix(in srgb, var(--dsh-tg-accent) 14%, transparent)` | the host's info button |
| `--dsw-alias-button-info-hover` | `color-mix(in srgb, var(--dsh-tg-accent) 22%, transparent)` | the host's info button, hovered |
| `--dsw-alias-interactive-bg-active` | `color-mix(in srgb, var(--dsh-tg-accent) 14%, transparent)` | the host's pressed or active wash |
| `--dsw-alias-interactive-bg-hover` | `var(--dsh-tg-hover-bg)` | the host's hover wash |
| `--dsw-alias-interactive-bg-hover-solid` | `color-mix(in srgb, var(--dsh-tg-surface) 94%, var(--dsh-tg-ink))` | the host's opaque hover |
| `--dsw-alias-markdown-code-block` | `var(--dsh-tg-code-block)` | the host's code block |
| `--dsw-alias-markdown-code-block-banner` | `var(--dsh-tg-table-head)` | the host's code block banner |
| `--dsw-alias-label-primary` | `var(--dsh-tg-ink)` | the host's primary text |
| `--dsw-alias-label-primary-bluish` | `var(--dsh-tg-ink)` | the host's bluish primary text |
| `--dsw-alias-label-secondary` | `var(--dsh-tg-ink-secondary)` | the host's secondary text |
| `--dsw-alias-label-tertiary` | `var(--dsh-tg-ink-secondary)` | the host's tertiary text, held to the secondary text's contrast |
| `--dsw-alias-label-caption` | `var(--dsh-tg-ink-secondary)` | the host's caption text |
| `--dsw-alias-label-shimmer` | `var(--dsh-tg-accent-text)` | the host's shimmer highlight |
| `--dsw-alias-label-deep-diving-shimmer` | `var(--dsh-tg-accent-text)` | the host's thinking shimmer |
| `--dsw-alias-state-business-primary` | `var(--dsh-tg-accent-solid)` | the host's business state colour |
| `--dsw-alias-state-business-tertiary` | `color-mix(in srgb, var(--dsh-tg-accent) 14%, transparent)` | the host's business state wash |
| `--dsw-alias-link` | `var(--dsh-tg-accent-text)` | the host's links |
| `--dsw-shadow-lv2` | `var(--dsh-tg-menu-shadow)` | the host's menu shadow |
| `--dsw-specific-input-major` | `var(--dsh-tg-card)` | the host's input card |
| `--dsw-specific-selector` | `var(--dsh-tg-selected-solid)` | the host's selected row |
| `--dsw-specific-sidebar-fill` | `var(--dsh-tg-card)` | the host's sidebar fill |
| `--dsw-specific-menu` | `var(--dsh-tg-menu)` | the host's menus |
| `--dsw-specific-bubble` | `var(--dsh-tg-bubble-out-solid)` | the host's own user bubble |
| `--dsh-tg-canvas` | `var(--dsh-tg-surface)` | the upstream sheets' canvas |
| `--dsh-tg-sidebar-canvas` | `var(--dsh-tg-card)` | the upstream sheets' sidebar ground |
| `--dsh-tg-raised` | `var(--dsh-tg-surface)` | the upstream sheets' raised surface |
| `--dsh-tg-inverse-fill` | `var(--dsh-tg-ink)` | an inverted chip's fill |
| `--dsh-tg-inverse-ink` | `var(--dsh-tg-surface)` | an inverted chip's text |
| `--dsh-tg-ink-strong` | `var(--dsh-tg-ink)` | the upstream sheets' strong text |
| `--dsh-tg-session-ink` | `var(--dsh-tg-ink)` | the upstream sheets' session title text |
| `--dsh-tg-inline-code-fg` | `var(--dsh-tg-ink)` | inline code text |
| `--dsh-tg-link` | `var(--dsh-tg-accent-text)` | links in the skin's own copy |
| `--dsh-tg-link-underline` | `color-mix(in srgb, var(--dsh-tg-accent-text) 40%, transparent)` | a link's underline |
| `--dsh-tg-link-hover` | `var(--dsh-tg-accent-text)` | a hovered link |
| `--dsh-tg-logo-ink` | `var(--dsh-tg-accent)` | a mark drawn as a shape in the accent |
| `--dsh-tg-chip` | `var(--dsh-tg-card)` | a chip's fill |
<!-- /generated:tokens -->

**Host token bindings.** The skin supplies its palette through the host's own
alias tokens, so a host control that reads more than one token for one surface
has to be given all of them. A filled primary button is that case: the host takes
the fill from `--dsw-alias-brand-primary`, but the hover from a monochrome step
of its own scale (light `#43454a`, dark `#ebeef2`) and the label from a
foreground token the skin leaves alone. `--dsw-alias-button-primary-fill` and
`--dsw-alias-button-primary-hover` therefore state both steps in each palette.
Two fills are palette-specific rather than carried over from the dark base:
`--dsw-alias-interactive-bg-hover-solid` (a solid chip, lighter than the canvas
in light) and `--dsw-alias-button-elevated-fill` (a surface above the canvas in
light, a raised gray in dark).

## Palette gate · 配色归属

The skin always paints; the palette preference only picks which of the three palettes does. Every rule that writes a host token or paints the skin's canvas onto the host's frame (`<html>`, `<body>`, `#root`, the sidebar and conversation columns) sits under `body[data-dsh-telegram-style]`, and the palette is carried by `data-dsh-tg-palette` on the body, so one palette's tokens replace another's wholesale and feature stylesheets never branch on it.

The skin's own surfaces read only its private tokens and host tokens. A new private colour token gets a value for each palette side and its host alias in `packages/client/src/theme/tokens.json`; the build refuses a private token without them. The token table has three groups: palette tokens (per palette side), shared tokens (the same in every palette) and aliases (the host tokens the skin rewrites).

Cards take the host's overlay layer rather than its canvas, and the shared popover card blurs what lies behind it only in the Glass palette.

Two colours are fixed in every palette: the reasoning slider's violet top rung (`--dsh-tg-apex*`) and the usage panel's data colours. Every other colour that paints a surface, a text, a border or an accent reads a token.

## Windows titlebar · 桌面顶栏

On the Windows desktop the 40px caption row has no colour of its own: the
sidebar and the conversation run to the window's top edge, each in its own
fill (`--dsh-tg-sidebar-canvas`, `--dsh-tg-canvas`), and the sidebar's
0.5px `--dsw-alias-border-l1` hairline runs with them from the top edge to the
bottom. The conversation column and the fullscreen file panel lose the host's
16px top-left corner, so the hairline meets them straight. The three window
buttons sit on the page itself: no block of their own behind them, and they dim
with a modal's mask like everything else. Their hover plate is the system's, a
tint of the button glyph's colour.

## Right sidebar · 右侧栏

A panel docked in the right column is a card: 8px inside the column on every
side, a 16px radius, the skin's 1px `--dsw-alias-border-l1` hairline and the
host's own panel elevation (`--dsw-elevation-prominent` — a `.5px` stroke, a
3px/8px drop and a 20px halo). The frame's canvas shows through the gap, and
the host's `.5px` left border on the first dock column gives way to the
hairline.

The card hangs on what paints the column: a docked tab's pane
(`[data-dockkit-host="dock"] > [data-dockkit-pane]`) or the column's own empty
host (`[data-dockkit-empty]`), which the pane inside it leaves transparent. A
panel pulled out of the sidebar becomes the host's own floating window
(`[data-dockkit-host="float"]`) and keeps that window's frame; a split column
gives each pane its own card, with the drag divider left on the seam between
them.

**Right sidebar card layout** (the Sidebar tab) chooses it: on is the card
above; off drops every rule that draws one, so the pane stands in the host's
own fill, flush with the column on all four sides, and a split's two panes meet
at the dock's own resting line. Every card rule is gated on
`<body data-dsh-tg-dock-look="card">`, so off is the host's own panel look
with nothing added.

**The start page.** The host centers its stack of entries in a box that never
grows, so a list taller than the pane was clipped at both ends, its first rows
out of reach. On the card the stack scrolls: `justify-content: flex-start`,
`margin-top: auto` on the first entry and `margin-bottom: auto` on the last.
The two auto margins absorb the free space exactly as `center` did while the
list fits, and fall to zero once it does not, so the stack starts at the top
and scrolls to its end.

## Typography

- **Body**: the system UI stack, `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif`.
- **Code**: `"JetBrains Mono", ui-monospace, "Cascadia Code", Consolas, monospace`; JetBrains Mono ships with the plugin. Both are fixed; there is no typeface preference.
- **Numbers**: times, usage and prices use tabular figures.
- **Headings**: sans-serif throughout.

| Where | Size | Weight |
|---|---|---|
| list title | 16px | 500 |
| list second line | 14px | 400 |
| message text | 15px | 400 |
| auxiliary text (time, usage) | 12px | 400 |
| group title | 13px | 500 |

## Shapes

- Radius: cards 16px, menus and popover cards 12px (rows 6px), bubbles 16px with a 4px
  tail corner, buttons fully round (`9999px`), and the 4 / 8 px steps for small controls. A shape copied from a host
  control keeps that control's own geometry rather than the scale above: the
  composer card's 18px (the host's 22px less 4), the inline composer's 14px and
  11px, the permission and workspace segments' 7px, the view tabs' 5px, the
  peak-rate and file pills' 999px.
- Borders: 1px, and in dark not a colour but a highlight. The three border
  tokens are one translucent white at `.09` / `.18` / `.30`, so a card, a panel,
  a code block or a keycap reads as a chamfer catching the top light over
  whatever fill it sits on rather than as a contour whose colour has to be
  re-picked per surface. The light rungs stay the warm opaque ladder. A copy of a
  host control keeps that control's own stroke: the inline composer's 1.6px stop
  square.
- Hairline: 0.5px, for the split between the sidebar and the conversation
  (`theme/chrome.css`, one device pixel on a retina display and the width the
  product itself states), the Markdown table frame and the trajectory chip
  (`theme/typography.css`, `features/chat-files`). Every other single-direction
  rule stays 1px.
- Spacing: 4 px rhythm.
- Bottom edge: the transcript never fades behind the composer by shadow. The
  composer seat paints an opaque `var(--dsw-alias-bg-base)` bar across its own
  box (so the bar's height *is* the composer's height) and one
  `--dsh-composer-fade-h` (40px) gradient band above it, running to transparent.
  The same token is the transcript's bottom clearance, so the last turn rests
  exactly at the band's top edge. Never re-add background-coloured halo shadows
  to the card to hide the transcript: they have to be restated in every
  light / dark / focus / attachment rule, and every rule that resets the card's
  `box-shadow` inherits the job.
- Focus: the composer field lights up — its hairline takes the input box's own
  shadow colour (espresso `#141413` in light) with a 1px halo in the same tone
  and a deeper drop shadow. Dark inverts the face: on the near-black canvas a
  black edge carries no cue, so the hairline and halo become bright ivory —
  the field visibly lights up instead of deepening. The footer tray below
  follows the same hairline so the two tiers stay one outline. Accent is never
  used for focus strokes.

## Motion

With the animation choice resolved to "reduced" every displacement is dropped, leaving at most a fade.

Every duration, curve, distance, blur and scale the skin uses is a token here,
and a stylesheet or a Web Animations call reads the token rather than writing the
value (D9). One value per role, so a faster feedback or a calmer swap is one
edit; the build refuses a time or a curve written anywhere else.

- Feedback: a control answering hover, press or focus.
- Reveal: content entering the chat area at the host's own 120 ms.
- Surface: an entrance — a menu, a popover, a panel, a dialog, a toast.
- Exit: a dismissal, deliberately quicker than the entrance.
- Travel: something moving along its own track (a fold's door, the reasoning
  slider).
- The swap, its gap and the roll of a figure's digits come from the transitions
  this skin ports; `THIRD_PARTY_NOTICES.md` names each one.
- Loop periods are separate from durations: a sweep, a pulse, a blink, a breath.
- Open: a menu growing out of its trigger, a dialog out of the centre, a
  settings page sliding in — the transitions.dev surfaces, settling on their own
  curve and closing on the exit duration.
- The presets these tokens feed live in `packages/client/src/shared/motion.css`:
  a surface arriving or leaving, a menu growing out of its trigger, a plain
  fade, one half of a wording swap, the pulse a placeholder and the sidebar's
  ongoing light share, and the two paints
  the waiting line's words can wear (a highlight band and a colour wash). A
  feature that needs its own effect reads the tokens and keeps its own
  keyframes.

The table below is generated from `packages/client/src/theme/tokens.json` by `npm run build`;
edit the JSON, not the table.

<!-- generated:motion (packages/client/src/theme/tokens.json) -->
| Token | Value | Use |
|---|---|---|
| `--dsh-tg-duration-instant` | `80ms` | the composer caret following the insertion point |
| `--dsh-tg-duration-feedback` | `120ms` | a control answering hover, press or focus: its colour, background, border, shadow, or a small turn or slide of its own parts |
| `--dsh-tg-duration-reveal` | `120ms` | content entering the chat area: an opened row's body, and each streamed piece of the answer |
| `--dsh-tg-duration-enter` | `320ms` | one message the reader sends growing into its row, and the same growth on the Motion tab's card |
| `--dsh-tg-duration-surface` | `150ms` | a floating surface or a group of controls appearing: popover cards, menus, panels, the search dialog, a toast, a strip fading in |
| `--dsh-tg-duration-exit` | `120ms` | a surface leaving on the reader's dismissal: a menu or a dialog closing, the overtime badge leaving |
| `--dsh-tg-duration-open` | `250ms` | a surface growing out of its anchor: a menu out of its trigger, a full-window dialog out of the centre, a settings page sliding in, the overtime badge sliding onto its line |
| `--dsh-tg-duration-swap` | `150ms` | each half of a wording swap: the old words leaving, the new ones arriving |
| `--dsh-tg-duration-swap-gap` | `50ms` | the offset the words arriving start after the words leaving, so the two halves of a wording swap travel together |
| `--dsh-tg-duration-clear-delay` | `50ms` | how long after a field empties the streak under its cleared words starts to rise |
| `--dsh-tg-duration-clear-text` | `400ms` | the two halves of clearing a field: the words leaving it, and the placeholder taking their place |
| `--dsh-tg-duration-clear` | `1000ms` | one whole clear: the words leaving, the placeholder arriving, and the streak's rise, peak and fall |
| `--dsh-tg-duration-roll` | `160ms` | a figure's characters rolling over to new digits |
| `--dsh-tg-duration-move` | `200ms` | something travelling along its own track: a fold's door, the reasoning slider's knob and fill |
| `--dsh-tg-duration-count` | `220ms` | a session number counting to its new reading |
| `--dsh-tg-duration-slide` | `240ms` | the segmented controls' sliding highlight, a sidebar icon's quarter turn, the wording box taking the width of the words arriving, and streamed content sliding up from the bottom edge |
| `--dsh-tg-duration-fade` | `300ms` | a slow cross-fade: the theme flip, the titlebar tabs' hover reveal, the reasoning knob's glow, a placeholder handing its place to what it stood for |
| `--dsh-tg-duration-bounce` | `350ms` | a switch's knob travelling across with its double bounce |
| `--dsh-tg-duration-flight` | `400ms` | the sent message flying from the composer to its row |
| `--dsh-tg-duration-step` | `500ms` | one step of the reasoning window's text rising two lines |
| `--dsh-tg-duration-pop` | `500ms` | something popping into place: the overtime badge's own pill |
| `--dsh-tg-duration-rise` | `500ms` | a line of the home greeting rising into place |
| `--dsh-tg-duration-stagger` | `70ms` | how far behind the piece before it a staggered piece starts: the greeting's second line |
| `--dsh-tg-period-dot-orbit` | `2400ms` | one turn of the waiting line's loader dots that swap corners: four quarter-turns of the two pairs, which leaves every dot where it started |
| `--dsh-tg-period-dot-rotate` | `10s` | how long one of the waiting line's loader motions stands before another takes its place, the next one picked so a motion never follows itself |
| `--dsh-tg-duration-reduced` | `0.01ms` | every skin animation and transition under the Reduced animation choice (D40) |
| `--dsh-tg-period-host-sweep` | `1500ms` | one pass of the highlight band across the waiting line's words and a running process group's header |
| `--dsh-tg-duration-host-sweep-delay` | `300ms` | how long the highlight band waits after its words appear before its first pass |
| `--dsh-tg-period-preview-swap` | `4000ms` | one turn of the settings page's waiting-line preview: one wording standing, leaving, and standing again |
| `--dsh-tg-period-preview-reveal` | `4000ms` | one turn of the settings page's new-text fade preview: the sample arriving character by character, then standing before the next wipe |
| `--dsh-tg-period-preview-caret` | `4000ms` | one turn of the settings page's caret preview: the sample line typed out, then standing whole before the next turn |
| `--dsh-tg-period-preview-enter` | `2600ms` | one turn of the Motion tab's message-entrance card: one message arriving, standing, and giving way to the next |
| `--dsh-tg-period-wash-hue` | `4000ms` | one turn of the hue rotation the waiting line's colour wash runs through |
| `--dsh-tg-period-wash-drift` | `5000ms` | one orbit of the colour washes around the waiting line's glyph box |
| `--dsh-tg-period-pulse` | `1600ms` | a placeholder breathing while its numbers are computed |
| `--dsh-tg-period-flash` | `1450ms` | one flash of the reasoning slider's top-rung matrix |
| `--dsh-tg-period-flow` | `4000ms` | one pass of the reasoning slider's top-rung particle flow |
| `--dsh-tg-period-blink` | `1000ms` | one blink of the composer caret |
| `--dsh-tg-period-landed` | `1400ms` | the mark on the turn the conversation navigator landed on |
| `--dsh-tg-period-hold` | `840ms` | how long the reasoning window's text stands between two steps |
| `--dsh-tg-period-dot-bounce` | `500ms` | one bounce of the waiting line's loader dots under the skin, and the period each dot's own start is measured against |
| `--dsh-tg-period-dot-line` | `1250ms` | one round trip of the waiting line's loader dots along their own lines, the motion the dots take while the turn is not thinking |
| `--dsh-tg-ease-standard` | `ease` | feedback and surfaces: the default curve |
| `--dsh-tg-ease-out` | `ease-out` | something arriving and settling: a fold's door, content entering the chat area, the landing mark |
| `--dsh-tg-ease-enter` | `cubic-bezier(0.34, 1.3, 0.64, 1)` | a message the reader sends growing into its row: the slight overshoot as it takes its full size |
| `--dsh-tg-ease-in-out` | `ease-in-out` | something that leaves and returns, or swaps in place: wording swaps, pulses, flashes |
| `--dsh-tg-ease-glide` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | travel along a track: the sliding highlight, the reasoning slider, the search dialog's entrance, the reasoning window's step, the wording box's width, the stream's slide |
| `--dsh-tg-ease-roll` | `cubic-bezier(0.4, 0, 0.2, 1)` | digits rolling over: the file rows' tail and the process group header's counts |
| `--dsh-tg-ease-spring` | `cubic-bezier(0.34, 1.45, 0.64, 1)` | a small overshoot as something lands: the overtime badge popping in, a switch's knob bouncing past its end |
| `--dsh-tg-ease-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` | a surface or a page settling into place out of its anchor: menus and dialogs opening and closing, a settings page sliding, the overtime badge sliding onto its line, the greeting's lines rising |
| `--dsh-tg-ease-host-sweep` | `steps(48, end)` | the band across the waiting line's words and a running process group's header |
| `--dsh-tg-ease-harmonic` | `cubic-bezier(0.37, 0, 0.63, 1)` | a loader dot walking its line from one end to the other, and its size between an end and the middle: a sine's simple harmonic, at rest at either end and fastest halfway |
| `--dsh-tg-ease-damped-out` | `cubic-bezier(0.33, 1, 0.68, 1)` | a loader dot's fade in a hand-over that does most of its change early: a walking or swapping dot coming in, a bouncing one going out |
| `--dsh-tg-ease-damped-in` | `cubic-bezier(0.32, 0, 0.67, 0)` | a loader dot's fade in a hand-over that does most of its change late: a walking or swapping dot going out, a bouncing one coming in |
| `--dsh-tg-distance-nudge` | `4px` | the short offset a surface rises from, and a small row's wording swap travels |
| `--dsh-tg-distance-travel` | `8px` | the waiting line's wording swap, a settings page's slide, the overtime badge's sideways slide, and both directions of the waiting line's loader dots: the lift off their floor and the reach along their own lines |
| `--dsh-tg-distance-rise` | `12px` | how far below its place a line of the home greeting starts, and the overtime badge's upward slide |
| `--dsh-tg-blur-soft` | `2px` | the blur words and badges pass through while they swap or pop in, and a placeholder passes through as it hands its place over |
| `--dsh-tg-blur-enter` | `3px` | the blur a settings page or a line of the home greeting passes through as it slides or rises in |
| `--dsh-tg-scale-surface` | `0.98` | the scale a surface grows from as it rises |
| `--dsh-tg-scale-dropdown` | `0.97` | the scale a menu grows from out of its trigger |
| `--dsh-tg-scale-dropdown-exit` | `0.99` | the scale a menu shrinks to while it fades on closing |
| `--dsh-tg-duration-menu` | `160ms` | a dropdown menu opening from its button's corner (spec 4.10) |
| `--dsh-tg-scale-menu` | `0.85` | the scale a menu opens from |
| `--dsh-tg-duration-ripple` | `300ms` | a press ripple spreading (spec 4.10) |
| `--dsh-tg-scale-dot-mid` | `0.55` | how small a loader dot is while it crosses the middle of its line; at either end it is the dot's own size, so the line motion never draws a dot larger than the bouncing one |
| `--dsh-tg-duration-resize` | `300ms` | a surface taking a new size: the model picker's second level following the list a query leaves |
| `--dsh-tg-timing-resize` | `var(--dsh-tg-duration-resize) var(--dsh-tg-ease-settle)` | shorthand: a size change, written after the property in a transition |
| `--dsh-tg-timing-feedback` | `var(--dsh-tg-duration-feedback) var(--dsh-tg-ease-standard)` | shorthand: a control's state change, written after the property in a transition |
| `--dsh-tg-timing-surface` | `var(--dsh-tg-duration-surface) var(--dsh-tg-ease-standard)` | shorthand: a surface appearing, written after the property or the keyframes' name |
| `--dsh-tg-period-sticker-breathe` | `4000ms` | the idle sticker's breath (spec 4.6) |
| `--dsh-tg-period-sticker-dots` | `1200ms` | the thought bubble's three dots lighting in turn |
| `--dsh-tg-period-sticker-bounce` | `600ms` | the working bounce |
| `--dsh-tg-period-sticker-bounce-fast` | `450ms` | the working bounce with two or more sessions at work |
| `--dsh-tg-period-sticker-sway` | `900ms` | the sway while waiting on the reader |
| `--dsh-tg-period-sticker-spin` | `1600ms` | the loop arrow turning while the context is compacted |
| `--dsh-tg-duration-sticker-shake` | `300ms` | the error shake |
| `--dsh-tg-duration-sticker-gray` | `1200ms` | the error's grey fading back |
| `--dsh-tg-duration-sticker-wake` | `400ms` | the hop out of sleep |
| `--dsh-tg-duration-sticker-hearts` | `900ms` | the hearts a click lets float up |
| `--dsh-tg-duration-sticker-hop` | `500ms` | the hop a double click asks for |
<!-- /generated:motion -->

## Layers

A z-index the skin writes is one of two kinds (D9). Inside one box, siblings
are ordered with a literal from -1 to 9: a fill painted under its own content,
a label over its sliding pill, the composer's rows over one another. Anything
that has to clear what the host draws around it — the composer's own controls,
the window's title row, a floating card, a surface over the whole window —
stands on a layer token, and the build refuses any other number.

The table below is generated from `packages/client/src/theme/tokens.json` by `npm run build`;
edit the JSON, not the table.

<!-- generated:layers (packages/client/src/theme/tokens.json) -->
| Token | Value | Use |
|---|---|---|
| `--dsh-tg-layer-control` | `10` | a control kept over the composer card's own stacked rows: the send and stop buttons, the reasoning picker's trigger |
| `--dsh-tg-layer-picker` | `20` | a picker that hangs its card from inside the composer: the permission picker, whose card has to stand over the controls beside it |
| `--dsh-tg-layer-chrome` | `30` | the window's title row the skin draws into: the header band's title and actions, the titlebar's view tabs, over the host's own header |
| `--dsh-tg-layer-float` | `99999` | a floating card or menu over everything the host draws: the popover cards, the hero menu |
| `--dsh-tg-layer-takeover` | `2147483000` | a surface that covers the whole window: the account-hold page, the sent message's stand-in in flight |
<!-- /generated:layers -->

## Text selection

Selection is the one surface that leaves the palette on purpose — it is a
transient gesture, not part of the interface, so it uses the platform's two
solid paints and looks the same on both canvases:

| State | Background | Text |
|---|---|---|
| Window focused | `#3366D0` | `#FFFFFF` |
| Window unfocused | `#C7C7C6` | `#000000` |

Both are solid (never translucent) and `!important`, so they override whatever
colour the text underneath carries — links, inline code, syntax tokens. CSS
cannot read window focus: Chromium reaches the inactive paint through its own
internal `-internal-inactive-selection-*` properties, which a stylesheet cannot
address. `packages/client/src/features/composer/selection-mirror.ts` therefore mirrors `document.hasFocus()`
onto `data-dsh-window-blur` and the stylesheet switches on that attribute; the
selection itself survives the blur.

## Markdown material

A quote is a **container**, not a link: it keeps the prose face on a neutral bar
and wash (text `#B0AEA5`, light `#6E6A60`), and whatever sits inside it keeps its
own material — links stay blue, inline-code chips stay warm red, file mentions
stay link-blue. Never paint the quote itself with the link colour: the colour
inherits into the block's inline code and mentions, which is exactly the leak
that made every path inside a quote read as a link.

**Inline file mentions are links, not code.** The host resolves a file path
inside an inline code span to a button (`.fileMention`, hashed — match it with
`[class*="_fileMention"]`) and paints it with its link alias. The generic
inline-code chip rule is more specific than that class, so a mention inherits
the chip's warm red unless a rule names it. A mention takes the link blue, weight
500, and the link's underline (solid in the link tone at rest, solid and fully
opaque on hover, same thickness and offset — the same treatment the skin gives an
anchor); the chip itself is left alone — the same fill, hairline, radius and
padding as any other inline code. Plain inline code keeps its warm text. Note the
hover rule must set only `text-decoration-color`: the `text-decoration` shorthand
resets `text-decoration-thickness` to `auto` and thins the line mid-hover.

## Inline code

The chip hugs its glyphs. The host builds it as an `inline-flex` box that
inherits the prose line box — 23px for a 15px code size — which left ~5px of
empty wash above and below the text. The skin sets `line-height: 1.2` on inline
code (27px → 22px, with the 1px padding as the visible inset); lower values
start clipping descenders. The fill, hairline, radius and size are unchanged.

## Popovers · 多选一弹层

Every single-choice popover in the skin — the permission menu, the model picker,
the account drawer, and the host's own menu primitive under the hero row's
workspace and preset pickers — is meant to start from one recipe. New popovers
take it rather than inventing a card.

Two rules hold across all of them, both owned by `shared/popover.ts`. A
pointer opens a card only after a **100 ms dwell** — long enough that crossing a
28px trigger on the way somewhere else unfolds nothing — and the card closes
100 ms after the pointer leaves. One card keeps its own number with the reason
written where it is used: the model picker's levels close after 150 ms (the
pointer has to cross level 1 to reach level 2). And **only one card is on screen
at a time**: each popover registers its close path with `registerPopover(name,
close)` and calls `closeOtherPopovers(name)` on the way open, so opening the
model picker folds the permission menu, the account drawer and the host's hero
menu.

The context meter's popover is the host's own panel (it portals it, places it,
and dismisses it), so the skin drives its trigger on hover and paints nothing of
the shell itself. What it carries is described under "Context popover" below.

**Card**

| Property | Value |
|---|---|
| background | `var(--dsw-alias-bg-overlay)`; dark `#1e1e1d` |
| border | `1px solid var(--dsw-alias-border-l1)`; dark the same stroke, which the dark ladder makes a highlight. The edge stays the card's own border: the box the placement reads and the opening animation scales keeps the paint path it has always had, and no stroke is drawn inside it |
| radius | 12px |
| shadow | `0 8px 24px rgba(20,20,19,.12), 0 2px 6px rgba(20,20,19,.08)`; dark `0 8px 28px rgba(0,0,0,.65), 0 2px 8px rgba(0,0,0,.45)` |
| padding | 6px |
| layout | flex column, `gap: 6px`; a list body stacks its rows 3px apart |
| z-index | 99999, above the host's own menus (1100) |
| open | `opacity 0 → 1`, `translateY(4px) scale(.98) → none`, `.15s ease`, origin on the anchor's side |

**Row**

| Property | Value |
|---|---|
| min-height | 32px — a floor, not a cap: a two-line row grows |
| padding | `2px 7px` |
| radius | 6px |
| text | 13px / 20px, `var(--dsw-alias-label-primary)` |
| hover | `var(--dsh-tg-hover-bg, rgba(0, 0, 0, .08))` |
| icon | 16px, `var(--dsw-alias-label-secondary)` |
| two-line row | name 13px / 16px at 500; description 11px / 14px in `label-tertiary` |
| current row | trailing `IconCheckOutline16` in `var(--dsw-alias-brand-primary)` — the accent is what marks the choice |
| disabled | `opacity: .4`, `cursor: not-allowed` |

**Heading, separator, footer**

- heading row: 11px / 16px at 600, `letter-spacing: .04em`, uppercase, `label-tertiary`, `padding: 6px 7px 2px`
- separator: `0.5px` `var(--dsw-alias-border-l2)` — the host's own line on a menu
  surface (`Menu.module.css`) — `margin: 2px 4px`, drawn as a top border on a
  zero-height box. One rule in the shared shell covers every separator in a card,
  the host's own menu separators included, so the line is one thickness wherever
  it appears and does not follow the card's opening scale
- pinned footer: `margin-top` / `padding-top` 4px, and the same `0.5px`
  `var(--dsw-alias-border-l2)` line above it

**Host surfaces**

The host's dropdown menus are one shared primitive (primitives' `Menu`), and its
two class-name families hash in opposite directions: the primitive ships inside
the web shell as `_<local>_<hash>_<n>` (`_itemWrap_1nxmc_92`,
`_itemLabel_1nxmc_174`), while the client-ui packages hash as `<hash>_<local>`
(`daogkW_itemName`, `p_FcLG_cardWorkspaceTrigger`). A substring matcher therefore
takes the longest stable piece of whichever family it targets — `_itemWrap_`,
`_itemLabel_`, `_viewport_` on one side, `_itemName`, `_itemDesc` on the other —
never the bare local name.

The hero row's two pickers are that primitive, portaled to `<body>` with no
marker of their own. `packages/client/src/features/hero-menu/hero-menu.ts` stamps the open card with
`data-dsh-tg-hero-menu` and `features/hero-menu/hero-menu.css` restyles it; the
host's other menus (sidebar row menus, the settings permission row, submenus)
keep the host's own design on purpose. What that replaces: a 20px radius card
with 4px padding, 40px rows at 10px radius, and 14px text.

The stamp's value names the picker (`workspace` or `preset`), because the two
cards differ. The preset card keeps the popover table's 32px rows for its
two-line entries. The workspace card is Claude Code's folder menu: a 180px-min
card with 4px padding, 26px plain-text rows (no folder glyph in front of each
folder, no `＋` on the pinned add row) and the accent check on the current one.

**The account card** is that primitive too, and it carries the skin's rows
inside it. The host mounts it with nothing but its own three entries and places
it from that geometry; `features/account/surface.ts` injects the skin's container
a frame later, the card grows, and the host re-places it on the frame after the
list changed. Nothing may be painted in between: the card would fade in at the
height and the place it is about to leave — low, then jumping up mid-fade. So
while the account row is armed the card stays unpainted (the same armed window
that carries its one-shot entrance), and the feature stamps
`data-dsh-tg-account-ready` once the skin's rows are inside it and its
placement has been read twice with the same value. The entrance animation hangs
on that stamp, so it plays on the card the reader will actually see.

## Context popover · 上下文弹层

The context meter's popover is the host's own panel: the skin opens it by
pressing the host's trigger (hover, with the shared 100 ms dwell and close
grace, gated on the "open popovers on hover" preference; a click still works),
and paints nothing of its shell or its dismissal. It mounts
instead of toggling `data-open`, so the feature stamps the panel and it takes
the cards' own short rise as a one-shot animation — same 4px, same `scale(.98)`,
same 0.15s — and a surface the skin opens arrives the same way wherever it is
the host's.

Its horizontal place is the one thing the skin takes over. ui-chat hangs the
panel from the anchor's LEFT edge and only then clamps it into the viewport
(`useStatDialog`, align `start`), so a trigger at the end of the composer row
leaves the panel against the window's right margin instead of under the ring.
`features/context-stats/stats-binding.ts` reads the meter's right edge and the
panel's own layout width — `offsetWidth`, not its rect: the entrance scales the
box, and a transformed rect is two per cent narrower than the one that settles —
and writes `--dsh-tg-context-panel-left` with the mark that turns it on;
`features/composer/inline-bar.css` reads it with `!important`, which outranks the
host's inline value. The reading is re-taken when the panel's box changes (a size
subscription on the observation bus) and when the viewport moves (`reposition('viewport')`).

What the skin appends to it is the session's numbers
(`features/context-stats/session-stats.ts`), read from the host's `sessionStats`
and `tokenUsage` projections — the same durable whole-log values the host's own
pills render — never by opening the host's stat dialogs. The labels and the
duration / token templates come from the host's `chat` locale namespace, so the
two surfaces read the same words; the host's small formatting rules
(`formatDuration`, `formatTokensPerSecond`, `formatExactTokens`,
`formatCacheHitPercent`) are mirrored so the figures match character for
character.

The cost is the session's own. The host half prices every settlement at its
own instant and route and answers the settled total over `SESSION_COST_PATH`;
the browser adds the tokens the streaming answer has grown by at the output
rate in force, so the figure moves with the written-back tokens and settles
with them. It writes four decimals and the symbol of the `billingCurrency`
setting (`¥0.0015`, `$0.0002`): the official CNY and USD tables are stored
apart, so the setting picks a table rather than converting one. On the line it
stands between the written-back tokens and the cache share, and it is among the
figures the ladder gives up when the line needs the room for the total; in the
block it is the usage section's first row.

The segment keeps its width across a session switch: the session's figure is
replaced while the next one is being priced, so the amount sits in a box of an
amount's measure, right-aligned so a growing figure extends left, and the box
stands as the currency symbol and a dash in `label-tertiary` until the new
figure arrives. Without it the segment folds out of the line and back, and the
whole bottom line re-lays around it.

Which figures appear follows the host's statistics row. Its detailed form gets
the whole list. Its compact form carries only the output speed and the cache-hit
share on the composer line, so the block keeps the four that row leaves out —
the total time, the first-token average, the output speed and the cache-hit
share. The total is the one figure the host has no word for (its dialog names
the model's time and the tool calls' separately): it is their sum, labelled from
the skin's own copy (`contextTotalTime`).

The block: a 1px `var(--dsw-alias-border-l1)` rule and 10px above it, then per
section an 11px / 16px heading at 600 in `label-tertiary` and a two-column grid
(6px by 10px). A row is a stack: 12px / 16px label in `label-tertiary` over a
14px / 20px value at 500 in `label-primary`, the value in tabular figures so
numbers do not dance as they change. Rows follow the host's own rules — one
appears only when its input exists — and the block is rewritten on every
projection frame while the panel is open.

While the projections have answered nothing, the block holds the numbers' place
under the two real headings: bars at a row's own 37px (16 + 1 + 20) in the host's
solid hover fill, pulsing over 1.6s (still under the reduced animation choice).
The place is given up after 2s, so a host that serves no such projection ends at
the panel it drew itself rather than keeping placeholder bars.

**All five are aligned**: the account drawer was the outlier
(8px row radius, 2px and 4px card gap, 8px padding, 220 / 260px min-width,
z-index 1000 and 100000) and now follows the table above. The hero row's pickers are the host's own menu primitive, which differs in
two ways that CSS cannot change: it mounts instead of toggling a `data-open`
attribute, so it takes the same fade/scale as a one-shot `0.15s` animation; and
the host places it *below* its trigger, which is where the composer sits — so
`packages/client/src/features/hero-menu/hero-menu.ts` re-places it on the trigger the way the
skin's own composer pickers sit: right-aligned with the trigger and opening
upward by the same 6px air, flipping below only when the viewport leaves no room
above, and clamped to the 8px viewport margin (`POPOVER_MARGIN`). The host
re-runs its own placement from its anchor geometry on every frame while the card
is open, so the position is handed over in two custom properties on the card
(`--dsh-tg-hero-menu-x` / `--dsh-tg-hero-menu-y`, written by the same
pass that stamps it) which `features/hero-menu/hero-menu.css` reads with
`!important`; that declaration outranks the host's plain inline value.

## Context meter · 上下文计量

**The trigger is a pie.** Where the host draws a ring of two circles, the meter
draws two sectors on one centre: the share taken in the colour its occupancy fell
on, the rest of the plate in the quiet tone beside it. The smaller share keeps
the box's radius (8px) and the larger one steps in by up to 1.3px — half the
lift — so a lopsided split reads as the smaller part standing out to the edge,
15% and 85% mirror each other, and an even split is two half discs of one radius;
the step eases to nothing as the split comes even. The seam is one width, 1.2px,
shared between two strokes by the split: the occupied sector's stroke runs from
the whole width at nothing taken to nothing at everything taken, the plate's is
the mirror, and each is half the width at the even split. Each sector is cut by
the stroke around the other's path, so the seam follows the whole boundary — both
radii, the outer arc and the apex — and the two edges move with the split as the
reading crosses the middle. The part that stands out is painted last: the plate
above the even split, the reading's colour below it. The pie is 16px across, one
pixel more than the ring's 14px cell on each side, and concentric with it; the
ring keeps its cell and is hidden while the pie stands, so the trigger's layout
and the room the composer keeps for it are the host's. The occupied sector takes
the reading's own colour (the occupancy ramp, below), the plate the quiet tone
beside it.

**The line of numbers.** On its own line under the card, each figure is plain
text in the line's type (13px / 500, tabular figures), not a run of per-character
spans: a reading that moves is chased from the value on show, closing about two
thirds of the distance every 73ms and the rest within 220ms, a reading that lands
mid-count becomes the new destination, and another session's numbers are chased
from the ones on show too. Only the cache share's figure and the percent sign
after it wear the band; the words before them keep the line's tone. A card too
narrow drops figures in a fixed order, and the widest step folds each token
figure into k / M / B.

## Search · 搜索

**Sidebar box.** The box takes the brand's place in the logo row while the
pointer is over the sidebar: 28px tall, 8px radius, a 1px `#E8E6DC` hairline on
the ivory canvas fill (dark: `#2E2C29` on `#1E1E1D`), a 16px search glyph in the
secondary label, the "Search" label in the tertiary label at 14px, and the
host's search shortcut as 20px keycaps at the right end. The New session row's
own shortcut wears that same keycap: a 20px box with a 1px hairline, 4px radius
and 12px secondary ink, and the `+` the host writes between the two keys goes,
the way the box leaves it out. It is a button like the New session and Plugins
rows below it: the pointer cursor, and on hover the same plate those rows take
(`--dsh-tg-hover-bg`, dark `rgba(255, 255, 255, 0.08)`) laid over its
opaque fill. Box and brand share one grid cell and cross-fade over 0.16s, the
timing the workspace heading and its segmented control trade places with; the
box is excluded from the window drag region. Standalone gives the box a row of
its own under the brand row, shown without a hover; that row adds no inline
padding, so the box's hairline stands on the two edges of the column's own
inset and is exactly as wide as the New session plate below it. In the desktop
titlebar mode the brand row rises 6px, since the sidebar column starts under
the 40px titlebar — as far as it goes with the box still wholly below that
edge, which clips the column. A box narrower than 200px keeps its glyph and
label and leaves the keycaps out.

**Palette.** A modal card set 8vh from the top, 760px wide at most, 16px radius,
on the same ivory fill (dark `#1E1E1D`) under the host's mask. From the top: a
17px borderless input with a 28px close button; the category chips (32px tall,
8px radius, 14px, tertiary at rest and primary when current) sharing one
sliding highlight at `rgba(20, 20, 19, 0.06)`; the list, capped at
`min(520px, 62vh)`, with 13px tertiary section captions and 40px rows (8px
radius, 15px title, an 18px glyph in the secondary label, a 13px tertiary detail
after the title and an optional 13px tertiary excerpt line under it, the match
inside it in the primary label at weight 500 with no fill); a hairline-topped footer
of hints with 20px keycaps. The input text, the chips' text, the captions and
the row glyphs all start on one vertical line 24px in from the card edge. The
highlighted row takes `rgba(20, 20, 19, 0.05)` (dark `rgba(250, 249, 245, 0.07)`)
and shows the Enter glyph; the others hide it. The card fades in and settles
from 6px above at 98.5% scale over 0.18s; on close card and mask fade out
together over 0.14s before the modal unmounts.

## The waiting line · 模型正在做什么的那一行

The host's running row, its divider and its live region stay as the host draws
them. Its whale tail is DeepSeek's own character, so the
skin hides it and leads the line with its own loader: three 4px dots of the
accent in force in an 18 × 14 box, resting on the floor, and the motion they
play follows what the turn is doing (`features/chat-wait/wait-loader.ts`). While
the model thinks they bounce — each rising the skin's 8px and flattening against
the floor as it leaves, half a second a bounce with the second dot starting two
fifths of the period behind the first and the third three fifths. While the turn
writes or works they leave that bounce and walk three lines through one point,
120° apart with the second line run the other way: each dot is a damped simple
harmonic along its own line, the whole line taken in 1.25s, dwelling at either
end at the dot's own size and shrinking to 0.55 as it crosses the middle, so no
frame of the line motion draws a dot larger than the bouncing one. The two never
cut: the lane leaving fades each of its dots out over one of its own legs,
starting where that motion next turns back — off the floor for a bounce, off a
far end for a walk — and the lane arriving fades each of its dots in over one of
its own legs, starting where that motion next carries it, so no dot is ever moved
to a pose its motion does not carry; a motion stands for 2s before the next may
take it over. Under the
other brands the host's whale stands. The host's own
shimmering words step aside for the skin's line beside it: the wording in the
secondary label at 14px on a 24px line,
the turn's clock 8px later in the caption at 13px with tabular figures, and the
"No response yet" badge 8px after that (11px on a 16px line, 0 6px padding, a 5px
radius, the warning label over 16% of itself). The line takes the row's own
width and gives way inside it: the words are carried whole, so a clause the row
has no room for is clipped where the room ends and the copy draws an ellipsis,
with the loader, the clock and the badge keeping their places. The wording wears
one of two paints, whichever the Motion tab's Waiting-line animation holds: a
highlight band swept across it the way the host's own rows sweep — 1.5s a pass
with the band resting the last third of it, in the host's shimmer tint — or a
colour wash, the seven radial washes of `packages/client/src/shared/motion.css`
over a grey ramp, orbiting the glyph box (5s an orbit while the hue turns a full
circle over 4s), which is the effect transitions.dev ships as its Pro gradient
text. A wording that changes runs both halves of the swap at once and is over in
0.2s: the old one
leaves upward with a 2px blur while the new one, parked one gap, enters from 4px
below; under Reduced motion the band is left out, the wash holds its still frame,
and the wording is written at once. The Motion tab's preview cards
wear these same two paints (`packages/client/src/features/settings/settings.css`)
and take turns between a state word and the host's own word for a wait, so a card
shows the wording swap as well as the paint.

With the chat area's own follow on, the row is pinned while the conversation
follows its tail, at the place that follow's glide comes to rest — the
composer's own height, the fade band above it and the host's 16px transcript
padding — the canvas painted behind it, since the transcript's tail would
otherwise show through. The pin stands only while the host reports the tail (or
the stream glide holds the position) and steps aside for the reader's own
scrolling.

## Home layouts · 首页版面

The new-conversation page has two arrangements. `homeLayout` (settings: Home
layout) writes `data-dsh-tg-home-layout` onto `<body>` and
`packages/client/src/features/home/home-panel.css` branches on it. Both are the host's own
hero markup — the greeting, the workspace row, the dock and the composer card
inside `…_composerStack …_composerHero` — so only the arrangement differs.

| | Classic | Studio |
|---|---|---|
| greeting | centred, 44.2px serif, brand mark on its line | top left, one fixed line naming the user ("What's up next, …?") in the 20px sans UI face, a 21px brand mark on its line |
| composer card | vertically centred in the scroll body | the conversation's single-line inline form, resting on the window's bottom edge (16px foot) |
| between them | — | the usage panel |
| permission control | the segment group | the conversation's trigger and its card |
| workspace / preset row | the card's footer tray | hairline chips directly above the card |
| column width | the hero's centred box | a 720px composer column; the greeting and the panel form a 480px block against its left edge |

The studio composer is stamped `data-composer-variant="inline"` (composer.ts's
pass reads the same preference), so the home card is drawn by the conversation's
single-line stylesheet. The classic tray rules in `features/composer/card.css` are scoped
away from studio with `:not([data-dsh-tg-home-layout="studio"])`. That is
deliberate: they set `order: 1` / `order: 2` on the same boxes, and a competing
rule would have to be out-specified rather than merely reordered — scoping them
removes the contest.

**The usage panel.** It is a `conversation.input.dock` entry (the host's list
seat between the greeting and the card; a list seat keys its entries by `id`),
and it renders only in the hero phase — the host mounts that same seat inside a
conversation, where the todo, queue and goal bars hang on it. The seat is scoped
to a session, so the cold start screen (no session yet, the card waiting for a
workspace) has none; there the skin mounts the same component on a
`display: contents` element of its own (`.dsh-tg-home-seat`) and drops it
once the host's dock arrives. A window too short for the whole panel shrinks the
panel, never the page: the greeting keeps the top edge, the chips and the card
keep the bottom, and the panel scrolls between them with a 32px fade over its
bottom edge that lifts over the last 32px of travel.

The cold start card waits for a workspace: the host marks it with a dashed ring
and makes every control on it inert, so a press anywhere opens the workspace
picker. In the studio form the ring sits on the single-line input box itself
(the host's dashed stroke and colours, flat, no drop shadow), and the permission
trigger fills the card's empty mode strip on the preset a new session starts in
— disabled, like the rest of the card's controls.

The panel is Claude Code's dashboard shape: a flat warm-gray wash (a
`color-mix` of the label tone at 4% over the card tone, which flips with the
theme on its own), an Overview/Models tab pair on the left of its head, and the
All/30d/7d range pills on the right. The active tab and range pill are a gray
chip one step below that wash — half the radius the 20px control would round to,
so it reads as a rounded rectangle rather than a full pill. Overview carries six
stat cells in a 3×2 grid under Claude Code's names (Sessions, Messages, Total
tokens, Active days, Peak hour, Favorite model) whose tiles sit one clear step
deeper than the panel (15% of the label tone) and set a 12px label over a 13px
bold figure — the figure stays barely above its own label, which is also what
lets a long model id such as deepseek-v4.1-flash sit on one line; the favourite
model is a name, not a figure, and keeps the regular weight. Messages are the
settled calls. Once the picked range's total passes one
book, the yardstick line appears under the grid: sixty-five books from Tao Te
Ching (7.6k tokens) to In Search of Lost Time (1.6M), the public-domain ones
measured by feeding their full text to the o200k_base tokenizer (the English
original or the standard English translation; Faust in German) and the rest
estimated (1.3 tokens a word for English, 0.96 tokens a character for modern
Chinese prose). The line states the rounded multiple as a share of the book
("~2× the tokens in Moby-Dick"), never as an excess over it.
The book is drawn afresh each time the page comes back to the new-conversation
hero, and a range that has not reached it steps down to the longest book it has
passed, so the range pills keep the same book whenever the totals allow. The heat
grid takes one
equal column per week (twenty-six weeks), square cells from a 3px gutter, in
Claude Code's blue data ramp (`#3b6ecf` mixed in at the shares `HOME_HEAT_RAMP`
in `packages/client/src/constants.ts` lists, over the neutral empty cell); because the columns are fractions of the panel's own width, the newest
week can never fall past the edge. Hovering a cell shows Claude Code's day tip at
once: a solid pill in the label ink with the canvas tone for text (so it inverts
with the theme), 13px medium, reading the day in the shell's language and the
tokens that day spent ("Sep 9 — 15.9k tokens"), the same figure the cell's heat
is bucketed from; the pill is centred on its cell except where its own width
would carry it past the panel's edge, and there it lines up with that cell's
outer edge so it stays inside the panel, and it stands above its cell except
where the cell holds more room below it, and there it hangs under the cell so it
never reaches over the grid's top edge across the stat cells; the pill's own
width and height are read off the cell the
pointer is on (`packages/client/src/features/home/heat-tip.ts`).
Models is Claude Code's own shape: one column
per day of the chart's thirty-day window, stacked from the axis up with each
model's slice in its rank's colour (ranks past the ramp share its last, grey
step), four gridlines with their token labels in a 34px left gutter and every
third column's date under it in the shell's language ("Aug 26"), and beneath it
the ranked list — swatch, model name, the input/output split, and the share of
the models shown — folding past six rows behind one "show more" row, which turns
into "show less" once the list is open. The chart
and the list write counts Claude Code's way: one decimal at most, no trailing
".0", a lowercase k ("109M", "963.6k"). The list reads the roll-up's per-model
buckets; the chart reads its per-day per-model map, so a day with nothing
attributed to a model draws no stack. Each column is sized to its day's total
against the axis top and each slice to its share of the day, so the column's
rounding sits on the top of the stack. A range window filters the
tiles (the peak hour included), the yardstick line and the model list; the heat
grid and the chart keep their own windows.

Two sources, in this order: the host half's usage route, then the session list's
own projection block (`tokenUsage`, `modelSelection`, `sessionListMetadata`).
The second answers in a few milliseconds and carries per-model totals without the
four buckets, which is what the list falls back to when the first cannot answer.
The first reads the cost-meter ledger for the days it knows — its
`<provider>:<model>` split becomes the per-model cells, one model across providers
merged into one — takes the dates past the ledger's newest day from the accurate
per-event fold, and keeps the two apart by date rather than adding them; the
sessions behind the ledger's days and the logs written on the folded ones are one
union. Both carry each day's session ids, which a range window unions into one
distinct session count. Only the fold knows the settlement hours: it keeps one
hour histogram per day, which a range window sums into its own peak hour, and the
ledger's own days carry none — the ledger's figures land first, and the peak hour
of the folded days lands a moment later. The panel names
which one it drew from, and a figure neither can answer is a dash.

The skeleton keeps the frame's geometry — six fixed-size stat cells, a heat grid
of a fixed cell count, and on the models tab the chart's frame with three
stand-in rows — and the heat grid's empty cell **is** the zero step, so "no data"
and "a day with no usage" stay different things: a missing value draws a
placeholder, a zero day draws the grid's own base tone.

## The sticker mascot · 输入条上的贴纸桌宠

The mascot is one sticker image, `design-assets/sticker-source.png` exported by
`npm run sticker` (`scripts/sticker.mjs`) to a 210×192 webp with its alpha kept.
It is 72px tall (56px on a window narrower than 760px) and stands on the top
edge of what it stands on, 16px in from the right and with its feet 6px over the
edge: the input bar's card on the home page, and — in a conversation, unless
Where it stands keeps it to the home page — the input area or the panel that
replaces it. The Sticker mascot row in Appearance switches it off. It takes the
pointer on its own body only; the rest of its box lets clicks through. There is
no dragging.

The state machine is the upstream one (`mascot-stage.ts`, `mascot-signals.ts`):
it hands the player an act key, `sticker-acts.ts` maps the key to a state, and
`sticker.css` draws the state with keyframes — no frames, no timer of its own
while it plays. The state is written on the sticker as `data-dsh-tg-mascot-state`
(and `data-dsh-tg-mascot-tempo` for the working bounce). With the animation
choice resolved to "reduced" nothing moves: the still image and the bubble's
marks stay, and a click still names its act.

| State | Looks | When |
|---|---|---|
| `idle` | breathes, 4 s | nothing runs |
| `thinking` | tilts, a thought bubble with three dots lighting in turn | the model reasons or has not answered |
| `working` | bounces, 600 ms (450 ms with two or more sessions or subagents at work) | the model writes, or tools run |
| `notification` | sways, a `!` badge | an approval, a question or a plan review waits |
| `sweeping` | a loop arrow turns in the bubble | a compaction runs |
| `error` | a shake, then grey fading back | a tool call or a turn failed (4.8 s) |
| `happy` | a jump and three hearts | a turn or a compaction finished (5.2 s) |
| `sleeping` | tilts, dimmed, `z z` in the bubble | a quiet minute |
| `waking` | a small hop | the next pointer move or key |
| `hearts` / `hop` | hearts float up / a hop | a click / a double click |

## Implementation notes

- Every rule is scoped under `body[data-dsh-telegram-style]`.
- Dark tokens are the base; light overrides use `:not([data-ds-dark-theme])`.
- A surface's stylesheet sits beside its feature under `packages/client/src/features/<feature>/`;
  the look no single feature owns is in `packages/client/src/theme/`, and the parts several
  features share (the popover card and rows, the sliding highlight) are in
  `packages/client/src/shared/`. The host selector discipline and the style checks the build
  runs are in `docs/adr/` (D3, D9, D30).
- The page's scale (settings › General) is the `zoom` the theme sheet puts on the body, so a
  length written into the page is read in a smaller space than the one a bounding rect is
  measured in: code that turns a measured box into a written length goes through
  `packages/client/src/shared/page-zoom.ts`.

