import { makeStylist, phraseStyle, shuffled, tokenise, wallHtml } from "./wall";

const KEY_DELAY_MS = [55, 140] as const;
const PHRASE_PAUSE_MS = [500, 1600] as const;
const SCROLL_MS = 260;
const PAUSED_KEY = "wall-paused";

const between = ([min, max]: readonly [number, number]) => min + Math.random() * (max - min);

const top = (el: Element) => el.getBoundingClientRect().top;

function span(className: string): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = className;
  return el;
}

function readPaused(): boolean {
  try {
    return localStorage.getItem(PAUSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writePaused(paused: boolean) {
  try {
    if (paused) localStorage.setItem(PAUSED_KEY, "1");
    else localStorage.removeItem(PAUSED_KEY);
  } catch {
    // Storage is unavailable (private mode); the choice lasts for this page.
  }
}

/**
 * Carries on typing where the server-rendered wall stops: phrases arrive a
 * key at a time, and when the last line fills the wall scrolls up a line, as
 * a terminal does. Typing stops while the wall is off-screen, the tab is
 * hidden, the visitor prefers reduced motion or they've pressed the toggle.
 */
export function mountWall(wall: HTMLElement) {
  const inner = wall.querySelector<HTMLElement>(".wall-inner");
  const toggle = wall.querySelector<HTMLButtonElement>(".wall-toggle");
  const phrases: string[] = JSON.parse(wall.dataset.phrases ?? "[]");
  if (!inner || phrases.length === 0) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const pickStyle = makeStylist(Math.random);
  const caret = span("wall-caret");
  let queue: string[] = [];
  let paused = readPaused();
  let onScreen = false;
  let timer: number | undefined;

  const lineHeight = () => parseFloat(getComputedStyle(inner).lineHeight);
  const lineCount = () => Number(getComputedStyle(wall).getPropertyValue("--wall-lines")) || 1;
  const words = () => [...inner.querySelectorAll<HTMLElement>(".wall-word")];

  /** How many lines of words the wall holds beyond what it shows. */
  function overflow(): number {
    const all = words();
    if (all.length === 0) return 0;
    const used = Math.round((top(all.at(-1)!) - top(all[0])) / lineHeight()) + 1;
    return Math.max(0, used - lineCount());
  }

  function dropEmptyPhrases() {
    for (const phrase of inner!.querySelectorAll(".wall-phrase")) {
      if (!phrase.querySelector(".wall-word")) phrase.remove();
    }
  }

  // Removing whole lines from the top leaves every other line break in place.
  // Measure before removing anything: each removal moves the words after it.
  function dropTopLines(count: number) {
    const all = words();
    if (all.length === 0 || count <= 0) return;
    const cutoff = top(all[0]) + (count - 0.5) * lineHeight();
    for (const word of all.filter((w) => top(w) < cutoff)) word.remove();
    dropEmptyPhrases();
  }

  // The server renders more than any viewport shows; keep what fits, and drop
  // a final phrase that the wall's edge cuts short.
  function trimToFit() {
    const all = words();
    if (all.length === 0) return;
    const cutoff = top(all[0]) + (lineCount() - 0.5) * lineHeight();
    const hidden = all.filter((word) => top(word) > cutoff);
    const cut = new Set(hidden.map((word) => word.closest(".wall-phrase")));
    for (const word of hidden) word.remove();
    for (const phrase of cut) phrase?.remove();
    dropEmptyPhrases();
  }

  function nextPhrase(): string {
    if (queue.length === 0) queue = shuffled(phrases, Math.random);
    return queue.pop()!;
  }

  function* scrollUp(): Generator<number> {
    const extra = overflow();
    if (extra === 0) return;
    const scroll = inner!.animate(
      [{ translate: "0 0" }, { translate: `0 ${-extra * lineHeight()}px` }],
      { duration: SCROLL_MS, easing: "cubic-bezier(0.3, 0.7, 0.2, 1)", fill: "forwards" },
    );
    yield SCROLL_MS;
    dropTopLines(extra);
    scroll.cancel();
  }

  // Each yield is the wait in milliseconds before the next step.
  function* typist(): Generator<number> {
    for (;;) {
      const style = pickStyle();
      const phrase = span("wall-phrase");
      phrase.style.cssText = phraseStyle(style);
      inner!.append(" ", phrase);
      for (const token of [...tokenise(nextPhrase()), { text: style.glyph, space: true }]) {
        if (token.space) phrase.append(" ");
        const word = span("wall-word");
        const text = document.createTextNode("");
        word.append(text, caret);
        phrase.append(word);
        for (const char of token.text) {
          text.data += char;
          yield* scrollUp();
          yield between(KEY_DELAY_MS);
        }
      }
      yield between(PHRASE_PAUSE_MS);
    }
  }

  // `?wall-capture` (scripts/generate-hero-images.ts): the wall alone, full
  // and still, as a post's social card.
  if (new URLSearchParams(location.search).has("wall-capture")) {
    document.documentElement.dataset.wallCapture = "";
    for (let i = 0; i < 100 && overflow() === 0; i++) {
      const phrase = { tokens: tokenise(nextPhrase()), ...pickStyle() };
      inner.insertAdjacentHTML("beforeend", ` ${wallHtml([phrase])}`);
    }
    trimToFit();
    return;
  }

  const steps = typist();

  function step() {
    timer = window.setTimeout(step, steps.next().value);
  }

  function sync() {
    const run = onScreen && !paused && !document.hidden && !reducedMotion.matches;
    if (run && timer === undefined) {
      step();
    } else if (!run && timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
    wall.toggleAttribute("data-typing", run);
  }

  function showToggle() {
    if (!toggle) return;
    toggle.hidden = reducedMotion.matches;
    toggle.setAttribute("aria-pressed", String(paused));
  }

  trimToFit();
  showToggle();

  toggle?.addEventListener("click", () => {
    paused = !paused;
    writePaused(paused);
    showToggle();
    sync();
  });
  reducedMotion.addEventListener("change", () => {
    showToggle();
    sync();
  });
  document.addEventListener("visibilitychange", sync);
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    sync();
  }).observe(wall);
  // A narrower wall wraps onto more lines than it shows.
  new ResizeObserver(() => dropTopLines(overflow())).observe(wall);
}
