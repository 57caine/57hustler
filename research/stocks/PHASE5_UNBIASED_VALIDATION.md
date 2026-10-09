# Phase 5: unbiased universe & genuinely out-of-sample research (2026-10-09)

Follows Phase 2 (`ROBUSTNESS_AUDIT.md`), Phase 3 (`PHASE3_SKABU_COMPARISON.md`), and
Phase 4 (`PHASE4_EXECUTION_REALISM.md`). Owner authorized this phase "mobile-first" —
continuation from Phase 4, no Mac work required right now. Same rules as before:
local-only, Draft PR #20 branch only, no `main` merge, no real trades, no brokerage
connection, no secrets, no J-Quants price data committed. The cloud sandbox has no
access to the owner's local `adjusted_prices.csv`, so nothing here is run against
real data or reported as an actual backtest result — every number in this document
and in the test suite comes from synthetic fixtures.

## Priority 0: independent audit of Phase 4

### Real bug found and fixed: `rebalance_log` leaking into three "compact" outputs

Phase 4 added `rebalance_log` (a list of `{"date", "trades"}` per rebalance event) to
`backtest.run()`'s result. Three pre-existing "compact JSON" helpers were written
before that field existed and only ever stripped `equity_curve`/`final_positions` —
so once Phase 4 landed, `rebalance_log` silently started leaking through all three,
contradicting every phase's stated promise of a summary with "no raw prices/equity
curve" and, for Phase 4 specifically, the explicit instruction to verify this:

| File | Function | What leaked | Where it surfaced |
|---|---|---|---|
| `time_split.py` | `time_split_report()` | `final_positions` **and** `rebalance_log` (it only ever dropped `equity_curve`) | every split's `result`, and from there into `report.py`'s `time_split_validation` |
| `report.py` | `_without_bulk_fields()` | `rebalance_log` | `momentum_strategy`, and the `time_split_validation` entries above |
| `skabu_model.py` | `_without_bulk_fields()` | `rebalance_log` | every model in `compare_lot_models()`, and from there into `phase4_report.py`'s `lot_model_comparison` |

Confirmed directly before fixing (not assumed): ran `compare_lot_models()` against a
synthetic fixture and checked `"rebalance_log" in json.dumps(report)` → `True`. Fixed
by adding `"rebalance_log"` to all three drop sets. Regression tests added in
`test_time_split.py`, `test_report.py`, `test_skabu_model.py`, and
`test_phase4_report.py` (`test_output_is_compact_no_raw_curves_anywhere` now also
asserts `"rebalance_log" not in text`) — all now pass; re-running the synthetic
check above now returns `False`.

### Signal timing and execution mechanics: re-inspected, no defect found

Re-read `backtest.run()` line by line against the exact Phase 5 question ("inspect
actual backtest signal timestamp and execution mechanics"). Confirmed: the momentum
signal at loop index `i` uses `signal_i = i - 1` — i.e. only the prior iteration's
close — and `execute_rebalance()` is called with `trade_date = d` (the current
iteration's date), which the loop has not yet appended to `curve` at signal time.
This is exactly what `test_backtest.py`'s `test_no_future_price_used_for_signal` and
`test_future_shock_cannot_change_past_equity` already assert against synthetic data
designed to catch a lookahead bug. No defect found; no change made.

### Benchmark fairness: already fixed in Phase 4, re-confirmed still correct

Re-ran `test_skabu_model.py::test_each_strategy_compared_against_matching_lot_size_baseline`
and manually re-read `compare_lot_models()`'s `baseline_specs` dict: each of the four
lot-size strategies is still paired with a buy-and-hold baseline built with the
identical `lot_size`/`cost_bps`. No regression since the Phase 4 fix.

### Split boundaries: distinguishing a slice from genuine out-of-sample

This is the central methodological point Phase 5 asked to pin down. `walk_forward.py`
(Phase 4) runs `backtest.run()` **once** over the full period and reports each
"window" as a date-range slice of that single result. That is legitimate for what it
claims — see its own `warmup_note`, which already says windows "are not fully
independent from-a-blank-slate re-estimations" — but it is **not** a held-out test:
there is only ever one run, so there is no development/holdout separation and nothing
was ever "frozen before looking" at any window. Nothing in Phase 4's code or docs
called this "out-of-sample" (checked: no occurrence of "out-of-sample" or "OOS" in
`walk_forward.py`, `PHASE4_EXECUTION_REALISM.md`, or `phase4_report.py`), so there was
no mislabeling to fix — but Phase 5 adds a mechanism that IS a genuine chronological
holdout test, specifically so the two are never conflated going forward: see
Priority 2 (`preregistration.py`) below. `phase5_report.py`'s `oos_status` field
always refers to that genuine holdout test, never to `walk_forward_report()`'s
windows.

### Stress cases: re-inspected, no defect found

Re-read `_failure_mode_sensitivity()` in `phase4_report.py`: `baseline`, `no_fill`
(= `cash_baseline`), `one_session_execution_delay` (= `execution_delay_sessions=1`),
and `worse_execution_slippage` (= `cost_bps=100`) all correctly reuse the same
`lookback`/`max_names`/`lot_size` as the baseline run, varying only the one dimension
each case names. No defect found.

### "Acknowledged" is not "empirically validated" — the acknowledgment flag was vacuous

`execution_timing.assert_same_day_close_fill_assumption_holds()` requires a caller to
pass `True` to proceed — but `phase4_report.py` always passed a hardcoded `True`
itself, so the "acknowledgment" was really just `phase4_report.py` talking to itself,
not an external reviewer confirming anything. That is not wrong as a code-level
assumption guard (the function still exists to prevent a future caller from silently
defaulting to "assume filled"), but reporting
`same_day_close_fill_assumption_acknowledged: true` without qualification risks being
read as "this was checked and holds," which it is not. Fixed by adding a second,
separate field: `timing_preflight.empirically_validated: false` (always, hardcoded),
plus an explicit caveat sentence in `phase4_report.py`'s own output explaining the
distinction. Covered by
`test_phase4_report.py::test_acknowledgment_is_not_conflated_with_empirical_validation`.

## Priority 1: avoiding hindsight universe selection (`universe.py`)

This project's current local data — `adjusted_prices.csv`, however many hand-picked
symbols the owner has locally — carries **no point-in-time metadata**: no listing/
delisting dates, no sector history, no corporate-action log, and no record of how or
when those specific symbols were chosen relative to their subsequent performance.
**Survivorship-bias-free validation is NOT POSSIBLE with this data, full stop.**
`universe.bias_status(has_point_in_time_metadata=False)` (the default, and the only
honest default given what actually exists) returns `bias_unresolved: true` and an
explicit `data_required` list — it does not substitute today's ticker list and call
the result unbiased.

What `universe.py` adds instead is the machinery that WOULD support point-in-time
universe construction if real metadata is ever supplied:

- A schema (`validate_metadata_schema`) for a list of dated events —
  `listed`/`delisted`/`sector_set`/`corporate_action`/`price_available`/
  `price_unavailable` — each with an `effective_date`: the date the information was
  actually **knowable**, not merely the date the event describes.
- `build_point_in_time_universe(events, as_of_date, sector=None)`, which filters to
  only events with `effective_date <= as_of_date` **before** doing anything else —
  so a delisting dated after `as_of_date` cannot affect a universe built as of an
  earlier date, by construction. Tested directly against this exact scenario
  (`test_delisting_not_yet_knowable_does_not_leak_into_earlier_universe`).

Only synthetic fixtures are used in `test_universe.py` — no real listing/sector data
exists in this project, and none was fetched or invented for this phase. No owner
action is required yet; this is purely preparatory plumbing.

## Priority 2: pre-registration and a genuine holdout protocol (`preregistration.py`)

- `freeze_params(lookback, max_names, cost_bps, lot_size)` returns a parameter dict
  plus a SHA-256 manifest hash over its canonical JSON encoding.
  `PRE_REGISTERED_PARAMS`/`PRE_REGISTERED_MANIFEST_HASH` freeze this project's
  Phase 1-4 parameters (`lookback=126, max_names=5, cost_bps=20`, fractional shares)
  as a committed, content-addressed artifact. **Stated plainly, not oversold:**
  freezing them now is forward-looking only — it does not retroactively prove the
  original Phase 1 choice of these exact numbers was made blind, before ever seeing
  a backtest result; that cannot be verified after the fact. What it does guarantee
  is that from this commit onward, nobody can silently change these numbers between
  a development run and a holdout run without `verify_manifest` catching the mismatch.
- `chronological_holdout_split(common_dates, development_fraction=0.7)` splits
  strictly by date — development is always entirely before holdout, never
  interleaved, and the split point depends only on the date count and the fraction,
  never on either period's performance.
- `holdout_protocol_report()` runs `backtest.run()` **twice, independently** — once
  on the development slice, once on the untouched holdout slice — the one thing
  `walk_forward_report()` does not do (see Priority 0 above). It reports
  `oos_status`:
  - `"validated_with_caveats"` only when the holdout has at least
    `MIN_VIABLE_HOLDOUT_OBSERVATIONS` (60) dates AND at least `MIN_VIABLE_HOLDOUT_TRADES`
    (5) executed trades, and (if an `expected_manifest_hash` was supplied) the
    parameters actually used match it.
  - `"not_validated"` otherwise — including when a manifest mismatch is detected
    ("contamination"), when there isn't enough history to split meaningfully, or when
    either threshold isn't met — always with a `reason` and/or `warnings` explaining
    why, never a silently-weakened number presented as if it were fine.
  - A `statistical_power_note` spells out, every time, that even a
    `"validated_with_caveats"` result is "ran without a known defect," not "proven
    profitable" or "statistically significant" — this project's ~489-900 observations
    and 126-day lookback are candidly weak regardless of which status comes back.

`phase5_report.py`'s CLI deliberately does **not** expose `--lookback`/`--max-names`/
`--cost-bps` flags — every run uses `PRE_REGISTERED_PARAMS` and checks it against
`PRE_REGISTERED_MANIFEST_HASH`. Honestly: because both constants are computed from
the same `freeze_params()` call inside `preregistration.py`, this particular
self-check is trivially true by construction — the real contamination-detection use
case is for a caller (or a future Phase) that accepts independently-supplied
parameters and checks them against a hash frozen earlier, which
`holdout_protocol_report()`'s `expected_manifest_hash` argument supports directly
(and is exercised with a genuinely mismatched hash in
`test_preregistration.py::test_contamination_detected_when_hash_mismatches`).

## Priority 3: matched 1-share benchmark (`phase5_report.py`)

`_matched_benchmark_comparison()` runs the pre-registered strategy and two 1-share
buy-and-hold baselines (`cost_bps=0`, officially-sourced S-Kabu zero cost; and
`cost_bps=20`, the same cost as the strategy) against the **exact same** `prices`
dict, `capital`, and start date — never a different universe or a different starting
cash. TOPIX is `not_computed` unless a local `--topix-csv` is supplied; no value is
ever invented. The report surfaces, per run:

- `concentration_turnover_cost`: the existing 20%-of-cash position cap (not relaxed),
  `turnover_ratio`, `notional_traded`, `cost_bps`, and `max_drawdown_pct` — all read
  directly from `backtest.run()`'s own result, not recomputed or adjusted.
- `dividend_and_tax_uncertainty`: repeats Phase 2's standing caveat (unconfirmed
  whether adjusted close already reflects dividends beyond splits/rights) and notes
  that any tax figure is a separate, simplified scenario — never mixed into position
  sizing, same design as `backtest.after_tax_summary()`.
- `no_parameter_optimization`: states plainly that the single pre-registered
  parameter set was reused unchanged — nothing here was searched or adjusted to
  produce a better headline return.

## Real-data follow-up fix (2026-10-09): holdout warmup

The owner ran `phase5_report.py` locally against real J-Quants data (10 tickers x
425 trading days) and reported `oos_status: not_validated`, reason `"holdout period
backtest failed: insufficient common history"`, with `development=298` days /
`holdout=127` days under the pre-registered `lookback=126`.

**Root cause:** `holdout_protocol_report()` ran `backtest.run()` on the holdout
slice **alone**. `backtest.run()` requires at least `lookback + 3` observations
before it will generate even one signal (its own internal validation). A 127-day
holdout against `lookback=126` needs 129 — so the holdout could **never** produce a
single trade, regardless of how long the underlying price history actually was. This
was a real defect in the Priority 2 implementation, not a property of the real data
or evidence against the strategy.

**Fix:** `holdout_protocol_report()` now gives the holdout run `lookback` trading
days of **warmup**, taken from the tail of the *development* period — strictly
before the holdout starts, never from inside or after it, so this is not future data
and not a look at holdout performance. The combined warmup+holdout slice is run
through `backtest.run()` as a single, still-independent-from-development call; a new
helper, `_evaluation_window_result()`, then reports return/drawdown/trades/monthly
returns computed **only** from the holdout period's own start onward — mirroring how
`walk_forward.py` (Phase 4) measures a window's return from its own start value, not
the run's original capital. The development evaluation itself is completely
unaffected (same full development-period run as before); the two evaluations remain
strictly separate, which `test_development_result_unaffected_by_warmup_reuse` checks
directly.

One subtlety worth stating plainly: because warmup is sized at **exactly**
`lookback` days, `backtest.run()`'s own `i > lookback` guard means no trade is even
possible until one day past the warmup/holdout boundary — so the very first holdout
observation can legitimately still show the unchanged initial-capital-shaped equity
from warmup. That is expected behavior given this design, not evidence the warmup
was skipped; `EvaluationWindowResultTests` in `test_preregistration.py` tests the
exclusion logic directly against a controlled synthetic curve/rebalance log, rather
than relying on a specific economic scenario to demonstrate it end-to-end.

Regression tests added (`test_preregistration.py`, 8 new): the exact reported shape
(10 tickers, 425 days, `lookback=126`, default `development_fraction=0.7` ->
298/127) no longer fails with "insufficient common history"
(`test_holdout_shorter_than_lookback_plus_three_no_longer_fails_outright`);
`warmup_period` is reported with the correct length and ends strictly before
`holdout_period` starts; the development evaluation is provably unaffected; and
`EvaluationWindowResultTests` (4 tests) verify the warmup-exclusion helper directly.
All still against synthetic fixtures only — this fix has not yet been re-run against
the owner's real data; see "Running this later on your Mac" below.

## Flags, every Phase 5 report

- `data_required`: non-empty list naming exactly what point-in-time metadata is
  missing (empty only if `has_point_in_time_metadata=True` was explicitly passed,
  which nothing in this project does with real data today).
- `bias_unresolved`: `true` by default, for the reason above.
- `oos_status`: `"validated_with_caveats"` or `"not_validated"`, from the genuine
  holdout protocol — never from `walk_forward_report()`'s windows.
- `readiness_for_real_trading`: hardcoded `false` in every report produced by this
  phase. It is not meant to ever flip to `true` from this project alone.

## Tests

`test_universe.py` (17), `test_preregistration.py` (27, including the 8 holdout-warmup
regression tests above), `test_phase5_report.py` (17), plus the Priority-0 regression
tests added to `test_time_split.py`, `test_report.py`, `test_skabu_model.py`, and
`test_phase4_report.py` (5 more) — all against synthetic fixtures, zero network
calls, zero real data. Combined with every prior phase:

```
cd research/stocks && python3 -m unittest discover -v
# Ran 202 tests ... OK
```

## Unresolved blockers (stated plainly)

- **Survivorship bias is not resolved and cannot be, with current data.** `universe.py`
  provides the mechanism; it does not and cannot manufacture point-in-time metadata
  that was never recorded for the original 10-symbol selection. Resolving this needs
  the owner (or a licensed data source) to supply real point-in-time listing/sector/
  corporate-action history — not something this sandbox can fetch or infer.
  `bias_unresolved: true` will stay `true` until that happens.
  `has_point_in_time_metadata=True` is currently just a plumbing-test switch — passing
  it does not mean real metadata was used, only that the code path it unlocks is
  exercised; see `test_universe.py`'s synthetic fixtures.
- **The fix above has not yet been re-run against the owner's real `adjusted_prices.csv`.**
  This cloud sandbox cannot access it. The owner's one real-data run (10 tickers, 425
  days) is what surfaced the holdout-warmup bug in the first place, and that run
  predates this fix. `oos_status`, trade counts, and every other figure in
  `phase5_report.py`'s output may still differ once re-run against real data with the
  fix applied — possibly landing on `"not_validated"` for a different, legitimate
  reason not seen in these synthetic tests (e.g. too few trades even with warmup).
  The Mac command below is the only way to find out.
- **Statistical power remains weak regardless of outcome.** Even a clean
  `"validated_with_caveats"` result from real data will rest on a development/holdout
  split of what is still well under 1,000 total observations — `statistical_power_note`
  says this every time, deliberately, so it cannot be read past.

## Running this later on your Mac

```bash
cd /path/to/57hustler/research/stocks
git fetch origin docs/ai-harness-trading-research-20261008
git checkout docs/ai-harness-trading-research-20261008

# 1) Run the full test suite (202 tests as of the holdout-warmup fix above;
#    standard library only, no network, no key, no real data).
python3 -m unittest discover -v

# 2) Generate the Phase 5 unbiased-universe / holdout-validation report on
#    your existing local CSV. No --lookback/--max-names/--cost-bps flags
#    exist on purpose -- see "Priority 2" above.
python3 phase5_report.py ~/Desktop/stock-research-all10/adjusted_prices.csv \
  --development-fraction 0.7 \
  --out ~/Desktop/stock-research-all10/phase5_report.json
```

`phase5_report.json` is written locally only and contains no raw per-day price
series or equity curves — only the pre-registered parameters and manifest hash,
universe transparency and bias flags, the genuine holdout-validation result, the
matched 1-share benchmark comparison, and the caveats described above.
