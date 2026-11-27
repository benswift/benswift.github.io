// Types a TextImage out in reading order the first time it scrolls into
// view, so the picture develops line by line. The wall's pause toggle and
// reduced motion both leave it fully drawn.

const TYPE_MS = 6000;
const PAUSED_KEY = "wall-paused";

function readPaused(): boolean {
  try {
    return localStorage.getItem(PAUSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function mountTextImage(grid: HTMLElement) {
  const rows = [...grid.querySelectorAll<HTMLElement>(".text-image-row")];
  const cols = Number(getComputedStyle(grid).getPropertyValue("--cols"));
  const total = rows.length * cols;
  let frame: number | undefined;

  function finish() {
    if (frame !== undefined) cancelAnimationFrame(frame);
    grid.dataset.typed = "";
  }

  if (total === 0 || readPaused() || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finish();
    return;
  }

  function type() {
    grid.dataset.caret = "";
    let typed = 0;
    let doneRows = 0;
    let last = performance.now();
    const step = (now: number) => {
      // Uneven bursts read as typing; the cap stops a hidden tab catching up
      // all at once.
      const dt = Math.min(now - last, 50);
      last = now;
      typed = Math.min(total, typed + (dt / TYPE_MS) * total * (0.2 + Math.random() * 1.6));
      const row = Math.floor(typed / cols);
      const col = Math.floor(typed % cols);
      for (; doneRows < Math.min(row, rows.length); doneRows++) {
        rows[doneRows].dataset.done = "";
      }
      if (row < rows.length) rows[row].style.setProperty("--typed", String(col));
      grid.style.setProperty("--caret-row", String(Math.min(row, rows.length - 1)));
      grid.style.setProperty("--caret-col", String(row < rows.length ? col : cols));
      if (typed < total) frame = requestAnimationFrame(step);
      else finish();
    };
    frame = requestAnimationFrame(step);
  }

  // Pausing the wall mid-type finishes the picture instead.
  document.querySelector(".wall-toggle")?.addEventListener("click", finish);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      type();
    },
    { threshold: 0.25 },
  );
  observer.observe(grid);
}
