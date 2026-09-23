import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface ForCode {
  division: string;
  group: string;
  field: string;
  description: string;
}

/** Split one RFC 4180 CSV line: fields may be quoted, with "" as an escaped quote. */
export function parseCsvLine(line: string): string[] {
  return Array.from(
    line.matchAll(/(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g),
    ([, quoted, bare]) => quoted?.replaceAll('""', '"') ?? bare ?? "",
  );
}

export function parseForCodes(csv: string): ForCode[] {
  return csv
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => {
      const [division, group, field, description] = parseCsvLine(line);
      if (!division || !group || !/^\d{6}$/.test(field ?? "") || !description) {
        throw new Error(`malformed FoR code row: ${line}`);
      }
      return { division, group, field: field!, description };
    });
}

export function loadForCodes(): ForCode[] {
  return parseForCodes(
    readFileSync(resolve(process.cwd(), "_data/FoR-Codes-2020-processed.csv"), "utf8"),
  );
}
