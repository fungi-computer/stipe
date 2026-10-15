import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import postcss from "postcss";
import { expect, it } from "vitest";

const run = promisify(execFile);

it("emits SVG endpoint colors for a host without color utilities", async () => {
  const directory = await mkdtemp(join(tmpdir(), "stipe-svg-palette-"));
  const input = join(directory, "input.css");
  const output = join(directory, "output.css");
  try {
    const styles = fileURLToPath(new URL("../styles.css", import.meta.url));
    await writeFile(input, `@import ${JSON.stringify(styles)} source(none);\n`);
    await run(
      fileURLToPath(
        new URL("../node_modules/.bin/tailwindcss", import.meta.url),
      ),
      ["--cwd", directory, "--input", input, "--output", output],
    );
    const colors = new Map<string, string>();
    postcss.parse(await readFile(output, "utf8")).walkDecls((declaration) => {
      if (["--color-black", "--color-white"].includes(declaration.prop))
        colors.set(declaration.prop, declaration.value);
    });
    expect(colors).toEqual(
      new Map([
        ["--color-black", "#000"],
        ["--color-white", "#fff"],
      ]),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
