import { describe, expect, it } from "vitest";
import { compareNtro, type LocalNtro, type RemoteNtro } from "./ntro-check";

const local: LocalNtro = {
  key: "k",
  title: "T",
  authors: [{ name: "Ben Swift" }],
  year: 2025,
  doi: "10.5281/zenodo.1",
  license: "MIT",
  category: "A: B",
  designation: "Standard",
  for_codes: [{ code: "460208", weight: 100 }],
};
const remote: RemoteNtro = {
  ...local,
  authors: ["Ben Swift"],
  for_codes: [{ code: "460208", name: "NLP", weight: 100 }],
};

describe("compareNtro", () => {
  it("reports nothing when the records agree", () => {
    expect(compareNtro(local, remote)).toEqual([]);
  });

  it("reports each differing field", () => {
    const diffs = compareNtro(local, {
      ...remote,
      doi: "10.5281/zenodo.2",
      authors: ["Ben Swift", "Someone Else"],
      for_codes: [{ code: "460208", weight: 60 }],
    });
    expect(diffs.map((d) => d.split(":")[0])).toEqual(["doi", "authors", "for_codes"]);
  });
});
