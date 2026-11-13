// packages/contracts/src/package.ts
var PACKAGE_NAME = "dsh-telegram-style";

// packages/contracts/src/services.ts
var OFFICIAL_MODEL_GROUP = "deepseek-official";

// packages/contracts/src/prices.ts
var CURRENCY_CNY = "CNY";
var CURRENCY_USD = "USD";
var CURRENCIES = [CURRENCY_CNY, CURRENCY_USD];
var CURRENCY_SYMBOL = {
  [CURRENCY_CNY]: "\xA5",
  [CURRENCY_USD]: "$"
};

// packages/contracts/src/prefs.ts
var MOTION_SYSTEM = "system";
var MOTION_REDUCED = "reduced";
var MOTION_FULL = "full";
var MOTION_MODES = [MOTION_SYSTEM, MOTION_REDUCED, MOTION_FULL];
var STATUS_MOTION_SWEEP = "sweep";
var STATUS_MOTION_WASH = "wash";
var STATUS_MOTIONS = [STATUS_MOTION_SWEEP, STATUS_MOTION_WASH];
var CARET_MOTION_OFF = "off";
var CARET_MOTION_TYPING = "typing";
var CARET_MOTIONS = [CARET_MOTION_TYPING, CARET_MOTION_OFF];
var CHAT_REVEAL_OFF = "off";
var CHAT_REVEAL_ON = "on";
var CHAT_REVEAL_MODES = [CHAT_REVEAL_ON, CHAT_REVEAL_OFF];
var MESSAGE_ENTER_FLIGHT = "flight";
var MESSAGE_ENTER_GROW = "grow";
var MESSAGE_ENTER_MODES = [MESSAGE_ENTER_FLIGHT, MESSAGE_ENTER_GROW];
var PALETTE_TELEGRAM = "telegram";
var PALETTE_GLASS = "glass";
var PALETTE_TRANS = "trans";
var PALETTES = [PALETTE_TELEGRAM, PALETTE_GLASS, PALETTE_TRANS];
var MASCOT_SCOPE_HOME = "home";
var MASCOT_SCOPE_ALL = "all";
var MASCOT_SCOPES = [MASCOT_SCOPE_HOME, MASCOT_SCOPE_ALL];
var SEARCH_STYLE_ICON = "icon";
var SEARCH_STYLE_OVERLAY = "overlay";
var SEARCH_STYLE_STANDALONE = "standalone";
var SEARCH_STYLES = [SEARCH_STYLE_ICON, SEARCH_STYLE_OVERLAY, SEARCH_STYLE_STANDALONE];
var CHAT_ANIMATIONS_OFF = "off";
var STATS_POSITION_INLINE = "inline";
var STATS_POSITION_CONTEXT = "context";
var STATS_POSITIONS = [STATS_POSITION_INLINE, STATS_POSITION_CONTEXT];
var HOME_LAYOUT_CLASSIC = "classic";
var HOME_LAYOUT_STUDIO = "studio";
var HOME_LAYOUTS = [HOME_LAYOUT_CLASSIC, HOME_LAYOUT_STUDIO];
var COMPOSER_SCOPE_OFF = "off";
var COMPOSER_SCOPE_HERO = "hero";
var COMPOSER_SCOPE_CONVERSATION = "conversation";
var COMPOSER_SCOPE_ALL = "all";
var COMPOSER_SCOPES = [COMPOSER_SCOPE_OFF, COMPOSER_SCOPE_HERO, COMPOSER_SCOPE_CONVERSATION, COMPOSER_SCOPE_ALL];
var AUTO_POPOVER_OFF = "off";
var AUTO_POPOVER_ACCOUNT = "account";
var AUTO_POPOVER_ALL = "all";
var AUTO_POPOVER_SCOPES = [AUTO_POPOVER_OFF, AUTO_POPOVER_ACCOUNT, AUTO_POPOVER_ALL];
var USERNAME_MAX = 64;
var QUICK_PROVIDERS_MAX = 64;
var PROVIDER_ID_MAX = 128;
var PREFS = {
  motion: { type: "choice", values: MOTION_MODES, default: MOTION_SYSTEM },
  statusMotion: { type: "choice", values: STATUS_MOTIONS, default: STATUS_MOTION_SWEEP },
  /** An earlier build stored the two words; `precise` is what the switch being on means. */
  statusDetail: { type: "boolean", default: true, legacy: { precise: true, simple: false } },
  collapseFooter: { type: "boolean", default: true },
  /** It was a boolean before it grew its choices. */
  autoPopover: { type: "choice", values: AUTO_POPOVER_SCOPES, default: AUTO_POPOVER_ALL, legacy: { true: AUTO_POPOVER_ALL, false: AUTO_POPOVER_OFF } },
  composerScope: { type: "choice", values: COMPOSER_SCOPES, default: COMPOSER_SCOPE_ALL },
  modelPicker: { type: "boolean", default: true },
  modelDescriptions: { type: "boolean", default: true },
  /**
   * The provider ids the picker's first level carries: ids rather than names,
   * so a catalog rename does not lose the stored selection. The official
   * service is the picker's default rather than a choice, so a stored id for it
   * is dropped.
   */
  quickProviders: { type: "list", default: [], max: QUICK_PROVIDERS_MAX, entryMax: PROVIDER_ID_MAX, drop: [OFFICIAL_MODEL_GROUP] },
  username: { type: "text", default: "", max: USERNAME_MAX },
  homeLayout: { type: "choice", values: HOME_LAYOUTS, default: HOME_LAYOUT_STUDIO },
  palette: { type: "choice", values: PALETTES, default: PALETTE_TELEGRAM, legacy: { claude: PALETTE_TELEGRAM, host: PALETTE_TELEGRAM } },
  /** The doodle layer over the wallpaper's plain colour (spec 4.1, 6.3); off leaves only the colour. */
  doodle: { type: "boolean", default: true },
  /** The sticker on the input bar (spec 4.6, 6.3); every mascot an earlier build stored reads as on, `off` as off. */
  mascot: { type: "boolean", default: true, legacy: { brand: true, crab: true, deepy: true, off: false } },
  mascotScope: { type: "choice", values: MASCOT_SCOPES, default: MASCOT_SCOPE_ALL },
  permissionsControl: { type: "boolean", default: true },
  statsPosition: { type: "choice", values: STATS_POSITIONS, default: STATS_POSITION_CONTEXT },
  /** Which official price table the session's cost figure follows. */
  billingCurrency: { type: "choice", values: CURRENCIES, default: CURRENCY_CNY },
  workspaceView: { type: "boolean", default: true },
  dockCards: { type: "boolean", default: true },
  sidebarSearch: { type: "boolean", default: true },
  searchStyle: { type: "choice", values: SEARCH_STYLES, default: SEARCH_STYLE_OVERLAY },
  turnNav: { type: "boolean", default: true },
  viewTabs: { type: "boolean", default: true },
  /** It held a choice before it became a switch again; every retired choice meant on bar `off`. */
  chatAnimations: { type: "boolean", default: true, legacy: { [CHAT_ANIMATIONS_OFF]: false, enhanced: true, redraw: true } },
  chatWait: { type: "boolean", default: true },
  chatSend: { type: "boolean", default: true },
  chatReveal: { type: "choice", values: CHAT_REVEAL_MODES, default: CHAT_REVEAL_OFF },
  caretMotion: { type: "choice", values: CARET_MOTIONS, default: CARET_MOTION_TYPING },
  messageEnter: { type: "choice", values: MESSAGE_ENTER_MODES, default: MESSAGE_ENTER_FLIGHT }
};
var PREF_DEFAULTS = Object.freeze(Object.fromEntries(
  Object.entries(PREFS).map(([key, spec]) => [key, spec.default])
));

// packages/host/src/settings.ts
async function resolveSchemaFactory() {
  try {
    const { createRequire } = await import("node:module");
    const anchor = typeof process.argv[1] === "string" && process.argv[1] !== "" ? process.argv[1] : process.execPath;
    const factory = createRequire(anchor)("@deepseek-ai/schemastery");
    if (factory !== null && factory !== void 0 && typeof factory.object === "function") return factory;
  } catch {
  }
  try {
    const specifier = "@deepseek-ai/schemastery";
    const resolved = await import(specifier);
    const factory = resolved?.default ?? resolved?.Schema ?? null;
    return factory !== null && factory !== void 0 && typeof factory.object === "function" ? factory : null;
  } catch {
    return null;
  }
}
var SchemaFactory = await resolveSchemaFactory();
function volatileField(field) {
  return typeof field?.volatile === "function" ? field.volatile() : field;
}
function prefsField(Schema, key) {
  return Schema.union([Schema.string(), Schema.boolean(), Schema.array(Schema.string())]).default(PREFS[key].default);
}
var Config = SchemaFactory === null ? void 0 : SchemaFactory.object(Object.fromEntries(
  Object.keys(PREFS).map((key) => [key, volatileField(prefsField(SchemaFactory, key))])
));
function registerSettings(ctx) {
  if (typeof ctx.inject !== "function") return;
  ctx.inject(["settings"], (scope) => {
    const settings = scope.settings;
    if (typeof settings?.configure !== "function") return;
    scope.effect(
      () => settings.configure({ auto: false }, ctx.fiber),
      `${PACKAGE_NAME}: settings presentation`
    );
  });
}
export {
  Config,
  registerSettings
};
