import { readFile } from "node:fs/promises";

import { expect, test } from "vitest";

type CssDeclaration = {
  name: string;
  value: string;
};

function ruleBody(stylesheet: string, pattern: RegExp): string {
  return pattern.exec(stylesheet)?.at(1) ?? "";
}

function declarations(rule: string): CssDeclaration[] {
  const parsed: CssDeclaration[] = [];
  const pattern = /^\s*([^:]+):\s*(.*?);\s*$/gm;

  for (const match of rule.matchAll(pattern)) {
    const name = match.at(1);
    const value = match.at(2);
    if (name !== undefined && value !== undefined) {
      parsed.push({ name, value: value.trim() });
    }
  }

  return parsed;
}

test("Stipe reduces motion to short opacity fades without spatial motion", async () => {
  const stylesheet = await readFile(
    new URL("../styles.css", import.meta.url),
    "utf8",
  );
  const mediaStart = stylesheet.indexOf(
    "@media (prefers-reduced-motion: reduce)",
  );
  expect(mediaStart).toBeGreaterThanOrEqual(0);

  const media = stylesheet.slice(mediaStart);
  const reducedMotionRoot = ruleBody(
    media,
    /:root,\s*\[data-theme\]\s*\{([\s\S]*?)\}/,
  );
  expect(declarations(reducedMotionRoot)).toEqual([
    { name: "--stipe-motion-bounce", value: "0" },
    { name: "--stipe-motion-stretch", value: "0" },
    { name: "--stipe-motion-distance", value: "0px" },
    { name: "--stipe-motion-stagger", value: "0ms" },
    { name: "--stipe-motion-blur", value: "0px" },
    { name: "--stipe-motion-shake", value: "0px" },
    { name: "--stipe-motion-steps", value: "0" },
    { name: "--stipe-press-depth", value: "0px" },
    { name: "--stipe-press-scale", value: "1" },

    { name: "--stipe-motion-squish", value: "120ms" },
    { name: "--stipe-motion-fast", value: "120ms" },
    { name: "--stipe-motion-normal", value: "120ms" },
    { name: "--stipe-motion-slow", value: "120ms" },
  ]);

  const reducedMotionUniversal = ruleBody(
    media,
    /\*,\s*\*::before,\s*\*::after\s*\{([\s\S]*?)\}/,
  );
  expect(declarations(reducedMotionUniversal)).toEqual([
    { name: "animation-duration", value: "0.01ms !important" },
    { name: "animation-iteration-count", value: "1 !important" },
    { name: "scroll-behavior", value: "auto !important" },
    { name: "transition-property", value: "opacity !important" },
    {
      name: "transition-duration",
      value: "var(--stipe-motion-fast) !important",
    },
  ]);
});
