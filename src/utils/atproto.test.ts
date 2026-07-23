import { describe, expect, it } from "vitest";
import { getAtUri, getPublicationAtUri } from "./atproto";

// These read the committed atproto-state.json at the repo root (vitest runs
// with cwd there), the same data the production build renders from.
describe("atproto build-time helpers", () => {
  it("derives a document AT-URI from a post path", () => {
    const uri = getAtUri(
      "/blog/2026/02/19/at-uris-as-persistent-identifiers-for-scholarly-blogging",
    );
    expect(uri).toMatch(
      /^at:\/\/did:[a-z0-9:]+\/site\.standard\.document\/2026-02-19-at-uris-as-persistent-identifiers-for-scholarly-blogging$/,
    );
  });

  it("exposes the publication AT-URI for the rel link tag", () => {
    const uri = getPublicationAtUri();
    expect(uri).toMatch(/^at:\/\/did:[a-z0-9:]+\/site\.standard\.publication\/self$/);
  });

  it("document and publication URIs share the same DID", () => {
    const doc = getAtUri(
      "/blog/2026/02/19/at-uris-as-persistent-identifiers-for-scholarly-blogging",
    );
    const pub = getPublicationAtUri();
    expect(doc?.split("/")[2]).toBe(pub?.split("/")[2]);
  });
});
