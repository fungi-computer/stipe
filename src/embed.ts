const HEX_COLOR = /^#[0-9a-f]{6}$/iu;

/**
 * The embed themes' default chrome tokens, for surfaces outside Daisy (the
 * loader's launcher in a host page's shadow root). `styles.css` defines the
 * same values; a test keeps the two in step.
 */
export const EMBED_THEME_TOKENS = {
  embed: {
    base100: "#ffffff",
    baseContent: "#1f2328",
    primary: "#2f5fd0",
    primaryContent: "#ffffff",
  },
  "embed-dark": {
    base100: "#1b1d21",
    baseContent: "#e8eaed",
    primary: "#7aa2f7",
    primaryContent: "#000000",
  },
} as const;

/** Host inputs for the `embed` and `embed-dark` themes. Both are optional. */
export type EmbedThemeOptions = Readonly<{
  /** Owner accent as `#rrggbb`; drives Daisy primary and accent. */
  accent?: string | undefined;
  /** Host page font-family list, already bounded by the host's parser. */
  fontFamily?: string | undefined;
}>;

/** Custom properties the embed themes read, keyed by property name. */
export type EmbedThemeProperties = Readonly<Record<string, string>>;

function channel(hex: string, offset: number): number {
  const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of one `#rrggbb` colour. */
function luminance(hex: string): number {
  return (
    0.2126 * channel(hex, 1) +
    0.7152 * channel(hex, 3) +
    0.0722 * channel(hex, 5)
  );
}

/** Black or white, whichever has the higher WCAG contrast on `hex`. */
export function readableContentColor(hex: string): "#000000" | "#ffffff" {
  if (!HEX_COLOR.test(hex)) {
    throw new TypeError("Colour must be #rrggbb");
  }
  const light = luminance(hex);
  return (light + 0.05) / 0.05 >= 1.05 / (light + 0.05) ? "#000000" : "#ffffff";
}

/**
 * Project host inputs onto the embed themes' custom properties. The host
 * applies them (for example with `style.setProperty`) beside
 * `data-theme="embed"` or `data-theme="embed-dark"`.
 */
export function embedThemeProperties(
  options: EmbedThemeOptions,
): EmbedThemeProperties {
  const properties: Record<string, string> = {};
  if (options.accent !== undefined) {
    const accent = options.accent.toLowerCase();
    properties["--embed-accent"] = accent;
    properties["--embed-accent-content"] = readableContentColor(accent);
  }
  const family = options.fontFamily?.trim();
  if (family) {
    properties["--embed-font-family"] = `${family}, system-ui, sans-serif`;
  }
  return Object.freeze(properties);
}
