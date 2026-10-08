"""Performance metrics derived purely from an equity curve
(list of (ISO date string, value) pairs, chronological). Standard library
only, no network access. Used for both the momentum backtest and the
baselines, so comparisons use identical definitions.
"""
from datetime import date


def monthly_returns(equity_curve):
    """Last observation of each calendar month -> month-over-month % change.
    The first month in the curve has no prior month and is excluded."""
    if not equity_curve:
        return []
    last_value_of_month = {}
    order = []
    for d_iso, v in equity_curve:
        d = date.fromisoformat(d_iso)
        key = f"{d.year:04d}-{d.month:02d}"
        if key not in last_value_of_month:
            order.append(key)
        last_value_of_month[key] = v  # equity_curve is chronological, so last write wins
    rows = []
    prev = None
    for key in order:
        v = last_value_of_month[key]
        if prev is not None:
            rows.append({"month": key, "return_pct": round((v / prev - 1) * 100, 2)})
        prev = v
    return rows


def worst_month(equity_curve):
    rows = monthly_returns(equity_curve)
    if not rows:
        return None
    return min(rows, key=lambda r: r["return_pct"])


def drawdown_durations(equity_curve):
    """One entry per peak-to-recovery episode: depth, and how many days it
    took to recover (None if the curve ends still underwater -- that last
    episode's duration is deliberately left unknown rather than guessed)."""
    if not equity_curve:
        return []
    episodes = []
    peak_v, peak_d = None, None
    trough_v, trough_d = None, None
    in_drawdown = False
    for d_iso, v in equity_curve:
        d = date.fromisoformat(d_iso)
        if peak_v is None or v >= peak_v:
            if in_drawdown:
                episodes.append({
                    "peak_date": peak_d.isoformat(),
                    "trough_date": trough_d.isoformat(),
                    "recovery_date": d.isoformat(),
                    "depth_pct": round((trough_v / peak_v - 1) * 100, 2),
                    "duration_days": (d - peak_d).days,
                })
                in_drawdown = False
            peak_v, peak_d = v, d
            trough_v, trough_d = v, d
        else:
            in_drawdown = True
            if v < trough_v:
                trough_v, trough_d = v, d
    if in_drawdown:
        episodes.append({
            "peak_date": peak_d.isoformat(),
            "trough_date": trough_d.isoformat(),
            "recovery_date": None,
            "depth_pct": round((trough_v / peak_v - 1) * 100, 2),
            "duration_days": None,
        })
    return episodes
