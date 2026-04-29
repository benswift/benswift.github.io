import type { Heading, Emphasis, Strong, Text, Link, InlineCode, Root } from "mdast";
import type { Node } from "unist";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

const MAX_PHRASE_LEN = 36;
const SPLIT_RE = /[.,;:?!—–\n]+/;

function nodeText(node: Node): string {
  let out = "";
  visit(node, "text", (text: Text) => {
    out += text.value;
  });
  return out.replaceAll(/\s+/g, " ").trim();
}

export function extractHeroPhrases(markdown: string): string[] {
  const tree = unified().use(remarkParse).parse(markdown) as Root;

  const phrases: string[] = [];
  const seen = new Set<string>();

  const consider = (raw: string) => {
    if (!raw) return;
    if (raw.length > MAX_PHRASE_LEN) return;
    const key = raw.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    phrases.push(raw);
  };

  visit(tree, (node, _index, parent) => {
    if (node.type === "heading") {
      const heading = node as Heading;
      if (heading.depth >= 2 && heading.depth <= 4) {
        consider(nodeText(heading));
      }
    } else if (node.type === "emphasis" || node.type === "strong" || node.type === "link") {
      consider(nodeText(node as Emphasis | Strong | Link));
    } else if (node.type === "inlineCode") {
      consider((node as InlineCode).value.replaceAll(/\s+/g, " ").trim());
    } else if (node.type === "text") {
      // Skip text inside h1 / h5+ headings — those are intentionally not extracted
      if (parent && parent.type === "heading") {
        const heading = parent as Heading;
        if (heading.depth < 2 || heading.depth > 4) return;
      }
      const text = node as Text;
      for (const fragment of text.value.split(SPLIT_RE)) {
        consider(fragment.replaceAll(/\s+/g, " ").trim());
      }
    }
  });

  return phrases;
}
