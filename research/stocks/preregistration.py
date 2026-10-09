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
"""
import hashlib
import json
from datetime import date

import backtest
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


def _strip_bulk(d):
    return {k: v for k, v in d.items() if k not in ("equity_curve", "final_positions", "rebalance_log")}


def holdout_protocol_report(prices, lookback, max_names, cost_bps, lot_size=None,
                             capital=1_000_000, development_fraction=0.7,
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
        silently-weakened number."""
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
        development_dates, holdout_dates = chronological_holdout_split(common, development_fraction)
    except ValueError as e:
        return {
            "oos_status": "not_validated",
            "reason": f"could not split into development/holdout: {e}",
            "manifest_hash": manifest_hash,
            "parameters": params,
        }

    development_prices = time_split.slice_prices(prices, development_dates[0], development_dates[-1])
    holdout_prices = time_split.slice_prices(prices, holdout_dates[0], holdout_dates[-1])

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
            "warnings": warnings,
        }

    try:
        holdout_result = backtest.run(holdout_prices, capital=capital, **params)
    except ValueError as e:
        return {
            "oos_status": "not_validated",
            "reason": f"holdout period backtest failed: {e}",
            "manifest_hash": manifest_hash,
            "parameters": params,
            "development_period": {"start": development_dates[0].isoformat(),
                                    "end": development_dates[-1].isoformat(),
                                    "observations": len(development_dates)},
            "development_result": _strip_bulk(development_result),
            "warnings": warnings,
        }

    if holdout_result["trades"] < min_holdout_trades:
        warnings.append(f"holdout executed only {holdout_result['trades']} trades "
                         f"(below the minimum viable {min_holdout_trades}) -- too few to support "
                         f"a real conclusion")

    oos_status = "validated_with_caveats" if (
        len(holdout_dates) >= min_holdout_observations and holdout_result["trades"] >= min_holdout_trades
    ) else "not_validated"

    return {
        "oos_status": oos_status,
        "manifest_hash": manifest_hash,
        "parameters": params,
        "development_period": {"start": development_dates[0].isoformat(), "end": development_dates[-1].isoformat(),
                                "observations": len(development_dates)},
        "holdout_period": {"start": holdout_dates[0].isoformat(), "end": holdout_dates[-1].isoformat(),
                            "observations": len(holdout_dates)},
        "development_result": _strip_bulk(development_result),
        "holdout_result": _strip_bulk(holdout_result),
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
