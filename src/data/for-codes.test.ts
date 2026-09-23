import { describe, expect, test } from "vitest";
import { loadForCodes, parseCsvLine, parseForCodes } from "./for-codes";

describe("parseCsvLine", () => {
  test("handles quoted fields containing commas and escaped quotes", () => {
    expect(parseCsvLine('"a, b",c,"say ""hi""",d')).toEqual(["a, b", "c", 'say "hi"', "d"]);
  });
});

describe("parseForCodes", () => {
  test("rejects malformed rows instead of dropping them", () => {
    expect(() => parseForCodes("header\nonly,two")).toThrow(/malformed/);
  });

  test("loads every row of the processed ANZSRC 2020 file", () => {
    const codes = loadForCodes();
    expect(codes).toHaveLength(1967);
    expect(codes).toContainEqual({
      division: "Agricultural, Veterinary and Food Sciences",
      group: "Agriculture, land and farm management",
      field: "300201",
      description: "Agricultural hydrology",
    });
  });
});
