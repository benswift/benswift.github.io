// Rehype plugin: put a copy of each footnote straight after its reference, as
// a `.sidenote` span that global.css floats into the right-hand margin on a
// wide screen and hides otherwise. The footnote list at the end of the page
// stays as it is, so the copy is decoration: hidden from assistive technology,
// its links out of the tab order.

export interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  children?: HastNode[];
  properties?: Record<string, unknown>;
}

const isElement = (node: HastNode, tagName: string) =>
  node.type === "element" && node.tagName === tagName;

const isBlank = (node: HastNode) => node.type === "text" && !node.value?.trim();

// Boolean attributes arrive as `true` or as an empty string.
const has = (node: HastNode, property: string) => node.properties?.[property] !== undefined;

function footnoteRef(node: HastNode): HastNode | undefined {
  if (!isElement(node, "sup")) return undefined;
  return node.children?.find((child) => isElement(child, "a") && has(child, "dataFootnoteRef"));
}

// Copies lose their ids (the originals keep them), the "back to reference"
// arrow, and their place in the tab order.
function decorative(node: HastNode): HastNode[] {
  if (isElement(node, "a") && has(node, "dataFootnoteBackref")) return [];
  const { id: _id, ...properties } = node.properties ?? {};
  if (isElement(node, "a")) properties.tabIndex = -1;
  return [
    {
      ...node,
      ...(node.properties ? { properties } : {}),
      ...(node.children ? { children: node.children.flatMap(decorative) } : {}),
    },
  ];
}

/**
 * A footnote's content as phrasing content, or undefined when it holds
 * anything but paragraphs (a list or code block can't sit inside the
 * paragraph that refers to it).
 */
function inlineContent(definition: HastNode): HastNode[] | undefined {
  const blocks = (definition.children ?? []).filter((child) => !isBlank(child));
  if (blocks.length === 0 || !blocks.every((block) => isElement(block, "p"))) return undefined;
  return blocks.flatMap((block, i) => [
    ...(i > 0
      ? [{ type: "element", tagName: "span", properties: { className: ["sidenote-gap"] } }]
      : []),
    ...(block.children ?? []).flatMap(decorative),
  ]);
}

function collectDefinitions(node: HastNode, found: Map<string, HastNode>) {
  const id = node.properties?.id;
  if (isElement(node, "li") && typeof id === "string" && id.includes("fn-")) found.set(id, node);
  for (const child of node.children ?? []) collectDefinitions(child, found);
}

function addSidenotes(node: HastNode, definitions: Map<string, HastNode>) {
  // Not inside the footnote list itself, nor a table, whose cells would
  // clip a float.
  if (!node.children || has(node, "dataFootnotes") || isElement(node, "table")) return;
  node.children = node.children.flatMap((child) => {
    addSidenotes(child, definitions);
    const ref = footnoteRef(child);
    const href = ref?.properties?.href;
    const target = typeof href === "string" ? definitions.get(href.replace(/^#/, "")) : undefined;
    const content = target && inlineContent(target);
    if (!ref || !content) return [child];
    const sidenote: HastNode = {
      type: "element",
      tagName: "span",
      // Pagefind would otherwise index every note twice.
      properties: { className: ["sidenote"], ariaHidden: "true", dataPagefindIgnore: "" },
      children: [
        { type: "element", tagName: "sup", properties: {}, children: ref.children ?? [] },
        ...content,
      ],
    };
    return [child, sidenote];
  });
}

export function rehypeSidenotes() {
  return (tree: HastNode) => {
    const definitions = new Map<string, HastNode>();
    collectDefinitions(tree, definitions);
    if (definitions.size > 0) addSidenotes(tree, definitions);
  };
}
