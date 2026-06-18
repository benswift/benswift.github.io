import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  atUri,
  buildDocumentRecord,
  buildNtroRecord,
  discoverGigs,
  DOCUMENT_NSID,
  type GigData,
  NTRO_NSID,
  type PutFn,
  publishGig,
  gigDocPath,
} from "./atproto-livecoding";

const sampleGig: GigData = {
  slug: "2024-05-31-iclc-24",
  title: "Coloring Code",
  date: "2024-05-31",
  description: "A from-scratch livecoded set.",
  textContent: "It was great to perform again.",
  contentHash: "hash1",
  doi: "10.5281/zenodo.123456",
  venue: "Shanghai Concert Hall",
  event: "ICLC 2024",
  instrument: "Extempore",
  forCodes: ["360405"],
};

describe("paths and uris", () => {
  it("builds the gig page path", () => {
    expect(gigDocPath("2024-05-31-iclc-24")).toBe("/livecoding/2024-05-31-iclc-24");
  });

  it("builds an at-uri", () => {
    expect(atUri("did:plc:abc", DOCUMENT_NSID, "rkey1")).toBe(
      "at://did:plc:abc/site.standard.document/rkey1",
    );
  });
});

describe("buildDocumentRecord", () => {
  it("emits a site.standard.document with page metadata", () => {
    const rec = buildDocumentRecord(sampleGig, "at://did:plc:abc/site.standard.publication/self");
    expect(rec.$type).toBe(DOCUMENT_NSID);
    expect(rec.path).toBe("/livecoding/2024-05-31-iclc-24");
    expect(rec.site).toBe("at://did:plc:abc/site.standard.publication/self");
    expect(rec.publishedAt).toBe("2024-05-31T00:00:00.000Z");
    expect(rec.tags).toContain("livecoding");
    expect(rec.tags).toContain("extempore");
    // The document lexicon has no place for a DOI — that's the companion's job.
    expect(rec).not.toHaveProperty("doi");
  });
});

describe("buildNtroRecord", () => {
  const docRef = { uri: "at://did:plc:abc/site.standard.document/2024-05-31-iclc-24", cid: "cid1" };

  it("holds the DOI and a strongRef to the document (AC #3)", () => {
    const rec = buildNtroRecord(
      sampleGig,
      docRef,
      "2026-06-18T00:00:00.000Z",
      "10.5281/zenodo.999",
    );
    expect(rec.$type).toBe(NTRO_NSID);
    expect(rec.document).toEqual(docRef);
    expect(rec.doi).toBe("10.5281/zenodo.123456");
    expect(rec.partOf).toBe("10.5281/zenodo.999");
    expect(rec.performedAt).toBe("2024-05-31T00:00:00.000Z");
    expect(rec.fieldsOfResearch).toEqual(["360405"]);
  });

  it("omits the DOI when the gig has none yet", () => {
    const rec = buildNtroRecord(
      { ...sampleGig, doi: undefined },
      docRef,
      "2026-06-18T00:00:00.000Z",
    );
    expect(rec).not.toHaveProperty("doi");
    expect(rec.document).toEqual(docRef);
  });
});

describe("publishGig", () => {
  it("puts the document first, then the NTRO strongRef-ing it", async () => {
    const calls: Array<{ collection: string; rkey: string; record: Record<string, unknown> }> = [];
    const put: PutFn = async (collection, rkey, record) => {
      calls.push({ collection, rkey, record });
      return { uri: atUri("did:plc:abc", collection, rkey), cid: `cid-${calls.length}` };
    };

    const result = await publishGig(
      put,
      sampleGig,
      "at://did:plc:abc/site.standard.publication/self",
      "2026-06-18T00:00:00.000Z",
    );

    expect(calls).toHaveLength(2);
    expect(calls[0].collection).toBe(DOCUMENT_NSID);
    expect(calls[1].collection).toBe(NTRO_NSID);
    // The NTRO's document strongRef points at the just-written document.
    expect(calls[1].record.document).toEqual(result.document);
    expect(result.document.cid).toBe("cid-1");
    // AC #4: the exposed DataCite relatedIdentifier is the document AT-URI.
    expect(result.dataciteRelatedIdentifier).toBe(result.document.uri);
    expect(result.dataciteRelatedIdentifier).toBe(
      "at://did:plc:abc/site.standard.document/2024-05-31-iclc-24",
    );
  });
});

describe("discoverGigs", () => {
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "gigs-test-"));
    fs.writeFileSync(
      path.join(dir, "2024-05-31-iclc-24.md"),
      '---\ntitle: "Coloring Code"\ndate: "2024-05-31"\ninstrument: "Extempore"\ndoi: "10.5281/zenodo.123"\n---\n\nThe **body** text.',
    );
    fs.writeFileSync(path.join(dir, "index.md"), "---\ntitle: index\n---\n");
  });
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it("parses gig frontmatter and body, skipping index.md", () => {
    const gigs = discoverGigs(dir);
    expect(gigs).toHaveLength(1);
    expect(gigs[0].slug).toBe("2024-05-31-iclc-24");
    expect(gigs[0].title).toBe("Coloring Code");
    expect(gigs[0].doi).toBe("10.5281/zenodo.123");
    expect(gigs[0].textContent).toBe("The body text.");
    expect(gigs[0].contentHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("honours the only filter", () => {
    expect(discoverGigs(dir, "iclc-24")).toHaveLength(1);
    expect(discoverGigs(dir, "nonexistent")).toHaveLength(0);
  });
});
