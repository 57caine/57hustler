"""Phase 4 Priority B.3: proper walk-forward time-split, fixing a warm-up
artifact in Phase 2's time_split.py. Standard library only, no network
access, no tuning on any window.

The warm-up artifact (why it exists):
time_split.py's time_split_report() slices the INPUT prices into independent
sub-periods and re-runs backtest.run() on each slice from scratch. Each
independent run needs `lookback` days of its OWN sliced history before it can
generate its first signal (backtest.run()'s `i > lookback` guard) -- so
splitting ~489 observations into 2 periods with lookback=126 means each
~244-observation half burns roughly half of itself (126 of ~244 days) purely
on warm-up, leaving only ~118 days of genuine evaluation in the second half.
More splits make this proportionally worse. That artifact is a real
limitation of independent re-slicing, not of the strategy itself.

The fix used here:
Run backtest.run() ONCE over the FULL period with the caller's chosen
parameters (never tuned per window), producing one continuous equity curve
and a dated rebalance_log. Each reported "window" is then just a DATE-RANGE
SLICE of that single, already-computed result -- windows after the first
have real (not future) history available for their own lookback, which is
legitimate (it is strictly past data relative to that window, not lookahead)
and avoids wasting observations on redundant warm-up. The tradeoff, stated
plainly: windows are not fully independent from-a-blank-slate re-estimations;
a later window's signals were computed using genuinely-prior history that
was available by then, not re-derived from nothing.
"""
from datetime import date

import backtest
import metrics
import time_split


def walk_forward_report(prices, capital=1_000_000, lookback=126, max_names=5, cost_bps=20,
                         lot_size=None, execution_delay_sessions=0, n_splits=2):
    """Single backtest.run() call; windows are date-range slices of its
    result. No per-window tuning: every window reflects the SAME run."""
    result = backtest.run(prices, capital=capital, lookback=lookback, max_names=max_names,
                           cost_bps=cost_bps, lot_size=lot_size,
                           execution_delay_sessions=execution_delay_sessions)
    curve = result["equity_curve"]
    rebalance_log = result["rebalance_log"]
    common = [date.fromisoformat(d) for d, _ in curve]
    periods = time_split.split_periods(common, n_splits=n_splits)

    windows = []
    for start, end in periods:
        start_iso, end_iso = start.isoformat(), end.isoformat()
        sub_curve = [(d, v) for d, v in curve if start_iso <= d <= end_iso]
        if len(sub_curve) < 2:
            windows.append({"period": {"start": start_iso, "end": end_iso}, "error": "window too short to evaluate"})
            continue
        start_value = sub_curve[0][1]
        end_value = sub_curve[-1][1]
        window_trades = sum(e["trades"] for e in rebalance_log if start_iso <= e["date"] <= end_iso)
        dd_episodes = metrics.drawdown_durations(sub_curve)
        windows.append({
            "period": {"start": start_iso, "end": end_iso, "observations": len(sub_curve)},
            "start_value": start_value,
            "end_value": end_value,
            "return_pct": round((end_value / start_value - 1) * 100, 2),
            "trades_in_window": window_trades,
            "max_drawdown_pct": round(min((e["depth_pct"] for e in dd_episodes), default=0.0), 2),
            "worst_month": metrics.worst_month(sub_curve),
            "monthly_returns": metrics.monthly_returns(sub_curve),
        })

    return {
        "full_period_result": {k: v for k, v in result.items()
                                if k not in ("equity_curve", "final_positions", "rebalance_log")},
        "windows": windows,
        "warmup_note": (
            f"Each window above is a date-range SLICE of a SINGLE full-period backtest.run() call "
            f"(lookback={lookback}), not an independently re-run sub-backtest. An independent "
            f"per-window re-run (as in time_split.py) would need {lookback} of each window's own "
            f"observations purely for warm-up before any signal could be generated at all -- with "
            f"{len(common)} total observations split into {n_splits} windows, that would leave very "
            f"few genuine evaluation days in later windows. Slicing one continuous run avoids that, "
            f"at the cost of later windows having access to real (not future) history predating "
            f"them for lookback purposes -- legitimate, but means windows are not fully independent "
            f"from-a-blank-slate re-estimations. No parameter was tuned per window; every window "
            f"reflects the exact same single run."
        ),
    }
