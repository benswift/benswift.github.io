import { describe, expect, test } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  test("formats date in en-AU locale", () => {
    const date = new Date("2024-03-15T00:00:00Z");
    const result = formatDate(date);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/2024/);
  });
});
