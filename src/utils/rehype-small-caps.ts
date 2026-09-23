// Wraps acronyms in running text (DOI, AT-URI, the ANU in "ANU's", the DOI in
// "DOIs") in <span class="caps"> so global.css can set them in small caps.

// Just the hast shape this plugin touches.
interface HastNode {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

// Code, headings (set in lining capitals already) and anything that isn't prose.
const SKIP = new Set([
  "code",
  "pre",
  "kbd",
  "samp",
  "script",
  "style",
  "svg",
  "math",
  "abbr",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);

// Two or more capitals (hyphenated runs allowed), optionally followed by a
// plural "s", and not touching other letters or digits: COMP4020 and GPT-4's
// "4" stay full size.
const ACRONYM = /(?<![\p{L}\p{N}])[A-Z]{2,}(?:-[A-Z]{2,})*(?=s?(?![\p{L}\p{N}]))/gu;

function splitText(value: string): HastNode[] | null {
  const parts: HastNode[] = [];
  let last = 0;
  for (const match of value.matchAll(ACRONYM)) {
    if (match.index > last) parts.push({ type: "text", value: value.slice(last, match.index) });
    parts.push({
      type: "element",
      tagName: "span",
      properties: { className: ["caps"] },
      children: [{ type: "text", value: match[0] }],
    });
    last = match.index + match[0].length;
  }
  if (parts.length === 0) return null;
  if (last < value.length) parts.push({ type: "text", value: value.slice(last) });
  return parts;
}

function transform(node: HastNode) {
  if (!node.children) return;
  if (node.tagName && SKIP.has(node.tagName)) return;
  node.children = node.children.flatMap((child) => {
    if (child.type === "text") return splitText(child.value ?? "") ?? [child];
    transform(child);
    return [child];
  });
}

export function rehypeSmallCaps() {
  return (tree: HastNode, file: { path?: string }) => {
    // Decks use their own face, which has no small caps.
    if (file.path?.endsWith(".deck.mdx")) return;
    transform(tree);
  };
}
