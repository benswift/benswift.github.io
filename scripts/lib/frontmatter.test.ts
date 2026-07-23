import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "./frontmatter";

describe("parseFrontmatter", () => {
  it("parses front matter and returns the body", () => {
    const r = parseFrontmatter("---\ntitle: Hi\n---\nBody here\n");
    expect(r.data).toEqual({ title: "Hi" });
    expect(r.content).toBe("Body here\n");
  });

  it("keeps a blank line at the top of the body", () => {
    expect(parseFrontmatter("---\ntitle: Hi\n---\n\nBody\n").content).toBe("\nBody\n");
  });

  it("returns the whole input as content when there is no front matter", () => {
    const r = parseFrontmatter("No front matter\njust text");
    expect(r.data).toEqual({});
    expect(r.content).toBe("No front matter\njust text");
  });

  it("treats an indented fence as no front matter", () => {
    const raw = "  ---\ntitle: Hi\n---\nBody";
    expect(parseFrontmatter(raw)).toEqual({ data: {}, content: raw });
  });

  it("handles an empty front matter block", () => {
    expect(parseFrontmatter("---\n---\nBody")).toEqual({ data: {}, content: "Body" });
  });

  it("handles no body after the closing fence", () => {
    expect(parseFrontmatter("---\ntitle: Hi\n---").content).toBe("");
    expect(parseFrontmatter("---\ntitle: Hi\n---\n").content).toBe("");
  });

  it("ends the block at the first closing fence only", () => {
    const r = parseFrontmatter("---\ntitle: Hi\n---\nbefore\n---\nafter");
    expect(r.data).toEqual({ title: "Hi" });
    expect(r.content).toBe("before\n---\nafter");
  });

  it("strips a leading byte-order mark", () => {
    const r = parseFrontmatter("﻿---\ntitle: Hi\n---\nBody");
    expect(r.data).toEqual({ title: "Hi" });
    expect(r.content).toBe("Body");
  });

  it("handles CRLF line endings", () => {
    const r = parseFrontmatter("---\r\ntitle: Hi\r\n---\r\nBody\r\n");
    expect(r.data).toEqual({ title: "Hi" });
    expect(r.content).toBe("Body\r\n");
  });

  it("returns empty data and content for an empty string", () => {
    expect(parseFrontmatter("")).toEqual({ data: {}, content: "" });
  });

  it("returns the input verbatim when the closing fence is missing", () => {
    const raw = "---\ntitle: Hi\nno closing fence\n";
    expect(parseFrontmatter(raw)).toEqual({ data: {}, content: raw });
  });

  it("parses scalars, lists and nested maps", () => {
    const r = parseFrontmatter(
      [
        "---",
        'title: "A Talk"',
        'date: "2012-05-09"',
        "tags: [a, b]",
        "nested:",
        "  k: v",
        "---",
        "x",
      ].join("\n"),
    );
    expect(r.data).toEqual({
      title: "A Talk",
      date: "2012-05-09",
      tags: ["a", "b"],
      nested: { k: "v" },
    });
  });

  // Regression: the scripts were written against js-yaml 3.x via gray-matter,
  // where yes/no/on/off are NOT booleans and quoted dates stay strings. The
  // yaml package's 1.2 default matches this --- lock it so a future config or
  // version change can't silently coerce these.
  it("does not coerce yes/no/on/off to booleans", () => {
    expect(parseFrontmatter("---\ndraft: no\npublish: yes\nflag: off\n---\nx").data).toEqual({
      draft: "no",
      publish: "yes",
      flag: "off",
    });
  });

  it("keeps quoted dates as strings", () => {
    expect(parseFrontmatter('---\ndate: "2012-05-09"\n---\nx').data).toEqual({
      date: "2012-05-09",
    });
  });

  it("returns booleans and numbers for their canonical YAML 1.2 spellings", () => {
    expect(parseFrontmatter("---\npublished: false\ncount: 3\n---\nx").data).toEqual({
      published: false,
      count: 3,
    });
  });

  it("supports a typed front matter shape", () => {
    interface Gig {
      title: string;
      doi?: string;
    }
    const { data } = parseFrontmatter<Gig>("---\ntitle: ICLC\ndoi: 10.5281/x\n---\nbody");
    expect(data.title).toBe("ICLC");
    expect(data.doi).toBe("10.5281/x");
  });
});

// Regression over the real corpus: every content file must parse without
// throwing and yield a non-empty data object (they all carry front matter).
describe("parseFrontmatter on real content", () => {
  const roots = ["src/content/blog", "src/content/talks", "src/content/livecoding"].map((d) =>
    path.resolve(process.cwd(), d),
  );

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const files = fs
      .readdirSync(root, { recursive: true })
      .map(String)
      .filter((f) => (f.endsWith(".md") || f.endsWith(".mdx")) && !f.includes("index.md"));

    it(`parses every file under ${path.basename(root)}`, () => {
      expect(files.length).toBeGreaterThan(0);
      for (const f of files) {
        const raw = fs.readFileSync(path.join(root, f), "utf8");
        const { data, content } = parseFrontmatter(raw);
        expect(data, f).toBeInstanceOf(Object);
        expect(Object.keys(data as object).length, f).toBeGreaterThan(0);
        expect(typeof content, f).toBe("string");
      }
    });
  }
});
