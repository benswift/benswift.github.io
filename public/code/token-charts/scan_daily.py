#!/usr/bin/env python3
"""Per-response token usage, keyed by local calendar day, for the blog charts.

Two trees are walked. ~/claude-logs is what Claude Code has written since
3 July 2025; ~/zed-logs is the Zed era before it, back-filled into the same
record shape by dotfiles/bin/import-zed-logs. Everything downstream reads one
undifferentiated list of responses, which is the point: the question is how
much work went through an agent, not which agent it was.
"""

from __future__ import annotations

import json
import pickle
import sys
from datetime import datetime
from multiprocessing import Pool
from pathlib import Path
from zoneinfo import ZoneInfo

ROOTS = (Path.home() / "claude-logs", Path.home() / "zed-logs")
TZ = ZoneInfo("Australia/Sydney")


def scan(path: Path) -> dict[int, tuple]:
    out: dict[int, tuple] = {}
    try:
        fh = path.open(errors="replace")
    except OSError:
        return out
    with fh:
        for line in fh:
            if '"usage"' not in line:
                continue
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            msg = rec.get("message")
            if not isinstance(msg, dict):
                continue
            u = msg.get("usage")
            ts = rec.get("timestamp")
            mid = msg.get("id")
            if not isinstance(u, dict) or not ts or not mid:
                continue
            try:
                local = datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone(TZ)
            except ValueError:
                continue
            cc = u.get("cache_creation") or {}
            w5, w1 = (
                cc.get("ephemeral_5m_input_tokens"),
                cc.get("ephemeral_1h_input_tokens"),
            )
            if w5 is None and w1 is None:
                w5, w1 = u.get("cache_creation_input_tokens", 0) or 0, 0
            out[hash(mid)] = (
                local.strftime("%Y-%m-%d"),
                local.hour,
                local.weekday(),
                msg.get("model") or "unknown",
                u.get("input_tokens", 0) or 0,
                u.get("output_tokens", 0) or 0,
                u.get("cache_read_input_tokens", 0) or 0,
                w5 or 0,
                w1 or 0,
                rec.get("cwd"),
                bool(rec.get("estimated")),
            )
    return out


def main() -> None:
    files = sorted(path for root in ROOTS for path in root.glob("*/**/*.jsonl"))
    merged: dict[int, tuple] = {}
    with Pool(24) as pool:
        for chunk in pool.imap_unordered(scan, files, chunksize=16):
            merged.update(chunk)
    print(f"{len(files)} files, {len(merged)} unique responses", file=sys.stderr)
    with open(sys.argv[1], "wb") as fh:
        pickle.dump(list(merged.values()), fh)


if __name__ == "__main__":
    main()
