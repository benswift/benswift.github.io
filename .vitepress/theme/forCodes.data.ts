import { readFileSync } from "fs";
import { resolve } from "path";

interface ForCode {
  division: string;
  group: string;
  field: string;
  description: string;
}

export default {
  load(): ForCode[] {
    const csvPath = resolve(__dirname, "../../_data/FoR-Codes-2020-processed.csv");
    const csv = readFileSync(csvPath, "utf-8");
    const lines = csv.trim().split("\n");

    // Skip header
    const codes: ForCode[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Parse CSV properly handling quoted fields
      const match = line.match(/^"([^"]+)","?([^",]+)"?,(\d+),(.+)$/);
      if (match) {
        codes.push({
          division: match[1],
          group: match[2],
          field: match[3],
          description: match[4],
        });
      }
    }
    return codes;
  },
};

export type { ForCode };
