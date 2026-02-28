import { describe, it, expect, beforeEach, afterEach } from "vitest"
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { readState, writeState, type AtprotoState } from "./state"

describe("state", () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "state-test-"))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  const sampleState: AtprotoState = {
    did: "did:plc:abc123",
    publicationAtUri: "at://did:plc:abc123/site.standard.publication/self",
    contentHashes: {
      "/blog/2026/02/18/test": "abc123def456",
    },
  }

  it("returns null for missing file", () => {
    expect(readState(path.join(tmpDir, "missing.json"))).toBeNull()
  })

  it("round-trips state correctly", () => {
    const filePath = path.join(tmpDir, "state.json")
    writeState(filePath, sampleState)
    const loaded = readState(filePath)
    expect(loaded).toEqual(sampleState)
  })

  it("writes valid JSON with trailing newline", () => {
    const filePath = path.join(tmpDir, "state.json")
    writeState(filePath, sampleState)
    const raw = fs.readFileSync(filePath, "utf8")
    expect(raw.endsWith("\n")).toBe(true)
    expect(() => JSON.parse(raw)).not.toThrow()
  })
})
