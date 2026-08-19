"""Daily tokens for the top public GitHub repos, plus its Vega-Lite spec."""

import json
import pickle
from collections import defaultdict
from datetime import date, timedelta

# cwd prefix -> (label, github slug). Every one of these is a public repo;
# anything not listed here is aggregated away and never named.
PUBLIC = [
    ("~/projects/slop-university-press", "slop-university", "benswift/slop-university"),
    ("~/projects/slop-university", "slop-university", "benswift/slop-university"),
    ("~/projects/llms-unplugged", "llms-unplugged", "ANUcybernetics/llms-unplugged"),
    ("~/.dotfiles", "dotfiles", "benswift/.dotfiles"),
    ("~/projects/extempore", "extempore", "digego/extempore"),
    ("~/Code/extempore", "extempore", "digego/extempore"),
    ("~/projects/benswift-me", "benswift.me", "benswift/benswift.github.io"),
    ("~/projects/out-of-office-cv-website", "out-of-office-cv", "out-of-office-cv/out-of-office-cv-website"),
    ("~/projects/out-of-office-cv-website-cron", "out-of-office-cv", "out-of-office-cv/out-of-office-cv-website"),
    ("~/projects/slop-salon", "slop-salon", "ANUcybernetics/slop-salon"),
    ("~/Code/panic_tda", "panic-tda", "ANUcybernetics/panic-tda"),
    ("~/projects/aps-ai-transparency-tracker", "aps-ai-transparency-tracker",
     "ANUcybernetics/aps-ai-transparency-tracker"),
    ("~/Documents/edex/panic/panic", "panic", "ANUcybernetics/panic"),
    ("~/projects/imaginative-restoration", "imaginative-restoration",
     "ANUcybernetics/imaginative-restoration"),
    ("~/projects/neon-perceptron", "neon-perceptron", "ANUcybernetics/neon-perceptron"),
    ("~/projects/cyberneticstudio-xyz", "cyberneticstudio.xyz", "ANUcybernetics/cyberneticstudio.xyz"),
]
TOP_N = 10


def label_for(cwd: str) -> str | None:
    for prefix, label, _ in PUBLIC:
        if cwd == prefix or cwd.startswith(prefix + "/"):
            return label
    return None


rows = pickle.load(open("projects.pkl", "rb"))
daily = defaultdict(int)
totals = defaultdict(int)
grand = 0
days = set()
for day, cwd, tok, cost in rows:
    grand += tok
    days.add(day)
    label = label_for(cwd)
    if label:
        daily[(day, label)] += tok
        totals[label] += tok

top = sorted(totals, key=lambda k: -totals[k])[:TOP_N]
covered = sum(totals[k] for k in top)
print(f"top {TOP_N} public repos cover {covered/1e9:.1f}B of {grand/1e9:.1f}B ({covered/grand:.0%})")
for k in top:
    print(f"  {totals[k]/1e9:6.2f}B  {k}")

start, end = date.fromisoformat(min(days)), date.fromisoformat(max(days))
all_days = [start + timedelta(days=n) for n in range((end - start).days + 1)]
order = [f"{k} · {totals[k]/1e9:.1f}B" for k in top]
data = [{"date": d.isoformat(), "project": f"{k} · {totals[k]/1e9:.1f}B",
         "millions": round(daily.get((d.isoformat(), k), 0) / 1e6, 2)}
        for k in top for d in all_days]
json.dump(data, open("by_project_daily.json", "w"), indent=0)
json.dump(order, open("project_order.json", "w"))

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
                  f"Tokens per day, 7-day rolling mean, for the {TOP_N} public repositories I spent",
                  "the most tokens on. Each panel is scaled to its own peak, with the total in the label;",
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
        "width": 600, "height": 34,
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
print("wrote by-project.vl.json")
