import { describe, expect, test } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveContentPath } from "./source-path";

function makeTempRepo(files: string[]): string {
  const root = mkdtempSync(join(tmpdir(), "source-path-test-"));
  for (const file of files) {
    const full = join(root, file);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, "");
  }
  return root;
}

describe("resolveContentPath", () => {
  test("picks .md when only .md exists", () => {
    const root = makeTempRepo(["blog/2024/01/01/hello.md"]);
    try {
      expect(resolveContentPath("blog", "2024/01/01/hello", root)).toBe("blog/2024/01/01/hello.md");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("picks .mdx when only .mdx exists", () => {
    const root = makeTempRepo(["blog/2024/01/01/hello.mdx"]);
    try {
      expect(resolveContentPath("blog", "2024/01/01/hello", root)).toBe(
        "blog/2024/01/01/hello.mdx",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("prefers .md when both exist", () => {
    const root = makeTempRepo(["blog/2024/01/01/hello.md", "blog/2024/01/01/hello.mdx"]);
    try {
      expect(resolveContentPath("blog", "2024/01/01/hello", root)).toBe("blog/2024/01/01/hello.md");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("falls back to .md when neither exists (caller's problem)", () => {
    const root = makeTempRepo([]);
    try {
      expect(resolveContentPath("blog", "missing", root)).toBe("blog/missing.md");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("strips existing .md extension from id before re-appending", () => {
    const root = makeTempRepo(["blog/2024/01/01/hello.md"]);
    try {
      expect(resolveContentPath("blog", "2024/01/01/hello.md", root)).toBe(
        "blog/2024/01/01/hello.md",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("strips existing .mdx extension from id before resolving", () => {
    const root = makeTempRepo(["blog/2024/01/01/hello.mdx"]);
    try {
      expect(resolveContentPath("blog", "2024/01/01/hello.mdx", root)).toBe(
        "blog/2024/01/01/hello.mdx",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
