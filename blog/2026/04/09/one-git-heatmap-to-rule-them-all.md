---
title: "One git heatmap to rule them all"
description:
  "A Python script that merges contribution data from GitHub and multiple GitLab
  instances into a single interactive SVG heatmap."
tags: ["tools", "python", "visualisation"]
---

GitHub's contribution heatmap is one of those things I find unreasonably
satisfying to look at. A year of work, reduced to a grid of green squares. But
if your work is spread across multiple git forges---as mine is, between GitHub,
ANU's GitLab, and a work GitLab---then no single profile page tells the whole
story. My GitHub heatmap has gaps that aren't actually gaps; they're just weeks
where the commits landed somewhere else.

So I wrote a script to fix that. It pulls contribution data from all three
forges, merges it, and renders a single self-contained SVG that covers my entire
git history. Here's what it looks like (with synthetic demo data---the real one
has my actual credentials baked into the environment):

<iframe src="/assets/contributions.svg" width="100%" height="400" style="border:none;border-radius:6px;aspect-ratio:1082/388"></iframe>

The whole thing is a single Python file---about 900 lines, with
[httpx](https://www.python-httpx.org/) as the only dependency. It uses
[uv's inline script metadata](https://docs.astral.sh/uv/guides/scripts/#declaring-script-dependencies)
so you can run it with `uv run contribution_heatmap.py` without setting up a
virtual environment. GitHub data comes via the
[GraphQL contributions API](https://docs.github.com/en/graphql/reference/objects#contributionscollection),
which gives you a nice per-day breakdown by year. GitLab is more work---the
events API only retains a year or two of history on most self-hosted instances,
so the script scans all your member projects and queries their commit history
directly via the
[repository commits endpoint](https://docs.gitlab.com/api/commits/).

A few design decisions worth mentioning. The tiles are week-aggregated rather
than daily, because 16 years of daily tiles would produce an unreadably wide
image. Each year gets its own row with 53 columns, which keeps things compact
while still letting you spot seasonal patterns.

The colour scaling uses per-year quantile normalisation by default, so even
quiet early years show meaningful variation rather than being washed out by
later activity. There's a toggle in the SVG to switch to global normalisation if
you want to see the absolute picture---click "By year / Global" in the bottom
right. The palette matches GitHub's dark theme, because this site is dark-mode
only and I didn't fancy debugging a light-mode variant.

The SVG is fully self-contained: inline CSS, inline JavaScript for the hover
popovers, no external dependencies at view time. Hover over any tile and you get
a breakdown by source, a day-of-week mini bar chart for that week, and the top
event types. It's all embedded in `foreignObject` elements, which is one of
those SVG features that feels slightly transgressive but works well in
practice.[^foreignobject]

[^foreignobject]:
    `foreignObject` lets you embed arbitrary HTML inside an SVG. It's been
    supported in all major browsers for years, but it still feels like you're
    getting away with something.

Caching is simple but effective. For GitHub, past years get saved as JSON files
and only the current (incomplete) year gets refetched. For GitLab, commits are
cached per project and only rescanned when a project's `last_activity_at`
changes. The initial run takes a few minutes (scanning 1,000+ projects), but
subsequent runs are near-instant.

Configuration is all via environment variables---`GITHUB_USER`, `GITHUB_TOKEN`,
`GITLAB1_URL`, `GITLAB1_USER`, `GITLAB1_TOKEN`, and so on for a second GitLab
instance. There's a `--dry-run` flag that shows what would be fetched without
actually hitting any APIs, which was helpful while getting the request counts
right.

## The full script

```python
#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx"]
# ///
"""Generate a multi-source contribution heatmap as a self-contained interactive SVG."""

from __future__ import annotations

import argparse
import json
import logging
import sys
import time
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from pathlib import Path

import httpx  # ty: ignore[unresolved-import]

log = logging.getLogger(__name__)

# ── Constants ──────────────────────────────────────────────────────────────────

TILE = 14
GAP = 2
CELL = TILE + GAP
LEFT_MARGIN = 54
TOP_MARGIN = 72
RIGHT_MARGIN = 180
BOTTOM_MARGIN = 44
MAX_WEEKS = 53

PALETTE = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
SOURCE_COLORS = {"github": "#6e5494", "gitlab1": "#fc6d26", "gitlab2": "#1f9e8e"}
SOURCE_LABELS = {"github": "GitHub", "gitlab1": "GitLab #1", "gitlab2": "GitLab #2"}
TEXT_COLOR = "#c9d1d9"
MUTED_COLOR = "#8b949e"
BG_COLOR = "#0d1117"
POPOVER_BG = "#1b1f23"
POPOVER_BORDER = "#30363d"

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

MAX_RETRIES = 3
RETRY_DELAYS = [1, 2, 4]
GITLAB_REQUEST_DELAY = 0.1


# ── Data types ─────────────────────────────────────────────────────────────────

@dataclass
class DayData:
    count: int = 0
    event_types: dict[str, int] = field(default_factory=dict)


@dataclass
class WeekData:
    week_start: date
    total: int = 0
    by_source: dict[str, int] = field(default_factory=dict)
    by_day: list[int] = field(default_factory=lambda: [0] * 7)
    top_event_types: list[tuple[str, int]] = field(default_factory=list)


@dataclass
class Stats:
    total: int = 0
    longest_streak: int = 0
    current_streak: int = 0
    most_active_week: tuple[date, int] = field(default_factory=lambda: (date.today(), 0))
    most_active_dow: str = "Monday"
    per_year: dict[int, dict[str, int]] = field(default_factory=dict)
    sources_available: list[str] = field(default_factory=list)
    sources_failed: list[str] = field(default_factory=list)


# ── HTTP helpers ───────────────────────────────────────────────────────────────

def _request(client: httpx.Client, method: str, url: str, **kwargs) -> httpx.Response:
    for attempt in range(MAX_RETRIES):
        try:
            resp = client.request(method, url, **kwargs)
            if resp.status_code == 429:
                delay = RETRY_DELAYS[min(attempt, len(RETRY_DELAYS) - 1)]
                log.warning("Rate limited on %s, sleeping %ds", url, delay)
                time.sleep(delay)
                continue
            resp.raise_for_status()
            return resp
        except httpx.TransportError as e:
            if attempt == MAX_RETRIES - 1:
                raise
            delay = RETRY_DELAYS[min(attempt, len(RETRY_DELAYS) - 1)]
            log.warning("Request failed (%s), retrying in %ds", e, delay)
            time.sleep(delay)
    raise RuntimeError(f"Failed after {MAX_RETRIES} retries: {method} {url}")


def _graphql(client: httpx.Client, query: str, variables: dict) -> dict:
    resp = _request(client, "POST", "https://api.github.com/graphql",
                    json={"query": query, "variables": variables})
    data = resp.json()
    if "errors" in data:
        raise RuntimeError(f"GraphQL errors: {data['errors']}")
    rate = data.get("data", {}).get("rateLimit", {})
    if rate and rate.get("remaining", 100) < 10:
        reset_at = datetime.fromisoformat(rate["resetAt"].replace("Z", "+00:00"))
        wait = max(0, (reset_at - datetime.now(reset_at.tzinfo)).total_seconds())
        if wait > 0:
            log.info("GitHub rate limit low (%d remaining), sleeping %.0fs",
                     rate["remaining"], wait)
            time.sleep(wait)
    return data


# ── GitHub fetcher ─────────────────────────────────────────────────────────────

GITHUB_CREATED_QUERY = """
query($login: String!) {
  rateLimit { remaining resetAt }
  user(login: $login) { createdAt }
}"""

GITHUB_CONTRIB_QUERY = """
query($login: String!, $from: DateTime!, $to: DateTime!) {
  rateLimit { remaining resetAt }
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}"""


def fetch_github(user: str, token: str, start_year: int | None,
                 end_date: date, cache_dir: Path, no_cache: bool) -> tuple[dict[date, DayData], int]:
    client = httpx.Client(
        headers={"Authorization": f"bearer {token}", "Content-Type": "application/json"},
        timeout=30,
    )
    try:
        resp = _graphql(client, GITHUB_CREATED_QUERY, {"login": user})
        created = datetime.fromisoformat(
            resp["data"]["user"]["createdAt"].replace("Z", "+00:00"))
        join_year = created.year
        if start_year is None:
            start_year = join_year

        result: dict[date, DayData] = {}

        for year in range(start_year, end_date.year + 1):
            cache_file = cache_dir / f"github_{year}.json"
            if not no_cache and year < end_date.year and cache_file.exists():
                log.info("GitHub %d: using cache", year)
                cal = json.loads(cache_file.read_text())
            else:
                log.info("GitHub %d: fetching", year)
                from_dt = f"{year}-01-01T00:00:00Z"
                to_year = year + 1 if year < end_date.year else end_date.year
                to_month = 1 if year < end_date.year else end_date.month
                to_day = 1 if year < end_date.year else end_date.day
                to_dt = f"{to_year}-{to_month:02d}-{to_day:02d}T00:00:00Z"
                if year == end_date.year:
                    to_dt = f"{(end_date + timedelta(days=1)).isoformat()}T00:00:00Z"

                data = _graphql(client, GITHUB_CONTRIB_QUERY,
                                {"login": user, "from": from_dt, "to": to_dt})
                cal = data["data"]["user"]["contributionsCollection"]["contributionCalendar"]
                cache_dir.mkdir(parents=True, exist_ok=True)
                cache_file.write_text(json.dumps(cal))

            for week in cal["weeks"]:
                for day in week["contributionDays"]:
                    d = date.fromisoformat(day["date"])
                    if d <= end_date:
                        result[d] = DayData(count=day["contributionCount"])

        return result, start_year
    finally:
        client.close()


# ── GitLab fetcher ─────────────────────────────────────────────────────────────

def _list_gitlab_projects(client: httpx.Client,
                          base_url: str) -> list[dict]:
    projects: list[dict] = []
    page = 1
    while True:
        resp = _request(client, "GET", f"{base_url}/api/v4/projects",
                        params={"membership": "true", "per_page": 100,
                                "page": page, "simple": "true"})
        batch = resp.json()
        if not batch:
            break
        projects.extend(batch)
        if len(batch) < 100:
            break
        page += 1
        time.sleep(GITLAB_REQUEST_DELAY)
    return projects


def _fetch_project_user_commits(client: httpx.Client, base_url: str,
                                proj_id: int,
                                author_emails: list[str]) -> list[str]:
    seen: set[str] = set()
    dates: list[str] = []
    for email in author_emails:
        page = 1
        while True:
            try:
                resp = _request(client, "GET",
                                f"{base_url}/api/v4/projects/{proj_id}/repository/commits",
                                params={"author": email, "per_page": 100, "page": page})
            except Exception:
                break
            batch = resp.json()
            if not isinstance(batch, list) or not batch:
                break
            for c in batch:
                sha = c.get("id", "")
                if sha and sha not in seen:
                    seen.add(sha)
                    dates.append(c["created_at"][:10])
            if len(batch) < 100:
                break
            page += 1
            time.sleep(GITLAB_REQUEST_DELAY)
    return dates


def fetch_gitlab(base_url: str, username: str, token: str,
                 author_emails: list[str], start_year: int | None,
                 end_date: date, cache_dir: Path, no_cache: bool,
                 source_name: str) -> tuple[dict[date, DayData], int]:
    base_url = base_url.rstrip("/")
    client = httpx.Client(headers={"PRIVATE-TOKEN": token}, timeout=30)
    try:
        projects = _list_gitlab_projects(client, base_url)
        log.info("%s: %d member projects to scan", source_name, len(projects))

        cache_file = cache_dir / f"{source_name}_project_commits.json"
        cached: dict[str, dict] = {}
        if not no_cache and cache_file.exists():
            cached = json.loads(cache_file.read_text())

        result: dict[date, DayData] = {}
        scanned = 0

        for i, proj in enumerate(projects):
            proj_id = str(proj["id"])
            proj_path = proj.get("path_with_namespace", proj_id)
            last_activity = proj.get("last_activity_at", "")

            if proj_id in cached and not no_cache:
                if cached[proj_id].get("last_activity") == last_activity:
                    for d_str in cached[proj_id].get("dates", []):
                        _add_commit_date(result, d_str, start_year, end_date)
                    continue

            commit_dates = _fetch_project_user_commits(
                client, base_url, proj["id"], author_emails)
            scanned += 1

            cached[proj_id] = {
                "last_activity": last_activity,
                "path": proj_path,
                "dates": commit_dates,
            }

            for d_str in commit_dates:
                _add_commit_date(result, d_str, start_year, end_date)

            if commit_dates:
                log.info("%s: %s — %d commits", source_name, proj_path,
                         len(commit_dates))
            if scanned % 100 == 0:
                log.info("%s: scanned %d/%d projects…",
                         source_name, i + 1, len(projects))

        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_file.write_text(json.dumps(cached))
        log.info("%s: done — scanned %d projects (%d from cache)",
                 source_name, scanned, len(projects) - scanned)

        if result and start_year is None:
            start_year = min(d.year for d in result)
        if start_year is None:
            start_year = end_date.year
        return result, start_year
    finally:
        client.close()


def _add_commit_date(result: dict[date, DayData], d_str: str,
                     start_year: int | None, end_date: date) -> None:
    try:
        d = date.fromisoformat(d_str)
    except ValueError:
        return
    if d > end_date:
        return
    if start_year and d.year < start_year:
        return
    if d not in result:
        result[d] = DayData()
    result[d].count += 1
    result[d].event_types["commits"] = result[d].event_types.get("commits", 0) + 1


# ── Data processing ────────────────────────────────────────────────────────────

def _week_start(d: date) -> date:
    return d - timedelta(days=d.weekday())


def _year_week_mondays(year: int) -> list[date]:
    """All week-start Mondays whose Thursday falls in the given calendar year."""
    jan1 = date(year, 1, 1)
    monday = jan1 - timedelta(days=jan1.weekday())
    if (monday + timedelta(days=3)).year < year:
        monday += timedelta(weeks=1)

    weeks = []
    while (monday + timedelta(days=3)).year == year:
        weeks.append(monday)
        monday += timedelta(weeks=1)
    return weeks


def merge_sources(sources: dict[str, dict[date, DayData]]) -> dict[date, dict[str, DayData]]:
    daily: dict[date, dict[str, DayData]] = {}
    for src, days in sources.items():
        for d, dd in days.items():
            if d not in daily:
                daily[d] = {}
            daily[d][src] = dd
    return daily


def aggregate_weeks(daily: dict[date, dict[str, DayData]],
                    start_year: int, end_date: date
                    ) -> dict[int, list[tuple[date, WeekData]]]:
    flat: dict[date, WeekData] = {}
    for d, sources in daily.items():
        ws = _week_start(d)
        if ws not in flat:
            flat[ws] = WeekData(week_start=ws)
        wd = flat[ws]
        dow = d.weekday()
        for src, dd in sources.items():
            wd.total += dd.count
            wd.by_source[src] = wd.by_source.get(src, 0) + dd.count
            wd.by_day[dow] += dd.count

    all_event_types: dict[date, dict[str, int]] = {}
    for d, sources in daily.items():
        ws = _week_start(d)
        if ws not in all_event_types:
            all_event_types[ws] = {}
        for dd in sources.values():
            for et, cnt in dd.event_types.items():
                all_event_types[ws][et] = all_event_types[ws].get(et, 0) + cnt

    for ws, ets in all_event_types.items():
        if ws in flat:
            flat[ws].top_event_types = sorted(ets.items(), key=lambda x: -x[1])[:3]

    by_year: dict[int, list[tuple[date, WeekData]]] = {}
    for year in range(start_year, end_date.year + 1):
        mondays = _year_week_mondays(year)
        by_year[year] = [(m, flat.get(m, WeekData(week_start=m))) for m in mondays]
    return by_year


# ── Statistics ─────────────────────────────────────────────────────────────────

def compute_stats(daily: dict[date, dict[str, DayData]],
                  weeks_by_year: dict[int, list[tuple[date, WeekData]]],
                  end_date: date,
                  sources_ok: list[str],
                  sources_fail: list[str]) -> Stats:
    stats = Stats(sources_available=sources_ok, sources_failed=sources_fail)

    if not daily:
        return stats

    all_dates = sorted(daily.keys())
    start = all_dates[0]

    stats.total = sum(dd.count for sources in daily.values() for dd in sources.values())

    longest = current = 0
    d = start
    while d <= end_date:
        day_total = sum(dd.count for dd in daily.get(d, {}).values())
        if day_total > 0:
            current += 1
            longest = max(longest, current)
        else:
            current = 0
        d += timedelta(days=1)
    stats.longest_streak = longest
    stats.current_streak = current

    dow_totals = [0] * 7
    for d, sources in daily.items():
        day_total = sum(dd.count for dd in sources.values())
        dow_totals[d.weekday()] += day_total
    stats.most_active_dow = DAYS[dow_totals.index(max(dow_totals))]

    best_week = date.today()
    best_count = 0
    for year_weeks in weeks_by_year.values():
        for monday, wd in year_weeks:
            if wd.total > best_count:
                best_count = wd.total
                best_week = monday
    stats.most_active_week = (best_week, best_count)

    for year, year_weeks in weeks_by_year.items():
        year_by_source: dict[str, int] = {}
        for _, wd in year_weeks:
            for src, cnt in wd.by_source.items():
                year_by_source[src] = year_by_source.get(src, 0) + cnt
        year_by_source["_total"] = sum(year_by_source.values())
        stats.per_year[year] = year_by_source

    return stats


# ── Color levels ───────────────────────────────────────────────────────────────

def _compute_thresholds(values: list[int]) -> list[int]:
    non_zero = sorted(v for v in values if v > 0)
    if not non_zero:
        return [1, 1, 1]
    n = len(non_zero)
    return [
        non_zero[max(0, n * 1 // 4 - 1)],
        non_zero[max(0, n * 2 // 4 - 1)],
        non_zero[max(0, n * 3 // 4 - 1)],
    ]


def _level(value: int, thresholds: list[int]) -> int:
    if value == 0:
        return 0
    if value <= thresholds[0]:
        return 1
    if value <= thresholds[1]:
        return 2
    if value <= thresholds[2]:
        return 3
    return 4


# ── SVG builder ────────────────────────────────────────────────────────────────

def _fmt_date(d: date) -> str:
    return f"{d.day} {MONTHS[d.month - 1]} {d.year}"


def _fmt_date_short(d: date) -> str:
    return f"{d.day} {MONTHS[d.month - 1]}"


def build_svg(weeks_by_year: dict[int, list[tuple[date, WeekData]]],
              stats: Stats) -> str:
    years = sorted(weeks_by_year.keys())
    num_years = len(years)

    grid_w = MAX_WEEKS * CELL
    grid_h = num_years * CELL
    svg_w = LEFT_MARGIN + grid_w + RIGHT_MARGIN
    svg_h = TOP_MARGIN + grid_h + BOTTOM_MARGIN

    global_totals = [wd.total for yws in weeks_by_year.values() for _, wd in yws]
    global_thresh = _compute_thresholds(global_totals)

    year_thresh: dict[int, list[int]] = {}
    for year, yws in weeks_by_year.items():
        year_thresh[year] = _compute_thresholds([wd.total for _, wd in yws])

    active_sources = stats.sources_available

    parts: list[str] = []

    parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" '
                 f'viewBox="0 0 {svg_w} {svg_h}" '
                 f'width="{svg_w}" height="{svg_h}">')

    # Background
    parts.append(f'<rect width="{svg_w}" height="{svg_h}" fill="{BG_COLOR}" rx="6"/>')

    # CSS
    parts.append('<style><![CDATA[')
    parts.append(f'text {{ fill: {TEXT_COLOR}; '
                 f'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }}')
    parts.append(f'.year-label {{ font-size: 11px; fill: {MUTED_COLOR}; }}')
    parts.append(f'.month-label {{ font-size: 10px; fill: {MUTED_COLOR}; }}')
    parts.append(f'.stat-text {{ font-size: 11px; fill: {MUTED_COLOR}; }}')
    parts.append(f'.title {{ font-size: 14px; font-weight: 600; fill: {TEXT_COLOR}; }}')
    parts.append(f'.year-total {{ font-size: 10px; fill: {MUTED_COLOR}; text-anchor: end; }}')
    parts.append(f'.toggle {{ font-size: 10px; cursor: pointer; }}')
    parts.append(f'.tile {{ rx: 2; ry: 2; }}')
    parts.append(']]></style>')

    # Title
    source_names = " + ".join(SOURCE_LABELS[s] for s in active_sources)
    if stats.sources_failed:
        source_names += " (" + ", ".join(
            f"{SOURCE_LABELS.get(s, s)} unavailable" for s in stats.sources_failed) + ")"
    parts.append(f'<text x="{LEFT_MARGIN}" y="20" class="title">'
                 f'Contributions across {source_names} \u00b7 {years[0]}\u2013{years[-1]}</text>')

    # Stats strip
    maw_date = _fmt_date_short(stats.most_active_week[0])
    stat_line = (f"Total: {stats.total:,} \u00b7 "
                 f"Longest streak: {stats.longest_streak:,} days \u00b7 "
                 f"Most active week: {maw_date} ({stats.most_active_week[1]:,}) \u00b7 "
                 f"Most active day: {stats.most_active_dow}")
    parts.append(f'<text x="{LEFT_MARGIN}" y="38" class="stat-text">{stat_line}</text>')

    # Month labels (based on last year)
    last_year = years[-1]
    last_mondays = [m for m, _ in weeks_by_year[last_year]]
    for month_idx in range(12):
        first_of_month = date(last_year, month_idx + 1, 1)
        ws = _week_start(first_of_month)
        if ws in last_mondays:
            col = last_mondays.index(ws)
        else:
            closest = min(last_mondays, key=lambda m: abs((m - ws).days))
            col = last_mondays.index(closest)
        x = LEFT_MARGIN + col * CELL
        parts.append(f'<text x="{x}" y="{TOP_MARGIN - 6}" class="month-label">'
                     f'{MONTHS[month_idx]}</text>')

    # Tile grid + year labels + sidebar
    js_data: dict[str, dict] = {}

    for row, year in enumerate(years):
        y_base = TOP_MARGIN + row * CELL

        # Year label
        parts.append(f'<text x="{LEFT_MARGIN - 6}" y="{y_base + TILE - 2}" '
                     f'class="year-label" text-anchor="end">{year}</text>')

        year_weeks = weeks_by_year[year]
        for col, (monday, wd) in enumerate(year_weeks):
            lv_year = _level(wd.total, year_thresh[year])
            lv_global = _level(wd.total, global_thresh)
            x = LEFT_MARGIN + col * CELL
            y = y_base

            tile_key = f"{year}-{col}"

            # Fallback title
            source_parts = []
            for s in active_sources:
                v = wd.by_source.get(s, 0)
                short = s.upper().replace("GITLAB", "GL").replace("GITHUB", "GH")
                source_parts.append(f"{short}:{v}")
            title_text = (f"Week of {_fmt_date(monday)} \u00b7 "
                          f"{wd.total} contributions ({' '.join(source_parts)})")

            parts.append(
                f'<rect class="tile" id="t-{tile_key}" data-k="{tile_key}" '
                f'data-ly="{lv_year}" data-lg="{lv_global}" '
                f'x="{x}" y="{y}" width="{TILE}" height="{TILE}" '
                f'fill="{PALETTE[lv_year]}">'
                f'<title>{title_text}</title></rect>')

            # JS data for popover
            js_entry: dict = {
                "t": wd.total,
                "s": {s: wd.by_source.get(s, 0) for s in active_sources},
                "d": wd.by_day,
                "l": f"Week of {_fmt_date(monday)}",
            }
            if wd.top_event_types:
                js_entry["e"] = [[et, cnt] for et, cnt in wd.top_event_types]
            js_data[tile_key] = js_entry

        # Year total + source bar (right sidebar)
        year_total = stats.per_year.get(year, {}).get("_total", 0)
        sidebar_x = LEFT_MARGIN + MAX_WEEKS * CELL + 10
        parts.append(f'<text x="{sidebar_x + 40}" y="{y_base + TILE - 2}" '
                     f'class="year-total">{year_total:,}</text>')

        # Stacked source bar
        bar_x = sidebar_x + 48
        bar_w = 100
        bar_h = 8
        bar_y = y_base + (TILE - bar_h) // 2
        parts.append(f'<rect x="{bar_x}" y="{bar_y}" width="{bar_w}" '
                     f'height="{bar_h}" fill="#21262d" rx="2"/>')
        if year_total > 0:
            offset = 0
            for s in active_sources:
                s_count = stats.per_year.get(year, {}).get(s, 0)
                if s_count == 0:
                    continue
                w = max(1, round(s_count / year_total * bar_w))
                w = min(w, bar_w - offset)
                parts.append(f'<rect x="{bar_x + offset}" y="{bar_y}" width="{w}" '
                             f'height="{bar_h}" fill="{SOURCE_COLORS[s]}" rx="2"/>')
                offset += w

    # Legend
    legend_y = TOP_MARGIN + num_years * CELL + 16
    legend_x = LEFT_MARGIN
    parts.append(f'<text x="{legend_x}" y="{legend_y + 10}" '
                 f'style="font-size:10px;fill:{MUTED_COLOR}">Less</text>')
    for i, color in enumerate(PALETTE):
        bx = legend_x + 30 + i * (TILE + 2)
        parts.append(f'<rect x="{bx}" y="{legend_y}" width="{TILE}" '
                     f'height="{TILE}" fill="{color}" rx="2"/>')
    parts.append(f'<text x="{legend_x + 30 + 5 * (TILE + 2) + 4}" y="{legend_y + 10}" '
                 f'style="font-size:10px;fill:{MUTED_COLOR}">More</text>')

    # Source legend
    src_legend_x = legend_x + 160
    for i, s in enumerate(active_sources):
        sx = src_legend_x + i * 90
        parts.append(f'<rect x="{sx}" y="{legend_y + 2}" width="10" height="10" '
                     f'fill="{SOURCE_COLORS[s]}" rx="2"/>')
        parts.append(f'<text x="{sx + 14}" y="{legend_y + 10}" '
                     f'style="font-size:10px;fill:{MUTED_COLOR}">{SOURCE_LABELS[s]}</text>')

    # Normalization toggle
    toggle_x = svg_w - RIGHT_MARGIN + 10
    parts.append(f'<text id="toggle-year" x="{toggle_x}" y="{legend_y + 10}" '
                 f'class="toggle" fill="{TEXT_COLOR}" '
                 f'onclick="toggleMode(\'year\')">By year</text>')
    parts.append(f'<text x="{toggle_x + 48}" y="{legend_y + 10}" '
                 f'style="font-size:10px;fill:{MUTED_COLOR}"> / </text>')
    parts.append(f'<text id="toggle-global" x="{toggle_x + 58}" y="{legend_y + 10}" '
                 f'class="toggle" fill="{MUTED_COLOR}" '
                 f'onclick="toggleMode(\'global\')">Global</text>')

    # Popover foreignObject
    parts.append(
        f'<foreignObject id="popover" x="0" y="0" width="280" height="320" display="none">'
        f'<div xmlns="http://www.w3.org/1999/xhtml" id="popover-content" '
        f'style="background:{POPOVER_BG};color:{TEXT_COLOR};padding:10px 12px;'
        f'border-radius:6px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;'
        f'font-size:11px;line-height:1.5;border:1px solid {POPOVER_BORDER};'
        f'box-shadow:0 4px 12px rgba(0,0,0,0.5);">'
        f'</div>'
        f'</foreignObject>')

    # JS
    sources_js = json.dumps([[s, SOURCE_LABELS[s], SOURCE_COLORS[s]]
                             for s in active_sources])
    data_js = json.dumps(js_data, separators=(",", ":"))
    palette_js = json.dumps(PALETTE)

    js = _build_js(data_js, sources_js, palette_js, svg_w, svg_h, CELL)
    parts.append(f'<script type="text/ecmascript"><![CDATA[\n{js}\n]]></script>')

    parts.append('</svg>')
    return "\n".join(parts)


def _build_js(data_js: str, sources_js: str, palette_js: str,
              svg_w: int, svg_h: int, cell: int) -> str:
    return f"""
var W={data_js};
var S={sources_js};
var P={palette_js};
var SVG_W={svg_w},SVG_H={svg_h},CELL={cell};
var mode='year';
var fo=document.getElementById('popover');
var pc=document.getElementById('popover-content');

document.querySelectorAll('.tile').forEach(function(el){{
  el.addEventListener('mouseenter',show);
  el.addEventListener('mouseleave',hide);
}});

function toggleMode(m){{
  mode=m;
  var attr=m==='year'?'ly':'lg';
  document.querySelectorAll('.tile').forEach(function(el){{
    el.setAttribute('fill',P[el.dataset[attr]]);
  }});
  document.getElementById('toggle-year').setAttribute('fill',m==='year'?'{TEXT_COLOR}':'{MUTED_COLOR}');
  document.getElementById('toggle-global').setAttribute('fill',m==='global'?'{TEXT_COLOR}':'{MUTED_COLOR}');
}}

function show(evt){{
  var k=evt.target.dataset.k;
  if(!k||!W[k])return;
  var d=W[k];
  var h='<div style="font-weight:600;margin-bottom:4px">'+d.l+'</div>';
  h+='<div style="margin-bottom:8px">'+d.t+' contribution'+(d.t!==1?'s':'')+'</div>';

  var maxD=Math.max.apply(null,d.d.concat([1]));
  h+='<div style="display:flex;gap:1px;height:28px;align-items:flex-end;margin-bottom:8px">';
  var days=['M','T','W','T','F','S','S'];
  for(var i=0;i<7;i++){{
    var pct=d.d[i]?Math.max(d.d[i]/maxD*100,8):0;
    var bg=d.d[i]?'#39d353':'#21262d';
    h+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">';
    h+='<div style="flex:1;width:100%;display:flex;align-items:flex-end">';
    h+='<div style="width:100%;background:'+bg+';height:'+pct+'%;border-radius:1px"></div>';
    h+='</div>';
    h+='<div style="font-size:8px;color:{MUTED_COLOR}">'+days[i]+'</div>';
    h+='</div>';
  }}
  h+='</div>';

  var maxS=1;
  for(var i=0;i<S.length;i++){{var v=d.s[S[i][0]]||0;if(v>maxS)maxS=v;}}
  for(var i=0;i<S.length;i++){{
    var src=S[i],v=d.s[src[0]]||0;
    var pct=v/maxS*100;
    h+='<div style="display:flex;align-items:center;gap:6px;margin:2px 0">';
    h+='<span style="width:56px;color:{MUTED_COLOR};font-size:10px">'+src[1]+'</span>';
    h+='<div style="flex:1;height:6px;background:#21262d;border-radius:2px">';
    h+='<div style="width:'+pct+'%;height:100%;background:'+src[2]+';border-radius:2px;min-width:'+(v?'2px':'0')+'"></div>';
    h+='</div>';
    h+='<span style="width:24px;text-align:right;font-size:10px">'+v+'</span>';
    h+='</div>';
  }}

  if(d.e&&d.e.length){{
    h+='<div style="margin-top:6px;font-size:10px;color:{MUTED_COLOR}">Mostly: ';
    h+=d.e.map(function(x){{return x[0]}}).join(', ');
    h+='</div>';
  }}

  pc.innerHTML=h;

  var tx=parseFloat(evt.target.getAttribute('x'));
  var ty=parseFloat(evt.target.getAttribute('y'));
  var pw=280,ph=320;
  var px=tx+CELL+4;
  var py=ty-40;
  if(px+pw>SVG_W-20)px=tx-pw-4;
  if(py<10)py=10;
  if(py+ph>SVG_H-10)py=Math.max(10,SVG_H-ph-10);
  fo.setAttribute('x',px);
  fo.setAttribute('y',py);
  fo.setAttribute('display','inline');
}}

function hide(){{
  fo.setAttribute('display','none');
}}
"""


# ── CLI ────────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Multi-source contribution heatmap generator")
    p.add_argument("--output", default=None, help="Output SVG path")
    p.add_argument("--start-year", type=int, default=None, help="Override earliest year")
    p.add_argument("--end-date", type=str, default=None, help="Override end date (YYYY-MM-DD)")
    p.add_argument("--cache-dir", type=str, default=".cache", help="Cache directory")
    p.add_argument("--no-cache", action="store_true", help="Skip cache, always refetch")
    p.add_argument("--dry-run", action="store_true", help="Show what would be fetched")
    p.add_argument("-v", "--verbose", action="store_true", help="Verbose output")
    return p.parse_args()


def main():
    args = parse_args()
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s: %(message)s",
    )

    import os
    end_date = date.fromisoformat(args.end_date) if args.end_date else date.today()
    output = args.output or os.environ.get("OUTPUT_PATH", "contributions.svg")
    cache_dir = Path(args.cache_dir)
    start_year = args.start_year

    github_user = os.environ.get("GITHUB_USER")
    github_token = os.environ.get("GITHUB_TOKEN")
    gl1_url = os.environ.get("GITLAB1_URL")
    gl1_user = os.environ.get("GITLAB1_USER")
    gl1_token = os.environ.get("GITLAB1_TOKEN")
    gl2_url = os.environ.get("GITLAB2_URL")
    gl2_user = os.environ.get("GITLAB2_USER")
    gl2_token = os.environ.get("GITLAB2_TOKEN")
    author_emails = [e.strip() for e in
                     os.environ.get("AUTHOR_EMAILS", "").split(",") if e.strip()]

    fetch_plan = []
    if github_user and github_token:
        fetch_plan.append(("github", f"GitHub ({github_user})"))
    if gl1_url and gl1_user and gl1_token:
        fetch_plan.append(("gitlab1", f"GitLab #1 ({gl1_user}@{gl1_url})"))
    if gl2_url and gl2_user and gl2_token:
        fetch_plan.append(("gitlab2", f"GitLab #2 ({gl2_user}@{gl2_url})"))

    if not fetch_plan:
        print("No sources configured. Set GITHUB_USER/GITHUB_TOKEN and/or "
              "GITLAB1_URL/GITLAB1_USER/GITLAB1_TOKEN environment variables.",
              file=sys.stderr)
        sys.exit(1)

    has_gitlab = any(n.startswith("gitlab") for n, _ in fetch_plan)
    if has_gitlab and not author_emails:
        print("AUTHOR_EMAILS is required for GitLab sources (comma-separated "
              "git author emails).", file=sys.stderr)
        sys.exit(1)

    if args.dry_run:
        print("Would fetch from:")
        year_range = f"{start_year or '(auto-detect)'} to {end_date.year}"
        for name, desc in fetch_plan:
            est = (end_date.year - (start_year or 2010) + 1)
            if name == "github":
                print(f"  {desc}: ~{est} GraphQL queries (years {year_range})")
            else:
                print(f"  {desc}: ~{est * 10} REST requests (years {year_range}, est.)")
        print(f"Output: {output}")
        return

    sources: dict[str, dict[date, DayData]] = {}
    sources_ok: list[str] = []
    sources_fail: list[str] = []
    earliest_year = start_year

    # Fetch GitHub first so its join year can serve as the floor for GitLab
    if github_user and github_token:
        log.info("Fetching GitHub (%s)", github_user)
        try:
            data, detected_start = fetch_github(
                github_user, github_token, start_year, end_date, cache_dir, args.no_cache)
            sources["github"] = data
            sources_ok.append("github")
            if earliest_year is None or detected_start < earliest_year:
                earliest_year = detected_start
            log.info("GitHub (%s): %d days with activity", github_user, len(data))
        except Exception as e:
            log.warning("Failed to fetch GitHub: %s", e)
            sources_fail.append("github")

    for name, desc in fetch_plan:
        if name == "github":
            continue
        log.info("Fetching %s", desc)
        try:
            if name == "gitlab1":
                assert gl1_url and gl1_user and gl1_token
                data, detected_start = fetch_gitlab(
                    gl1_url, gl1_user, gl1_token, author_emails,
                    earliest_year, end_date, cache_dir, args.no_cache,
                    "gitlab1")
            elif name == "gitlab2":
                assert gl2_url and gl2_user and gl2_token
                data, detected_start = fetch_gitlab(
                    gl2_url, gl2_user, gl2_token, author_emails,
                    earliest_year, end_date, cache_dir, args.no_cache,
                    "gitlab2")
            else:
                continue

            sources[name] = data
            sources_ok.append(name)
            if earliest_year is None or detected_start < earliest_year:
                earliest_year = detected_start
            log.info("%s: %d days with activity", desc, len(data))
        except Exception as e:
            log.warning("Failed to fetch %s: %s", desc, e)
            sources_fail.append(name)

    if not sources:
        print("All sources failed. Cannot generate heatmap.", file=sys.stderr)
        sys.exit(1)

    if earliest_year is None:
        earliest_year = end_date.year

    daily = merge_sources(sources)
    weeks_by_year = aggregate_weeks(daily, earliest_year, end_date)
    stats = compute_stats(daily, weeks_by_year, end_date, sources_ok, sources_fail)
    svg = build_svg(weeks_by_year, stats)

    Path(output).write_text(svg)
    print(f"Written {len(svg):,} bytes to {output}")
    print(f"  {stats.total:,} total contributions across {len(sources_ok)} sources, "
          f"{earliest_year}-{end_date.year}")


if __name__ == "__main__":
    main()
```
