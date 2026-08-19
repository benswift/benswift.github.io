"""Emit the three Vega-Lite specs for the token-usage post."""

import json

BG = "#1c1a1d"
INK = "#e0e0e0"
INK2 = "#aaa"
GRID = "#363338"
TOKENS = "#be2edd"   # brand purple: token counts
SPEND = "#d97706"    # amber: dollars
FONT = "Helvetica Neue, Helvetica, Arial, sans-serif"

CONFIG = {
    "background": BG,
    "font": FONT,
    "axis": {
        "labelColor": INK2, "titleColor": INK2, "domainColor": GRID,
        "tickColor": GRID, "gridColor": GRID, "gridOpacity": 0.6,
        "labelFontSize": 12, "titleFontSize": 12, "titleFontWeight": "normal",
    },
    "legend": {"labelColor": INK, "titleColor": INK2, "labelFontSize": 12, "symbolType": "square"},
    "title": {"color": INK, "fontSize": 15, "fontWeight": 600, "anchor": "start",
              "subtitleColor": INK2, "subtitleFontSize": 12},
    "header": {"labelColor": INK, "labelFontSize": 13, "labelFontWeight": 600, "titleColor": INK2},
    "view": {"stroke": None},
}

def spec(**kw):
    s = {"$schema": "https://vega.github.io/schema/vega-lite/v6.json", "config": CONFIG}
    s.update(kw)
    return s

monthly = json.load(open("monthly.json"))
by_model = json.load(open("by_model.json"))
cats = json.load(open("categories.json"))

# roll the monthly family split up to a single total per month
totals = {}
for r in monthly:
    totals[r["month"]] = totals.get(r["month"], 0) + r["tokens"]
MONTH_LABEL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

def label(month: str) -> str:
    y, m, _ = month.split("-")
    return f"{MONTH_LABEL[int(m) - 1]} {y[2:]}"

month_rows = [{"month": label(m), "billions": t / 1e9} for m, t in sorted(totals.items())]
month_order = [r["month"] for r in month_rows]
peak = max(month_rows, key=lambda r: r["billions"])

c1 = spec(
    title={"text": "Tokens per month", "subtitle":
           "All Claude Code sessions, July 2025 - August 2026. August 2026 is a partial month."},
    data={"values": month_rows},
    width=680, height=260,
    layer=[
        {"mark": {"type": "bar", "color": TOKENS, "cornerRadiusEnd": 4},
         "encoding": {"tooltip": [{"field": "month", "type": "nominal"},
                                  {"field": "billions", "type": "quantitative", "format": ".2f",
                                   "title": "billion tokens"}]}},
        {"transform": [{"filter": f"datum.month === '{peak['month']}'"}],
         "mark": {"type": "text", "dy": -9, "color": INK, "fontSize": 12, "fontWeight": 600},
         "encoding": {"text": {"field": "billions", "type": "quantitative", "format": ".1f"}}},
    ],
    encoding={
        "x": {"field": "month", "type": "nominal", "sort": month_order,
              "axis": {"title": None, "labelAngle": 0, "grid": False}},
        "y": {"field": "billions", "type": "quantitative",
              "axis": {"title": "billions of tokens", "format": ".0f"}},
    },
)

model_rows = []
for r in by_model:
    model_rows.append({"model": r["model"], "measure": "billions of tokens", "value": r["tokens"] / 1e9})
    model_rows.append({"model": r["model"], "measure": "indicative API cost (US$)", "value": r["cost"]})
order = [r["model"] for r in by_model]

c2 = spec(
    title={"text": "Tokens and indicative cost, by model",
           "subtitle": "Same ordering in both panels, with independent scales."},
    data={"values": model_rows},
    facet={"column": {"field": "measure", "type": "nominal", "title": None,
                      "sort": ["billions of tokens", "indicative API cost (US$)"]}},
    resolve={"scale": {"x": "independent"}},
    spec={
        "width": 260, "height": 320,
        "mark": {"type": "bar", "cornerRadiusEnd": 4, "height": {"band": 0.7}},
        "encoding": {
            "y": {"field": "model", "type": "nominal", "sort": order,
                  "axis": {"title": None, "grid": False}},
            "x": {"field": "value", "type": "quantitative", "axis": {"title": None, "format": "~s"}},
            "color": {"field": "measure", "type": "nominal", "legend": None,
                      "scale": {"domain": ["billions of tokens", "indicative API cost (US$)"],
                                "range": [TOKENS, SPEND]}},
            "tooltip": [{"field": "model", "type": "nominal"},
                        {"field": "value", "type": "quantitative", "format": ",.1f"}],
        },
    },
)

c3 = spec(
    title={"text": "Where the tokens go, and where the money goes",
           "subtitle": "Share of the 55.1B tokens against share of the indicative US$50k."},
    data={"values": cats},
    width=560, height=230,
    mark={"type": "bar", "cornerRadiusEnd": 4},
    encoding={
        "y": {"field": "category", "type": "nominal",
              "sort": ["cache read", "cache write (1h)", "cache write (5m)", "output", "fresh input"],
              "axis": {"title": None, "grid": False}},
        "yOffset": {"field": "measure", "sort": ["share of tokens", "share of spend"]},
        "x": {"field": "share", "type": "quantitative",
              "axis": {"title": None, "format": ".0%"}, "scale": {"domain": [0, 1]}},
        "color": {"field": "measure", "type": "nominal",
                  "scale": {"domain": ["share of tokens", "share of spend"], "range": [TOKENS, SPEND]},
                  "legend": {"title": None, "orient": "top", "direction": "horizontal"}},
        "tooltip": [{"field": "category", "type": "nominal"},
                    {"field": "measure", "type": "nominal"},
                    {"field": "share", "type": "quantitative", "format": ".2%"}],
    },
)

for name, s in (("tokens-per-month", c1), ("by-model", c2), ("where-the-tokens-go", c3)):
    json.dump(s, open(f"{name}.vl.json", "w"), indent=2)
    print("wrote", name)
