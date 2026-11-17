"""Independent baselines for comparing the momentum backtest against.
Standard library only. No network access.

Per the Phase 2 robustness-audit request: an equal-weight buy-and-hold
baseline over the SAME tickers, and a trivial cash baseline. TOPIX is
intentionally NOT estimated or invented here -- J-Quants Free does not
provide TOPIX OHLC, so a TOPIX comparison is only computed when the
caller supplies their own legally-obtained local CSV (date,close); without
one, callers should report the TOPIX comparison as "not computed", not
fill it in with a guess.
"""
import csv
import math
from datetime import date


def cash_baseline(capital, start, end):
    """Trivial floor comparison: capital earns nothing and loses nothing."""
    if not math.isfinite(capital) or capital <= 0:
        raise ValueError("positive finite capital required")
    return {
        "name": "cash",
        "initial": capital,
        "final": capital,
        "return_pct": 0.0,
        "max_drawdown_pct": 0.0,
        "start": start.isoformat(),
        "end": end.isoformat(),
    }


def buy_and_hold_equal_weight(prices, capital=1_000_000, cost_bps=20, lot_size=None):
    """Equal-weight buy on the first common date across all tickers, held
    with no rebalancing to the last common date. Uses the same cost_bps
    round-trip-cost convention as backtest.run() on entry, and an explicit
    exit cost applied only to the final reported liquidation value, so the
    comparison to the momentum strategy is apples-to-apples."""
    if not prices:
        raise ValueError("empty prices")
    if not math.isfinite(capital) or capital <= 0:
        raise ValueError("positive finite capital required")
    if not math.isfinite(cost_bps) or not 0 <= cost_bps < 10000:
        raise ValueError("cost_bps must be between 0 and 10000")
    if lot_size is not None and (not isinstance(lot_size, int) or lot_size < 1):
        raise ValueError("lot_size must be a positive integer or None")
    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    if len(common) < 2:
        raise ValueError("insufficient common history")
    start, end = common[0], common[-1]
    tickers = sorted(prices)
    budget_each = capital / len(tickers)
    shares = {}
    for t in tickers:
        spend = budget_each / (1 + cost_bps / 10000)
        raw_qty = spend / prices[t][start]
        qty = math.floor(raw_qty / lot_size) * lot_size if lot_size else raw_qty
        shares[t] = qty
    spent = sum(q * prices[t][start] * (1 + cost_bps / 10000) for t, q in shares.items())
    cash = capital - spent

    equity_curve = []
    for d in common:
        equity_curve.append((d.isoformat(), round(cash + sum(q * prices[t][d] for t, q in shares.items()), 2)))

    exit_value = cash + sum(q * prices[t][end] * (1 - cost_bps / 10000) for t, q in shares.items())
    peak = capital
    dd = 0.0
    for _, v in equity_curve:
        peak = max(peak, v)
        dd = min(dd, v / peak - 1)
    return {
        "name": "buy_and_hold_equal_weight",
        "initial": capital,
        "final": round(exit_value, 2),
        "return_pct": round((exit_value / capital - 1) * 100, 2),
        "max_drawdown_pct": round(dd * 100, 2),
        "start": start.isoformat(),
        "end": end.isoformat(),
        "tickers": tickers,
        "lot_size": lot_size,
        "equity_curve": equity_curve,
    }


def topix_baseline_from_csv(path, capital=1_000_000, start=None, end=None):
    """Buy-and-hold on a user-supplied, legally-obtained local TOPIX CSV
    (columns: date,close). Restricts to [start, end] if given, so it can be
    aligned to the same window as the main analysis. Returns None-shaped
    guidance is NOT provided here -- callers without a CSV should simply
    not call this function and report TOPIX as unavailable; this function
    never fabricates a value."""
    series = {}
    with open(path, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            d = date.fromisoformat(r["date"])
            p = float(r["close"])
            if not math.isfinite(p) or p <= 0:
                raise ValueError(f"invalid TOPIX price at {d.isoformat()}")
            series[d] = p
    if not series:
        raise ValueError("empty TOPIX CSV")
    dates = sorted(series)
    if start is not None:
        dates = [d for d in dates if d >= start]
    if end is not None:
        dates = [d for d in dates if d <= end]
    if len(dates) < 2:
        raise ValueError("insufficient TOPIX history in the requested window")
    first, last = dates[0], dates[-1]
    ret_pct = (series[last] / series[first] - 1) * 100
    peak = series[first]
    dd = 0.0
    for d in dates:
        peak = max(peak, series[d])
        dd = min(dd, series[d] / peak - 1)
    return {
        "name": "topix_buy_and_hold",
        "source": f"user-supplied local CSV: {path}",
        "initial": capital,
        "final": round(capital * series[last] / series[first], 2),
        "return_pct": round(ret_pct, 2),
        "max_drawdown_pct": round(dd * 100, 2),
        "start": first.isoformat(),
        "end": last.isoformat(),
    }
