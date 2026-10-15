/** Semantic terminal colors projected from a maintained theme. */
export type TerminalPalette = {
  readonly background: string;
  readonly foreground: string;
  readonly cursor: string;
  readonly cursorAccent: string;
  readonly selectionBackground: string;
  readonly surface: string;
  readonly primary: string;
  readonly accent: string;
  readonly success: string;
  readonly info: string;
  readonly warning: string;
  readonly error: string;
  readonly black: string;
  readonly red: string;
  readonly green: string;
  readonly yellow: string;
  readonly blue: string;
  readonly magenta: string;
  readonly cyan: string;
  readonly white: string;
  readonly brightBlack: string;
  readonly brightRed: string;
  readonly brightGreen: string;
  readonly brightYellow: string;
  readonly brightBlue: string;
  readonly brightMagenta: string;
  readonly brightCyan: string;
  readonly brightWhite: string;
  readonly selectionForeground: string;
};

const LATTE: TerminalPalette = Object.freeze({
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

const MOCHA: TerminalPalette = Object.freeze({
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

const READOUT: TerminalPalette = Object.freeze({
  background: "#fbfbfa",
  foreground: "#1a1b1e",
  cursor: "#1a1b1e",
  cursorAccent: "#fbfbfa",
  surface: "#e6e6e1",
  selectionBackground: "#1a1b1e",
  selectionForeground: "#fbfbfa",
  primary: "#e5534b",
  accent: "#e5534b",
  success: "#2f7a3e",
  info: "#2659c4",
  warning: "#9a6200",
  error: "#c4383a",
  black: "#5c5f66",
  red: "#c4383a",
  green: "#2f7a3e",
  yellow: "#9a6200",
  blue: "#2659c4",
  magenta: "#933a88",
  cyan: "#0f7079",
  white: "#1a1b1e",
  brightBlack: "#6b6f76",
  brightRed: "#c4383a",
  brightGreen: "#2f7a3e",
  brightYellow: "#9a6200",
  brightBlue: "#2659c4",
  brightMagenta: "#933a88",
  brightCyan: "#0f7079",
  brightWhite: "#1a1b1e",
});

const READOUT_NIGHT: TerminalPalette = Object.freeze({
  background: "#0e0f11",
  foreground: "#e3e3df",
  cursor: "#e3e3df",
  cursorAccent: "#0e0f11",
  surface: "#26292e",
  selectionBackground: "#e3e3df",
  selectionForeground: "#0e0f11",
  primary: "#ff7b6b",
  accent: "#ff7b6b",
  success: "#8fd19e",
  info: "#8ab4f8",
  warning: "#e7c27a",
  error: "#ff8a80",
  black: "#9a9ea6",
  red: "#ff8a80",
  green: "#8fd19e",
  yellow: "#e7c27a",
  blue: "#8ab4f8",
  magenta: "#dba6e8",
  cyan: "#7fd3d3",
  white: "#e3e3df",
  brightBlack: "#7d828b",
  brightRed: "#ff8a80",
  brightGreen: "#8fd19e",
  brightYellow: "#e7c27a",
  brightBlue: "#8ab4f8",
  brightMagenta: "#dba6e8",
  brightCyan: "#7fd3d3",
  brightWhite: "#e3e3df",
});

/** Return the maintained terminal palette for an exact theme name. */
export function terminalPalette(theme: string): TerminalPalette | undefined {
  switch (theme.trim()) {
    case "readout":
      return READOUT;
    case "readout-night":
      return READOUT_NIGHT;
    case "latte":
      return LATTE;
    case "mocha":
      return MOCHA;
    default:
      return undefined;
  }
}
