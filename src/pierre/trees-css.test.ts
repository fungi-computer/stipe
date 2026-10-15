import { readFile } from "node:fs/promises";

import { expect, test } from "vitest";

function stripComments(stylesheet: string): string {
  return stylesheet.replace(/\/\*[\s\S]*?\*\//g, "").trim();
}

test("Stipe's Pierre CSS bridge imports the visual law exactly once", async () => {
  const stylesheet = await readFile(
    new URL("../../pierre/trees.css", import.meta.url),
    "utf8",
  );
  const bridge = stripComments(stylesheet);

  expect(bridge).toBe('@import "../styles.css";');
  expect(bridge.match(/@import\s+"[^"]+";/g)).toEqual([
    '@import "../styles.css";',
  ]);
});
