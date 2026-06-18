import fs from "node:fs";
import path from "node:path";

// Operational state for the collection-level (umbrella) Zenodo record, kept
// per target. Filename matches the gitignored `scripts/.zenodo-state-*.json`
// glob, so the sandbox and prod collection records never get committed (the
// committed, site-facing value lives in src/data/livecoding-collection.ts,
// written only on a production publish).

export type Target = "sandbox" | "prod";

export interface CollectionState {
  /** Zenodo Community slug the umbrella + every gig is filed under. */
  communitySlug?: string;
  /** InvenioRDM community UUID, once the community is known to exist. */
  communityId?: string;
  /** Legacy Deposit API deposition id for the umbrella record. */
  depositionId?: number;
  /** Reserved (pre-publish) or published version DOI for the umbrella. */
  doi?: string;
  /** Concept DOI — stable across versions; what citations should target. */
  conceptDoi?: string;
  /** Upload bucket for the umbrella deposition. */
  bucket?: string;
  /** True once the umbrella record has been published. */
  published?: boolean;
  /** Gig DOIs currently linked from the umbrella via hasPart. */
  hasParts?: string[];
}

export function collectionStatePath(target: Target): string {
  return path.resolve(process.cwd(), `scripts/.zenodo-state-collection-${target}.json`);
}

export function loadCollectionState(target: Target): CollectionState {
  const p = collectionStatePath(target);
  return fs.existsSync(p) ? (JSON.parse(fs.readFileSync(p, "utf8")) as CollectionState) : {};
}

export function saveCollectionState(target: Target, state: CollectionState): void {
  fs.writeFileSync(collectionStatePath(target), JSON.stringify(state, null, 2) + "\n");
}

/**
 * The reserved/published umbrella DOI for this target, if one exists yet. The
 * per-gig deposit script reads this so every gig record links back to the
 * collection via `isPartOf` at deposit time.
 */
export function loadCollectionDoi(target: Target): string | undefined {
  return loadCollectionState(target).doi;
}
