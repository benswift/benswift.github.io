import { describe, expect, test } from "vitest"
import { formatDate, parseDate, formatDateFromString } from "./date"

describe("formatDate", () => {
  test("formats date in en-AU locale", () => {
    const date = new Date("2024-03-15T00:00:00Z")
    const result = formatDate(date)
    expect(result).toMatch(/15/)
    expect(result).toMatch(/Mar/)
    expect(result).toMatch(/2024/)
  })

  test("formats date with short year", () => {
    const date = new Date("2024-03-15T00:00:00Z")
    const result = formatDate(date, true)
    expect(result).toMatch(/15/)
    expect(result).toMatch(/Mar/)
    expect(result).toMatch(/24/)
    expect(result).not.toMatch(/2024/)
  })
})

describe("parseDate", () => {
  test("parses ISO date string", () => {
    const result = parseDate("2024-03-15")
    expect(result).toBeInstanceOf(Date)
    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(2) // 0-indexed
    expect(result.getDate()).toBe(15)
  })
})

describe("formatDateFromString", () => {
  test("composes parse and format", () => {
    const result = formatDateFromString("2024-03-15")
    expect(result).toMatch(/15/)
    expect(result).toMatch(/Mar/)
    expect(result).toMatch(/2024/)
  })

  test("passes short year option through", () => {
    const result = formatDateFromString("2024-03-15", true)
    expect(result).not.toMatch(/2024/)
    expect(result).toMatch(/24/)
  })
})
