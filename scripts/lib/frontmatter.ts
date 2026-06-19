import { parse as parseYaml } from "yaml";

/** Parsed front matter: the YAML `data` object and the markdown `content` after the closing fence. */
export interface ParsedFrontmatter<T> {
  data: T;
  content: string;
}

const BOM = 0xfeff;
// An opening `---` fence on the first line, and a closing `---` on its own line
// (tolerating CRLF endings and trailing spaces, or end of file).
const OPEN = /^---\r?\n/;
const CLOSE = /(^|\r?\n)---[ \t]*(\r?\n|$)/;

/**
 * Parse YAML front matter delimited by `---` fences, returning the parsed
 * `data` and the markdown `content` that follows the closing fence. A focused
 * replacement for the slice of `gray-matter` this repo relied on (`.data` /
 * `.content`), backed by the maintained `yaml` package rather than js-yaml 3.x
 * --- verified to match gray-matter's output across every content file in the
 * site.
 *
 * Input without an opening fence (or with an opening fence but no matching
 * close) is returned verbatim as `content` with empty `data`, matching
 * gray-matter. A leading byte-order mark is stripped either way.
 */
export function parseFrontmatter<T = Record<string, unknown>>(raw: string): ParsedFrontmatter<T> {
  const s = raw.charCodeAt(0) === BOM ? raw.slice(1) : raw;
  const open = OPEN.exec(s);
  const rest = open ? s.slice(open[0].length) : "";
  const close = open ? CLOSE.exec(rest) : null;

  // `yaml.parse` is typed `any`, so `?? {}` keeps `data` assignable to `T` --- it
  // also yields `{}` for the no-front-matter path (parsing an empty document).
  const data: T = parseYaml(close ? rest.slice(0, close.index) : "") ?? {};
  const content = close ? rest.slice(close.index + close[0].length) : s;
  return { data, content };
}
