import { describe, it, expect } from "vitest";
import { resolveHeroImage } from "./hero-image";

const fakeImage = { src: "/fake.png", width: 100, height: 100, format: "png" } as never;
const fakeDefault = { src: "/default.png", width: 100, height: 100, format: "png" } as never;

describe("resolveHeroImage", () => {
  it("returns the matching image when present", () => {
    const map = { "/src/assets/heroes/2026-04-28-foo.png": fakeImage };
    expect(resolveHeroImage("2026-04-28-foo", map, fakeDefault)).toBe(fakeImage);
  });

  it("returns the default when slug is missing from map", () => {
    expect(resolveHeroImage("2026-04-28-missing", {}, fakeDefault)).toBe(fakeDefault);
  });

  it("returns the default for an empty slug", () => {
    expect(resolveHeroImage("", { "/src/assets/heroes/x.png": fakeImage }, fakeDefault)).toBe(
      fakeDefault,
    );
  });
});
