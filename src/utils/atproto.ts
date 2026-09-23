import path from "node:path";
import { type AtprotoState, readState } from "../../scripts/lib/state";

let cachedState: AtprotoState | null | undefined;

export function loadAtprotoState(): AtprotoState | null {
  if (cachedState !== undefined) return cachedState;
  cachedState = readState(path.resolve(process.cwd(), "atproto-state.json"));
  return cachedState;
}

export function getPublicationAtUri(): string | undefined {
  return loadAtprotoState()?.publicationAtUri || undefined;
}

export function getAtUri(postPath: string): string | undefined {
  const state = loadAtprotoState();
  if (!state?.did) return undefined;

  const match = postPath.match(/(\d{4})\/(\d{2})\/(\d{2})\/(.+?)$/);
  if (!match) return undefined;

  const [, year, month, day, slug] = match;
  const rkey = `${year}-${month}-${day}-${slug}`;
  return `at://${state.did}/site.standard.document/${rkey}`;
}
