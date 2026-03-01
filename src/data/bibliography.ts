import fs from "node:fs"
import path from "node:path"
import bibtexParse from "bibtex-parse"

interface BibTeXEntry {
  key: string
  type: string
  [field: string]: string | undefined
}

export interface Publication {
  key: string
  type: string
  title: string
  authors: string
  year: string
  venue?: string
  doi?: string
  url?: string
  abstract?: string
  pdfPath?: string
}

function getField(entry: BibTeXEntry, field: string): string | undefined {
  return (entry[field.toUpperCase()] as string | undefined) ??
    (entry[field.toLowerCase()] as string | undefined)
}

export function loadPublications(): Publication[] {
  const bibFile = path.resolve(process.cwd(), "_data/ben-pubs.bib")
  if (!fs.existsSync(bibFile)) return []

  const bibContent = fs.readFileSync(bibFile, "utf8")

  try {
    const entries = bibtexParse.entries(bibContent) as BibTeXEntry[]

    return entries
      .map((entry) => {
        const title = getField(entry, "title")
        const author = getField(entry, "author")
        const date = getField(entry, "date")
        const yearField = getField(entry, "year")
        const booktitle = getField(entry, "booktitle") ?? getField(entry, "eventtitle")
        const journal = getField(entry, "journal") ?? getField(entry, "journaltitle")
        const publisher = getField(entry, "publisher")
        const doi = getField(entry, "doi")
        const url = getField(entry, "url")
        const abstract = getField(entry, "abstract")
        const file = getField(entry, "file")

        let year = "Unknown"
        if (date) {
          const match = date.match(/^(\d{4})/)
          if (match) year = match[1]
        } else if (yearField) {
          year = String(yearField)
        }

        let venue = ""
        if (booktitle) venue = booktitle
        else if (journal) venue = journal
        else if (publisher) venue = publisher

        const pdfPath = file
          ? `/assets/documents/preprints/${path.basename(file.trim())}`
          : undefined

        return {
          key: entry.key,
          type: entry.type,
          title: title?.replaceAll(/[{}]/g, "") || "Untitled",
          authors: author?.replaceAll(/[{}]/g, "") || "Unknown",
          year,
          venue: venue?.replaceAll(/[{}]/g, ""),
          doi,
          url,
          abstract: abstract?.replaceAll(/[{}]/g, ""),
          pdfPath,
        }
      })
      .sort((a, b) => b.year.localeCompare(a.year))
  } catch (error) {
    console.error("Error parsing BibTeX:", error)
    return []
  }
}
