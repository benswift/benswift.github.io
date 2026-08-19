"""Daily tokens for the projects that got the most of them, plus its chart spec.

Longest matching prefix wins, so ~/projects/comp4020/website is its own entry
rather than being absorbed into the comp4020 workspace directory. A None label
drops the path: those are the projects below the cut-off, plus the long tail of
one-off directories and worktrees.
"""

import json
import pickle
from collections import defaultdict
from datetime import date, timedelta

MAP = [
    # public GitHub repos, merged where one repo lives at two paths
    ("~/projects/slop-university-press", "slop-university"),
    ("~/projects/slop-university", "slop-university"),
    ("~/projects/llms-unplugged", "llms-unplugged"),
    ("~/.dotfiles", "dotfiles"),
    ("~/projects/extempore", "extempore"),
    ("~/Code/extempore", "extempore"),
    ("~/projects/benswift-me", "benswift.me"),
    ("~/projects/out-of-office-cv-website", "out-of-office-cv"),
    ("~/projects/out-of-office-cv-website-cron", "out-of-office-cv"),
    ("~/projects/slop-salon", "slop-salon"),
    ("~/Code/panic_tda", "panic-tda"),
    ("~/projects/aps-ai-transparency-tracker", "aps-ai-transparency-tracker"),
    ("~/Documents/edex/panic/panic", "panic"),
    # private or self-hosted, named anyway: the totals give nothing away
    ("~/projects/comp4020-agentic-coding-studio", "comp4020-agentic-coding-studio"),
    ("~/projects/blowing-smoke", "blowing-smoke"),
    ("~/projects/comp4020/website", "comp4020/website"),
    ("~/projects/astro-theme-anu", "astro-theme-anu"),
    ("~/projects/strproxy", "strproxy"),
    ("~/projects/comp4020", "comp4020 (workspace)"),
    # below the cut-off, and would otherwise be swallowed by the line above
    ("~/projects/comp4020/tutors", None),
    ("~/projects/comp4020/lucy", None),
    ("~/projects/comp4020/strproxy", None),
]
MAP.sort(key=lambda kv: -len(kv[0]))


def label_for(cwd: str) -> str | None:
    for prefix, label in MAP:
        if cwd == prefix or cwd.startswith(prefix + "/"):
            return label
    return None


rows = pickle.load(open("projects.pkl", "rb"))
daily: dict[tuple[str, str], int] = defaultdict(int)
totals: dict[str, int] = defaultdict(int)
grand = 0
days = set()
for day, cwd, tok, cost in rows:
    grand += tok
    days.add(day)
    label = label_for(cwd)
    if label:
        daily[(day, label)] += tok
        totals[label] += tok

order_keys = sorted(totals, key=lambda k: -totals[k])
covered = sum(totals.values())
print(f"{len(order_keys)} projects cover {covered/1e9:.1f}B of {grand/1e9:.1f}B ({covered/grand:.0%})")
for k in order_keys:
    print(f"  {totals[k]/1e9:6.2f}B  {k}")

start, end = date.fromisoformat(min(days)), date.fromisoformat(max(days))
all_days = [start + timedelta(days=n) for n in range((end - start).days + 1)]
order = [f"{k} · {totals[k]/1e9:.1f}B" for k in order_keys]
data = [{"date": d.isoformat(), "project": f"{k} · {totals[k]/1e9:.1f}B",
         "millions": round(daily.get((d.isoformat(), k), 0) / 1e6, 2)}
        for k in order_keys for d in all_days]
json.dump(data, open("by_project_daily.json", "w"), indent=0)

BG, INK, INK2, GRID, TOKENS = "#1c1a1d", "#e0e0e0", "#aaa", "#363338", "#be2edd"
FONT = "Helvetica Neue, Helvetica, Arial, sans-serif"
CONFIG = {
    "background": BG, "font": FONT,
    "axis": {"labelColor": INK2, "titleColor": INK2, "domainColor": GRID, "tickColor": GRID,
             "gridColor": GRID, "gridOpacity": 0.6, "labelFontSize": 12, "titleFontSize": 12,
             "titleFontWeight": "normal"},
    "title": {"color": INK, "fontSize": 15, "fontWeight": 600, "anchor": "start",
              "subtitleColor": INK2, "subtitleFontSize": 12, "subtitleLineHeight": 17},
    "header": {"labelColor": INK, "labelFontSize": 11, "labelFontWeight": 600, "titleColor": INK2},
    "view": {"stroke": None},
}

spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
    "config": CONFIG,
    "title": {"text": "Tokens by project",
              "subtitle": [
                  f"Tokens per day, 7-day rolling mean, for the {len(order_keys)} projects I spent the",
                  "most tokens on. Each panel is scaled to its own peak, with the total in the label;",
                  f"together they are {covered/grand:.0%} of all tokens.",
              ]},
    "data": {"values": data},
    "transform": [{"window": [{"op": "mean", "field": "millions", "as": "smooth"}],
                   "frame": [-3, 3], "groupby": ["project"], "sort": [{"field": "date"}]}],
    "facet": {"row": {"field": "project", "type": "nominal", "sort": order, "title": None,
                      "header": {"labelAngle": 0, "labelAlign": "left", "labelOrient": "left",
                                 "labelPadding": 6}}},
    "spacing": 3,
    "resolve": {"scale": {"y": "independent"}},
    "spec": {
        "width": 600, "height": 30,
        "mark": {"type": "area", "color": TOKENS, "opacity": 0.9, "interpolate": "monotone"},
        "encoding": {
            "x": {"field": "date", "type": "temporal",
                  "axis": {"title": None, "format": "%b %y", "labelAngle": 0, "grid": False,
                           "tickCount": {"interval": "month", "step": 2}}},
            "y": {"field": "smooth", "type": "quantitative",
                  "axis": {"title": None, "grid": False, "labels": False, "ticks": False,
                           "domain": False}},
            "tooltip": [{"field": "project", "type": "nominal"},
                        {"field": "date", "type": "temporal", "title": "day"},
                        {"field": "smooth", "type": "quantitative", "format": ",.0f",
                         "title": "million tokens/day"}],
        },
    },
}
json.dump(spec, open("by-project.vl.json", "w"), indent=2)
