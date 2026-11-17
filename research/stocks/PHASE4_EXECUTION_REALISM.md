# Phase 4: execution realism & out-of-sample validation (2026-10-08)

Follows Phase 2 (`ROBUSTNESS_AUDIT.md`) and Phase 3 (`PHASE3_SKABU_COMPARISON.md`).
Phase 4 addresses the owner's PR #20 comment "Phase 4 — execution realism &
out-of-sample validation (research only)": Priority A (verify causal timing)
and Priority B (robust performance) — same local-only, no network, no
brokerage, no `main`-merge rules as before.

## Priority A: verify causal timing

### A.1 — explicit, checked timing assumptions (`execution_timing.py`)

The engine's long-standing convention — signal from the prior trading day's
close, execute at the next observed trading day's close — was already proven
free of same-day lookahead by `test_backtest.py`'s
`test_no_future_price_used_for_signal` / `test_future_shock_cannot_change_past_equity`.
Phase 4 does not change that proof; it makes the convention an **auditable,
checked** assumption instead of an implicit one:

- `assert_same_day_close_fill_assumption_holds(True)` — every caller relying
  on the next-day-close convention must explicitly acknowledge that it is
  only a valid proxy for SBI S-Kabu execution if the (unmodeled) order sits
  within SBI's `10:30–14:00` same-day-close window (see §A.2). Passing
  `False`, or omitting the argument, raises rather than silently assuming a
  fill.
- `validate_trading_calendar(common_dates)` — rejects any consecutive-date
  gap larger than `MAX_PLAUSIBLE_GAP_DAYS` (10 calendar days, comfortably
  above Japan's longest ordinary closures — New Year, Golden Week). An
  anomalously large gap more likely indicates a data problem (halt, missing
  rows, delisting) than an ordinary weekend/holiday, and is rejected rather
  than silently trusted.
- Neither function is wired into `backtest.run()` itself — doing so would
  risk silently changing behavior already covered by existing passing tests.
  Instead, `phase4_report.py` calls both explicitly as a **preflight step**
  before running anything else, and surfaces the result under
  `timing_preflight` in its JSON output. A deterministic daily order
  workflow (explicit timestamp guards, trading-calendar checks, rejection
  when information is unavailable) is exactly what these two functions
  implement; nothing here silently assumes a guaranteed close fill.

### A.2 — SBI S-Kabu rules: fresh re-confirmation

Re-confirmed on **2026-10-08T17:13:37Z**: this sandbox's egress policy still
blocks `sbisec.co.jp` / `search.sbisec.co.jp` directly (same `connect_rejected`
result as earlier attempts against `jpx-jquants.com` / `api.jquants.com`, and
as recorded in `PHASE3_SKABU_COMPARISON.md`). The rules below are therefore
**confirmed via web search of SBI's own official domain** at that timestamp,
not by directly reading the page from this environment — unchanged from
Phase 3, now re-verified rather than merely carried forward unchecked:

- Market orders only; four order-time windows (`00:00–07:00` → morning
  opening, `07:00–10:30` → afternoon opening, `10:30–14:00` → afternoon
  **closing**, `14:00–24:00` → next business day's morning opening); unfilled
  opening-price orders roll to that day's closing session, then expire;
  stop-priced closes allocate no S-Kabu orders.
- 1-share trading unit; commission **and** spread both zero under SBI's
  "Zero Revolution" program.
- **Re-verify against the official page** —
  `https://search.sbisec.co.jp/v2/popwin/attention/trading/stock_07.html` —
  before relying on this for a real decision. This report distinguishes
  search-snippet confirmation from a direct page fetch throughout, per the
  owner's explicit instruction; no claim here is "directly checked."
- As in Phase 3, this project has no intraday opening-price data anywhere in
  its CSVs, so only the `10:30–14:00 → same-day close` bucket is modeled.
  The three opening-price buckets, roll-to-close/expiry, and stop-allocation
  non-execution remain **explicitly unmodeled** — reconstructing them would
  require inventing intraday prices this project does not have, which the
  task explicitly rules out. If daily OHLC/market-status data is ever
  supplied, this is the gap to revisit first.

## Priority B: robust performance

### B.3 — proper walk-forward validation (`walk_forward.py`, fixing a warm-up artifact)

Phase 2's `time_split.py` independently re-slices the input prices per
sub-period and re-runs `backtest.run()` from scratch on each slice. Each
independent run needs `lookback` days of its **own** sliced history before it
can generate a first signal — splitting ~489 observations into 2 periods with
`lookback=126` means each ~244-observation half burns roughly half of itself
on warm-up, leaving only ~118 genuinely-evaluated days in the second half.
More splits make this proportionally worse.

`walk_forward.walk_forward_report()` fixes this by running `backtest.run()`
**once** over the full period with the caller's chosen parameters (never
tuned per window), then reporting each "window" as a date-range **slice** of
that single, already-computed equity curve and rebalance log. Per-split
trade counts, equity, return %, max drawdown, worst month, and monthly
returns are all derived from the slice. The tradeoff is stated in the
report's own `warmup_note` field: later windows are not fully independent
from-a-blank-slate re-estimations — their signals used genuinely-prior
history that was legitimately available by then (not lookahead), which is
exactly what avoids the warm-up waste, but means the windows are not
statistically independent of each other. With only ~489 trading days (~2
years) total, this short-window statistical-power limitation (already flagged
in Phase 2) still applies; `n_splits=2` is the default precisely because more
splits would make both the original warm-up artifact and this trade-off
worse, not better.

### B.4 — comparable, lot-matched benchmarks (bug found and fixed in `skabu_model.py`)

Phase 3's `compare_lot_models()` had a real defect, found during this phase's
audit rather than assumed away: every lot-size strategy (fractional, 100-share,
S-Kabu 1-share at two cost assumptions) was benchmarked against a single,
always-**fractional-share** `buy_and_hold_equal_weight(...)` baseline — a
mismatched comparison, exactly what the owner's Priority B.4 flagged ("avoid
false 100-share/cash baseline comparisons"). Fixed by adding four lot-matched
buy-and-hold baselines, each built with the **same** `lot_size` and `cost_bps`
as the strategy it benchmarks:

| Strategy | Matched baseline | `lot_size` | `cost_bps` |
|---|---|---|---|
| `fractional_shares` | `buy_and_hold_fractional` | `None` | comparison (20 default) |
| `lot_100_shares` | `buy_and_hold_lot_100` | 100 | comparison (20 default) |
| `skabu_1_share_zero_cost` | `buy_and_hold_skabu_1_share_zero_cost` | 1 | 0 (official) |
| `skabu_1_share_same_cost_as_lots` | `buy_and_hold_skabu_1_share_same_cost_as_lots` | 1 | comparison (20 default) |

`test_skabu_model.py` gained `test_each_strategy_compared_against_matching_lot_size_baseline`,
asserting each pair shares a `lot_size`. TOPIX remains `not_computed` unless
the caller supplies a legitimately-sourced local CSV (`baselines.topix_baseline_from_csv`) —
no value is invented, same as Phase 2.

### B.5 — realistic failure modes (`phase4_report.py`)

`phase4_report.py`'s `failure_mode_sensitivity` section adds four stress
cases around the same baseline run, none of which claims to predict
real-world frequency:

- **`no_fill`** — a trade that never fills leaves that capital in cash;
  approximated by the existing `cash_baseline()` rather than inventing a new
  partial-fill mechanic.
- **`one_session_execution_delay`** — reuses `backtest.run()`'s
  `execution_delay_sessions=1` (added in this phase; `execution_delay_sessions=0`
  is byte-identical to every prior version of `run()`, verified by
  `test_backtest.py::test_default_delay_zero_matches_original_rebalance_log`).
  A later signal arriving before a deferred trade executes replaces the
  pending one ("most recent decision wins"); `overlapping_signals_discarded`
  counts how often this happened.
- **`worse_execution_slippage`** — the same strategy re-run at
  `cost_bps=100` (5× the project's standard 20bps assumption) as a stressed
  execution-quality case — a sensitivity row, not a measured or predicted
  slippage figure.
- **Dividend/corporate-action uncertainty, liquidity, and concentration** are
  reported as qualitative notes, not fabricated numbers:
  - *Concentration* is already capped in `backtest.run()` at
    `min(equal_weight, 20% of current cash)` per rebalance; Phase 4 does not
    relax or re-tune that cap.
  - *Liquidity* cannot be modeled from what this project actually has: the
    CSVs contain daily **close** prices only, no volume — there is no basis
    for estimating what fraction of a day's volume an order would represent,
    or any resulting market-impact cost. Stated as an unmodeled gap, not
    assumed negligible.
  - *Dividend/corporate-action uncertainty* repeats Phase 2's standing caveat
    (whether the adjusted-close series already reflects dividends beyond
    splits/rights could not be confirmed from this environment) and adds
    that a corporate action landing exactly on a rebalance date could distort
    that day's momentum ranking in a way daily closes alone cannot detect.

### B.6 — compact JSON summary and tests

`phase4_report.py` ties `execution_timing`'s preflight,
`walk_forward.walk_forward_report()`, the now lot-matched
`skabu_model.compare_lot_models()`, and the failure-mode sensitivity above
into **one** JSON object — `equity_curve`, `final_positions`, and
`rebalance_log` are stripped everywhere in it, same compact-report convention
as Phase 2/3. `test_phase4_report.py` (12 tests) covers: all required
top-level sections present; the timing preflight actually ran (and that an
anomalous calendar gap is rejected, not silently accepted, via
`test_anomalous_calendar_gap_is_rejected_not_silently_accepted`); every
failure-mode case present with `no_fill` matching a plain cash baseline;
lot-matched baselines paired correctly; no raw curves anywhere in the JSON
text; no parameter silently changed between sections (same `cost_bps`/
`lookback` everywhere); and the CLI itself runs end-to-end as a subprocess,
writes `--out`, and fails cleanly (not a crash) on a bad CSV.
`test_execution_timing.py` (14 tests) and `test_walk_forward.py` (8 tests)
cover those two new modules independently. `test_backtest.py` gained
`TestExecutionDelaySessions` (5 tests) proving `execution_delay_sessions=0`
exactly reproduces every prior behavior and that a positive delay defers
execution deterministically.

## Overfitting guard (unchanged principle, reapplied here)

No window, split, or failure-mode case in Phase 4 had any parameter searched
or adjusted to make a result look better. `walk_forward_report()` runs the
**same** single backtest once and slices it; `failure_mode_sensitivity`'s four
cases all share the same `lookback`/`max_names`/strategy as the baseline,
varying only the one dimension each case names. All of Phase 2's and Phase
3's standing caveats (short ~2-year sample, survivorship/selection bias in
how the 10 symbols were chosen, unverified dividend adjustment, S-Kabu rule
sourcing) apply unchanged and are repeated in every Phase 4 report's
`caveats` list — nothing here claims production accuracy.

## Running this on your Mac

```bash
cd /path/to/57hustler/research/stocks

# 1) Run the full test suite (125 tests as of Phase 4; standard library
#    only, no network, no key).
python3 -m unittest discover -v

# 2) Generate the Phase 4 execution-realism / out-of-sample report on your
#    existing local CSV.
python3 phase4_report.py ~/Desktop/stock-research-all10/adjusted_prices.csv \
  --lookback 126 --max-names 5 --cost-bps 20 --n-splits 2 \
  --out ~/Desktop/stock-research-all10/phase4_report.json
```

`phase4_report.json` is written locally only and contains no raw per-day
price series or equity curves — only the timing preflight result, walk-forward
windows, lot-matched model comparison, failure-mode sensitivity cases, and
caveats described above.
