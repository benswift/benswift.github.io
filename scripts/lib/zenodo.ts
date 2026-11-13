// Helpers shared by the scripts that talk to Zenodo's legacy Deposit API
// (scripts/zenodo-deposit.ts, scripts/ntro-zenodo.ts).

import { ZENODO_USER_AGENT } from "./zenodo-community";

/** A non-2xx Zenodo response; the message carries the method, URL, status and body. */
export class ZenodoError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** A JSON request against the Zenodo API; throws a ZenodoError on a non-2xx status. */
export type ZenodoRequest = (method: string, url: string, body?: unknown) => Promise<any>;

/** A request function that authenticates with `token` (omitted when undefined). */
export function zenodoClient(token: string | undefined): ZenodoRequest {
  return async (method, url, body) => {
    const res = await fetch(url, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "User-Agent": ZENODO_USER_AGENT,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new ZenodoError(`Zenodo ${method} ${url} → ${res.status}: ${text}`, res.status);
    }
    return res.status === 204 ? null : res.json();
  };
}

/** "Ben Swift" → "Swift, Ben"; leaves already-comma'd or single-token names alone. */
export function familyFirst(name: string): string {
  if (name.includes(",")) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const family = parts.pop()!;
  return `${family}, ${parts.join(" ")}`;
}

/** The deposition/record id embedded in a Zenodo DOI like 10.xxxx/zenodo.<id>. */
export function depositionIdFromDoi(doi?: string): number | undefined {
  const m = doi?.match(/zenodo\.(\d+)$/);
  return m ? Number(m[1]) : undefined;
}

/** Insert or replace a frontmatter field directly after an anchor line. */
export function setFrontmatterField(
  raw: string,
  anchorKey: string,
  newKey: string,
  value: string,
): string {
  const line = `${newKey}: "${value}"`;
  const existing = new RegExp(`^${newKey}:.*$`, "m");
  if (existing.test(raw)) return raw.replace(existing, line);
  const anchor = new RegExp(`^(${anchorKey}:.*)$`, "m");
  if (anchor.test(raw)) return raw.replace(anchor, `$1\n${line}`);
  // no anchor — insert as the first line after the opening ---
  return raw.replace(/^---\n/, `---\n${line}\n`);
}
