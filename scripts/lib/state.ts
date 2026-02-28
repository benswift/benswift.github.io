import fs from "node:fs"

export interface AtprotoState {
  did: string
  publicationAtUri: string
  contentHashes: Record<string, string>
}

export function readState(statePath: string): AtprotoState | null {
  if (!fs.existsSync(statePath)) return null
  const raw = fs.readFileSync(statePath, "utf8")
  return JSON.parse(raw) as AtprotoState
}

export function writeState(statePath: string, state: AtprotoState): void {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n")
}
