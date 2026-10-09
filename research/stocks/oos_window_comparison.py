"""Phase 5 follow-up: strategy vs buy-and-hold over a FIXED, calendar-pinned
OOS window (2025-12-19 to 2026-06-30 by default -- the window the owner
specified), matched exactly on period, starting capital, ticker universe,
and cost/lot assumptions. Local-only, no network access, no real orders,
no brokerage connection.

Builds on preregistration.py's warmup-corrected holdout_protocol_report()
(date-range mode, via holdout_start/holdout_end) for the strategy side --
see PHASE5_UNBIASED_VALIDATION.md's "Real-data follow-up fix" section for
why warmup is needed and how its P&L/trades are excluded from the reported
OOS performance. The buy-and-hold side is a dedicated,
date-sliced baselines.buy_and_hold_equal_weight() run that needs no
warmup (it holds a fixed position, with no lookback indicator), using the
SAME OOS date range, initial capital, ticker set, and cost_bps/lot_size as
the strategy.
"""
import argparse
import json
import sys
from datetime import date

import backtest
import baselines
import time_split
from preregistration import holdout_protocol_report, PRE_REGISTERED_PARAMS, PRE_REGISTERED_MANIFEST_HASH

# The OOS window specified by the owner for this comparison.
DEFAULT_OOS_START = date(2025, 12, 19)
DEFAULT_OOS_END = date(2026, 6, 30)

# Mirrors backtest.run()'s own position cap; stated here too so this
# report's "known_constraints" section is self-contained.
POSITION_CONCENTRATION_CAP_PCT_OF_CASH = 20


def oos_vs_buy_and_hold_report(prices, capital=1_000_000, oos_start=DEFAULT_OOS_START, oos_end=DEFAULT_OOS_END,
                                params=None, expected_manifest_hash=PRE_REGISTERED_MANIFEST_HASH):
    """params defaults to preregistration.PRE_REGISTERED_PARAMS -- the
    single pre-registered parameter set -- so this comparison is never
    silently run with different parameters than the rest of Phase 5. The
    strategy side reuses holdout_protocol_report()'s warmup-corrected,
    manifest-checked holdout evaluation pinned to [oos_start, oos_end];
    the buy-and-hold side is computed independently over the identical
    realized OOS date range, capital, ticker set, and cost/lot
    assumptions, so the two are directly comparable."""
    if params is None:
        params = PRE_REGISTERED_PARAMS

    strategy_report = holdout_protocol_report(
        prices, lookback=params["lookback"], max_names=params["max_names"], cost_bps=params["cost_bps"],
        lot_size=params["lot_size"], capital=capital, holdout_start=oos_start, holdout_end=oos_end,
        expected_manifest_hash=expected_manifest_hash,
    )

    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    oos_dates = [d for d in common if oos_start <= d <= oos_end]
    if not oos_dates:
        return {
            "oos_window": {"requested_start": oos_start.isoformat(), "requested_end": oos_end.isoformat()},
            "parameters": params,
            "oos_status": "not_validated",
            "reason": f"no price observations fall within the requested OOS window "
                      f"[{oos_start.isoformat()}, {oos_end.isoformat()}]",
            "strategy": strategy_report,
            "buy_and_hold": None,
        }

    oos_prices = time_split.slice_prices(prices, oos_dates[0], oos_dates[-1])
    buy_and_hold, buy_and_hold_error = None, None
    try:
        bh_result = baselines.buy_and_hold_equal_weight(
            oos_prices, capital=capital, cost_bps=params["cost_bps"], lot_size=params["lot_size"])
        buy_and_hold = {
            "start": bh_result["start"], "end": bh_result["end"], "initial": bh_result["initial"],
            "final": bh_result["final"], "return_pct": bh_result["return_pct"],
            "max_drawdown_pct": bh_result["max_drawdown_pct"], "tickers": bh_result["tickers"],
            "lot_size": bh_result["lot_size"], "cost_bps": params["cost_bps"],
        }
    except ValueError as e:
        buy_and_hold_error = str(e)

    return {
        "oos_window": {
            "requested_start": oos_start.isoformat(), "requested_end": oos_end.isoformat(),
            "actual_start": oos_dates[0].isoformat(), "actual_end": oos_dates[-1].isoformat(),
            "observations": len(oos_dates),
        },
        "parameters": params,
        "oos_status": strategy_report["oos_status"],
        "strategy": strategy_report,
        "buy_and_hold": buy_and_hold,
        "buy_and_hold_error": buy_and_hold_error,
        "matched_on": [
            "period (identical realized OOS date range)",
            "initial capital",
            "ticker universe (every ticker present in the supplied price data)",
            "cost_bps",
            "lot_size",
        ],
        "known_constraints": {
            "trading_cost_bps": params["cost_bps"],
            "cost_bps_note": "A single round-trip cost assumption (commission+spread bundled); not "
                              "modeled separately, and not measured from real fills. See ROBUSTNESS_AUDIT.md.",
            "lot_size": params["lot_size"],
            "lot_size_note": (
                "None = fractional shares (research-only; not an executable Japanese lot size)."
                if params["lot_size"] is None else
                f"Whole-lot rounding to multiples of {params['lot_size']} shares; the rounding "
                f"remainder stays in cash."
            ),
            "position_concentration_cap_pct_of_cash": POSITION_CONCENTRATION_CAP_PCT_OF_CASH,
            "concentration_note": "backtest.run() caps any single position at "
                                   "min(equal_weight, 20% of current cash) at every rebalance; the "
                                   "buy-and-hold side splits capital equally across all tickers with no cap "
                                   "needed (it never adds positions after the initial purchase).",
            "ticker_selection_bias": "The ticker universe here is whatever tickers are present in the "
                                     "supplied price data -- a present-day-selected set, not constructed "
                                     "point-in-time (see universe.py / bias_status()). bias_unresolved=True "
                                     "applies to this comparison too; this report does not attempt to "
                                     "resolve it.",
        },
        "caveats": [
            "Unvalidated research output, NOT investment results.",
            "oos_status comes from preregistration.holdout_protocol_report()'s warmup-corrected, "
            "manifest-checked holdout evaluation -- see PHASE5_UNBIASED_VALIDATION.md's "
            "'Real-data follow-up fix' section for why warmup is needed and how it is excluded "
            "from the reported OOS performance.",
            "buy_and_hold uses the SAME realized OOS date range, initial capital, ticker set, and "
            "cost_bps/lot_size as the strategy -- no warmup is needed for buy-and-hold since it does "
            "not use a lookback indicator and takes no further action after its initial purchase.",
            "TOPIX is not included in this comparison; see phase5_report.py's benchmark_comparison "
            "for the TOPIX not_computed/local-CSV path if a TOPIX comparison is needed.",
            "No parameter was chosen or adjusted by looking at this OOS window's result.",
        ],
    }


def build_parser():
    parser = argparse.ArgumentParser(
        description="Phase 5: strategy vs buy-and-hold over a fixed OOS calendar window "
                    "(local-only, compact JSON output, no network access, no parameter flags)")
    parser.add_argument("prices_csv", help="local path to adjusted_prices.csv (columns: date,ticker,close)")
    parser.add_argument("--capital", type=float, default=1_000_000)
    parser.add_argument("--oos-start", default=DEFAULT_OOS_START.isoformat(),
                         help="ISO date (YYYY-MM-DD); default 2025-12-19")
    parser.add_argument("--oos-end", default=DEFAULT_OOS_END.isoformat(),
                         help="ISO date (YYYY-MM-DD); default 2026-06-30")
    parser.add_argument("--out", help="optional local file path to also write the JSON to")
    return parser


def main():
    args = build_parser().parse_args()
    try:
        prices = backtest.load(args.prices_csv)
        report = oos_vs_buy_and_hold_report(
            prices, capital=args.capital,
            oos_start=date.fromisoformat(args.oos_start), oos_end=date.fromisoformat(args.oos_end),
        )
    except ValueError as e:
        sys.exit(f"stopped: {e}")

    text = json.dumps(report, ensure_ascii=False, indent=2)
    print(text)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"also wrote {args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
