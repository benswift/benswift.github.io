#!/usr/bin/env pnpm exec tsx

import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

interface Artist {
  name: string
  role: string
}

interface Frontmatter {
  title: string
  date?: string
  venue?: string
  type?: string
  event?: string
  event_url?: string
  video_url?: string
  artists?: Artist[]
  description?: string
}

function main() {
  const livecodingDir = path.resolve(process.cwd(), "livecoding")
  const files = fs
    .readdirSync(livecodingDir)
    .filter((f) => f.endsWith(".md") && f !== "index.md")
    .sort()

  const entries: string[] = []

  for (const file of files) {
    const content = fs.readFileSync(path.join(livecodingDir, file), "utf8")
    const { data } = matter(content) as { data: Frontmatter }

    const dateStr = file.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? data.date ?? ""
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(5, 7)
    const day = dateStr.slice(8, 10)

    const lines: string[] = []
    lines.push("TY  - ART")
    lines.push(`TI  - ${data.title}`)
    lines.push("AU  - Swift, Ben")
    if (data.artists) {
      for (const a of data.artists) {
        const parts = a.name.split(" ")
        const last = parts.pop()
        const first = parts.join(" ")
        lines.push(`AU  - ${last}, ${first}`)
      }
    }
    lines.push(`PY  - ${year}/${month}/${day}/`)
    if (data.event) lines.push(`T2  - ${data.event}`)
    if (data.venue) lines.push(`CY  - ${data.venue}`)
    if (data.description) lines.push(`AB  - ${data.description}`)
    lines.push("N2  - Livecoded music performance")
    lines.push("M3  - Live performance")
    const notes = [`${data.type ?? "curated"} performance`]
    if (data.video_url) notes.push(`video: ${data.video_url}`)
    lines.push(`N1  - ${notes.join(" | ")}`)
    if (data.event_url) lines.push(`UR  - ${data.event_url}`)
    lines.push(`KW  - livecoding`)
    lines.push(`KW  - performance`)
    lines.push("ER  - ")

    entries.push(lines.join("\n"))
  }

  const output = entries.join("\n") + "\n"
  const outPath = path.resolve(process.cwd(), "_data", "performances.ris")
  fs.writeFileSync(outPath, output)
  console.log(`Wrote ${files.length} entries to ${outPath}`)
}

main()
