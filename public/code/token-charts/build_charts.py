"""Vega-Lite specs for the daily-granularity charts."""

import json
import statistics

from chart_style import BG, CONFIG, EMPTY, PLOT_WIDTHS, RAMP, SPEND, TOKENS


def spec(**kw):
    s = {"$schema": "https://vega.github.io/schema/vega-lite/v6.json", "config": CONFIG}
    s.update(kw)
    return s


cal = json.load(open("calendar.json"))
cum = json.load(open("cumulative.json"))
per_model = json.load(open("per_model_daily.json"))
model_order = json.load(open("model_order.json"))
when = json.load(open("when.json"))

# --- 1. calendar heatmap -----------------------------------------------------
active = sorted(r["millions"] for r in cal if r["tokens"])
cuts = [round(statistics.quantiles(active, n=4)[i]) for i in range(3)]
print("heatmap thresholds (millions):", cuts)

BINS = [
    "none",
    f"under {cuts[0]}M",
    f"{cuts[0]}-{cuts[1]}M",
    f"{cuts[1]}-{cuts[2]}M",
    f"over {cuts[2]}M",
]

calendar = spec(
    title={
        "text": "Every day of agent use",
        "subtitle": "Tokens per day, 3 July 2025 to 19 August 2026. "
        "Unfilled cells are days with no session at all.",
    },
    data={"values": cal},
    transform=[
        {
            "calculate": f"datum.tokens === 0 ? '{BINS[0]}'"
            f" : datum.millions < {cuts[0]} ? '{BINS[1]}'"
            f" : datum.millions < {cuts[1]} ? '{BINS[2]}'"
            f" : datum.millions < {cuts[2]} ? '{BINS[3]}' : '{BINS[4]}'",
            "as": "bin",
        }
    ],
    width=PLOT_WIDTHS["daily-heatmap"],
    height=105,
    mark={"type": "rect", "cornerRadius": 2, "stroke": BG, "strokeWidth": 2},
    encoding={
        "x": {
            "field": "date",
            "type": "ordinal",
            "timeUnit": "yearweek",
            "axis": {
                "title": None,
                "labelAngle": 0,
                "grid": False,
                "domain": False,
                "ticks": False,
                "labelOverlap": False,
                "labelExpr": "date(datum.value) > 7 ? '' : month(datum.value) == 0"
                " ? timeFormat(datum.value, '%b %y') : timeFormat(datum.value, '%b')",
            },
        },
        "y": {
            "field": "date",
            "type": "ordinal",
            "timeUnit": "day",
            "axis": {
                "title": None,
                "grid": False,
                "domain": False,
                "ticks": False,
                "format": "%a",
                "labelExpr": "indexof([1,3,5], day(datum.value)) >= 0 ? timeFormat(datum.value, '%a') : ''",
            },
        },
        "color": {
            "field": "bin",
            "type": "nominal",
            "scale": {"domain": BINS, "range": [EMPTY] + RAMP},
            "legend": {
                "title": None,
                "orient": "bottom",
                "direction": "horizontal",
                "symbolType": "square",
                "symbolSize": 130,
                "columnPadding": 12,
            },
        },
        "tooltip": [
            {"field": "date", "type": "temporal", "title": "day"},
            {
                "field": "millions",
                "type": "quantitative",
                "title": "million tokens",
                "format": ",.0f",
            },
        ],
    },
)

# --- 2. small multiples: daily tokens per model ------------------------------
by_model_daily = spec(
    title={
        "text": "The rise and fall of each model",
        "subtitle": "Tokens per day, 7-day rolling mean. One panel per model, ordered by first use; "
        "all panels share the same scale.",
    },
    data={"values": per_model},
    transform=[
        {
            "window": [{"op": "mean", "field": "millions", "as": "smooth"}],
            "frame": [-3, 3],
            "groupby": ["model"],
            "sort": [{"field": "date"}],
        },
    ],
    facet={
        "row": {
            "field": "model",
            "type": "nominal",
            "sort": model_order,
            "title": None,
            "header": {
                "labelAngle": 0,
                "labelAlign": "left",
                "labelOrient": "left",
                "labelPadding": 6,
            },
        }
    },
    spec={
        "width": PLOT_WIDTHS["rise-and-fall"],
        "height": 36,
        "mark": {
            "type": "area",
            "color": TOKENS,
            "opacity": 0.9,
            "interpolate": "monotone",
            "line": False,
        },
        "encoding": {
            "x": {
                "field": "date",
                "type": "temporal",
                "axis": {
                    "title": None,
                    "format": "%b %y",
                    "labelAngle": 0,
                    "grid": False,
                    "tickCount": {"interval": "month", "step": 2},
                },
            },
            "y": {
                "field": "smooth",
                "type": "quantitative",
                "axis": {
                    "title": None,
                    "grid": False,
                    "labels": False,
                    "ticks": False,
                    "domain": False,
                },
            },
            "tooltip": [
                {"field": "model", "type": "nominal"},
                {"field": "date", "type": "temporal", "title": "day"},
                {
                    "field": "smooth",
                    "type": "quantitative",
                    "format": ",.0f",
                    "title": "million tokens/day",
                },
            ],
        },
    },
    resolve={"scale": {"y": "shared"}},
    spacing=3,
)

# --- 3. cumulative -----------------------------------------------------------
cum_rows = []
for r in cum:
    cum_rows.append(
        {"date": r["date"], "measure": "billions of tokens", "value": r["billions"]}
    )
    cum_rows.append(
        {
            "date": r["date"],
            "measure": "indicative API cost (US$)",
            "value": r["dollars"],
        }
    )

cumulative = spec(
    title={
        "text": "Cumulative since day zero",
        "subtitle": "The same 413 days, counted two ways. Separate panels, separate scales.",
    },
    data={"values": cum_rows},
    facet={
        "row": {
            "field": "measure",
            "type": "nominal",
            "sort": ["billions of tokens", "indicative API cost (US$)"],
            "title": None,
            "header": {
                "labelAngle": 0,
                "labelAlign": "left",
                "labelOrient": "top",
                "labelPadding": 2,
            },
        }
    },
    resolve={"scale": {"y": "independent"}},
    spec={
        "width": PLOT_WIDTHS["cumulative"],
        "height": 160,
        "mark": {"type": "area", "opacity": 0.85, "line": {"strokeWidth": 2}},
        "encoding": {
            "x": {
                "field": "date",
                "type": "temporal",
                "axis": {
                    "title": None,
                    "format": "%b %y",
                    "labelAngle": 0,
                    "grid": False,
                    "tickCount": {"interval": "month", "step": 2},
                },
            },
            "y": {
                "field": "value",
                "type": "quantitative",
                "axis": {"title": None, "format": "~s"},
            },
            "color": {
                "field": "measure",
                "type": "nominal",
                "legend": None,
                "scale": {
                    "domain": ["billions of tokens", "indicative API cost (US$)"],
                    "range": [TOKENS, SPEND],
                },
            },
            "tooltip": [
                {"field": "date", "type": "temporal", "title": "day"},
                {"field": "value", "type": "quantitative", "format": ",.0f"},
            ],
        },
    },
)

# --- 4. diurnal profile -------------------------------------------------------
diurnal = json.load(open("diurnal.json"))

when_chart = spec(
    title={
        "text": "The working day, as seen by the token meter",
        "subtitle": "Average tokens per hour of the day (Australia/Sydney), across 295 weekdays "
        "and 118 weekend days.",
    },
    data={"values": diurnal},
    width=PLOT_WIDTHS["diurnal"],
    height=250,
    layer=[
        {
            "mark": {
                "type": "line",
                "strokeWidth": 2,
                "interpolate": "monotone",
                "point": {"filled": True, "size": 45},
            },
            "encoding": {
                "tooltip": [
                    {"field": "kind", "type": "nominal", "title": None},
                    {"field": "hour", "type": "quantitative"},
                    {
                        "field": "millions",
                        "type": "quantitative",
                        "format": ",.1f",
                        "title": "million tokens/hour",
                    },
                ]
            },
        },
        {
            "transform": [
                {
                    "filter": "(datum.kind === 'Mon-Fri' && datum.hour === 17) || (datum.kind === 'Sat-Sun' && datum.hour === 21)"
                }
            ],
            "mark": {
                "type": "text",
                "align": "left",
                "dx": 9,
                "fontSize": 13,
                "fontWeight": 600,
            },
            "encoding": {"text": {"field": "kind", "type": "nominal"}},
        },
    ],
    encoding={
        "x": {
            "field": "hour",
            "type": "quantitative",
            "axis": {
                "title": None,
                "grid": False,
                "values": [0, 3, 6, 9, 12, 15, 18, 21],
                "labelExpr": "datum.value + ':00'",
            },
            "scale": {"domain": [0, 23], "nice": False},
        },
        "y": {
            "field": "millions",
            "type": "quantitative",
            "axis": {"title": "million tokens per hour"},
        },
        "color": {
            "field": "kind",
            "type": "nominal",
            "legend": None,
            "scale": {"domain": ["Mon-Fri", "Sat-Sun"], "range": [TOKENS, SPEND]},
        },
    },
)

for name, s in (
    ("daily-heatmap", calendar),
    ("rise-and-fall", by_model_daily),
    ("cumulative", cumulative),
    ("diurnal", when_chart),
):
    json.dump(s, open(f"{name}.vl.json", "w"), indent=2)
    print("wrote", name)
