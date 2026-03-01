import type { Root } from "mdast"
import type { Node } from "unist"
import { visit } from "unist-util-visit"

interface DirectiveNode extends Node {
  name: string
  data?: Record<string, unknown>
  children: DirectiveNode[]
}

export function remarkContainers() {
  return (tree: Root) => {
    visit(tree, (node: Node) => {
      if (node.type === "containerDirective") {
        const directive = node as DirectiveNode
        const type = directive.name

        if (type === "details") {
          const data = directive.data || (directive.data = {})
          const summary =
            directive.children[0]?.data?.directiveLabel
              ? directive.children.shift()
              : null

          data.hName = "details"
          data.hProperties = { class: `custom-block ${type}` }

          if (summary) {
            directive.children.unshift({
              type: "paragraph",
              data: { hName: "summary" },
              children: summary.children,
            } as DirectiveNode)
          }
        } else if (["tip", "info", "warning", "danger"].includes(type)) {
          const data = directive.data || (directive.data = {})
          data.hName = "div"
          data.hProperties = { class: `custom-block ${type}` }

          const titleNode = directive.children[0]?.data?.directiveLabel
            ? directive.children.shift()
            : null

          const title = titleNode
            ? titleNode.children
            : [{ type: "text", value: type.charAt(0).toUpperCase() + type.slice(1) }]

          directive.children.unshift({
            type: "paragraph",
            data: { hName: "p", hProperties: { class: "custom-block-title" } },
            children: title,
          } as DirectiveNode)
        }
      }
    })
  }
}
