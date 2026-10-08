"""Fetch adjusted daily close prices from the J-Quants API V2 (Free plan).
Standard library only (urllib). No trading, no order placement, no brokerage access.

Endpoint: GET https://api.jquants.com/v2/equities/bars/daily
Auth: header "x-api-key: <JQUANTS_API_KEY>"
Params used here: code, from, to (date range per ticker)
Response: JSON {"data": [...], "pagination_key": "..."} where each record includes
an "AdjC" field — the split/rights-adjusted close provided directly by the API
(no manual adjustment-factor arithmetic performed here).

API key handling:
- Read ONLY from the environment variable JQUANTS_API_KEY, or (as a convenience
  fallback for local use) from a gitignored research/stocks/.env.local file in
  the form `JQUANTS_API_KEY=...`. The key is never printed, logged, or written
  to any output file.
- Root .gitignore already excludes `.env*` repo-wide; this script never writes
  the key anywhere itself.

Output handling (per DATA_EXECUTION_GATE.md step 5):
- This script writes fetched prices + a metadata JSON to an output directory
  the caller supplies. Callers must point --out-dir OUTSIDE this git repository
  (e.g. the session scratchpad) so real market data is never committed.
- Free plan constraints assumed per J-Quants official docs reviewed 2026-10-08:
  ~2 years of history, ~12-week reporting delay, 5 requests/minute rate limit,
  no CSV bulk download (API only). This script self-throttles to stay under
  the rate limit and does not attempt any paid-plan-only endpoint.

Terms-of-use note: J-Quants free-plan data is for personal, non-commercial use;
raw data redistribution is not permitted. This script never writes fetched
data into the git repository and callers must not commit it either.
"""
import argparse
import csv
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

API_BASE = "https://api.jquants.com/v2"
MIN_SECONDS_BETWEEN_REQUESTS = 13.0  # Free plan: 5 req/min = 12s min; +1s margin


def load_api_key():
    """Read JQUANTS_API_KEY from the environment, falling back to a local
    gitignored .env.local file for convenience. Never prints the value."""
    key = os.environ.get("JQUANTS_API_KEY")
    if key:
        return key.strip()
    env_path = os.path.join(os.path.dirname(__file__), ".env.local")
    if os.path.isfile(env_path):
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("JQUANTS_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


class RateLimiter:
    def __init__(self, min_interval):
        self.min_interval = min_interval
        self._last = 0.0

    def wait(self):
        elapsed = time.monotonic() - self._last
        if elapsed < self.min_interval:
            time.sleep(self.min_interval - elapsed)
        self._last = time.monotonic()


def fetch_ticker(api_key, code, date_from, date_to, limiter, max_retries=3):
    """Fetch all pages of daily bars for one ticker over [date_from, date_to].
    Returns a list of raw record dicts as returned by the API."""
    records = []
    pagination_key = None
    while True:
        params = {"code": code, "from": date_from, "to": date_to}
        if pagination_key:
            params["pagination_key"] = pagination_key
        url = f"{API_BASE}/equities/bars/daily?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers={"x-api-key": api_key})

        limiter.wait()
        attempt = 0
        while True:
            try:
                with urllib.request.urlopen(req, timeout=30) as resp:
                    body = json.loads(resp.read().decode("utf-8"))
                break
            except urllib.error.HTTPError as e:
                attempt += 1
                if e.code == 429 and attempt <= max_retries:
                    time.sleep(limiter.min_interval * attempt)
                    continue
                # Never leak the API key; error bodies from this API do not echo it,
                # but keep the message minimal regardless.
                raise RuntimeError(f"J-Quants API error for code={code}: HTTP {e.code}") from None

        records.extend(body.get("data", []))
        pagination_key = body.get("pagination_key")
        if not pagination_key:
            break
    return records


def main():
    parser = argparse.ArgumentParser(description="Fetch adjusted daily closes from J-Quants API V2 (Free plan)")
    parser.add_argument("--codes", required=True, help="comma-separated ticker codes, e.g. 7203,6758")
    parser.add_argument("--from-date", required=True, help="YYYY-MM-DD")
    parser.add_argument("--to-date", required=True, help="YYYY-MM-DD")
    parser.add_argument("--out-dir", required=True,
                         help="output directory OUTSIDE the git repo (e.g. the session scratchpad)")
    args = parser.parse_args()

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    out_dir_abs = os.path.abspath(args.out_dir)
    if out_dir_abs == repo_root or out_dir_abs.startswith(repo_root + os.sep):
        sys.exit("refusing to write fetched market data inside the git repository; choose an --out-dir outside it")

    api_key = load_api_key()
    if not api_key:
        sys.exit("JQUANTS_API_KEY not set (checked environment and research/stocks/.env.local)")

    codes = [c.strip() for c in args.codes.split(",") if c.strip()]
    if not codes:
        sys.exit("no ticker codes provided")

    os.makedirs(out_dir_abs, exist_ok=True)
    out_csv = os.path.join(out_dir_abs, "adjusted_prices.csv")
    out_meta = os.path.join(out_dir_abs, "fetch_metadata.json")

    limiter = RateLimiter(MIN_SECONDS_BETWEEN_REQUESTS)
    rows = []
    per_ticker_counts = {}
    missing = []

    for code in codes:
        print(f"fetching {code} ...", file=sys.stderr)
        try:
            records = fetch_ticker(api_key, code, args.from_date, args.to_date, limiter)
        except RuntimeError as e:
            print(f"  ERROR: {e}", file=sys.stderr)
            missing.append({"code": code, "error": str(e)})
            continue
        count = 0
        for r in records:
            adj_close = r.get("AdjC")
            d = r.get("Date")
            if adj_close is None or d is None:
                continue  # no-trade day or incomplete record; skip rather than fabricate a value
            rows.append({"date": d, "ticker": code, "close": adj_close})
            count += 1
        per_ticker_counts[code] = count
        print(f"  {count} rows", file=sys.stderr)

    rows.sort(key=lambda r: (r["ticker"], r["date"]))
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["date", "ticker", "close"])
        writer.writeheader()
        writer.writerows(rows)

    metadata = {
        "source": "J-Quants API V2, /equities/bars/daily, Free plan",
        "fetched_at_utc": datetime.now(timezone.utc).isoformat(),
        "requested_codes": codes,
        "requested_range": {"from": args.from_date, "to": args.to_date},
        "adjustment_method": "AdjC field returned directly by the API (split/rights-adjusted close); not recomputed locally",
        "rows_per_ticker": per_ticker_counts,
        "missing_or_errored_codes": missing,
        "known_constraints": [
            "Free plan: approx. 2 years history, approx. 12-week reporting delay",
            "No dividend adjustment confirmed distinct from split/rights adjustment; treat as unverified",
            "TOPIX daily data is not available on the Free plan",
        ],
        "terms_of_use_note": "Personal, non-commercial use only; raw data must not be redistributed or committed to a public repository",
    }
    with open(out_meta, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

    print(f"wrote {len(rows)} rows to {out_csv}", file=sys.stderr)
    print(f"wrote metadata to {out_meta}", file=sys.stderr)
    if missing:
        print(f"WARNING: {len(missing)} code(s) failed: {[m['code'] for m in missing]}", file=sys.stderr)


if __name__ == "__main__":
    main()
