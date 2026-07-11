import fs from "node:fs";
import type { RecommendEntry } from "./atproto";

/**
 * Curated list of site.standard.document AT-URIs this publication endorses.
 * Readers and aggregators use recommend records as social signals for
 * surfacing well-regarded content, so entries should be posts (anyone's,
 * not ours) worth vouching for.
 *
 * The config file is hand-authored; the publish pipeline diffs it against the
 * site.standard.graph.recommend records already in the repo and creates or
 * deletes records to match, so removing a line retracts the recommendation.
 */
export interface RecommendationsConfig {
  documents: string[];
}

/** Returns the recommended document AT-URIs, or null when no config file exists. */
export function readRecommendations(configPath: string): string[] | null {
  if (!fs.existsSync(configPath)) return null;
  const parsed = JSON.parse(fs.readFileSync(configPath, "utf8")) as Partial<RecommendationsConfig>;
  const documents = parsed.documents ?? [];
  for (const uri of documents) {
    if (!uri.startsWith("at://")) {
      throw new Error(`Recommendation is not an AT-URI: ${uri}`);
    }
  }
  return [...new Set(documents)];
}

export interface RecommendDiff {
  /** Document AT-URIs that need a new recommend record. */
  toCreate: string[];
  /** Rkeys of recommend records to delete (retracted or duplicate). */
  toDelete: string[];
}

export function diffRecommends(existing: RecommendEntry[], desired: string[]): RecommendDiff {
  const desiredSet = new Set(desired);
  const kept = new Set<string>();
  const toDelete: string[] = [];

  for (const entry of existing) {
    if (desiredSet.has(entry.document) && !kept.has(entry.document)) {
      kept.add(entry.document);
    } else {
      toDelete.push(entry.rkey);
    }
  }

  const toCreate = desired.filter((uri) => !kept.has(uri));
  return { toCreate, toDelete };
}
