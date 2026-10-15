import { expect, test } from "vitest";

import { terminalPalette } from "./terminal.js";

test("Stipe returns explicit absence for arbitrary terminal themes", () => {
  expect(terminalPalette("dracula")).toBeUndefined();
  expect(terminalPalette(" third-party-theme ")).toBeUndefined();
  expect(terminalPalette("  ")).toBeUndefined();
});
