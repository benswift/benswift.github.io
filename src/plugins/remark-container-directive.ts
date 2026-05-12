import remarkDirective from "remark-directive";

/**
 * Wraps `remark-directive` so only `:::name` container directives are
 * recognised. Drops text directives (`:N`) and leaf directives (`::N`)
 * from the micromark extension, which keeps `:::tip` callouts working
 * without consuming unrelated colons like `right:40%` in image alts or
 * `11:05` in table cells.
 */
export function remarkContainerDirective(this: unknown): void {
  remarkDirective.call(this as never);

  const data = (this as { data: () => Record<string, unknown> }).data();
  const exts = data.micromarkExtensions as
    | Array<{ text?: Record<number, unknown>; flow?: Record<number, unknown[]> }>
    | undefined;
  const ext = exts?.[exts.length - 1];
  if (!ext) return;

  // Charcode 58 is ':'. directive()'s extension binds the text construct
  // (directiveText) on `text` and an array of [directiveContainer, directiveLeaf]
  // on `flow`. Drop text entirely; keep only the first flow construct.
  if (ext.text) delete ext.text[58];
  if (ext.flow && Array.isArray(ext.flow[58])) {
    ext.flow[58] = [ext.flow[58][0]];
  }
}
