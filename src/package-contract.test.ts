import manifest from "../package.json" with { type: "json" };
import { readFileSync } from "node:fs";

import { expect, test } from "vitest";

test("Stipe declares only its explicit public subpaths", () => {
  expect(manifest.exports).toEqual({
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
    },
    "./theme": {
      types: "./dist/theme.d.ts",
      import: "./dist/theme.js",
    },
    "./pierre/trees": {
      types: "./dist/pierre/trees.d.ts",
      import: "./dist/pierre/trees.js",
    },
    "./styles.css": "./styles.css",
    "./fonts.css": "./fonts.css",
    "./fonts-sans.css": "./fonts-sans.css",
    "./fonts-mono.css": "./fonts-mono.css",
    "./fonts-display.css": "./fonts-display.css",
    "./pierre/trees.css": "./pierre/trees.css",
  });
  expect(manifest.files).toEqual(
    expect.arrayContaining([
      "fonts-sans.css",
      "fonts-mono.css",
      "fonts-display.css",
      "fonts/*.woff2",
    ]),
  );
});

test("Nunito subset URLs stay relative to each host's asset build", () => {
  const css = readFileSync(
    new URL("../fonts-sans.css", import.meta.url),
    "utf8",
  );

  expect(css).not.toMatch(/https?:\/\//);
  for (const subset of [
    "latin",
    "latin-ext",
    "cyrillic",
    "cyrillic-ext",
    "vietnamese",
  ])
    expect(css).toContain(`./fonts/Nunito-VF-8c6a9bb-${subset}.woff2`);
});

test("Stipe package scaffold declares all required operations without publication execution", () => {
  const operations = manifest.botanical.operations;
  const operationNames = [
    "lint",
    "typecheck",
    "build",
    "test",
    "docs",
    "pack",
    "smoke",
    "stranger",
  ];

  expect(Object.keys(operations)).toEqual(operationNames);
  expect(operations).toEqual({
    lint: "required",
    typecheck: "required",
    build: "required",
    test: "required",
    docs: "required",
    pack: "required",
    smoke: "required",
    stranger: "required",
  });

  const scriptNames = Object.keys(manifest.scripts);
  for (const operationName of operationNames) {
    expect(scriptNames).toContain(operationName);
  }
});
