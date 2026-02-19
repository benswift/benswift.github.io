import fs from "fs"
import path from "path"
import { createHash } from "crypto"
import matter from "gray-matter"
import { extractDescription } from "../../.vitepress/utils/excerpt"

export interface PostData {
  title: string
  path: string
  date: string
  description: string
  tags: string[]
  content: string
  textContent: string
  contentHash: string
  filePath: string
}

export function pathToRkey(postPath: string): string {
  const match = postPath.match(/\/blog\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)/)
  if (!match) throw new Error(`Invalid post path: ${postPath}`)
  const [, year, month, day, slug] = match
  return `${year}-${month}-${day}-${slug}`
}

export function extractPostPath(relativePath: string): string {
  const withoutExt = relativePath.replace(/\.md$/, "")
  return `/${withoutExt}`
}

export function computeHash(content: string): string {
  return createHash("sha256").update(content).digest("hex")
}

export function discoverPosts(blogDir: string): PostData[] {
  const posts: PostData[] = []

  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return
    for (const item of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory() && item !== "tag") {
        scanDir(fullPath)
      } else if (item.endsWith(".md") && item !== "index.md") {
        const raw = fs.readFileSync(fullPath, "utf-8")
        const { data: fm, content } = matter(raw)

        if (fm.published === false) continue

        const relativePath = path.relative(path.resolve(blogDir, ".."), fullPath)
        const postPath = extractPostPath(relativePath)

        const dateMatch = postPath.match(/\/blog\/(\d{4})\/(\d{2})\/(\d{2})\//)
        if (!dateMatch) continue
        const [, year, month, day] = dateMatch
        const date = `${year}-${month}-${day}`

        let tags: string[] = []
        if (Array.isArray(fm.tags)) {
          tags = fm.tags.map(String)
        } else if (typeof fm.tags === "string") {
          tags = fm.tags.split(/\s+/).filter(Boolean)
        }

        const textContent = extractDescription(raw, 500)
        const description = fm.description || extractDescription(raw)

        posts.push({
          title: fm.title || item.replace(/\.md$/, ""),
          path: postPath,
          date,
          description,
          tags,
          content: raw,
          textContent,
          contentHash: computeHash(raw),
          filePath: fullPath,
        })
      }
    }
  }

  scanDir(blogDir)
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}
