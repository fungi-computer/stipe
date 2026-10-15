import { getTheme, terminalPalette } from "@fungi.computer/stipe";

const palette = terminalPalette(getTheme() ?? "latte");
if (palette) {
  console.log(palette.background, palette.foreground, palette.red); // latte's terminal colors
}
