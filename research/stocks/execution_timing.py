"""Phase 4 Priority A.1: explicit, deterministic order-timing guards.

Makes the engine's "signal at prior close, execute at next close" convention
an auditable, CHECKED assumption rather than an implicit one. Standard
library only, no network access.

That convention is only a valid proxy for SBI S-Kabu execution if the
(unmodeled) order is placed within SBI's 10:30-14:00 same-day-close
execution window -- see skabu_model.py / PHASE3_SKABU_COMPARISON.md for
that window's sourcing (confirmed via web search of SBI's own domain;
direct fetch of sbisec.co.jp is blocked by this sandbox's egress policy,
re-confirmed 2026-10-08T17:13:37Z via the proxy's own connect_rejected log).

This module does not simulate clock time directly -- no intraday timestamp
data exists anywhere in this project's CSVs, and none is fetched here (no
network calls are made). Instead of silently assuming the order-timing
assumption holds, it:
  1. Requires every caller relying on the next-day-close convention to
     explicitly ACKNOWLEDGE that assumption (assert_same_day_close_fill_
     assumption_holds) -- raises if not acknowledged, rather than quietly
     defaulting to "assume filled."
  2. Validates the trading-calendar GAP between a signal date and its
     execution date is a plausible single-step gap (not zero/negative, not
     anomalously large) -- an anomalously large gap more likely indicates a
     data problem (halt, missing rows, delisting) than an ordinary weekend
     or holiday, and is rejected rather than silently trusted.
"""
from datetime import date

# A normal weekend is a 2-3 calendar-day gap; Japan's longest ordinary
# market closures (New Year, Golden Week) run up to roughly 9-10 calendar
# days. A gap larger than this is treated as anomalous.
MAX_PLAUSIBLE_GAP_DAYS = 10


def validate_trading_gap(signal_date, execution_date, max_gap_days=MAX_PLAUSIBLE_GAP_DAYS):
    """Raise if the gap between a signal day and its execution day is not a
    plausible single-step trading-calendar gap. Returns the gap in calendar
    days on success."""
    if not isinstance(signal_date, date) or not isinstance(execution_date, date):
        raise ValueError("signal_date and execution_date must be date objects")
    gap = (execution_date - signal_date).days
    if gap <= 0:
        raise ValueError(f"execution_date {execution_date} is not after signal_date {signal_date}")
    if gap > max_gap_days:
        raise ValueError(
            f"gap of {gap} calendar days between {signal_date} and {execution_date} exceeds "
            f"max_gap_days={max_gap_days}; this looks like a data gap or trading halt, not an "
            f"ordinary weekend/holiday -- refusing to assume a fill rather than silently proceeding"
        )
    return gap


def validate_trading_calendar(common_dates, max_gap_days=MAX_PLAUSIBLE_GAP_DAYS):
    """Check every consecutive pair in a sorted list of trading dates for an
    anomalous gap. Returns the list of (prev, next, gap_days) tuples on
    success; raises on the first anomalous pair found rather than silently
    continuing past a likely data problem."""
    if not common_dates:
        raise ValueError("empty trading calendar")
    if list(common_dates) != sorted(common_dates):
        raise ValueError("common_dates must be sorted ascending")
    return [
        (prev, nxt, validate_trading_gap(prev, nxt, max_gap_days=max_gap_days))
        for prev, nxt in zip(common_dates, common_dates[1:])
    ]


def assert_same_day_close_fill_assumption_holds(acknowledge_sbi_window_assumption):
    """The next-day-close execution convention used throughout this project
    is only a valid proxy for SBI S-Kabu if the (unmodeled) order time falls
    within the 10:30-14:00 same-day-close window documented in
    skabu_model.py. This project has no intraday clock data to check that
    directly, so instead of silently assuming it holds, every caller that
    relies on this convention must explicitly pass
    acknowledge_sbi_window_assumption=True. Passing False (or omitting it)
    raises, rather than silently defaulting to "assume filled."""
    if not acknowledge_sbi_window_assumption:
        raise ValueError(
            "the next-day-close fill convention is only valid under the explicit, stated "
            "assumption that the order is placed within SBI's 10:30-14:00 same-day-close "
            "window (see skabu_model.py); call with acknowledge_sbi_window_assumption=True "
            "to confirm you are relying on that assumption, rather than silently assuming a fill"
        )
