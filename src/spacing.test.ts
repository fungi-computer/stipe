import { readFile } from "node:fs/promises";

import postcss from "postcss";
import { compile } from "tailwindcss";
import { expect, test } from "vitest";

import { STIPE_SPACING_NAMES } from "./index.js";

test("Stipe's named grid compiles to logical Tailwind spacing utilities", async () => {
  const source = await readFile(
    new URL("../styles.css", import.meta.url),
    "utf8",
  );
  const root = postcss.parse(source);
  const themes = root.nodes.filter(
    (node) => node.type === "atrule" && node.name === "theme",
  );
  expect(themes.length).toBeGreaterThan(0);
  const compiler = await compile(
    `${themes.map((theme) => theme.toString()).join("\n")}\n@tailwind utilities;`,
  );
  const css = postcss.parse(
    compiler.build(
      STIPE_SPACING_NAMES.flatMap((name) => [`px-${name}`, `gap-${name}`]),
    ),
  );
  const declarations: Record<string, string> = {};
  css.walkDecls(/^--spacing-/, ({ prop, value }) => {
    declarations[prop] = value;
  });
  expect(declarations).toEqual({
    "--spacing-2xs": "0.125rem",
    "--spacing-xs": "0.25rem",
    "--spacing-sm": "0.5rem",
    "--spacing-md": "0.75rem",
    "--spacing-lg": "1rem",
    "--spacing-xl": "1.5rem",
    "--spacing-2xl": "2rem",
    "--spacing-3xl": "3rem",
    "--spacing-4xl": "4rem",
  });
  for (const name of STIPE_SPACING_NAMES) {
    const padding: string[] = [];
    css.walkRules(`.px-${name}`, (rule) => {
      rule.walkDecls("padding-inline", ({ value }) => {
        padding.push(value);
      });
    });
    expect(padding).toEqual([`var(--spacing-${name})`]);
    const gaps: string[] = [];
    css.walkRules(`.gap-${name}`, (rule) => {
      rule.walkDecls("gap", ({ value }) => {
        gaps.push(value);
      });
    });
    expect(gaps).toEqual([`var(--spacing-${name})`]);
  }
});

test("named max widths are container sizes, not spacing steps", async () => {
  const source = await readFile(
    new URL("../styles.css", import.meta.url),
    "utf8",
  );
  const themes = postcss
    .parse(source)
    .nodes.filter((node) => node.type === "atrule" && node.name === "theme");
  expect(themes.length).toBeGreaterThan(0);
  const compiler = await compile(
    `${themes.map((theme) => theme.toString()).join("\n")}\n@tailwind utilities;`,
  );
  const sizes = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];
  const css = postcss.parse(
    compiler.build(sizes.map((size) => `max-w-${size}`)),
  );
  const tokens: Record<string, string> = {};
  css.walkDecls(/^--max-width-/, ({ prop, value }) => {
    tokens[prop] = value;
  });
  for (const size of sizes) {
    expect(tokens[`--max-width-${size}`]).toBe(`var(--container-${size})`);
    const widths: string[] = [];
    css.walkRules(`.max-w-${size}`, (rule) => {
      rule.walkDecls("max-width", ({ value }) => {
        widths.push(value);
      });
    });
    expect(widths).toEqual([`var(--max-width-${size})`]);
  }
});
