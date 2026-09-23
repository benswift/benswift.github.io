import { describe, expect, test } from "vitest";
import { rehypeSmallCaps } from "./rehype-small-caps";

const text = (value: string) => ({ type: "text", value });
const el = (tagName: string, ...children: object[]) => ({
  type: "element",
  tagName,
  properties: {},
  children,
});

function run(tree: object, path = "post.md") {
  rehypeSmallCaps()(tree as never, { path });
  return tree;
}

function capsIn(tree: object): string[] {
  return (
    JSON.stringify(tree)
      .match(/"className":\["caps"\]\},?"children":\[\{"type":"text","value":"[^"]+"/g)
      ?.map((m) => m.split('"value":"')[1]!.slice(0, -1)) ?? []
  );
}

describe("rehypeSmallCaps", () => {
  test("wraps acronyms, leaving plural s and possessives outside", () => {
    const tree = run({
      type: "root",
      children: [el("p", text("DOIs and the ANU's AT-URI format"))],
    });
    expect(capsIn(tree)).toEqual(["DOI", "ANU", "AT-URI"]);
    expect(JSON.stringify(tree)).toContain('"value":"s and the "');
  });

  test("leaves single capitals, mixed case and alphanumeric codes alone", () => {
    const tree = run({
      type: "root",
      children: [el("p", text("I use BibTeX in COMP4020 on macOS"))],
    });
    expect(capsIn(tree)).toEqual([]);
  });

  test("skips code and headings", () => {
    const tree = run({
      type: "root",
      children: [el("h2", text("The URL problem")), el("p", el("code", text("HTTP_PROXY")))],
    });
    expect(capsIn(tree)).toEqual([]);
  });

  test("leaves decks untouched", () => {
    const tree = run({ type: "root", children: [el("p", text("LLM"))] }, "talk.deck.mdx");
    expect(capsIn(tree)).toEqual([]);
  });
});
