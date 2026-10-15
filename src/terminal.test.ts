import { expect, test } from "vitest";

import { terminalPalette } from "./terminal.js";
import type { TerminalPalette } from "./terminal.js";

type MutableTerminalPalette = {
  -readonly [Key in keyof TerminalPalette]: TerminalPalette[Key];
};

test("Stipe projects latte and mocha into terminal semantic facts", () => {
  const latte = terminalPalette("latte");
  expect(latte).toEqual({
    background: "#eff1f5",
    foreground: "#4c4f69",
    cursor: "#4c4f69",
    cursorAccent: "#eff1f5",
    surface: "#ccd0da",
    selectionBackground: "#4c4f69",
    selectionForeground: "#eff1f5",
    primary: "#f98284",
    accent: "#ea76cb",
    success: "#40a02b",
    info: "oklch(58% 0.158 241.966)",
    warning: "#df8e1d",
    error: "#d20f39",
    black: "#5c5f77",
    red: "#d20f39",
    green: "#40a02b",
    yellow: "#df8e1d",
    blue: "#1e66f5",
    magenta: "#ea76cb",
    cyan: "#179299",
    white: "#4c4f69",
    brightBlack: "#6c6f85",
    brightRed: "#d20f39",
    brightGreen: "#40a02b",
    brightYellow: "#df8e1d",
    brightBlue: "#1e66f5",
    brightMagenta: "#8839ef",
    brightCyan: "#04a5e5",
    brightWhite: "#4c4f69",
  });

  const mocha = terminalPalette("mocha");
  expect(mocha).toEqual({
    background: "#1e1e2e",
    foreground: "#cdd6f4",
    cursor: "#cdd6f4",
    cursorAccent: "#1e1e2e",
    surface: "#45475a",
    selectionBackground: "#cdd6f4",
    selectionForeground: "#1e1e2e",
    primary: "#f98284",
    accent: "#f5c2e7",
    success: "#a6e3a1",
    info: "#89b4fa",
    warning: "#f9e2af",
    error: "#f38ba8",
    black: "#45475a",
    red: "#f38ba8",
    green: "#a6e3a1",
    yellow: "#f9e2af",
    blue: "#89b4fa",
    magenta: "#f5c2e7",
    cyan: "#94e2d5",
    white: "#cdd6f4",
    brightBlack: "#585b70",
    brightRed: "#f38ba8",
    brightGreen: "#a6e3a1",
    brightYellow: "#f9e2af",
    brightBlue: "#89b4fa",
    brightMagenta: "#cba6f7",
    brightCyan: "#89dceb",
    brightWhite: "#cdd6f4",
  });
});

test("Stipe terminal palettes are immutable shared visual law", () => {
  const latte = terminalPalette("latte");
  expect(latte).toBeDefined();
  if (latte === undefined) {
    throw new Error("The maintained latte palette must exist");
  }

  const originalBackground = latte.background;
  // SAFETY: this mapped test-only view deliberately exposes the mutation attempt
  // that the runtime freeze must reject.
  const mutableLatte = latte as MutableTerminalPalette;
  expect(Object.isFrozen(latte)).toBe(true);
  expect(() => {
    mutableLatte.background = "#000000";
  }).toThrow();
  expect(latte.background).toBe(originalBackground);
  expect(terminalPalette("latte")?.background).toBe(originalBackground);

  const mocha = terminalPalette("mocha");
  expect(mocha).toBeDefined();
  if (mocha === undefined) {
    throw new Error("The maintained mocha palette must exist");
  }
  expect(Object.isFrozen(mocha)).toBe(true);
  expect(terminalPalette("mocha")).toBe(mocha);
  expect(terminalPalette("dracula")).toBeUndefined();
});

test.each([
  ["readout", "#fbfbfa", "#1a1b1e", "#933a88", "#2f7a3e"],
  ["readout-night", "#0e0f11", "#e3e3df", "#dba6e8", "#8fd19e"],
])(
  "Readout terminal palette %s shares the docs semantic colors",
  (theme, background, foreground, magenta, green) => {
    const palette = terminalPalette(theme);
    expect(palette).toMatchObject({ background, foreground, magenta, green });
    expect(Object.isFrozen(palette)).toBe(true);
  },
);

test.each(["latte", "mocha", "readout", "readout-night"])(
  "%s selection uses the existing foreground/background as an explicit inverse pair",
  (theme) => {
    const palette = terminalPalette(theme);
    expect(palette).toBeDefined();
    expect(palette?.selectionBackground).toBe(palette?.foreground);
    expect(palette?.selectionForeground).toBe(palette?.background);
  },
);
