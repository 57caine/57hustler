# Phase 2: robustness audit (2026-10-08)

Implements the owner's Phase 2 robustness-audit comment on Draft PR #20. Everything
here runs **locally only** — no network calls, no brokerage connectivity, no new
paid services, no secrets, no raw J-Quants data committed to this repository.
Draft PR #20 stays Draft; nothing here merges to `main`.

The owner's initial local run (10 symbols: 8035, 6857, 6146, 7735, 6920, 6370,
9551, 6326, 6361, 6508; 489 dates each, 4,890 rows, 2024-07-17 to 2026-07-17;
virtual ¥1,000,000 → ¥2,059,918.62, +105.99%, max DD -27.28%, 161 trades,
`cost_bps=20`) is **unvalidated and NOT an investment result**. Nothing in this
document changes that; it adds the tooling to actually validate it.

## 1. Lookahead / timing / date-alignment / adjusted-price / survivorship audit

### Signal vs. execution timing — verified, not just asserted
`backtest.run()` rebalances on the first trading day of a new month (`d`), using
a signal computed from `common[i-1]` (the **prior** trading day's close) relative
to `common[i-1-lookback]`. The signal day is always strictly before the execution
day `d`, so the signal can never see `d`'s own price. This is backed by two
existing synthetic-data tests that assert it directly, not just by reading the
code: `test_backtest.py::test_no_future_price_used_for_signal` and
`::test_future_shock_cannot_change_past_equity` (a price shock placed on the last
date of a series provably does not change any equity-curve value before it).
Both still pass. **Conclusion: no lookahead in the signal/execution split**, under
the already-stated convention that execution happens at the next observed trading
day's close (not a live, same-day fill).

### Date alignment — confirmed limitation, not new
`common = sorted(set.intersection(*(set(x) for x in prices.values())))` keeps
only dates where **every** ticker has a price. A single ticker's missing day (a
real halt, a data gap, anything) silently drops that date **for all tickers**,
not just the affected one. This was already named as a known limitation in
`DATA_EXECUTION_GATE.md` step 3 and `README.md`; this audit does not change that
behavior (scope was explicitly limited to the category-fix and robustness
additions below, not a rewrite of the core engine's calendar handling).

### Adjusted-price handling — partially unverifiable from this environment
`fetch_jquants.py` uses the `AdjC` field the J-Quants API returns directly,
rather than recomputing a cumulative adjustment factor locally. Per the research
done for Draft PR #20's earlier comments, J-Quants' own documentation is split on
whether this adjustment also covers dividends versus only splits/reverse-splits/
rights issues (the English and Japanese spec pages disagreed in what could be
retrieved by web search from this environment, and the exact spec page could not
be fetched directly — this sandbox's egress policy blocks `jpx-jquants.com` and
`api.jquants.com`, confirmed via the proxy's own status log, not assumed).
**This remains explicitly unverified.** If the adjustment excludes dividends,
total-return figures here are systematically understated versus a true
total-return benchmark, in a way this codebase cannot currently detect or
correct. `fetch_jquants.py`'s own metadata already carries this caveat.

### Selection / survivorship bias — unverifiable here, must be stated plainly
The 10 symbols were chosen outside this codebase (by the owner). Whether that
choice was made using any information from after 2024-07-17, or because of their
known subsequent performance, **cannot be verified from this repository** — it
depends entirely on how and when the owner picked them. If the selection used
hindsight in any way, the backtest result is not meaningful regardless of how
correct the mechanics are. `report.py`'s output states this caveat on every run
rather than letting it be forgotten. Separately: delisting/renaming is not
specifically handled (no listed-issue-master cross-check is performed), so if any
of the 10 were delisted or merged during the window, that is also unverified.

### What is now machine-checked vs. what is still a documented caveat
| Item | Status |
|---|---|
| No lookahead in signal vs. execution | Verified by existing synthetic tests |
| Common-date-only calendar handling | Confirmed limitation (pre-existing, unchanged) |
| `AdjC` used as-is, not recomputed | Confirmed by code; dividend coverage unverified |
| Selection/survivorship bias in the 10 symbols | Unverifiable from this codebase |
| Delisting/renaming during the window | Not checked; unverified |

## 2. Independent baselines (`baselines.py`)

- `buy_and_hold_equal_weight(prices, ...)`: equal-weight buy on the first common
  date across the **same 10 symbols**, held with no rebalancing to the last
  common date, using the same `cost_bps` convention as the momentum strategy on
  entry and exit, so the comparison is apples-to-apples.
- `cash_baseline(...)`: the trivial zero-return floor.
- `topix_baseline_from_csv(path, ...)`: **only** computed if a local, legally
  obtained TOPIX CSV (`date,close`) is supplied via `--topix-csv`. J-Quants Free
  does not provide TOPIX OHLC (confirmed in the earlier Draft-PR research); this
  tool does not invent, estimate, or substitute a proxy value. Without
  `--topix-csv`, `report.py`'s output explicitly says `"status": "not_computed"`
  with the reason, rather than omitting the field or guessing.

## 3. Time-split validation and sensitivity (`time_split.py`)

`time_split_report()` runs the backtest independently on `n_splits` contiguous,
non-overlapping sub-periods using **the same fixed parameters on every split** —
nothing here searches for the best split-specific parameters, which would be
exactly the overfitting the owner's comment warns against.

**Stated plainly: with ~2 years of data and monthly rebalancing, there are only
on the order of 16-17 rebalances in the whole sample.** A 2-way split (the
default) already leaves each half with roughly 8-9 rebalances — far too few for
a period-level return or drawdown to be statistically meaningful on its own. This
module defaults to `n_splits=2` for exactly that reason and does not encourage
more splits; treat every split's output as illustrative, not as evidence either
way.

`sensitivity_sweep()` runs a small, **fixed-before-looking-at-results** grid of
`(lookback, max_names, cost_bps)` combinations over the full period and reports
every outcome side by side. Running this grid is sensitivity analysis; it is
sensitivity analysis only as long as no later step picks the best-performing row
and reports it as "the" result — `report.py` does not do that, and if a future
change starts doing so, this document's premise would no longer hold.

## 4. Realistic lots, costs, and tax (`backtest.py`)

- `run(..., lot_size=None)`: default `None` is **byte-for-byte unchanged**
  original behavior (fractional shares, research-only) — this is covered by a
  golden-value regression test (`test_default_lot_size_preserves_original_values`)
  asserting the exact same `final` the pre-Phase-2 code produced for a fixed
  synthetic series. Pass `lot_size=100` (or any other positive integer) for the
  realistic whole-lot mode: every buy rounds down to a multiple of `lot_size`,
  and the rounding remainder stays in cash — never spent, never lost.
- Transaction cost is still the single `cost_bps` knob that already existed; it
  is **not** split into separate commission/spread components here (that would
  be a larger, separate change). This is listed as a caveat in every report.
- `after_tax_summary(result, tax_rate=0.20315)` is a **separate function**,
  called after `run()` finishes, never mixed into position sizing. It applies one
  flat rate to the backtest's total realized gain. It explicitly does not model
  loss carryforward, NISA/tax-advantaged accounts, withholding timing, or
  unrealized gains on any still-open position — see its own `note` field, always
  present in the output.
- Real execution/price gaps (slippage beyond what `cost_bps` assumes, partial
  fills, the fact that a "next day's close" fill is still a simulation, not a
  live order) are not newly modeled; they remain a standing limitation, restated
  here rather than silently dropped.

## 5. Metrics (`metrics.py`)

- `monthly_returns(equity_curve)`: month-over-month % change using each month's
  last observation.
- `worst_month(equity_curve)`: the single worst entry from the above.
- `drawdown_durations(equity_curve)`: one entry per peak-to-recovery episode,
  with `duration_days: null` for a drawdown the curve ends still inside of
  (deliberately left unknown rather than guessed at).
- `turnover_ratio` (in `backtest.run()`'s own output): `notional_traded / initial
  capital`. This is a simplified proxy for trading activity relative to capital,
  **not** the textbook turnover definition (which typically annualizes and uses
  average AUM) — stated here to avoid overclaiming precision on terminology.

**Overfitting guard, stated explicitly:** none of the above (splits, sensitivity
grid, metrics) feeds back into choosing the "final" parameters reported as the
headline result. The headline `momentum_strategy` result in `report.py`'s output
always uses the parameters the caller explicitly asked for, not whichever row of
the sensitivity sweep happened to look best.

## 6. CLI and compact JSON summary (`report.py`)

```
python3 report.py adjusted_prices.csv [--topix-csv topix.csv] [--lookback 126]
    [--max-names 5] [--cost-bps 20] [--lot-size 100] [--tax-rate 0.20315]
    [--n-splits 2] [--out summary.json]
```

The printed/written JSON contains the momentum result, both baselines, the
after-tax scenario, the time-split report, the sensitivity sweep, monthly
returns, worst month, drawdown episodes, and the caveats above — but **never**
`equity_curve` or `final_positions` (per-day price-derived values and share
counts), so the output is compact and safe to paste or share without
reconstructing the underlying price series. `audit_data.py`'s quality-check
output (status, ticker count, common-date count, and its warnings — including
its own always-present "NOT VERIFIED: ..." line) is surfaced under
`data_quality` on every run so a human can see it; this tool does not try to
auto-decide which warnings are "important enough" to abort on, since
`audit_data.py`'s unconditional boilerplate warning would make a naive "any
warning aborts" rule fire on every single run.

All of the new modules (`baselines.py`, `metrics.py`, `time_split.py`,
`report.py`) and `backtest.py`'s additions are covered by synthetic-data unit
tests (`test_baselines.py`, `test_metrics.py`, `test_time_split.py`,
`test_report.py`, and the new cases in `test_backtest.py`) — standard library
`unittest`, no network access, no API key required to run them.

## 7. Running this on your Mac against the existing local CSV

This assumes the existing local file the owner already generated with
`fetch_jquants.py`, at `~/Desktop/stock-research-all10/adjusted_prices.csv`
(10 symbols, 2024-07-17 to 2026-07-17, per the Phase 2 comment). Nothing below
uploads that file anywhere; every command runs entirely on your Mac.

```bash
cd /path/to/57hustler/research/stocks

# 1) Run the full test suite (standard library only, no network, no key).
python3 -m unittest discover -v

# 2) Run the compact robustness report against your existing local CSV.
#    Research mode (fractional shares, matches the owner's original run):
python3 report.py ~/Desktop/stock-research-all10/adjusted_prices.csv \
  --lookback 126 --max-names 5 --cost-bps 20 \
  --out ~/Desktop/stock-research-all10/robustness_report.json

#    Realistic mode (100-share lots):
python3 report.py ~/Desktop/stock-research-all10/adjusted_prices.csv \
  --lookback 126 --max-names 5 --cost-bps 20 --lot-size 100 \
  --out ~/Desktop/stock-research-all10/robustness_report_lots100.json

# 3) Optional: if you have your own legally obtained local TOPIX CSV
#    (columns: date,close), add it for a real (not invented) TOPIX comparison:
python3 report.py ~/Desktop/stock-research-all10/adjusted_prices.csv \
  --topix-csv ~/Desktop/stock-research-all10/topix.csv \
  --out ~/Desktop/stock-research-all10/robustness_report_with_topix.json
```

`~/Desktop/stock-research-all10/robustness_report.json` is written locally only
and is safe to open/share — it never contains the raw per-day price series,
only the summary figures and caveats described above.
