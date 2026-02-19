export function generateCiteKey(year: string, slug: string): string {
  const camel = slug
    .split("-")
    .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join("")
  return `swift${year}${camel}`
}

export function generateBibtex(opts: {
  citeKey: string
  author: string
  title: string
  url: string
  year: string
  month: string
  atUri?: string
}): string {
  const lines = [
    `@online{${opts.citeKey},`,
    `  author = {${opts.author}},`,
    `  title = {${opts.title}},`,
    `  url = {${opts.url}},`,
    `  year = {${opts.year}},`,
    `  month = {${opts.month}},`,
  ]

  if (opts.atUri) {
    lines.push(`  note = {AT-URI: ${opts.atUri}},`)
  }

  lines.push("}")
  return lines.join("\n")
}
