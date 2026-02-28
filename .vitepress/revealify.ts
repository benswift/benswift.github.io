import type MarkdownIt from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";
import type StateCore from "markdown-it/lib/rules_core/state_core.mjs";

/**
 * Revealify markdown-it plugin
 *
 * Transforms markdown content into reveal.js slides by:
 * 1. Splitting on h1, h2, and hr elements to create new slides
 * 2. Wrapping content between splits in <section> tags
 * 3. Hoisting data-* attributes from headers to their parent section
 *
 * This replicates the Jekyll revealify.rb plugin behaviour.
 */

// State interface stored in env to avoid module-level mutable state
interface RevealifyState {
  inRevealPresentation: boolean;
  sectionOpen: boolean;
}

const REVEALIFY_STATE_KEY = "__revealify";

function getState(env: Record<string, unknown>): RevealifyState {
  if (!env[REVEALIFY_STATE_KEY]) {
    env[REVEALIFY_STATE_KEY] = {
      inRevealPresentation: false,
      sectionOpen: false,
    };
  }
  return env[REVEALIFY_STATE_KEY] as RevealifyState;
}

export function revealifyPlugin(md: MarkdownIt): void {
  // Store original rules
  const defaultHeadingOpen =
    md.renderer.rules.heading_open ||
    ((tokens, idx, options, _env, self) =>
      self.renderToken(tokens, idx, options));
  const defaultHr =
    md.renderer.rules.hr ||
    ((tokens, idx, options, _env, self) =>
      self.renderToken(tokens, idx, options));

  // Custom heading_open rule
  md.renderer.rules.heading_open = ((
    tokens,
    idx,
    options,
    env,
    self,
  ): string => {
    const state = getState(env as Record<string, unknown>);

    if (!state.inRevealPresentation) {
      return defaultHeadingOpen(tokens, idx, options, env, self);
    }

    const token = tokens[idx];
    const tag = token.tag;

    // Only h1 and h2 create new slides
    if (tag !== "h1" && tag !== "h2") {
      return defaultHeadingOpen(tokens, idx, options, env, self);
    }

    // Close previous section if open
    let result = "";
    if (state.sectionOpen) {
      result += "</section>\n";
    }

    // Extract any data attributes from the heading to hoist to section
    const attrs = token.attrs || [];
    const sectionAttrs: string[] = [];
    const headingAttrs: string[] = [];

    for (const [key, value] of attrs) {
      if (key.startsWith("data-") || key === "class" || key === "id") {
        sectionAttrs.push(`${key}="${value}"`);
      } else {
        headingAttrs.push(`${key}="${value}"`);
      }
    }

    // Open new section
    const sectionAttrStr =
      sectionAttrs.length > 0 ? " " + sectionAttrs.join(" ") : "";
    result += `<section${sectionAttrStr}>\n`;
    state.sectionOpen = true;

    // Render the heading without hoisted attributes
    token.attrs = headingAttrs.map((attr) => {
      const [k, v] = attr.replaceAll('"', "").split("=");
      return [k, v] as [string, string];
    });

    result += defaultHeadingOpen(tokens, idx, options, env, self);
    return result;
  }) as RenderRule;

  // Custom hr rule - creates slide breaks without visible content
  md.renderer.rules.hr = ((tokens, idx, options, env, self): string => {
    const state = getState(env as Record<string, unknown>);

    if (!state.inRevealPresentation) {
      return defaultHr(tokens, idx, options, env, self);
    }

    const token = tokens[idx];

    // Close previous section if open
    let result = "";
    if (state.sectionOpen) {
      result += "</section>\n";
    }

    // Extract any attributes from the hr for the new section
    const attrs = token.attrs || [];
    const sectionAttrs: string[] = [];

    for (const [key, value] of attrs) {
      sectionAttrs.push(`${key}="${value}"`);
    }

    // Open new section (hr itself is not rendered)
    const sectionAttrStr =
      sectionAttrs.length > 0 ? " " + sectionAttrs.join(" ") : "";
    result += `<section${sectionAttrStr}>\n`;
    state.sectionOpen = true;

    return result;
  }) as RenderRule;

  // Add core rule to handle presentation wrapper
  md.core.ruler.push("revealify_wrapper", (stateCore: StateCore): boolean => {
    // Check if this is a reveal presentation via frontmatter
    const env = stateCore.env as Record<string, unknown>;
    const state = getState(env);
    const frontmatter = env.frontmatter as { layout?: string } | undefined;

    if (!frontmatter?.layout || frontmatter.layout !== "reveal") {
      state.inRevealPresentation = false;
      return true;
    }

    state.inRevealPresentation = true;
    state.sectionOpen = false;

    return true;
  });

  // Add rule to close final section
  const originalRender = md.render.bind(md);
  md.render = (src: string, env?: object): string => {
    const envRecord = (env || {}) as Record<string, unknown>;
    const result = originalRender(src, envRecord);
    const state = getState(envRecord);

    if (state.inRevealPresentation && state.sectionOpen) {
      // Reset state for next render
      state.sectionOpen = false;
      return result + "</section>\n";
    }

    return result;
  };
}
