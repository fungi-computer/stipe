/** Optional geometry inputs for the Pierre tree style projection. */
export type PierreTreesStyleOptions = {
  itemHeight?: number;
  compact?: boolean;
};

function formatHeight(height: number): string {
  if (!Number.isFinite(height) || height <= 0) {
    throw new RangeError("Pierre tree item height must be finite and positive");
  }
  return `${String(height)}px`;
}

/** Return the exact CSS variable projection for Pierre trees. */
export function pierreTreesStyle(options: PierreTreesStyleOptions = {}) {
  const compact = options.compact ?? true;
  return {
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
    "--trees-icon-width-override": compact ? "0.875rem" : "1rem",
    "--trees-icon-nudge-override": "0px",
    "--trees-padding-inline-override": compact
      ? "var(--stipe-density-compact)"
      : "var(--stipe-density-comfortable)",
    "--trees-item-margin-x": "0px",
    "--trees-item-height": formatHeight(options.itemHeight ?? 32),
    "--trees-font-family-override": "Nunito, system-ui, sans-serif",
    "--trees-font-size-override": "0.75rem",
  };
}
