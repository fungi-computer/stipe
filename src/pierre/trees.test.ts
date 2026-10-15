import { expect, test } from "vitest";

import { pierreTreesStyle } from "./trees.js";

test("Stipe projects Pierre tree styling through exact CSS variable references", () => {
  expect(pierreTreesStyle()).toEqual({
    flex: "1",
    "--trees-bg-override": "var(--stipe-surface)",
    "--trees-fg-override": "var(--color-base-content)",
    "--trees-fg-muted-override": "var(--stipe-fg-muted)",
    "--trees-accent-override": "var(--color-primary)",
    "--trees-bg-muted-override": "var(--stipe-surface-raised)",
    "--trees-selected-bg-override": "var(--stipe-surface-selected)",
    "--trees-selected-fg-override": "var(--color-base-content)",
    "--trees-selected-focused-border-color-override": "transparent",
    "--trees-border-radius-override": "0rem",
    "--trees-border-radius": "0rem",
    "--trees-border-color-override": "var(--color-base-300)",
    "--trees-icon-width-override": "0.875rem",
    "--trees-icon-nudge-override": "0px",
    "--trees-padding-inline-override": "var(--stipe-density-compact)",
    "--trees-item-margin-x": "0px",
    "--trees-item-height": "32px",
    "--trees-font-family-override": "Nunito, system-ui, sans-serif",
    "--trees-font-size-override": "0.75rem",
  });
});

test("Stipe supports compact and comfortable Pierre geometry", () => {
  const defaultStyle = pierreTreesStyle();
  expect(defaultStyle["--trees-item-height"]).toBe("32px");
  expect(defaultStyle["--trees-icon-width-override"]).toBe("0.875rem");
  expect(defaultStyle["--trees-padding-inline-override"]).toBe(
    "var(--stipe-density-compact)",
  );

  const explicitCompactStyle = pierreTreesStyle({ compact: true });
  expect(explicitCompactStyle["--trees-item-height"]).toBe("32px");
  expect(explicitCompactStyle["--trees-icon-width-override"]).toBe("0.875rem");
  expect(explicitCompactStyle["--trees-padding-inline-override"]).toBe(
    "var(--stipe-density-compact)",
  );

  const comfortableStyle = pierreTreesStyle({
    itemHeight: 36,
    compact: false,
  });
  expect(comfortableStyle["--trees-item-height"]).toBe("36px");
  expect(comfortableStyle["--trees-icon-width-override"]).toBe("1rem");
  expect(comfortableStyle["--trees-padding-inline-override"]).toBe(
    "var(--stipe-density-comfortable)",
  );
});

test("Stipe rejects non-positive and non-finite Pierre row heights", () => {
  for (const itemHeight of [
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ]) {
    expect(() => pierreTreesStyle({ itemHeight })).toThrow(RangeError);
  }
});
