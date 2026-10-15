import { expect, test } from "vitest";

import { STIPE_GOOEY_FILTER } from "./gooey.js";

test("Stipe freezes the Gooey SVG filter constants", () => {
  expect(STIPE_GOOEY_FILTER).toEqual({
    alphaIntercept: -9,
    alphaSlope: 19,
    blurStdDeviation: 1.5,
  });
  expect(Object.isFrozen(STIPE_GOOEY_FILTER)).toBe(true);
});
