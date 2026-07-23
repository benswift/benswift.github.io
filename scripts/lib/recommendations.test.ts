import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { diffRecommends, readRecommendations } from "./recommendations";

describe("readRecommendations", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "recommend-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns null when the config file does not exist", () => {
    expect(readRecommendations(path.join(tmpDir, "missing.json"))).toBeNull();
  });

  it("returns an empty list for an empty config", () => {
    const configPath = path.join(tmpDir, "recs.json");
    fs.writeFileSync(configPath, JSON.stringify({ documents: [] }));
    expect(readRecommendations(configPath)).toEqual([]);
  });

  it("deduplicates repeated entries", () => {
    const configPath = path.join(tmpDir, "recs.json");
    const uri = "at://did:plc:x/site.standard.document/post";
    fs.writeFileSync(configPath, JSON.stringify({ documents: [uri, uri] }));
    expect(readRecommendations(configPath)).toEqual([uri]);
  });

  it("rejects entries that are not AT-URIs", () => {
    const configPath = path.join(tmpDir, "recs.json");
    fs.writeFileSync(configPath, JSON.stringify({ documents: ["https://example.com/post"] }));
    expect(() => readRecommendations(configPath)).toThrow(/not an AT-URI/);
  });
});

describe("diffRecommends", () => {
  const docA = "at://did:plc:x/site.standard.document/a";
  const docB = "at://did:plc:x/site.standard.document/b";

  it("creates everything when nothing exists", () => {
    expect(diffRecommends([], [docA, docB])).toEqual({ toCreate: [docA, docB], toDelete: [] });
  });

  it("is a no-op when records already match", () => {
    const existing = [{ rkey: "r1", document: docA }];
    expect(diffRecommends(existing, [docA])).toEqual({ toCreate: [], toDelete: [] });
  });

  it("deletes retracted recommendations", () => {
    const existing = [
      { rkey: "r1", document: docA },
      { rkey: "r2", document: docB },
    ];
    expect(diffRecommends(existing, [docA])).toEqual({ toCreate: [], toDelete: ["r2"] });
  });

  it("deletes duplicate records for the same document", () => {
    const existing = [
      { rkey: "r1", document: docA },
      { rkey: "r2", document: docA },
    ];
    expect(diffRecommends(existing, [docA])).toEqual({ toCreate: [], toDelete: ["r2"] });
  });
});
