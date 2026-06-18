// The umbrella DOI for Ben Swift's live-coding body of work + its Zenodo
// Community. PLACEHOLDER until `pnpm zenodo:collection --prod --publish` mints
// the production DOI and overwrites this file (TASK-23.09). The UI treats a
// null value as "not minted yet" and simply hides the citation block.

export interface LivecodingCollection {
  doi: string;
  conceptDoi: string;
  doiUrl: string;
  community: { slug: string; url: string };
}

export const livecodingCollection: LivecodingCollection | null = null;
