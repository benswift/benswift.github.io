import { describe, expect, test } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  test("formats as day, three-letter month, year", () => {
    expect(formatDate(new Date(2024, 2, 5))).toBe("5 Mar 2024");
  });

  test("abbreviates every month to three letters", () => {
    expect(formatDate(new Date(2026, 8, 18))).toBe("18 Sep 2026");
    expect(formatDate(new Date(2026, 5, 1))).toBe("1 Jun 2026");
    expect(formatDate(new Date(2026, 6, 24))).toBe("24 Jul 2026");
  });
});
