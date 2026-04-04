import { describe, expect, test } from "vitest";
import { extractDescription } from "./excerpt";

describe("extractDescription", () => {
  test("extracts basic text", () => {
    expect(extractDescription("Hello world.")).toBe("Hello world.");
  });

  test("removes HTML/Vue components", () => {
    expect(extractDescription("<MyComponent /> Some text.")).toBe("Some text.");
  });

  test("removes frontmatter", () => {
    const md = `---
title: Test
---

Description text.`;
    expect(extractDescription(md)).toBe("Description text.");
  });

  test("truncates with ellipsis at word boundary", () => {
    const long = "This is a fairly long sentence that exceeds the limit. ".repeat(10);
    const result = extractDescription(long, 50);
    expect(result.length).toBeLessThanOrEqual(51);
    expect(result).toMatch(/…$/);
    expect(result).not.toMatch(/\s…$/);
  });

  test("returns short content as-is", () => {
    expect(extractDescription("Short.", 160)).toBe("Short.");
  });

  test("removes markdown images", () => {
    expect(extractDescription("![alt](img.png) Text here.")).toBe("Text here.");
  });

  test("removes code blocks", () => {
    const md = `\`\`\`ts
code
\`\`\`

Description.`;
    expect(extractDescription(md)).toBe("Description.");
  });

  test("strips bold/italic markers", () => {
    expect(extractDescription("**bold** and *italic*")).toBe("bold and italic");
  });

  test("removes MDX import statements", () => {
    expect(extractDescription("import Foo from './Foo.svelte'\n\nSome description.")).toBe(
      "Some description.",
    );
  });

  test("removes multi-line MDX import statements", () => {
    expect(
      extractDescription(
        "import MiniPerceptron from\n'../../../../src/components/svelte/MiniPerceptron.svelte'\n\nSome description.",
      ),
    ).toBe("Some description.");
  });

  test("removes destructured multi-line MDX import statements", () => {
    expect(
      extractDescription("import {\n  Foo,\n  Bar,\n} from './components'\n\nSome description."),
    ).toBe("Some description.");
  });
});
