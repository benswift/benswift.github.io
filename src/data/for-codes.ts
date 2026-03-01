import { readFileSync } from "node:fs"
import { resolve } from "node:path"

export interface ForCode {
  division: string
  group: string
  field: string
  description: string
}

export function loadForCodes(): ForCode[] {
  const csvPath = resolve(process.cwd(), "_data/FoR-Codes-2020-processed.csv")
  const csv = readFileSync(csvPath, "utf8")
  const lines = csv.trim().split("\n")

  const codes: ForCode[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^"([^"]+)","?([^",]+)"?,(\d+),(.+)$/)
    if (match) {
      codes.push({
        division: match[1],
        group: match[2],
        field: match[3],
        description: match[4],
      })
    }
  }
  return codes
}
