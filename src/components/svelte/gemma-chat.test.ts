import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

test("GemmaChat loads MediaPipe WASM from the same release as the installed JS", () => {
  const { version } = JSON.parse(
    readFileSync("node_modules/@mediapipe/tasks-genai/package.json", "utf8"),
  );
  const source = readFileSync("src/components/svelte/GemmaChat.svelte", "utf8");
  expect(source).toContain(`@mediapipe/tasks-genai@${version}/wasm`);
});
