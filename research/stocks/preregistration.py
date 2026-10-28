"""Phase 5 Priority 2: parameter pre-registration and a genuinely
out-of-sample chronological development/holdout protocol.

Contrasts with walk_forward.py (Phase 4): that module slices a SINGLE
full-period backtest.run() call into date-range windows -- legitimate for
reporting (see its own warmup_note), but it is NOT a genuine held-out
test, because one run produced every window and no parameter was ever
"frozen before looking" at any of them. This module instead:

  1. Freezes a parameter set as a content-addressed manifest hash
     (freeze_params()) BEFORE any holdout evaluation.
  2. Runs backtest.run() TWICE, independently: once on a strictly earlier
     "development" period, once on a strictly later, untouched "holdout"
     period -- never the same run sliced after the fact.
  3. Optionally verifies the run's parameters against a manifest hash
     frozen earlier (expected_manifest_hash) -- a contamination check
     that catches parameters being silently swapped between the time they
     were pre-registered and the time the holdout was actually run.
  4. Warns, rather than silently reporting a number, when the sample size
     or trade count is too small to support a real conclusion.
  5. Reports oos_status="not_validated" instead of pretending, whenever a
     genuine untouched holdout does not exist, a manifest check fails, or
     the minimum viable sample/trade thresholds are not met.

No parameter is ever chosen by looking at the holdout result; the only
sequence this module supports is freeze -> develop -> holdout.

Real-data follow-up fix (found running against the owner's actual
J-Quants data: 10 tickers x 425 trading days, development_fraction=0.7 ->
development=298 days, holdout=127 days, lookback=126): the holdout run
used to be backtest.run() on ONLY the holdout_dates slice. Since
backtest.run() requires at least lookback+3 observations before it will
generate even one signal, a holdout slice of 127 days against
lookback=126 failed outright with "insufficient common history" -- the
holdout could never produce a single trade, no matter how long the
underlying history was. Fixed in holdout_protocol_report() by giving the
holdout run `lookback` trading days of WARMUP taken from the tail of the
development period (strictly BEFORE the holdout starts -- never from
inside or after it, so this is not future data and not a look at holdout
performance), then reporting holdout performance (return, drawdown,
trades, monthly returns) ONLY from the holdout period's own start onward
-- mirroring how walk_forward.py (Phase 4) slices a window's performance
from its own start value, not from the run's original capital. The
development run and its own reported evaluation are completely
unaffected by this; the two evaluations remain strictly separate (see
_evaluation_window_result()).
"""
import hashlib
import json
from datetime import date

import backtest
import metrics
import time_split

# A few months of trading days; below this, period-level statistics (max
# drawdown, worst month) are not considered meaningful here.
MIN_VIABLE_HOLDOUT_OBSERVATIONS = 60
# Fewer realized rebalances than this is too few to support any
# win-rate/drawdown-style conclusion.
MIN_VIABLE_HOLDOUT_TRADES = 5


def freeze_params(lookback, max_names, cost_bps, lot_size=None):
    """Returns (params, manifest_hash). manifest_hash is a deterministic
    SHA-256 over the canonical JSON encoding of params -- it exists so a
    LATER run (holdout_protocol_report with expected_manifest_hash=...)
    can detect whether the "same" parameters were silently changed after
    being pre-registered."""
    params = {"lookback": lookback, "max_names": max_names, "cost_bps": cost_bps, "lot_size": lot_size}
    canonical = json.dumps(params, sort_keys=True)
    manifest_hash = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
    return params, manifest_hash


def verify_manifest(params, manifest_hash):
    """True iff params hashes to EXACTLY manifest_hash. A contamination
    check, not a schema validator."""
    canonical = json.dumps(params, sort_keys=True)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest() == manifest_hash


# This project's parameters as used throughout Phase 1-4 (lookback=126,
# max_names=5, cost_bps=20, fractional shares), frozen here as a committed,
# content-addressed manifest. FORWARD-LOOKING ONLY: freezing them now does
# NOT retroactively prove the original Phase 1 choice of these exact
# numbers was made blind, before ever seeing a backtest result -- that
# cannot be verified after the fact. What this freeze DOES guarantee is
# that from this commit onward, nobody can silently change these numbers
# between a development run and a holdout run without the stored hash
# failing to match (see PRE_REGISTERED_MANIFEST_HASH usage in
# holdout_protocol_report's expected_manifest_hash).
PRE_REGISTERED_PARAMS, PRE_REGISTERED_MANIFEST_HASH = freeze_params(
    lookback=126, max_names=5, cost_bps=20, lot_size=None)


def chronological_holdout_split(common_dates, development_fraction=0.7):
    """Splits a SORTED list of dates into a strictly earlier development
    range and a strictly later, non-overlapping holdout range -- never
    interleaved, and never chosen by looking at performance in either
    half (the split point is purely a function of the date count and the
    caller-supplied fraction)."""
    if not common_dates:
        raise ValueError("empty common_dates")
    if list(common_dates) != sorted(common_dates):
        raise ValueError("common_dates must be sorted ascending")
    if not isinstance(development_fraction, (int, float)) or not 0 < development_fraction < 1:
        raise ValueError("development_fraction must be between 0 and 1 exclusive")
    if len(common_dates) < 2:
        raise ValueError("not enough observations to form a development/holdout split")
    split_idx = max(1, min(len(common_dates) - 1, round(len(common_dates) * development_fraction)))
    development = common_dates[:split_idx]
    holdout = common_dates[split_idx:]
    return development, holdout


def date_range_holdout_split(common_dates, holdout_start, holdout_end):
    """Splits a SORTED list of dates into a strictly earlier development
    range (everything before holdout_start) and a holdout range pinned to
    a CALLER-SPECIFIED calendar window [holdout_start, holdout_end],
    clipped to whatever dates actually exist in common_dates. Unlike
    chronological_holdout_split()'s fraction-based split, this lets a
    specific real-world out-of-sample window (e.g. a fixed OOS period
    agreed on ahead of time) be evaluated directly, while keeping the
    same strict chronological separation -- development never includes
    any date on or after holdout_start."""
    if not common_dates:
        raise ValueError("empty common_dates")
    if list(common_dates) != sorted(common_dates):
        raise ValueError("common_dates must be sorted ascending")
    if not isinstance(holdout_start, date) or not isinstance(holdout_end, date):
        raise ValueError("holdout_start and holdout_end must be date objects")
    if holdout_start > holdout_end:
        raise ValueError("holdout_start must not be after holdout_end")
    development = [d for d in common_dates if d < holdout_start]
    holdout = [d for d in common_dates if holdout_start <= d <= holdout_end]
    if not development:
        raise ValueError("no development-period observations exist before holdout_start")
    if not holdout:
        raise ValueError(f"no observations fall within [{holdout_start}, {holdout_end}]")
    return development, holdout


def _strip_bulk(d):
    return {k: v for k, v in d.items() if k not in ("equity_curve", "final_positions", "rebalance_log")}


def _evaluation_window_result(run_result, window_start_iso, window_end_iso):
    """Given a backtest.run() result whose equity_curve/rebalance_log spans
    a WARMUP period followed by an evaluation window, returns metrics
    computed ONLY from the evaluation window [window_start_iso,
    window_end_iso] -- never from the run's own initial capital, and never
    from trades/P&L that happened during warmup. start_value is the
    window's OWN starting equity (already shaped by whatever happened
    during warmup), so return_pct measures growth within the window only.
    Mirrors walk_forward.py's per-window slicing (Phase 4), applied here
    to a single dedicated, independent holdout run rather than a combined
    development+holdout run. Returns None if the window is too short to
    evaluate (fewer than 2 equity observations in range)."""
    curve = run_result["equity_curve"]
    sub_curve = [(d, v) for d, v in curve if window_start_iso <= d <= window_end_iso]
    if len(sub_curve) < 2:
        return None
    start_value = sub_curve[0][1]
    end_value = sub_curve[-1][1]
    window_trades = sum(e["trades"] for e in run_result["rebalance_log"]
                         if window_start_iso <= e["date"] <= window_end_iso)
    dd_episodes = metrics.drawdown_durations(sub_curve)
    return {
        "start_value": start_value,
        "end_value": end_value,
        "return_pct": round((end_value / start_value - 1) * 100, 2),
        "trades": window_trades,
        "max_drawdown_pct": round(min((e["depth_pct"] for e in dd_episodes), default=0.0), 2),
        "worst_month": metrics.worst_month(sub_curve),
        "monthly_returns": metrics.monthly_returns(sub_curve),
        "cost_bps": run_result["cost_bps"],
        "lot_size": run_result["lot_size"],
    }


def holdout_protocol_report(prices, lookback, max_names, cost_bps, lot_size=None,
                             capital=1_000_000, development_fraction=0.7,
                             holdout_start=None, holdout_end=None,
                             expected_manifest_hash=None,
                             min_holdout_observations=MIN_VIABLE_HOLDOUT_OBSERVATIONS,
                             min_holdout_trades=MIN_VIABLE_HOLDOUT_TRADES):
    """The freeze -> develop -> holdout protocol. Returns a dict whose
    oos_status is one of:
      - "validated_with_caveats": a genuine, untouched holdout ran with
        parameters that passed the contamination check (if one was
        requested) and met the minimum sample/trade thresholds. Still
        subject to every other standing caveat in this project (short
        history, no genuine point-in-time universe -- see universe.py).
      - "not_validated": something about the setup could not support a
        real conclusion (contamination detected, too little data to split
        meaningfully, or below the minimum observation/trade thresholds).
        Reported candidly, with the reason, instead of a fabricated or
        silently-weakened number.

    By default the holdout period is the LAST (1 - development_fraction)
    of the available history. Pass BOTH holdout_start and holdout_end
    (date objects) to pin the holdout to a specific calendar window
    instead (e.g. a fixed OOS period agreed on ahead of time) --
    development_fraction is then ignored. Passing only one of the two
    raises, so a caller cannot accidentally mix the two modes."""
    if (holdout_start is None) != (holdout_end is None):
        raise ValueError("holdout_start and holdout_end must both be given, or neither")

    params, manifest_hash = freeze_params(lookback, max_names, cost_bps, lot_size)

    if expected_manifest_hash is not None and manifest_hash != expected_manifest_hash:
        return {
            "oos_status": "not_validated",
            "reason": "contamination detected: these parameters do not match the manifest hash "
                       "they were checked against -- parameters appear to have changed after being "
                       "pre-registered",
            "manifest_hash": manifest_hash,
            "expected_manifest_hash": expected_manifest_hash,
            "parameters": params,
        }

    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    try:
        if holdout_start is not None:
            development_dates, holdout_dates = date_range_holdout_split(common, holdout_start, holdout_end)
        else:
            development_dates, holdout_dates = chronological_holdout_split(common, development_fraction)
    except ValueError as e:
        return {
            "oos_status": "not_validated",
            "reason": f"could not split into development/holdout: {e}",
            "manifest_hash": manifest_hash,
            "parameters": params,
        }

    development_period = {"start": development_dates[0].isoformat(), "end": development_dates[-1].isoformat(),
                           "observations": len(development_dates)}
    development_prices = time_split.slice_prices(prices, development_dates[0], development_dates[-1])

    # Warmup: the `lookback` trading days immediately BEFORE the holdout
    # period starts, taken from the tail of development_dates -- strictly
    # earlier than holdout, never from inside or after it. See the module
    # docstring for why this is necessary and why it is not a lookahead or
    # a look at holdout performance.
    warmup_dates = development_dates[-lookback:] if len(development_dates) >= lookback else development_dates
    warmup_period = {"start": warmup_dates[0].isoformat(), "end": warmup_dates[-1].isoformat(),
                      "observations": len(warmup_dates),
                      "note": "Reused from the tail of the development period solely to satisfy "
                              "backtest.run()'s own lookback requirement at the start of the holdout "
                              "run; its own P&L/trades are excluded from holdout_result below."}
    holdout_run_prices = time_split.slice_prices(prices, warmup_dates[0], holdout_dates[-1])

    warnings = []
    if len(holdout_dates) < min_holdout_observations:
        warnings.append(f"holdout has only {len(holdout_dates)} observations "
                         f"(below the minimum viable {min_holdout_observations}) -- statistically weak")

    try:
        development_result = backtest.run(development_prices, capital=capital, **params)
    except ValueError as e:
        return {
            "oos_status": "not_validated",
            "reason": f"development period backtest failed: {e}",
            "manifest_hash": manifest_hash,
            "parameters": params,
            "development_period": development_period,
            "warnings": warnings,
        }

    try:
        holdout_run_result = backtest.run(holdout_run_prices, capital=capital, **params)
    except ValueError as e:
        return {
            "oos_status": "not_validated",
            "reason": f"holdout period backtest failed: {e}",
            "manifest_hash": manifest_hash,
            "parameters": params,
            "development_period": development_period,
            "warmup_period": warmup_period,
            "development_result": _strip_bulk(development_result),
            "warnings": warnings,
        }

    holdout_start_iso, holdout_end_iso = holdout_dates[0].isoformat(), holdout_dates[-1].isoformat()
    holdout_eval = _evaluation_window_result(holdout_run_result, holdout_start_iso, holdout_end_iso)
    if holdout_eval is None:
        return {
            "oos_status": "not_validated",
            "reason": "holdout evaluation window too short to evaluate after excluding warmup",
            "manifest_hash": manifest_hash,
            "parameters": params,
            "development_period": development_period,
            "warmup_period": warmup_period,
            "development_result": _strip_bulk(development_result),
            "warnings": warnings,
        }

    if holdout_eval["trades"] < min_holdout_trades:
        warnings.append(f"holdout evaluation window executed only {holdout_eval['trades']} trades "
                         f"(below the minimum viable {min_holdout_trades}) -- too few to support "
                         f"a real conclusion")

    oos_status = "validated_with_caveats" if (
        len(holdout_dates) >= min_holdout_observations and holdout_eval["trades"] >= min_holdout_trades
    ) else "not_validated"

    return {
        "oos_status": oos_status,
        "manifest_hash": manifest_hash,
        "parameters": params,
        "development_period": development_period,
        "warmup_period": warmup_period,
        "holdout_period": {"start": holdout_start_iso, "end": holdout_end_iso, "observations": len(holdout_dates)},
        "development_result": _strip_bulk(development_result),
        "holdout_result": holdout_eval,
        "warnings": warnings,
        "statistical_power_note": (
            f"{len(common)} total observations split {development_fraction:.0%}/"
            f"{1 - development_fraction:.0%} into development/holdout with lookback={lookback} -- "
            "candidly weak statistical power either way; a handful of monthly rebalances in either "
            "period cannot support a confident conclusion. oos_status='validated_with_caveats' means "
            "'ran as a genuine, uncontaminated, minimally-sized holdout test', NOT 'proven profitable' "
            "or 'statistically significant'."
        ),
    }
