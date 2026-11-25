import { describe, expect, it } from "vitest";
import { type HastNode, rehypeSidenotes } from "./rehype-sidenotes";

const el = (tagName: string, properties: Record<string, unknown>, ...children: HastNode[]) => ({
  type: "element",
  tagName,
  properties,
  children,
});
const text = (value: string) => ({ type: "text", value });

const ref = (name: string, label: string) =>
  el("sup", {}, el("a", { href: `#user-content-fn-${name}`, dataFootnoteRef: true }, text(label)));

const footnotes = (...items: HastNode[]) =>
  el("section", { dataFootnotes: true, className: ["footnotes"] }, el("ol", {}, ...items));

const definition = (name: string, ...children: HastNode[]) =>
  el("li", { id: `user-content-fn-${name}` }, ...children);

const backref = (name: string) =>
  el("a", { href: `#user-content-fnref-${name}`, dataFootnoteBackref: "" }, text("↩"));

function run(...children: HastNode[]): HastNode {
  const tree = { type: "root", children };
  rehypeSidenotes()(tree);
  return tree;
}

describe("rehypeSidenotes", () => {
  it("copies a footnote after its reference, without the back-link or ids", () => {
    const tree = run(
      el("p", {}, text("A claim"), ref("a", "1"), text(".")),
      footnotes(
        definition(
          "a",
          el(
            "p",
            {},
            text("See "),
            el("a", { href: "https://example.com", id: "x" }, text("this")),
            text(" "),
            backref("a"),
          ),
        ),
      ),
    );
    const [, , sidenote] = tree.children![0].children!;
    expect(sidenote).toEqual(
      el(
        "span",
        { className: ["sidenote"], ariaHidden: "true", dataPagefindIgnore: "" },
        el("sup", {}, text("1")),
        text("See "),
        el("a", { href: "https://example.com", tabIndex: -1 }, text("this")),
        text(" "),
      ),
    );
  });

  it("leaves the footnote list as it was", () => {
    const list = footnotes(definition("a", el("p", {}, text("Note "), backref("a"))));
    const before = structuredClone(list);
    run(el("p", {}, ref("a", "1")), list);
    expect(list).toEqual(before);
  });

  it("separates a note's paragraphs with a gap", () => {
    const tree = run(
      el("p", {}, ref("a", "1")),
      footnotes(definition("a", el("p", {}, text("One")), text("\n"), el("p", {}, text("Two")))),
    );
    const sidenote = tree.children![0].children![1];
    expect(sidenote.children!.map((child) => child.value ?? child.properties?.className)).toEqual([
      undefined,
      "One",
      ["sidenote-gap"],
      "Two",
    ]);
  });

  it("skips a note holding a list or code block, and references inside tables", () => {
    const tree = run(
      el("p", {}, ref("a", "1")),
      el("table", {}, el("td", {}, ref("b", "2"))),
      footnotes(
        definition("a", el("p", {}, text("See:")), el("ul", {}, el("li", {}, text("x")))),
        definition("b", el("p", {}, text("Fine"))),
      ),
    );
    expect(tree.children![0].children).toHaveLength(1);
    expect(tree.children![1].children![0].children).toHaveLength(1);
  });
});
