"""Every dataset the charts read, from the one pickle scan_daily.py writes."""

import json
import pickle
from collections import defaultdict
from datetime import date, timedelta

from scope import LABEL, M, PRICES, RD, W1, W5, cost

rows = pickle.load(open("daily.pkl", "rb"))

daily = defaultdict(lambda: [0, 0.0])  # day -> [tokens, cost]
daily_model = defaultdict(lambda: [0, 0.0])  # (day, model) -> [tokens, cost]
monthly = defaultdict(int)  # month -> tokens
by_model = defaultdict(lambda: [0, 0.0])  # model -> [tokens, cost]
when = defaultdict(int)  # (weekday, hour) -> tokens
# token category -> [tokens, cost]. The five ways a token can be billed, which
# is the whole point of the last chart: they differ by a factor of fifty.
categories = defaultdict(lambda: [0, 0.0])
first_seen, last_seen = {}, {}

for day, hour, wd, model, i, o, rd, w5, w1, _cwd, estimated in rows:
    if estimated or model not in PRICES:
        continue
    pin, pout = PRICES[model]
    spend = cost(model, i, o, rd, w5, w1)
    tok = i + o + rd + w5 + w1
    label = LABEL[model]

    daily[day][0] += tok
    daily[day][1] += spend
    daily_model[(day, label)][0] += tok
    daily_model[(day, label)][1] += spend
    monthly[day[:7]] += tok
    by_model[label][0] += tok
    by_model[label][1] += spend
    when[(wd, hour)] += tok
    for name, count, unit in (
        ("fresh input", i, pin),
        ("output", o, pout),
        ("cache read", rd, pin * RD),
        ("cache write (5m)", w5, pin * W5),
        ("cache write (1h)", w1, pin * W1),
    ):
        categories[name][0] += count
        categories[name][1] += count * unit / M
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

# --- monthly totals, and the two rankings the cost charts use
json.dump(
    [{"month": f"{m}-01", "tokens": t} for m, t in sorted(monthly.items())],
    open("monthly.json", "w"),
    indent=0,
)
ranked = sorted(by_model.items(), key=lambda kv: -kv[1][0])
json.dump(
    [{"model": m, "tokens": t, "cost": round(c, 2)} for m, (t, c) in ranked],
    open("by_model.json", "w"),
    indent=0,
)

cat_tokens = sum(v[0] for v in categories.values())
cat_cost = sum(v[1] for v in categories.values())
json.dump(
    [
        {"category": name, "measure": measure, "share": share}
        for name, (t, c) in categories.items()
        for measure, share in (
            ("share of tokens", t / cat_tokens),
            ("share of spend", c / cat_cost),
        )
    ],
    open("categories.json", "w"),
    indent=0,
)

busiest = sorted(daily.items(), key=lambda kv: -kv[1][0])[:5]
print(
    f"span {start} .. {end} ({len(all_days)} days), "
    f"{sum(1 for d in daily if daily[d][0])} active"
)
print("total", f"{cum_t / 1e9:.1f}B tokens, ${cum_c:,.0f}")
print("busiest days:", [(d, f"{v[0] / 1e9:.2f}B") for d, v in busiest])
print("model order:", models)
print(
    "categories:",
    {
        k: f"{v[0] / cat_tokens:.1%} of tokens, {v[1] / cat_cost:.1%} of spend"
        for k, v in categories.items()
    },
)

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
