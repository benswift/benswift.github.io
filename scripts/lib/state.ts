import fs from "node:fs";
import { z } from "astro/zod";

const atprotoStateSchema = z.object({
  did: z.string(),
  publicationAtUri: z.string(),
  contentHashes: z.record(z.string(), z.string()),
});

export interface AtprotoState {
  did: string;
  publicationAtUri: string;
  contentHashes: Record<string, string>;
}

export function readState(statePath: string): AtprotoState | null {
  if (!fs.existsSync(statePath)) return null;
  const raw = fs.readFileSync(statePath, "utf8");
  const parsed = atprotoStateSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error(`malformed ATProto state file ${statePath}: ${parsed.error.message}`);
  }
  return parsed.data;
}

export function writeState(statePath: string, state: AtprotoState): void {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");
}
