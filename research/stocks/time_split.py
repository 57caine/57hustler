"""Time-split (walk-forward-style) validation and a fixed sensitivity sweep
for the momentum backtest. Standard library only, no network access.

Important limitation, stated explicitly rather than hidden: with roughly
two years of history and monthly rebalancing, a 2-way split already leaves
each half with only on the order of 8-9 rebalances. More splits would
shrink that further to a point where period-level statistics would not be
meaningful; this module deliberately defaults to n_splits=2 for that
reason and the caller should not request more without separately
justifying it against the observation count.

The sensitivity grid below is a SMALL, FIXED set of parameter
combinations chosen before looking at any result, not the output of a
search over the data. Running it is sensitivity analysis, not parameter
tuning: no step here picks the best-performing combination and feeds it
back into the "real" result.
"""
import math
from datetime import date

import backtest

SENSITIVITY_GRID = [
    {"lookback": 60, "max_names": 5, "cost_bps": 20},
    {"lookback": 126, "max_names": 5, "cost_bps": 20},
    {"lookback": 126, "max_names": 3, "cost_bps": 20},
    {"lookback": 126, "max_names": 5, "cost_bps": 0},
    {"lookback": 126, "max_names": 5, "cost_bps": 40},
]


def slice_prices(prices, start, end):
    """A new prices dict restricted to [start, end]; never mutates the input."""
    return {t: {d: p for d, p in series.items() if start <= d <= end} for t, series in prices.items()}


def split_periods(common_dates, n_splits=2):
    """n_splits contiguous, non-overlapping (start, end) date ranges covering
    the full common_dates span, as close to equal-sized as integer division
    allows. Raises if there clearly isn't enough history to make the split
    meaningful at all (a much lower bar than claiming the split is
    statistically powerful -- see the module docstring)."""
    if not isinstance(n_splits, int) or n_splits < 1:
        raise ValueError("n_splits must be a positive integer")
    if len(common_dates) < n_splits * 2:
        raise ValueError("not enough common history for the requested number of splits")
    chunk = len(common_dates) // n_splits
    periods = []
    for i in range(n_splits):
        start_idx = i * chunk
        end_idx = (i + 1) * chunk - 1 if i < n_splits - 1 else len(common_dates) - 1
        periods.append((common_dates[start_idx], common_dates[end_idx]))
    return periods


def time_split_report(prices, n_splits=2, **run_kwargs):
    """Run backtest.run() independently on each split with the SAME fixed
    parameters passed in run_kwargs (never adjusted per-split). A split with
    too little history for those parameters reports its own error rather
    than being silently skipped."""
    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    periods = split_periods(common, n_splits=n_splits)
    results = []
    for start, end in periods:
        sub = slice_prices(prices, start, end)
        observations = sum(1 for d in common if start <= d <= end)
        entry = {"period": {"start": start.isoformat(), "end": end.isoformat(), "observations": observations}}
        try:
            r = backtest.run(sub, **run_kwargs)
            entry["result"] = {k: v for k, v in r.items() if k != "equity_curve"}
        except ValueError as e:
            entry["error"] = str(e)
        results.append(entry)
    return results


def sensitivity_sweep(prices, capital=1_000_000, grid=None):
    """Run the fixed grid above (or a caller-supplied one, same contract)
    over the FULL period and report each outcome side by side. This is
    meant to show how sensitive the result is to a few reasonable
    parameter choices, not to find the best one."""
    rows = []
    for params in grid or SENSITIVITY_GRID:
        row = dict(params)
        try:
            r = backtest.run(prices, capital=capital, **params)
            row.update({"final": r["final"], "return_pct": r["return_pct"],
                        "max_drawdown_pct": r["max_drawdown_pct"], "trades": r["trades"]})
        except ValueError as e:
            row["error"] = str(e)
        rows.append(row)
    return rows
