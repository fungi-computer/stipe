import { readFile } from "node:fs/promises";

import postcss, { type AtRule } from "postcss";
import { expect, test } from "vitest";

function pluginBlocks(stylesheet: string, pluginName: string): AtRule[] {
  const blocks: AtRule[] = [];
  postcss.parse(stylesheet).walkAtRules("plugin", (rule) => {
    if (rule.params === `"${pluginName}"`) blocks.push(rule);
  });
  return blocks;
}

function declarations(block: AtRule | undefined) {
  const values: Record<string, string> = {};
  block?.walkDecls((declaration) => {
    values[declaration.prop] = declaration.value;
  });
  return values;
}

test("Stipe keeps Daisy light/dark and maintained latte, mocha, field-guide, and embed themes", async () => {
  const stylesheet = await readFile(
    new URL("../styles.css", import.meta.url),
    "utf8",
  );

  expect(stylesheet).toContain('@import "tailwindcss";');
  expect(stylesheet).toContain(
    '@plugin "daisyui" {\n  themes: light, dark;\n}',
  );

  const themeBlocks = pluginBlocks(stylesheet, "daisyui/theme");
  expect(themeBlocks).toHaveLength(10);
  expect(themeBlocks.map((block) => declarations(block).name)).toEqual([
    '"latte"',
    '"mocha"',
    '"field-guide"',
    '"field-guide-night"',
    '"embed"',
    '"embed-dark"',
    '"pirate-radio"',
    '"pirate-radio-night"',
    '"coin"',
    '"coin-night"',
  ]);

  const paper = declarations(themeBlocks[6]);
  const night = declarations(themeBlocks[7]);
  expect(Object.keys(paper).sort()).toEqual(
    Object.keys(declarations(themeBlocks[0])).sort(),
  );
  expect(Object.keys(night).sort()).toEqual(Object.keys(paper).sort());
  expect(paper["--color-base-100"]).toBe(night["--color-base-content"]);
  expect(paper["--color-base-content"]).toBe(night["--color-base-100"]);
  expect(paper["--color-primary"]).toBe(night["--color-primary"]);
  expect(paper.default).toBe("false");
  expect(night.default).toBe("false");

  // Coin is a complete arcade palette pair: the cabinet inverts, the coin stays gold.
  const coin = declarations(themeBlocks[8]);
  const coinNight = declarations(themeBlocks[9]);
  expect(Object.keys(coin).sort()).toEqual(
    Object.keys(declarations(themeBlocks[0])).sort(),
  );
  expect(Object.keys(coinNight).sort()).toEqual(Object.keys(coin).sort());
  expect(coin["--color-base-100"]).toBe(coinNight["--color-base-content"]);
  expect(coin["--color-base-content"]).toBe(coinNight["--color-base-100"]);
  expect(coin["--color-primary"]).toBe(coinNight["--color-primary"]);
  expect(coin["color-scheme"]).toBe('"light"');
  expect(coinNight["color-scheme"]).toBe('"dark"');
  expect(coin.default).toBe("false");
  expect(coinNight.default).toBe("false");

  expect(declarations(themeBlocks[0])).toEqual({
    name: '"latte"',
    default: "true",
    prefersdark: "false",
    "color-scheme": '"light"',
    "--color-base-100": "#eff1f5",
    "--color-base-200": "#e6e9ef",
    "--color-base-300": "#dce0e8",
    "--color-base-content": "#4c4f69",
    "--color-primary": "#f98284",
    "--color-primary-content": "#2a2a2a",
    "--color-secondary": "#b3e3da",
    "--color-secondary-content": "#2a2a2a",
    "--color-accent": "#ea76cb",
    "--color-accent-content": "#2a2a2a",
    "--color-neutral": "#4c4f69",
    "--color-neutral-content": "#eff1f5",
    "--color-info": "oklch(58% 0.158 241.966)",
    "--color-info-content": "oklch(97% 0.013 236.62)",
    "--color-success": "#40a02b",
    "--color-success-content": "#2a2a2a",
    "--color-warning": "#df8e1d",
    "--color-warning-content": "#2a2a2a",
    "--color-error": "#d20f39",
    "--color-error-content": "oklch(96% 0.015 12.422)",
    "--radius-selector": "0.375rem",
    "--radius-button": "0.375rem",
    "--radius-field": "var(--radius-button)",
    "--radius-box": "var(--radius-button)",
    "--size-selector": "0.25rem",
    "--size-field": "0.25rem",
    "--border": "1px",
    "--depth": "1",
    "--noise": "1",
  });

  expect(declarations(themeBlocks[1])).toEqual({
    name: '"mocha"',
    default: "false",
    prefersdark: "true",
    "color-scheme": '"dark"',
    "--color-base-100": "#1e1e2e",
    "--color-base-200": "#181825",
    "--color-base-300": "#11111b",
    "--color-base-content": "#cdd6f4",
    "--color-primary": "#f98284",
    "--color-primary-content": "#2a2a2a",
    "--color-secondary": "#94e2d5",
    "--color-secondary-content": "#1e1e2e",
    "--color-accent": "#f5c2e7",
    "--color-accent-content": "#2a2a2a",
    "--color-neutral": "#cdd6f4",
    "--color-neutral-content": "#1e1e2e",
    "--color-info": "#89b4fa",
    "--color-info-content": "#1e1e2e",
    "--color-success": "#a6e3a1",
    "--color-success-content": "#1e1e2e",
    "--color-warning": "#f9e2af",
    "--color-warning-content": "#1e1e2e",
    "--color-error": "#f38ba8",
    "--color-error-content": "#1e1e2e",
    "--radius-selector": "0.375rem",
    "--radius-button": "0.375rem",
    "--radius-field": "var(--radius-button)",
    "--radius-box": "var(--radius-button)",
    "--size-selector": "0.25rem",
    "--size-field": "0.25rem",
    "--border": "1px",
    "--depth": "1",
    "--noise": "1",
  });

  // Both presets retain their own default scheme. Paired values also let a
  // nested tape card select night colors without losing the enclosing tint.
  for (const [index, name, scheme] of [
    [2, '"field-guide"', '"light"'],
    [3, '"field-guide-night"', '"dark"'],
  ] as const) {
    expect(declarations(themeBlocks[index])).toMatchObject({
      name,
      default: "false",
      prefersdark: "false",
      "color-scheme": scheme,
      "--color-base-100": "light-dark(#fdfdfb, #18272b)",
      "--color-base-content": "light-dark(#292a22, #eee4ce)",
      "--color-primary": "light-dark(#536744, #9ba987)",
      "--color-secondary": "light-dark(#a76c37, #c29a69)",
      "--color-accent": "light-dark(#9e5145, #bd8175)",
      "--radius-button": "0.125rem",
      "--radius-selector": "0.125rem",
      "--radius-field": "0.125rem",
      "--radius-box": "0.25rem",
      "--border": "1px",
      "--depth": "0",
      "--noise": "0",
    });
  }

  for (const [index, scheme] of [
    [4, '"light"'],
    [5, '"dark"'],
  ] as const) {
    const theme = declarations(themeBlocks[index]);
    expect(theme).toMatchObject({
      default: "false",
      prefersdark: "false",
      "color-scheme": scheme,
      "--depth": "0",
      "--noise": "0",
    });
    expect(theme["--color-primary"]).toMatch(
      /^var\(--embed-accent, #[0-9a-f]{6}\)$/u,
    );
    expect(theme["--color-primary-content"]).toMatch(
      /^var\(--embed-accent-content, #[0-9a-f]{6}\)$/u,
    );
  }
  // Pages without data-theme (the Hub) follow the reader's appearance. Daisy
  // lets the last prefersdark theme win, so only mocha may claim dark; opt-in
  // themes such as field-guide-night are chosen with data-theme.
  expect(
    themeBlocks
      .map((block) => declarations(block))
      .filter((theme) => theme.prefersdark === "true")
      .map((theme) => theme.name),
  ).toEqual(['"mocha"']);
});

test("Readout is a values-only material with Maple chrome and independent light/night palettes", async () => {
  const stylesheet = await readFile(
    new URL("../styles.css", import.meta.url),
    "utf8",
  );
  const root = postcss.parse(stylesheet);
  const block = root.nodes.find(
    (node) =>
      node.type === "rule" &&
      node.selector === '[data-theme="readout"],\n[data-theme="readout-night"]',
  );
  expect(block).toBeDefined();
  if (block?.type !== "rule") throw new Error("Readout material missing");
  expect(block.nodes.every((node) => node.type === "decl")).toBe(true);
  const values: Record<string, string> = {};
  block.walkDecls((decl) => {
    values[decl.prop] = decl.value;
  });
  expect(values["--color-base-100"]).toBe("light-dark(#fbfbfa, #0e0f11)");
  expect(values["--font-sans"]).toContain('"Instrument Sans"');
  expect(values["--caps-label-font"]).toBe("var(--font-mono)");
  expect(values["--depth"]).toBe("0");
  expect(values["--stipe-shadow-raised"]).toBe("none");
  expect(values["--stipe-linework"]).toBe("light-dark(#e2e2dd, #25282c)");
});
