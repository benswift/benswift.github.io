"""Datasets for the daily-granularity charts."""

import json
import pickle
from collections import defaultdict
from datetime import date, timedelta

PRICES = {
    "claude-fable-5": (10, 50),
    "claude-opus-5": (5, 25),
    "claude-opus-4-8": (5, 25),
    "claude-opus-4-7": (5, 25),
    "claude-opus-4-6": (5, 25),
    "claude-opus-4-5-20251101": (5, 25),
    "claude-opus-4-1-20250805": (15, 75),
    "claude-opus-4-20250514": (15, 75),
    "claude-sonnet-5": (2, 10),
    "claude-sonnet-4-6": (3, 15),
    "claude-sonnet-4-5-20250929": (3, 15),
    "claude-sonnet-4-20250514": (3, 15),
    "claude-haiku-4-5-20251001": (1, 5),
}
LABEL = {
    "claude-opus-4-20250514": "Opus 4",
    "claude-sonnet-4-20250514": "Sonnet 4",
    "claude-opus-4-1-20250805": "Opus 4.1",
    "claude-sonnet-4-5-20250929": "Sonnet 4.5",
    "claude-haiku-4-5-20251001": "Haiku 4.5",
    "claude-opus-4-5-20251101": "Opus 4.5",
    "claude-opus-4-6": "Opus 4.6",
    "claude-sonnet-4-6": "Sonnet 4.6",
    "claude-opus-4-7": "Opus 4.7",
    "claude-opus-4-8": "Opus 4.8",
    "claude-sonnet-5": "Sonnet 5",
    "claude-opus-5": "Opus 5",
    "claude-fable-5": "Fable 5",
}
W5, W1, RD, M = 1.25, 2.0, 0.1, 1_000_000

rows = pickle.load(open("daily.pkl", "rb"))

daily = defaultdict(lambda: [0, 0.0])  # day -> [tokens, cost]
daily_model = defaultdict(lambda: [0, 0.0])  # (day, model) -> [tokens, cost]
when = defaultdict(int)  # (weekday, hour) -> tokens
first_seen, last_seen = {}, {}

for day, hour, wd, model, i, o, rd, w5, w1 in rows:
    if model not in PRICES:
        continue
    pin, pout = PRICES[model]
    cost = (i * pin + w5 * pin * W5 + w1 * pin * W1 + rd * pin * RD + o * pout) / M
    tok = i + o + rd + w5 + w1
    daily[day][0] += tok
    daily[day][1] += cost
    daily_model[(day, LABEL[model])][0] += tok
    daily_model[(day, LABEL[model])][1] += cost
    when[(wd, hour)] += tok
    label = LABEL[model]
    first_seen[label] = min(first_seen.get(label, day), day)
    last_seen[label] = max(last_seen.get(label, day), day)

start = date.fromisoformat(min(daily))
end = date.fromisoformat(max(daily))
all_days = [start + timedelta(days=n) for n in range((end - start).days + 1)]

# --- calendar heatmap: every day in range, zero-filled
cal = []
for d in all_days:
    key = d.isoformat()
    tok = daily.get(key, [0, 0.0])[0]
    week_start = d - timedelta(days=d.weekday())
    cal.append(
        {
            "date": key,
            "week": week_start.isoformat(),
            "weekday": d.weekday(),
            "tokens": tok,
            "millions": round(tok / 1e6, 1),
        }
    )
json.dump(cal, open("calendar.json", "w"), indent=0)

# --- cumulative
cum_t = cum_c = 0
cum = []
for d in all_days:
    t, c = daily.get(d.isoformat(), [0, 0.0])
    cum_t += t
    cum_c += c
    cum.append(
        {
            "date": d.isoformat(),
            "billions": round(cum_t / 1e9, 4),
            "dollars": round(cum_c, 2),
        }
    )
json.dump(cum, open("cumulative.json", "w"), indent=0)

# --- per model per day, zero-filled across each model's own lifespan
models = sorted(first_seen, key=lambda m: (first_seen[m], m))
per_model = []
for m in models:
    for d in all_days:
        key = d.isoformat()
        v = daily_model.get((key, m))
        per_model.append(
            {"date": key, "model": m, "millions": round((v[0] if v else 0) / 1e6, 2)}
        )
json.dump(per_model, open("per_model_daily.json", "w"), indent=0)
json.dump(models, open("model_order.json", "w"))

# --- when: weekday x hour
WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
json.dump(
    [
        {"weekday": WD[wd], "hour": h, "millions": round(when.get((wd, h), 0) / 1e6, 1)}
        for wd in range(7)
        for h in range(24)
    ],
    open("when.json", "w"),
    indent=0,
)

busiest = sorted(daily.items(), key=lambda kv: -kv[1][0])[:5]
print(
    f"span {start} .. {end} ({len(all_days)} days), {sum(1 for d in daily if daily[d][0])} active"
)
print("total", f"{cum_t / 1e9:.1f}B tokens, ${cum_c:,.0f}")
print("busiest days:", [(d, f"{v[0] / 1e9:.2f}B") for d, v in busiest])
print("model order:", models)

# --- diurnal profile: mean tokens per hour, weekday vs weekend ---------------
n_weekday = sum(1 for d in all_days if d.weekday() < 5)
n_weekend = len(all_days) - n_weekday
prof = defaultdict(int)
for (wd, h), tok in when.items():
    prof[("Mon-Fri" if wd < 5 else "Sat-Sun", h)] += tok
json.dump(
    [
        {
            "kind": k,
            "hour": h,
            "millions": round(
                prof.get((k, h), 0)
                / (n_weekday if k == "Mon-Fri" else n_weekend)
                / 1e6,
                2,
            ),
        }
        for k in ("Mon-Fri", "Sat-Sun")
        for h in range(24)
    ],
    open("diurnal.json", "w"),
    indent=0,
)
print(f"weekdays {n_weekday}, weekend days {n_weekend}")
