# Stipe (`@fungi.computer/stipe`)

Stipe is a CSS-first theme layer for Tailwind CSS v4 and daisyUI 5. One
stylesheet gives you a set of maintained daisyUI themes, a named spacing scale,
self-hosted fonts, and a small vocabulary of material tokens for frames,
shadows, cards and illustration colours.

A few typed helpers sit beside the CSS. They switch and watch the `data-theme`
attribute, project terminal colours for `latte` and `mocha`, build the custom
properties for the embeddable `embed` themes, and style Pierre's file tree
component from the same theme.

Stipe stays out of your app's state. You own theme persistence, storage, events
and components. [Caps](../caps/README.md) is the React component library built
on top of it.

## Install or set up

```sh
npm install @fungi.computer/stipe
```

Stipe brings `tailwindcss` 4 and `daisyui` 5 as dependencies. Its stylesheet is
Tailwind source, so your host compiles it with Tailwind v4 (for example with
`@tailwindcss/vite` or `@tailwindcss/postcss`). The package is ESM only.

Entrypoints:

- `@fungi.computer/stipe`: the typed helpers and constants.
- `@fungi.computer/stipe/theme`: `applyTheme`, `getTheme` and `subscribeTheme`
  on their own.
- `@fungi.computer/stipe/pierre/trees`: the `pierreTreesStyle` projection.
- `@fungi.computer/stipe/styles.css`: themes, tokens and the spacing scale.
- `@fungi.computer/stipe/pierre/trees.css`: the main stylesheet for hosts that
  only render Pierre trees.
- `@fungi.computer/stipe/fonts.css`, `fonts-sans.css`, `fonts-mono.css` and
  `fonts-display.css`: self-hosted font faces.

## Quick start

Import the stylesheet once, then set and watch the theme. This browser snippet
shows the current theme in a status element and switches the page to `mocha`:

```ts
import { applyTheme, getTheme, subscribeTheme } from "@fungi.computer/stipe";
import "@fungi.computer/stipe/styles.css";

function watchThemeStatus(status: Element): () => void {
  status.replaceChildren(getTheme() ?? "latte");
  return subscribeTheme((theme) => status.replaceChildren(theme));
}

const status = document.querySelector("[data-theme-status]");
if (status) {
  const stopObserving = watchThemeStatus(status);
  applyTheme("mocha");
  // Call stopObserving() when you tear down this view.
}
```

Without any `data-theme`, the page follows the reader's appearance setting with
`latte` (light) or `mocha` (dark). Spacing utilities such as `p-lg` and `gap-sm`
work right away.

## Core concepts

### Themes

Set a shipped theme with `data-theme` on the root or on an element.

`STIPE_THEMES` lists the curated shipped palettes: Daisy `light` and `dark`,
plus `latte`, `mocha`, `readout`, `readout-night`, `field-guide`,
`field-guide-night`, `embed`, `embed-dark`, `phosphor`, `codec`, `pirate-radio`,
`pirate-radio-night`, `coin`, and `coin-night`. The consulting family adds
`consulting`, `consulting-night`, `consulting-riso-latte`, and
`consulting-riso-glomzy`, each with an explicit `-ink` inverse. A nested
consulting theme chooses its own colorway. `coin` is the arcade cabinet: cream
(or, in `coin-night`, deep purple) paper, a gold primary, ink outlines, hard
drops, and buttons that sink into their slot. It is a complete palette; apply it
to a page like `latte`, not to one control. `chamfer` is a nested finish that
inherits the enclosing palette and typography. Button roles remain independent
of it. The `vishnu` finish retains the host palette and supplies Card gradient
faces, outline frames, featured shadows, empty-state borders and hover motion.
Complete nested palettes reset those values, and plain surface cards keep their
ordinary face. The `paper` finish inherits its enclosing palette and supplies
game-window linework, hard shadows, and control depth. A nested complete palette
resets material overrides; another partial finish inherits them. The `ember` and
`tide` tints inherit field-guide's paper and typography while changing primary
and accent colors. Their paired light/dark values follow the enclosing color
scheme. Inside that composition, `tape` selects dark paper, a monospace card
body and a red recording rim; `sunrise` supplies the existing gold rim and wash.
Nest these on `GameCard` to keep the finish local to the end card. Serialized
theme choices use `stipeThemeSchema` (a Zod enum); `StipeTheme` is its inferred
type. Daisy's other demo themes are not bundled. Hosts can still add a custom
palette and apply its name through the DOM helpers.

The generated [Stipe API reference](docs/api/README.md) lists the typed exports.
`applyTheme` accepts any non-empty Daisy theme name, and `getTheme` reads the
root's current `data-theme` value. `subscribeTheme` watches only that attribute
and returns a cleanup function; it safely does nothing where there is no DOM or
`MutationObserver`. Theme changes emit no storage or global events.
`terminalPalette` returns no palette for unknown themes; Pierre and Gooey
exports are bounded projections only.

`applyTheme(theme, root?)` sets `data-theme` on the root element, or on the
element you pass. `getTheme(root?)` reads it. `subscribeTheme(listener, root?)`
watches only that attribute and returns a cleanup function. These are plain DOM
helpers. Stipe has no JavaScript theme provider and no token-object format.

### Terminal palette

Stipe owns the coral terminal tint (`#f98284`). `terminalPalette("latte")` and
`terminalPalette("mocha")` return frozen semantic and ANSI colour sets that fit
terminal emulators such as xterm.js. Other theme names return `undefined`. The
Fungi wordmark art lives in [lantern](../lantern/README.md).

### Named spacing

The stylesheet supplies one rem-based grid through Tailwind's spacing namespace:

| Name  | Value      | At a 16px root |
| ----- | ---------- | -------------- |
| `2xs` | `0.125rem` | 2px            |
| `xs`  | `0.25rem`  | 4px            |
| `sm`  | `0.5rem`   | 8px            |
| `md`  | `0.75rem`  | 12px           |
| `lg`  | `1rem`     | 16px           |
| `xl`  | `1.5rem`   | 24px           |
| `2xl` | `2rem`     | 32px           |
| `3xl` | `3rem`     | 48px           |
| `4xl` | `4rem`     | 64px           |

Use classes such as `px-xs`, `py-sm`, `gap-md` and `p-lg`. Plain CSS can use
`var(--spacing-sm)`. Theme changes keep these values. `STIPE_SPACING_NAMES`
exports the names for class-merging configuration, and Caps already uses them.
Zero, automatic layout, proportional sizing and measured geometry keep their
ordinary CSS meaning. These tokens supply spacing. They do not constrain pane
resizing or force content to a fixed height.

### Fonts

The main stylesheet maps Nunito to `font-sans` and Maple Mono to `font-mono`.
Use the sans voice for interface copy and controls. Keep mono for machine
values, code and identifiers. Editorial pages also get Fraunces for
`font-display`, Nothing You Could Do for `font-handwritten` and Grenze Gotisch
for `font-nameplate`.

Tailwind compilation alone does not load fonts. Hosts with an asset bundler such
as Vite import `@fungi.computer/stipe/fonts.css` to load them. It references the
bundled WOFF2 files relative to the Stipe package, so each host's asset build
emits them on its own origin. Nunito ships as separate Latin, Latin Extended,
Cyrillic, Cyrillic Extended and Vietnamese subsets that load only for matching
text. Normal Nunito weights 200 to 900 and Maple Mono weights 200 to 800 use
`font-display: swap`. No Google Fonts request or runtime font dependency is
needed. [Font provenance](./fonts/README.md) records sources and checksums.

### Material themes

Stipe always emits Tailwind's `--color-black` and `--color-white` endpoints. SVG
lighting and alpha masks can consume them even when the host uses no black or
white utility classes. Caps owns the geometry and depth calculations.

Stipe defines a few material properties on top of daisyUI's own `--depth`,
`--noise`, radius and colour variables. Caps reads them in ordinary component
rules, with no selectors for individual themes:

| CSS property                    | Value type                                | Default                                          |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| `--stipe-surface-frame-width`   | Nonnegative CSS length                    | Component frame scale: 2/6/10px for sm/md/lg     |
| `--stipe-surface-frame-image`   | CSS background image, gradient, or `none` | Frame gradient derived from the semantic palette |
| `--stipe-shadow-raised`         | Box-shadow list or `none`                 | Component-specific raised shadow                 |
| `--stipe-shadow-inset`          | Box-shadow list or `none`                 | Component-specific recessed shadow               |
| `--stipe-shadow-edge`           | Box-shadow list or `none`                 | Component-specific edge highlight                |
| `--stipe-display-texture-image` | CSS background image, gradient, or `none` | `none`                                           |
| `--stipe-display-text-shadow`   | Text-shadow list or `none`                | `none`                                           |

Frame and shadow overrides reset to `initial` at each `data-theme` boundary. For
these unregistered custom properties, that selects the component's `var()`
fallback. It does not mean a zero-width frame. `none` explicitly removes an
image or shadow. Stock daisyUI themes do not need to define these properties.

The frame width is decoration, not content padding or a hit target. In Caps,
`Surface` supplies the frame, `Screen` the display face, and `Display` composes
both with a gasket. `--depth: 0` removes the gasket's physical spacing. Texture
is a decorative CSS image, separate from daisyUI's noise. Never use it to carry
information the reader needs.

### Embed themes

`embed` and `embed-dark` are for a widget framed inside someone else's page. The
host picks one (for example by `prefers-color-scheme`) and applies
`embedThemeProperties({ accent, fontFamily })` to the themed element with
`style.setProperty`. The owner's `#rrggbb` accent drives daisyUI primary and
accent. `readableContentColor` picks black or white content by WCAG luminance,
so primary text always reaches 4.5:1. A supplied font-family list comes before
`system-ui`. Without one the themes use `system-ui`. Your host parses the accent
and font list before passing them in. `EMBED_THEME_TOKENS` repeats the default
chrome colours for surfaces outside daisyUI, such as a launcher in a shadow
root.

### Illustration colours

`--stipe-art-{coral,blue,mint,grape,yellow,cream,ink,inkcap,graphite}` are
illustration roles, separate from control-state colours. Each has explicit light
and dark defaults through `light-dark()` and resets at every theme boundary.
Themes can override these roles to retint artwork. Drawings on the page use
`--stipe-sketch-ink`. Figure eye cut-outs use `--color-base-100` directly.

### Nested themes and finishes

You can nest `data-theme` inside another theme. A complete palette declares its
own typography and muted ink at its theme boundary, so nesting `latte` inside
`pirate-radio` restores `latte` typography. A values-only finish inherits
colours, `color-scheme`, fonts, button radius and muted ink. It sets
`--root-bg: transparent` so daisyUI does not paint a new page behind it, and
declares only the material values it changes.

CSS inherits through the DOM, not through React portals. Dialogs, dropdowns and
popup comboboxes in Caps take a portal `container` option. Dialogs and dropdowns
also use the host's `OverlayRoot` destinations when supplied; without one they
fall back to the document body. Popup comboboxes use their explicit `container`
or the document body. For a nested theme, choose an unclipped destination inside
that theme. An ancestor with clipping, transforms or containment can affect
positioning, so choose the portal container as part of your overlay layout.

### Readout

`readout` and `readout-night` are independent light and dark display palettes.
They use Instrument Sans prose, Maple Mono chrome and code, faint one-pixel
region and row rules, and zero raised/inset shadows. They extend the same Stipe
material hooks; Caps geometry and interaction stay unchanged. Load Stipe's full
`fonts.css` for both families. Code consumers disable ligatures in their code
presentation. `terminalPalette()` supplies the corresponding semantic syntax
colors so a docs adapter does not maintain a second palette.

### Pirate radio

`pirate-radio` is a complete, nestable cream-paper palette with orange-red spot
colour, mono labels, tight rules and a procedural print texture.
`pirate-radio-night` reverses it to warm ink-black paper. It uses Instrument
Sans for body text, Anton for headings and Departure Mono for every mono role,
including labels and numerals. No external font request or raster texture is
needed.

The theme sets generic Caps hooks instead of adding component props:
`--caps-heading-font`, `--caps-heading-weight`, `--caps-heading-case`,
`--caps-heading-tracking` (default `-0.025em`, `0.02em` here),
`--caps-heading-line-height` (1.2 here), `--caps-label-font` (mono here),
`--caps-card-image`, `--caps-window-image` and `--caps-print-texture-size`. Each
keeps the previous appearance when unset. `--font-numeric` defaults to
`var(--font-mono)` at every theme boundary, and Caps' numeric readouts use it
with tabular numerals. `--stipe-font-synthesis` keeps browser defaults in other
themes and is `none` here, so the regular-only fonts never get synthetic weights
or italics. CSS motion uses short 60/90/140/200 ms press timings without
overshoot. All of these reset at nested theme boundaries.

### Shell layer scale

Stipe supplies `--stipe-layer-desktop` (0), `--stipe-layer-windows` (10),
`--stipe-layer-chrome` (20), `--stipe-layer-popover` (30),
`--stipe-layer-dialog` (40), `--stipe-layer-toast` (50), and
`--stipe-layer-tooltip` (60). Maosaico owns the shell roots and consumes this
scale. Components select a named portal layer; window focus ranks remain local
to the windows root. The scale does not cross an iframe boundary.

The `--stipe-overlay-shadow-outset` token is a small CSS-pixel allowance (4px)
around measured overlay content. The isolated dashboard includes it in the
regions the host cuts out of sibling App frames, preserving a little shadow.

### Motion vocabulary

Each theme boundary resets motion so nested themes do not inherit an outer
spring. Durations (`squish`, `fast`, `normal`, `slow`, `spring-duration`,
`stagger`) use CSS milliseconds or seconds. `--stipe-motion-bounce` (0–1),
`--stipe-motion-stretch` and `--stipe-motion-steps` are unitless. Distance,
blur, shake and fuse use pixels. Press travel is `--stipe-press-depth` in pixels
and `--stipe-press-scale` is a unitless scale. Enter/exit easing uses
`--stipe-motion-ease` / `--stipe-motion-ease-exit`.

Caps' `@fungi.computer/caps/lib/motion` exports `readMotion(element)` for event
handlers and `useMotion(ref)` for live React controls. Both read the element's
computed tokens, including nested overrides. The hook observes theme/class/style
changes on its element and ancestors plus the OS motion preference; use a stable
container ref, not a per-frame animated child. The reader returns milliseconds
and pixels; reduced motion has zero travel, bounce, stretch, blur and shake, and
120ms durations for opacity fades. Consumers must select opacity-only animation
when `reduced` is true. Caps CSS durations and animated controls use these same
tokens. Under reduced motion, CSS transitions are restricted to short opacity
fades, spatial keyframes are suppressed, and list FLIP skips movement even
though fade durations remain nonzero. Theme feel values still require visual
sign-off.

## API reference

The generated [Stipe API reference](docs/api/README.md) lists every typed
export: the theme helpers, `terminalPalette`, `embedThemeProperties`,
`readableContentColor`, `EMBED_THEME_TOKENS`, `pierreTreesStyle`,
`STIPE_GOOEY_FILTER`, `STIPE_SPACING_NAMES` and `STIPE_TOKEN_NAMES`.

## Examples

Flatten an existing palette by adding material overrides after the Stipe
stylesheet, next to an ordinary daisyUI custom theme:

```css
@import "@fungi.computer/stipe/styles.css";

[data-theme="my-theme"] {
  --depth: 0;
  --noise: 0;
  --stipe-surface-frame-width: 1px;
  --stipe-surface-frame-image: linear-gradient(
    var(--color-base-300),
    var(--color-base-300)
  );
  --stipe-shadow-raised: none;
  --stipe-shadow-inset: none;
  --stipe-shadow-edge: none;
}
```

Theme an embedded widget with the owner's accent:

```ts
import { embedThemeProperties } from "@fungi.computer/stipe";

const widget = document.querySelector<HTMLElement>("#widget");
if (widget) {
  const dark = matchMedia("(prefers-color-scheme: dark)").matches;
  widget.dataset.theme = dark ? "embed-dark" : "embed";
  const properties = embedThemeProperties({
    accent: "#2f9e44",
    fontFamily: "Inter",
  });
  for (const [name, value] of Object.entries(properties)) {
    widget.style.setProperty(name, value);
  }
}
```

Feed a terminal emulator the current theme's colours:

```ts
import { getTheme, terminalPalette } from "@fungi.computer/stipe";

const palette = terminalPalette(getTheme() ?? "latte");
if (palette) {
  console.log(palette.background, palette.foreground, palette.red);
}
```

Style a Pierre file tree from the active theme:

```ts
import { pierreTreesStyle } from "@fungi.computer/stipe/pierre/trees";

const treeStyle = pierreTreesStyle({ compact: false, itemHeight: 28 });
```

## Limits and errors

- `applyTheme` throws `TypeError` for an empty or whitespace-only theme name. It
  accepts any other name and does not check that a theme by that name exists.
- Without a supplied root or a global document, `applyTheme` has no target and
  `getTheme` returns `null`. Setting and reading a theme do not require
  `MutationObserver`.
- `subscribeTheme` returns a no-op cleanup when its target or `MutationObserver`
  is unavailable. It reports non-empty attribute changes, not an initial value
  or attribute removal; read the initial value with `getTheme`.
- Theme changes emit no storage or global events. Persisting the choice is up to
  you.
- `terminalPalette` returns `undefined` for any theme other than `latte` and
  `mocha`.
- `readableContentColor` throws `TypeError` unless the colour is `#rrggbb`.
- `pierreTreesStyle` throws `RangeError` for an item height that is not finite
  and positive.
- Do not import Tailwind a second time or copy Stipe's token sheet into the
  host. Font URLs are relative to the host's own asset build, so one host cannot
  share another host's font files.
- Stipe has no React, routing, state, command, copy or policy APIs.

## Contribute and license

Stipe's tests cover the theme helpers, embed contrast, terminal palettes, the
spacing scale and the stylesheet's tokens and motion. In the monorepo, run them
from the package directory with `pnpm test`, then `pnpm run lint` and
`pnpm run typecheck`. When you add a complete palette, keep its name in the
complete-palette defaults in `styles.css`. Do not add a values-only finish to
that list or introduce a second theme attribute.

Code is MIT. See [LICENSE](./LICENSE). Bundled fonts keep their SIL Open Font
License 1.1. See [Nunito's license](./fonts/Nunito-OFL.txt),
[Maple Mono's license](./fonts/MapleMono-OFL.txt) and
[Anton's license](./fonts/Anton-OFL.txt). Every other bundled font has its own
`-OFL.txt` file in `fonts/`.
