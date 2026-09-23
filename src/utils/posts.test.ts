import { describe, expect, test } from "vitest";
import { postPath } from "./posts";

describe("postPath", () => {
  test("derives date, slug and url from a dated id", () => {
    expect(postPath("2024/08/12/some-post")).toEqual({
      date: "2024-08-12",
      slug: "some-post",
      url: "/blog/2024/08/12/some-post/",
    });
  });

  test("rejects ids outside the YYYY/MM/DD scheme", () => {
    expect(() => postPath("drafts/some-post")).toThrow(/YYYY\/MM\/DD/);
  });
});
