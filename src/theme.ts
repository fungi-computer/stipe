import { z } from "zod";

/** Curated themes shipped by Stipe; hosts may still install their own themes. */
export const STIPE_THEMES = [
  "light",
  "dark",
  "latte",
  "mocha",
  "readout",
  "readout-night",
  "field-guide",
  "field-guide-night",
  "embed",
  "embed-dark",
  "phosphor",
  "codec",
  "paper",
  "ember",
  "tide",
  "tape",
  "sunrise",
  "pirate-radio",
  "pirate-radio-night",
  "consulting",
  "consulting-ink",
  "consulting-night",
  "consulting-night-ink",
  "consulting-riso-latte",
  "consulting-riso-latte-ink",
  "consulting-riso-glomzy",
  "consulting-riso-glomzy-ink",
  "vishnu",
  "coin",
  "coin-night",
  "chamfer",
] as const;

/** Decode a shipped theme name at a serialized-data boundary. */
export const stipeThemeSchema = z.enum(STIPE_THEMES);

/** One of Stipe's shipped theme names. */
export type StipeTheme = z.infer<typeof stipeThemeSchema>;

const THEME_ATTRIBUTE = "data-theme";

/** Receives the current theme after a matching attribute mutation. */
export type ThemeListener = (theme: string) => void;

function resolveRoot(root?: HTMLElement): HTMLElement | null {
  if (root) return root;
  const runtime: Readonly<{ document?: Document }> = globalThis;
  return runtime.document?.documentElement ?? null;
}

function requireTheme(theme: string): string {
  const value = theme.trim();
  if (value.length === 0) {
    throw new TypeError("Theme must be a non-empty string");
  }
  return value;
}

/** Set the Daisy theme name. Persistence and application policy stay with the host. */
export function applyTheme(theme: string, root?: HTMLElement): void {
  const value = requireTheme(theme);
  const target = resolveRoot(root);
  if (!target) return;
  target.setAttribute(THEME_ATTRIBUTE, value);
}

/** Read the Daisy theme name from the root element, when available. */
export function getTheme(root?: HTMLElement): string | null {
  return resolveRoot(root)?.getAttribute(THEME_ATTRIBUTE) ?? null;
}

/** Subscribe to root data-theme mutations without owning browser policy. */
export function subscribeTheme(
  listener: ThemeListener,
  root?: HTMLElement,
): () => void {
  const target = resolveRoot(root);
  const runtime: Readonly<{
    MutationObserver?: typeof MutationObserver;
  }> = globalThis;
  const ownerDocument = target?.ownerDocument ?? null;
  const ownerWindow = ownerDocument?.defaultView;
  const Observer = ownerWindow?.MutationObserver ?? runtime.MutationObserver;
  if (!target || !Observer) return () => undefined;

  const observer = new Observer((records) => {
    if (
      !records.some(
        (record) =>
          record.type === "attributes" &&
          record.attributeName === THEME_ATTRIBUTE,
      )
    ) {
      return;
    }
    const theme = target.getAttribute(THEME_ATTRIBUTE);
    if (theme) listener(theme);
  });
  observer.observe(target, {
    attributes: true,
    attributeFilter: [THEME_ATTRIBUTE],
  });

  let disconnected = false;
  return () => {
    if (disconnected) return;
    disconnected = true;
    observer.disconnect();
  };
}
