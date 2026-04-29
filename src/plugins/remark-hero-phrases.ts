import type { Root, Heading, Emphasis, Strong, Text } from "mdast";
import { visit } from "unist-util-visit";

const MAX_PHRASE_LEN = 36;

function nodeText(node: Heading | Emphasis | Strong): string {
  let out = "";
  visit(node, "text", (text: Text) => {
    out += text.value;
  });
  return out.replaceAll(/\s+/g, " ").trim();
}

interface FileWithFrontmatter {
  data: {
    astro?: { frontmatter?: Record<string, unknown> };
  };
}

export function remarkHeroPhrases() {
  return (tree: Root, file: FileWithFrontmatter) => {
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

    visit(tree, (node) => {
      if (node.type === "heading") {
        const heading = node as Heading;
        if (heading.depth >= 2 && heading.depth <= 4) {
          consider(nodeText(heading));
        }
      } else if (node.type === "emphasis" || node.type === "strong") {
        consider(nodeText(node as Emphasis | Strong));
      }
    });

    const data = file.data;
    data.astro ??= {};
    data.astro.frontmatter ??= {};
    data.astro.frontmatter.heroPhrases = phrases;
  };
}
