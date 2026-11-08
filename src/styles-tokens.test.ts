import { readFile } from "node:fs/promises";

import postcss from "postcss";
import { expect, test } from "vitest";

import { STIPE_TOKEN_NAMES } from "./index.js";

type CssDeclaration = {
  name: string;
  value: string;
};

function baseDeclarations(stylesheet: string): CssDeclaration[] {
  const base = postcss
    .parse(stylesheet)
    .nodes.find(
      (node) => node.type === "rule" && node.selectors.includes(":root"),
    );
  if (base?.type !== "rule") throw new Error("Missing root token defaults");
  return base.nodes.flatMap((node) =>
    node.type === "decl" && node.prop.startsWith("--stipe-")
      ? [
          {
            name: node.prop,
            value: node.value
              .replace(/\s+/g, " ")
              .replace(/\(\s+/g, "(")
              .replace(/\s+\)/g, ")")
              .trim(),
          },
        ]
      : [],
  );
}

test("Stipe exposes every CSS token exactly once without duplicating Daisy roles", async () => {
  const stylesheet = await readFile(
    new URL("../styles.css", import.meta.url),
    "utf8",
  );
  const rootDeclarations = baseDeclarations(stylesheet);

  expect(rootDeclarations).not.toHaveLength(0);
  expect(rootDeclarations.map(({ name }) => name).sort()).toEqual(
    [...STIPE_TOKEN_NAMES].sort(),
  );
  expect(new Set(rootDeclarations.map(({ name }) => name)).size).toBe(
    STIPE_TOKEN_NAMES.length,
  );
  expect(
    Object.fromEntries(
      rootDeclarations.map(({ name, value }) => [name, value]),
    ),
  ).toEqual({
    "--stipe-font-synthesis": "initial",
    "--stipe-surface-frame-width": "initial",
    "--stipe-surface-frame-image": "initial",
    "--stipe-surface-molding-contrast": "1%",
    "--stipe-shadow-raised": "initial",
    "--stipe-shadow-inset": "initial",
    "--stipe-shadow-edge": "initial",
    "--stipe-display-gasket-face": "initial",
    "--stipe-display-texture-image": "none",
    "--stipe-display-text-shadow": "none",
    "--stipe-canvas": "var(--color-base-100)",
    "--stipe-surface": "var(--color-base-200)",
    "--stipe-surface-raised": "var(--color-base-100)",
    "--stipe-surface-selected": "var(--color-base-300)",
    "--stipe-fg-muted": "inherit",
    "--stipe-linework": "var(--color-base-300)",
    "--stipe-hairline":
      "color-mix(in oklab, var(--color-base-content) 22%, transparent)",
    "--stipe-hairline-quiet":
      "color-mix(in oklab, var(--color-base-content) 10%, transparent)",
    "--stipe-figure-ink": "var(--color-base-content)",
    "--stipe-density-compact": "0rem",
    "--stipe-density-comfortable": "0.25rem",
    "--stipe-motion-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    "--stipe-motion-squish": "90ms",
    "--stipe-motion-ease-exit": "cubic-bezier(0.4, 0, 1, 1)",
    "--stipe-motion-bounce": "0.3",
    "--stipe-motion-spring-duration": "320ms",
    "--stipe-motion-stretch": "0.28",
    "--stipe-motion-distance": "4px",
    "--stipe-motion-stagger": "24ms",
    "--stipe-motion-blur": "0px",
    "--stipe-motion-shake": "3px",
    "--stipe-motion-steps": "0",
    "--stipe-motion-fuse": "1px",
    "--stipe-press-depth": "0.5px",
    "--stipe-press-scale": "1",
    "--stipe-motion-fast": "120ms",
    "--stipe-motion-normal": "180ms",
    "--stipe-motion-slow": "280ms",
    "--stipe-motion-ease": "cubic-bezier(0.2, 0, 0, 1)",
    "--stipe-layer-desktop": "0",
    "--stipe-layer-windows": "10",
    "--stipe-layer-chrome": "20",
    "--stipe-layer-popover": "30",
    "--stipe-layer-dialog": "40",
    "--stipe-layer-toast": "50",
    "--stipe-layer-tooltip": "60",
    "--stipe-overlay-shadow-outset": "4px",
    "--stipe-icon-size-sm": "0.875rem",
    "--stipe-icon-size-md": "1rem",
    "--stipe-icon-size-lg": "1.25rem",
    "--stipe-icon-stroke": "1.75",
    "--stipe-card-rim": "#f4c32c",
    "--stipe-card-rim-edge": "#c99a12",
    "--stipe-card-face": "#fbf2df",
    "--stipe-card-panel": "#f3e3c3",
    "--stipe-card-ink": "#2d2416",
    "--stipe-card-ink-muted": "#6d5a3c",
    "--stipe-card-accent": "#e8554c",
    "--stipe-card-shadow":
      "inset 0 1px 0 rgb(255 255 255 / 0.45), 0 18px 32px -20px rgb(0 0 0 / 0.55)",
    "--stipe-card-foil-highlight": "rgb(255 255 255 / 0.5)",
    "--stipe-card-foil-warm": "rgb(255 214 245 / 0.35)",
    "--stipe-card-foil-cool": "rgb(180 240 255 / 0.35)",
    "--stipe-avatar-shadow": "0 2px 5px rgb(0 0 0 / 0.12)",
    "--stipe-art-coral": "light-dark(#ff6558, #ff6558)",
    "--stipe-art-blue": "light-dark(#43a6f2, #43a6f2)",
    "--stipe-art-mint": "light-dark(#63cfaa, #63cfaa)",
    "--stipe-art-grape": "light-dark(#a66cc1, #a66cc1)",
    "--stipe-art-yellow": "light-dark(#ffd05d, #ffd05d)",
    "--stipe-art-cream": "light-dark(#fff4de, #fff4de)",
    "--stipe-art-ink": "light-dark(#242c28, #242c28)",
    "--stipe-art-inkcap": "light-dark(#80499d, #80499d)",
    "--stipe-art-graphite": "light-dark(#49423f, #49423f)",
    "--stipe-sketch-ink": "var(--color-base-content)",
  });

  expect(stylesheet).toContain(
    ':root:not([data-theme]),\n[data-theme="latte"] {\n  --stipe-fg-muted: #5c5f77;\n  --stipe-sketch-ink: #1c1b22;\n}',
  );
  expect(stylesheet).toContain(
    '[data-theme="mocha"] {\n  --stipe-fg-muted: #a6adc8;\n  --stipe-sketch-ink: #f1e6d2;\n}',
  );
  expect(stylesheet).not.toMatch(
    /--stipe-(?:primary|secondary|accent|neutral|info|success|warning|error)\b/,
  );
});
