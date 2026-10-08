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
  to any output file, and is never included in any exception message (only the
  server's response body/status is, which never echoes the request's own
  headers).
- Root .gitignore already excludes `.env*` repo-wide; this script never writes
  the key anywhere itself.

Diagnostic mode (--diagnose-code):
- Fetches a single ticker only and prints a JSON diagnostic summary to stdout.
  Writes no files, needs no --out-dir/--codes. Intended for working out why a
  request fails (e.g. HTTP 400 from a bad parameter) without touching the
  output pipeline.

Output handling (per DATA_EXECUTION_GATE.md step 5):
- Batch mode writes fetched prices + a metadata JSON to an output directory
  the caller supplies. Callers must point --out-dir OUTSIDE any git working
  tree (e.g. the session scratchpad) so real market data is never committed.
  The repository root is located dynamically by walking up from this script's
  own location looking for a .git directory; if this file has been copied
  standalone to somewhere with no git ancestor at all (e.g. saved alone to a
  Desktop folder), there is no repository to protect and the check does not
  fire — it does not assume a fixed "two directories up" layout.
- Free plan constraints assumed per J-Quants official docs reviewed 2026-10-08:
  ~2 years of history, ~12-week reporting delay, 5 requests/minute rate limit,
  no CSV bulk download (API only). This script self-throttles to stay under
  the rate limit, retries HTTP 429 a bounded number of times with backoff
  (honoring a Retry-After header when the server sends one) rather than
  retrying forever, and does not attempt any paid-plan-only endpoint.

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
from datetime import datetime, timedelta, timezone

API_BASE = "https://api.jquants.com/v2"
MIN_SECONDS_BETWEEN_REQUESTS = 13.0  # Free plan: 5 req/min = 12s min; +1s margin
MAX_ERROR_BODY_CHARS = 500  # cap how much of a server error body we ever print


class JQuantsAPIError(Exception):
    """Raised for a non-retryable (or retry-exhausted) HTTP error from the API.
    Carries only information derived from the SERVER'S response — never the
    request's own headers or the API key — so it is always safe to print."""

    def __init__(self, status_code, message, body_snippet, retry_after=None):
        self.status_code = status_code
        self.message = message
        self.body_snippet = body_snippet
        self.retry_after = retry_after  # seconds, from the server's Retry-After header, if sent
        super().__init__(f"HTTP {status_code}: {message}")

    def diagnosis(self):
        hints = {
            400: "likely a malformed request: check that 'code' is a valid issue code and "
                 "'from'/'to' (or 'date') are YYYY-MM-DD and that at least one of code/date is set",
            401: "API key missing or invalid (not a parameter problem)",
            403: "key valid but not entitled to this endpoint/plan",
            404: "no data for this code/date range, or an unknown path",
            429: "rate limit exceeded even after retries; the Free plan allows 5 requests/minute",
        }
        return hints.get(self.status_code, "see body_snippet for the server's own explanation")


def load_api_key(base_dir=None):
    """Read JQUANTS_API_KEY from the environment, falling back to a local
    gitignored .env.local file for convenience. Never prints the value.
    base_dir defaults to this script's own directory; tests may override it
    so they never need to touch a real research/stocks/.env.local file."""
    key = os.environ.get("JQUANTS_API_KEY")
    if key:
        return key.strip()
    env_path = os.path.join(base_dir or os.path.dirname(__file__), ".env.local")
    if os.path.isfile(env_path):
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("JQUANTS_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


def find_repo_root(start_dir):
    """Walk upward from start_dir looking for a .git directory.
    Returns the repo root, or None if start_dir is not inside any git working
    tree (e.g. this script was copied standalone to a Desktop folder with no
    .git anywhere above it) — a fixed "N levels up from this file" assumption
    would misjudge that case, so we search instead of computing a path."""
    current = os.path.abspath(start_dir)
    while True:
        if os.path.isdir(os.path.join(current, ".git")):
            return current
        parent = os.path.dirname(current)
        if parent == current:
            return None
        current = parent


def is_inside_repo(path_abs, repo_root):
    if repo_root is None:
        return False
    return path_abs == repo_root or path_abs.startswith(repo_root + os.sep)


class RateLimiter:
    def __init__(self, min_interval):
        self.min_interval = min_interval
        self._last = 0.0

    def wait(self):
        elapsed = time.monotonic() - self._last
        if elapsed < self.min_interval:
            time.sleep(self.min_interval - elapsed)
        self._last = time.monotonic()


def _read_error_body(http_error):
    """Extract a safe, size-capped text snippet from the SERVER's error
    response. This is the server's own reply, never the outgoing request, so
    it cannot contain our API key or headers."""
    try:
        raw = http_error.read()
    except Exception:
        return ""
    try:
        text = raw.decode("utf-8", errors="replace")
    except Exception:
        text = repr(raw)
    return text[:MAX_ERROR_BODY_CHARS]


def _parse_retry_after(http_error, default=None):
    headers = getattr(http_error, "headers", None)
    value = headers.get("Retry-After") if headers else None
    if value is None:
        return default
    try:
        return max(0.0, float(value))
    except (TypeError, ValueError):
        return default


def _request_once(api_key, url):
    """Issue one HTTP GET. Returns the parsed JSON body on success, or raises
    JQuantsAPIError on any non-2xx response. The Authorization header is never
    included in anything this function returns or raises."""
    req = urllib.request.Request(url, headers={"x-api-key": api_key})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        snippet = _read_error_body(e)
        try:
            parsed = json.loads(snippet) if snippet else {}
        except ValueError:
            parsed = {}
        message = parsed.get("message") or parsed.get("error") or "(no message in response body)"
        # Read Retry-After here, while the original HTTPError (and its headers)
        # still exists; JQuantsAPIError itself never carries request/response
        # headers in general, only this one plain numeric value when present.
        retry_after = _parse_retry_after(e)
        raise JQuantsAPIError(e.code, message, snippet, retry_after=retry_after) from None


def fetch_ticker(api_key, code, date_from, date_to, limiter, max_retries=3):
    """Fetch all pages of daily bars for one ticker over [date_from, date_to].
    Returns a list of raw record dicts as returned by the API.

    HTTP 429 is retried up to max_retries times with backoff (honoring a
    Retry-After header if the server sends one); every other status is raised
    immediately as a JQuantsAPIError with no retry, since retrying a 400/401
    etc. cannot change the outcome."""
    records = []
    pagination_key = None
    while True:
        params = {"code": code, "from": date_from, "to": date_to}
        if pagination_key:
            params["pagination_key"] = pagination_key
        url = f"{API_BASE}/equities/bars/daily?{urllib.parse.urlencode(params)}"

        attempt = 0
        while True:
            limiter.wait()
            try:
                body = _request_once(api_key, url)
                break
            except JQuantsAPIError as e:
                if e.status_code == 429 and attempt < max_retries:
                    # Prefer the server's own Retry-After when it sends one;
                    # otherwise fall back to a capped exponential backoff tied
                    # to the rate-limit interval. Either way this is bounded by
                    # max_retries, not an unlimited retry loop.
                    wait_s = e.retry_after if e.retry_after is not None else min(60.0, limiter.min_interval * (2 ** attempt))
                    attempt += 1
                    time.sleep(wait_s)
                    continue
                raise

        records.extend(body.get("data", []))
        pagination_key = body.get("pagination_key")
        if not pagination_key:
            break
    return records


def diagnose(api_key, code, date_from, date_to, limiter):
    """Fetch a single ticker only and return a plain-dict diagnostic summary.
    Writes no files. Safe to print as-is: contains no headers or API key."""
    result = {"code": code, "requested_range": {"from": date_from, "to": date_to}}
    try:
        records = fetch_ticker(api_key, code, date_from, date_to, limiter, max_retries=1)
    except JQuantsAPIError as e:
        result["ok"] = False
        result["http_status"] = e.status_code
        result["server_message"] = e.message
        result["likely_cause"] = e.diagnosis()
        result["body_snippet"] = e.body_snippet
        return result

    dates = [r.get("Date") for r in records]
    with_adj_close = sum(1 for r in records if r.get("AdjC") is not None)
    result["ok"] = True
    result["row_count"] = len(records)
    result["rows_with_adjusted_close"] = with_adj_close
    result["rows_missing_adjusted_close"] = len(records) - with_adj_close
    result["first_date"] = min(dates) if dates else None
    result["last_date"] = max(dates) if dates else None
    return result


def build_parser():
    parser = argparse.ArgumentParser(description="Fetch adjusted daily closes from J-Quants API V2 (Free plan)")
    parser.add_argument("--codes", help="comma-separated ticker codes, e.g. 7203,6758 (batch mode)")
    parser.add_argument("--from-date", help="YYYY-MM-DD")
    parser.add_argument("--to-date", help="YYYY-MM-DD")
    parser.add_argument("--out-dir", help="output directory outside any git working tree (required in batch mode)")
    parser.add_argument("--diagnose-code", help="fetch one ticker only, print a diagnostic summary, write no files")
    return parser


def main():
    args = build_parser().parse_args()

    api_key = load_api_key()
    if not api_key:
        sys.exit("JQUANTS_API_KEY not set (checked environment and research/stocks/.env.local)")

    limiter = RateLimiter(MIN_SECONDS_BETWEEN_REQUESTS)

    if args.diagnose_code:
        if args.codes or args.out_dir:
            sys.exit("--diagnose-code cannot be combined with --codes/--out-dir")
        today = datetime.now(timezone.utc).date()
        date_from = args.from_date or (today - timedelta(days=14)).isoformat()
        date_to = args.to_date or today.isoformat()
        result = diagnose(api_key, args.diagnose_code, date_from, date_to, limiter)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        sys.exit(0 if result["ok"] else 1)

    if not args.codes or not args.from_date or not args.to_date or not args.out_dir:
        sys.exit("--codes, --from-date, --to-date and --out-dir are all required unless --diagnose-code is used")

    repo_root = find_repo_root(os.path.dirname(os.path.abspath(__file__)))
    out_dir_abs = os.path.abspath(args.out_dir)
    if is_inside_repo(out_dir_abs, repo_root):
        sys.exit(f"refusing to write fetched market data inside the git repository ({repo_root}); "
                 "choose an --out-dir outside it")

    codes = [c.strip() for c in args.codes.split(",") if c.strip()]
    if not codes:
        sys.exit("no ticker codes provided")

    os.makedirs(out_dir_abs, exist_ok=True)
    out_csv = os.path.join(out_dir_abs, "adjusted_prices.csv")
    out_meta = os.path.join(out_dir_abs, "fetch_metadata.json")

    rows = []
    per_ticker_counts = {}
    missing = []

    for code in codes:
        print(f"fetching {code} ...", file=sys.stderr)
        try:
            records = fetch_ticker(api_key, code, args.from_date, args.to_date, limiter)
        except JQuantsAPIError as e:
            print(f"  ERROR: HTTP {e.status_code}: {e.message} ({e.diagnosis()})", file=sys.stderr)
            missing.append({"code": code, "http_status": e.status_code, "server_message": e.message})
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
