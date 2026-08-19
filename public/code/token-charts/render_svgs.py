"""Render each .vl.json to the static SVG the blog post embeds.

Needs the Vega CLI on PATH (`npm i -g vega vega-lite vega-cli`), which is what
supplies vl2svg. The specs load their data by absolute URL, so the renderer is
pointed at public/ as its base.

The by-project chart gets one extra pass: every panel label naming a public
repository is wrapped in an SVG <a>, which works because the post inlines these
files rather than referencing them from an <img>.
"""

import html
import re
import subprocess
from pathlib import Path

from chart_style import REPOS, TARGET_WIDTH

HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parent.parent
OUT = PUBLIC.parent / "src/content/blog/2026/08/19"

CHARTS = ["daily-heatmap", "rise-and-fall", "by-project", "cumulative", "diurnal",
          "by-model", "where-the-tokens-go"]


def namespace_ids(svg: str, prefix: str) -> str:
    """Vega numbers its clip paths from 1 in every file it renders.

    Seven of these end up inlined in the one document, where duplicate ids
    silently cross-wire: a url(#clip1) reference resolves against whichever
    chart came first on the page, and its neighbour gets clipped by the wrong
    rectangle. Prefixing per chart keeps them apart.
    """
    return svg.replace('id="clip', f'id="{prefix}-clip').replace(
        "url(#clip", f"url(#{prefix}-clip")


def link_labels(svg: str) -> str:
    """Wrap the panel label of every public repo in an <a>."""
    for repo, url in REPOS.items():
        # the label carries the project's total, e.g. "dotfiles · 3.2B"
        pattern = re.compile(rf'(<text\b[^>]*>){re.escape(repo)}( · [\d.]+B)(</text>)')
        replacement = (
            f'<a href="{url}" target="_blank" rel="noopener" '
            f'aria-label="{html.escape(repo)} on GitHub" class="repo-link">'
            rf'\1{html.escape(repo)}\2\3</a>'
        )
        svg, n = pattern.subn(replacement, svg)
        if n != 1:
            raise SystemExit(f"expected one label for {repo}, found {n}")
    # Vega marks title text as pointer-events:none, which would swallow the clicks
    return svg.replace('class="mark-text role-title-text" role="graphics-symbol"',
                       'class="mark-text role-title-text" pointer-events="auto" '
                       'role="graphics-symbol"')


for name in CHARTS:
    dest = OUT / f"{name}.svg"
    subprocess.run(["vl2svg", "-b", str(PUBLIC), str(HERE / f"{name}.vl.json"), str(dest)],
                   check=True)
    svg = dest.read_text()
    width = int(re.search(r'width="(\d+)"', svg).group(1))
    if not TARGET_WIDTH - 6 <= width <= TARGET_WIDTH:
        print(f"  ! {name} rendered {width}px wide; re-tune PLOT_WIDTHS")
    svg = namespace_ids(svg, name)
    if name == "by-project":
        svg = link_labels(svg)
    dest.write_text(svg)
    print(f"wrote {dest.name} ({width}px)")
