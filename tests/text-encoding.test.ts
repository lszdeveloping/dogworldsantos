import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ignoredDirectories = new Set([
  ".git",
  ".next",
  "build",
  "dist",
  "node_modules",
]);

const textExtensions = new Set([
  ".css",
  ".env",
  ".example",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".sql",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
]);

const mojibake =
  /[\u00c2\u00c3][\u0080-\u00bf\u00a0-\u00bf]|\u00e2[\u0080-\u00bf\u20ac][\u0080-\u00bf\u2018-\u201d\u2020\u2021\u2022\u2026\u2030\u2122]?|\ufffd/g;

function listTextFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    if (ignoredDirectories.has(entry)) {
      return [];
    }

    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return listTextFiles(fullPath);
    }

    if (!stats.isFile() || !textExtensions.has(path.extname(entry))) {
      return [];
    }

    const contents = readFileSync(fullPath);
    if (contents.includes(0)) {
      return [];
    }

    return [fullPath];
  });
}

describe("Portuguese text encoding", () => {
  it("does not contain common mojibake sequences in project text files", () => {
    const offenders = listTextFiles(".").flatMap((file) => {
      const contents = readFileSync(file, "utf8");
      const matches = [...contents.matchAll(mojibake)];

      return matches.map((match) => `${file}: ${match[0]}`);
    });

    expect(offenders).toEqual([]);
  });
});
