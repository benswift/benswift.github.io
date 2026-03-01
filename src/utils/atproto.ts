import fs from "node:fs"
import path from "node:path"

interface AtprotoState {
  did: string
  publicationAtUri: string
  contentHashes: Record<string, string>
}

let cachedState: AtprotoState | null | undefined

export function loadAtprotoState(): AtprotoState | null {
  if (cachedState !== undefined) return cachedState
  const statePath = path.resolve(process.cwd(), "atproto-state.json")
  if (!fs.existsSync(statePath)) {
    cachedState = null
    return null
  }
  cachedState = JSON.parse(fs.readFileSync(statePath, "utf8")) as AtprotoState
  return cachedState
}

export function getAtUri(postPath: string): string | undefined {
  const state = loadAtprotoState()
  if (!state?.did) return undefined

  const match = postPath.match(/(\d{4})\/(\d{2})\/(\d{2})\/(.+?)$/)
  if (!match) return undefined

  const [, year, month, day, slug] = match
  const rkey = `${year}-${month}-${day}-${slug}`
  return `at://${state.did}/site.standard.document/${rkey}`
}
