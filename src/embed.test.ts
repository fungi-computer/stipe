import { readFile } from "node:fs/promises";

import { expect, test } from "vitest";

import {
  EMBED_THEME_TOKENS,
  embedThemeProperties,
  readableContentColor,
} from "./embed.js";

function contrast(a: number, b: number): number {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return (
    0.2126 * (channels[0] ?? 0) +
    0.7152 * (channels[1] ?? 0) +
    0.0722 * (channels[2] ?? 0)
  );
}

test("readable content picks black or white by luminance", () => {
  expect(readableContentColor("#ffffff")).toBe("#000000");
  expect(readableContentColor("#000000")).toBe("#ffffff");
  expect(readableContentColor("#2f5fd0")).toBe("#ffffff");
  expect(readableContentColor("#FFD400")).toBe("#000000");
  expect(readableContentColor("#7aa2f7")).toBe("#000000");
  for (const bad of ["red", "#fff", "#12345g", "#1234567", " #123456"])
    expect(() => readableContentColor(bad), bad).toThrow(TypeError);
});

test("every accent keeps WCAG AA contrast on its chosen content", () => {
  for (let value = 0; value <= 0xff_ff_ff; value += 0x03_07_0b) {
    const hex = `#${value.toString(16).padStart(6, "0")}`;
    const content = readableContentColor(hex);
    expect(
      contrast(luminance(hex), luminance(content)),
      hex,
    ).toBeGreaterThanOrEqual(4.5);
  }
});

test("embed properties project only the inputs the host supplied", () => {
  expect(embedThemeProperties({})).toEqual({});
  const properties = embedThemeProperties({
    accent: "#FFD400",
    fontFamily: '"Helvetica Neue", Arial',
  });
  expect(properties).toEqual({
    "--embed-accent": "#ffd400",
    "--embed-accent-content": "#000000",
    "--embed-font-family": '"Helvetica Neue", Arial, system-ui, sans-serif',
  });
  expect(Object.isFrozen(properties)).toBe(true);
  expect(embedThemeProperties({ fontFamily: "  " })).toEqual({});
  expect(() => embedThemeProperties({ accent: "blue" })).toThrow(TypeError);
});

test("embed themes read the host properties and keep readable defaults", async () => {
  const stylesheet = await readFile(
    new URL("../styles.css", import.meta.url),
    "utf8",
  );
  for (const name of ["embed", "embed-dark"]) {
    const block = new RegExp(
      `@plugin "daisyui/theme" \\{\\s*name: "${name}";([\\s\\S]*?)\\}`,
    ).exec(stylesheet)?.[1];
    expect(block, name).toBeDefined();
    const primary = /--color-primary: var\(--embed-accent, (#[0-9a-f]{6})\);/u
      .exec(block ?? "")
      ?.at(1);
    const content =
      /--color-primary-content: var\(--embed-accent-content, (#[0-9a-f]{6})\);/u
        .exec(block ?? "")
        ?.at(1);
    expect(primary, name).toBeDefined();
    expect(content, name).toBe(readableContentColor(primary ?? ""));
  }
  expect(stylesheet).toContain(
    '[data-theme="embed"],\n[data-theme="embed-dark"] {\n  --font-sans: var(--embed-font-family, system-ui, sans-serif);',
  );
});

test("the exported chrome tokens are the themes' own values", async () => {
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  for (const [name, tokens] of Object.entries(EMBED_THEME_TOKENS)) {
    const start = css.indexOf(`name: "${name}";`);
    expect(start, name).toBeGreaterThan(-1);
    const block = css.slice(start, css.indexOf("}", start));
    expect(block).toContain(`--color-base-100: ${tokens.base100};`);
    expect(block).toContain(`--color-base-content: ${tokens.baseContent};`);
    expect(block).toContain(`var(--embed-accent, ${tokens.primary})`);
    expect(block).toContain(
      `var(--embed-accent-content, ${tokens.primaryContent})`,
    );
  }
});
