# Phase 6: reducing ticker-selection bias & verifying reproducibility (2026-10-09)

Follows Phase 5 (`PHASE5_UNBIASED_VALIDATION.md`) and its real-data follow-up fixes.
Goal, as the owner stated it: reduce ticker-selection bias and verify the
reproducibility of the current strategy — not add new trading features. Draft PR
#20 branch only; no `main` merge, no real orders, no brokerage connection, no new
paid services, no API keys or price CSVs uploaded. Nothing in this phase fabricates
a performance figure; where real data would be needed to answer a question, this
document says so plainly instead of guessing.

## 1. Audit: when and on what basis were the current 10 tickers chosen?

Searched this repository's **entire git history** (`git log -p --all`) and every
PR #20 comment for the ticker codes `8035, 6857, 6146, 7735, 6920, 6370, 9551, 6326,
6361, 6508`. Findings:

- The **earliest** appearance of this exact list anywhere in this repository is
  `ROBUSTNESS_AUDIT.md` (Phase 2, commit `6da6f64`), which states: *"The owner's
  initial local run (10 symbols: ...) is unvalidated and NOT an investment
  result."* That same document's own "Selection / survivorship bias" section
  already says: *"The 10 symbols were chosen outside this codebase (by the owner).
  Whether that choice was made using any information from after 2024-07-17, or
  because of their known subsequent performance, cannot be verified from this
  repository."*
- The owner's "Phase 2" PR comment (`2026-10-08T16:43:38Z`) likewise presents the
  10 symbols as an already-decided fact of a prior **local** run ("Local J-Quants
  Free data acquisition and initial audit completed: 10 symbols ...") — it does not
  explain a selection methodology, and no earlier PR comment or commit does either.
- No commit, script default, README note, or `DATA_EXECUTION_GATE.md` entry records
  a selection date, a written criterion (e.g. "top N by market cap in sector X as of
  date Y"), or any point-in-time snapshot used to pick these specific 10 names.

**Conclusion, stated as the task requires: the selection date and selection
criteria for the original 10 tickers are UNKNOWN / UNVERIFIABLE from this
repository.** This was already correctly flagged as unverifiable in Phase 2; Phase
6 does not change that conclusion, only re-confirms it was never silently forgotten
and records that this fresh search (2026-10-09) found no new information. The later
sector classification recorded in `DATA_READINESS_REPORT.md` (semiconductors:
8035/6857/6146/7735/6920; water-related: 6370/9551/6326/6361/6508) describes **what
sector each company is in today**, by general knowledge and web search — it is not,
and was never claimed to be, evidence about *when* or *why* these 10 specific names
were originally picked over any others.

## 2. Point-in-time universe construction, extended across time (`universe.py`)

Phase 5 already added `build_point_in_time_universe(events, as_of_date, sector=None)`
— one date, one universe, using only information knowable by that date. Phase 6
adds `point_in_time_universe_series(events, dates, sector=None)`: the same mechanism
applied across a whole sequence of **rebalance** dates, returning one universe per
date plus `added`/`removed` tickers relative to the previous date in the series —
so universe churn over time is explicit and auditable, not something a caller has
to reconstruct by diffing independent snapshots by hand.

No lookahead is introduced: each date's universe is still computed independently
via `build_point_in_time_universe()`, so an event dated after an earlier rebalance
date can never change that earlier date's own universe — proven directly by
`test_later_date_universe_never_affects_earlier_date_universe` (comparing a series
built with a future delisting event present vs. absent; the two must be byte-equal
for every date up to the point the series actually diverges in the test's data).

**Explicitly NOT done, to avoid overclaiming:** this is still not wired into
`backtest.run()`, which assumes one fixed universe for an entire run. Running a
backtest where tickers are added/dropped mid-run (handling the cash from a dropped
position, re-normalizing weights, etc.) is real, further engineering work — this
function only produces the per-date universe *series*, the prerequisite data
structure for that future integration, not the integration itself. Exercised only
against synthetic fixtures (`test_universe.py`); no real metadata exists for this
project's actual tickers (see §3).

## 3. What J-Quants Free actually provides vs. what it does not (`data_availability.py`)

New reference module separating, explicitly, what this project has confirmed is
available on the J-Quants API V2 Free plan from what is not — sourced from
`DATA_READINESS_REPORT.md`'s web-search findings (2026-10-09) and
`DATA_EXECUTION_GATE.md`'s existing notes; no new claim about J-Quants is made
beyond what those documents already record.

| Available on Free | Not available on Free |
|---|---|
| Current listed-company list | **Historical, point-in-time listed/delisted-company list** |
| Daily OHLC equities (≈2yr, minus ~12wk lag) | TOPIX daily OHLC |
| Financial summary (sammary only) | Point-in-time sector/category history |
| — | Intraday minute/tick data (paid tiers) |
| — | CSV bulk download (Light plan+) |

The single most consequential gap is **"historical, point-in-time listed/delisted-
company list."** J-Quants Free only ever exposes *today's* listed-company list —
there is no confirmed way to ask "who was listed on 2024-07-17." This is precisely
why a present-day ticker list can never be treated as a safe stand-in for a
point-in-time universe: a name delisted since would silently vanish with no flag
that it was ever there, and a name listed after the backtest's start date would
silently appear to have existed the whole time.

`assert_no_delisted_ticker_fabrication(point_in_time_events)` encodes this as a
runnable guard: it raises if called with no point-in-time events at all, rather
than silently letting a caller treat a present-day ticker list as complete
history. Any future code that tries to build a *real* point-in-time universe from
J-Quants data must go through this gate — which, given §3's findings, it cannot
currently pass without the owner (or a licensed data vendor) supplying listing/
delisting history this project cannot get from J-Quants Free on its own.

## 4. `bias_unresolved` stays `true` — nothing here resolves it

Nothing in this phase supplies real point-in-time metadata (none exists for this
project yet), so `universe.bias_status(has_point_in_time_metadata=False)` —
the only call this project can honestly make right now — still returns
`bias_unresolved: true` with the same `data_required` list as Phase 5. Every
report this phase could produce against real data (none has been run; see §7)
would need to carry this flag forward unchanged. This is intentional: Phase 6's
job is to build the *mechanism* that would resolve survivorship bias if real
listing/delisting history is ever supplied (§2, §3), not to pretend it has been
resolved by writing code.

## 5. OOS ledger: don't re-use an already-evaluated holdout window (`oos_ledger.py`)

New, git-tracked `oos_ledger.json` + `oos_ledger.py`. Contains **no raw prices,
equity curves, or fabricated performance figures** — only period bounds, a
parameter manifest hash, a status, and bookkeeping metadata. Two statuses:

- `"reserved"`: a window has been **designated** as a holdout test window (e.g.
  agreed on with the owner) but no real result has been reported back yet. A
  reserved window does **not** block a run against it — that single real run is
  exactly what the reservation exists to permit.
- `"evaluated"`: a **real** result (from the owner's own Mac run against real
  data) has actually been reported and recorded. An evaluated window **does**
  block any later attempt to treat the same calendar period as fresh, untouched
  data — `oos_ledger.assert_window_not_already_evaluated()` raises on overlap.

**Seeded now:** one `"reserved"` entry for `[2025-12-19, 2026-06-30]` — the fixed
OOS window `oos_window_comparison.py` already defaults to, designated in this
conversation. Its `manifest_hash` is `preregistration.PRE_REGISTERED_MANIFEST_HASH`.
**No performance figure is recorded for it** — this cloud sandbox cannot access the
owner's real `adjusted_prices.csv`, so none exists yet. The entry's own note spells
out the promotion path: once the owner runs `oos_window_comparison.py` against real
data, re-running it with `--record-ledger` promotes this entry to `"evaluated"`
with the **real** `oos_status` that run computes — never a guessed one.

`oos_window_comparison.oos_vs_buy_and_hold_report()` gained an optional `ledger=`
parameter (omitted by default, so every existing caller/test is unaffected); its
CLI loads and checks `oos_ledger.json` **by default** (`--ignore-ledger` to skip,
`--ledger-path` to redirect — mainly for testing) and supports `--record-ledger` to
persist the real result after a run.

## 6. Designing the future time-series validation workflow (no retuning on past results)

The mechanism that already exists and is reused here, not reinvented: pre-registered,
hash-frozen parameters (`preregistration.PRE_REGISTERED_PARAMS` /
`PRE_REGISTERED_MANIFEST_HASH`, Phase 5) plus the OOS ledger above. Together they
define the protocol for evaluating the strategy against **future, not-yet-collected**
data without adjusting parameters by looking at past performance:

1. When new real data arrives covering a later period, compute the next candidate
   OOS window's start via `oos_ledger.suggest_next_window_start(ledger)` — the day
   **after** the latest `end` date among *every* recorded entry (reserved or
   evaluated), so the starting point is a mechanical function of what has already
   been consumed, never an eyeballed "this period looks like a good test."
2. Run `oos_window_comparison.py` (or `preregistration.holdout_protocol_report()`
   directly) with that new window, passing `expected_manifest_hash=
   PRE_REGISTERED_MANIFEST_HASH` (the default) — if the parameters in use ever
   differ from what was frozen in Phase 5, the manifest check raises instead of
   silently evaluating a quietly-changed strategy.
3. The ledger check (`assert_window_not_already_evaluated`) refuses to let that new
   window overlap any window already marked `"evaluated"` — so a later verification
   pass cannot "accidentally" re-select a period whose result is already known and
   call it a fresh test.
4. Once a real result comes back, `--record-ledger` appends it as `"evaluated"` —
   append-only; nothing here ever edits or deletes a past evaluated entry's
   figures, so the record of what has actually been tested only grows.
5. **No step above ever reads a past OOS result and then changes
   `lookback`/`max_names`/`cost_bps` for the next window.** `oos_window_comparison.py`'s
   CLI does not even expose those as flags (Phase 5 decision, unchanged); the only
   way to legitimately change the pre-registered parameters is to edit
   `preregistration.py`'s `PRE_REGISTERED_PARAMS` directly, which changes the
   manifest hash and is therefore a visible, reviewable diff in this repository —
   not a silent, undocumented adjustment.

This is a **design + the supporting mechanism**, tested against synthetic fixtures;
it has not yet been exercised against a second real-data window, because no second
window's real data exists yet. `suggest_next_window_start()` is covered directly in
`test_oos_ledger.py`.

## 7. Tests

All existing tests kept, zero modified. New tests, all against synthetic fixtures,
zero network calls, zero real data:

| File | New tests |
|---|---|
| `test_universe.py` | +9 (`PointInTimeUniverseSeriesTests`) |
| `test_data_availability.py` | +8 (new file) |
| `test_oos_ledger.py` | +17 (new file) |
| `test_oos_window_comparison.py` | +5 (ledger integration: 3 on the report function, 2 on the CLI) |

```
cd research/stocks && python3 -m unittest discover -v
# Ran 264 tests ... OK
```

## Biases resolved vs. still unresolved (stated plainly)

**Resolved / newly auditable this phase:**
- The original ticker-selection date/criteria question now has a definitive answer
  — *unknown, unverifiable from this repository* — recorded with the actual search
  performed, instead of being an open question nobody had explicitly checked.
- It is no longer possible to silently redefine an already-evaluated OOS window as
  "fresh" data without an explicit `--ignore-ledger` override that shows up in the
  command actually run (`oos_ledger.json` + the enforcement in
  `oos_window_comparison.py`).

**Still unresolved (cannot be resolved without data this project does not have):**
- Survivorship bias in the current 10-ticker universe: `bias_unresolved: true`
  stands, because no point-in-time listing/delisting history exists for them (§3,
  §4). `universe.py`'s mechanism exists for *if/when* that data is ever supplied —
  it cannot manufacture history that was never recorded.
- Whether the original 10 tickers were chosen using any hindsight: unverifiable,
  not just unresolved — the information needed to answer this (the owner's own
  selection process, outside this codebase) may not be reconstructable at all.
- The designated OOS window `[2025-12-19, 2026-06-30]` has no real result yet;
  `oos_ledger.json` records it as `"reserved"`, not `"evaluated"`.

## Running this on your Mac

```bash
cd /path/to/57hustler/research/stocks
git fetch origin docs/ai-harness-trading-research-20261008
git checkout docs/ai-harness-trading-research-20261008

# 1) Run the full test suite (264 tests as of Phase 6; standard library
#    only, no network, no key, no real data).
python3 -m unittest discover -v

# 2) Run the designated OOS window against your real local CSV, and record
#    the REAL result (not a guess) into oos_ledger.json so it cannot later
#    be silently treated as still-unused data.
python3 oos_window_comparison.py ~/Desktop/stock-research-all10/adjusted_prices.csv \
  --record-ledger \
  --out ~/Desktop/stock-research-all10/oos_window_comparison.json

# 3) After step 2, oos_ledger.json will have changed locally (status
#    promoted to "evaluated" for 2025-12-19..2026-06-30). If you want that
#    change committed, do so explicitly -- it still contains no raw prices
#    or equity curves, only the window bounds, the manifest hash, and the
#    oos_status string.
git diff research/stocks/oos_ledger.json
```
