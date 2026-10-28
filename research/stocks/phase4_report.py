"""Phase 4 CLI: compact JSON summary tying together the Priority A timing/
calendar preflight, the Priority B walk-forward validation, the (now
lot-matched) buy-and-hold baselines, and explicit failure-mode sensitivity
cases (no fill, one-session execution delay, worse execution/slippage,
dividend/corporate-action uncertainty, liquidity and concentration).

Local-only: reads a local CSV, makes no network calls, places no real
orders, connects to no brokerage. Prints ONE compact JSON summary that
excludes raw prices and equity curves, so it is safe to paste or share.

See ROBUSTNESS_AUDIT.md (Phase 2), PHASE3_SKABU_COMPARISON.md (Phase 3),
and PHASE4_EXECUTION_REALISM.md (this phase) for the full narrative --
this module is the machine-readable summary, not a replacement for those.
"""
import argparse
import json
import sys

import backtest
import baselines
import execution_timing
from skabu_model import compare_lot_models, DEFAULT_COMPARISON_COST_BPS
from walk_forward import walk_forward_report

# ~5x the project's standard 20bps cost assumption, as a stressed
# execution-quality / slippage sensitivity case -- not a prediction of
# actual slippage, which this project has no data to estimate.
SLIPPAGE_STRESS_COST_BPS = 100

CONCENTRATION_LIQUIDITY_NOTES = [
    "Concentration: backtest.run() already caps any single position at "
    "min(equal_weight, 20% of current cash) at every rebalance (see "
    "backtest.py's `budget = min(cash / len(chosen), cash * 0.20)`); this "
    "report does not relax or re-tune that cap.",
    "Liquidity: this project's CSVs contain only daily CLOSE prices, no "
    "volume -- there is no data from which to estimate what fraction of a "
    "day's trading volume the modeled order size would represent, or any "
    "resulting market-impact cost. This is an unmodeled gap, not assumed "
    "to be negligible.",
    "Dividends / corporate actions: whether the price series' adjustment "
    "already accounts for dividends (beyond splits/rights) could not be "
    "confirmed from this environment (same caveat as ROBUSTNESS_AUDIT.md); "
    "a corporate action landing exactly on a rebalance date could also "
    "distort that day's momentum ranking in a way this backtest cannot "
    "detect from close prices alone.",
]


def _without_bulk(d):
    drop = {"equity_curve", "final_positions", "rebalance_log"}
    return {k: v for k, v in d.items() if k not in drop}


def _failure_mode_sensitivity(prices, capital, lookback, max_names, cost_bps, lot_size):
    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    start, end = common[0], common[-1]

    baseline_run = backtest.run(prices, capital=capital, lookback=lookback, max_names=max_names,
                                 cost_bps=cost_bps, lot_size=lot_size)
    delayed = backtest.run(prices, capital=capital, lookback=lookback, max_names=max_names,
                            cost_bps=cost_bps, lot_size=lot_size, execution_delay_sessions=1)
    stressed_cost = backtest.run(prices, capital=capital, lookback=lookback, max_names=max_names,
                                  cost_bps=SLIPPAGE_STRESS_COST_BPS, lot_size=lot_size)
    no_fill = baselines.cash_baseline(capital, start, end)

    stress_multiple = f"{SLIPPAGE_STRESS_COST_BPS / cost_bps:.1f}x" if cost_bps else "n/a (baseline cost_bps is 0)"

    return {
        "baseline": _without_bulk(baseline_run),
        "no_fill": {
            **no_fill,
            "modeling_note": "A trade that never fills leaves that capital in cash; approximated "
                              "here by the cash baseline rather than inventing a partial-fill mechanic.",
        },
        "one_session_execution_delay": _without_bulk(delayed),
        "worse_execution_slippage": {
            **_without_bulk(stressed_cost),
            "stress_cost_bps": SLIPPAGE_STRESS_COST_BPS,
            "modeling_note": f"Same strategy re-run at cost_bps={SLIPPAGE_STRESS_COST_BPS} "
                              f"({stress_multiple} the baseline cost_bps={cost_bps}) as a stressed "
                              "slippage/execution-quality case, not a measured or predicted figure.",
        },
        "notes": CONCENTRATION_LIQUIDITY_NOTES,
    }


def build_phase4_report(prices_csv, capital=1_000_000, lookback=126, max_names=5, cost_bps=20,
                         lot_size=None, n_splits=2, comparison_cost_bps=DEFAULT_COMPARISON_COST_BPS,
                         max_gap_days=execution_timing.MAX_PLAUSIBLE_GAP_DAYS):
    prices = backtest.load(prices_csv)
    common = sorted(set.intersection(*(set(x) for x in prices.values())))

    # Priority A preflight: explicit, CHECKED timing assumptions rather than
    # a silent "assume filled." Both raise ValueError (propagated to the
    # caller, never swallowed) if the calendar looks anomalous or the SBI
    # same-day-close window assumption is not explicitly acknowledged.
    execution_timing.assert_same_day_close_fill_assumption_holds(True)
    calendar_gaps = execution_timing.validate_trading_calendar(common, max_gap_days=max_gap_days)

    walk_forward = walk_forward_report(prices, capital=capital, lookback=lookback, max_names=max_names,
                                        cost_bps=cost_bps, lot_size=lot_size, n_splits=n_splits)

    lot_comparison = compare_lot_models(prices, capital=capital, lookback=lookback, max_names=max_names,
                                         comparison_cost_bps=comparison_cost_bps)

    failure_modes = _failure_mode_sensitivity(prices, capital, lookback, max_names, cost_bps, lot_size)

    return {
        "period": {"start": common[0].isoformat(), "end": common[-1].isoformat(), "observations": len(common)},
        "parameters": {"capital": capital, "lookback": lookback, "max_names": max_names,
                        "cost_bps": cost_bps, "lot_size": lot_size, "n_splits": n_splits},
        "timing_preflight": {
            "same_day_close_fill_assumption_acknowledged": True,
            # Phase 5 clarification: "acknowledged" means this report-builder
            # passed the required boolean -- it is NOT evidence the SBI
            # 10:30-14:00 same-day-close assumption was empirically tested
            # against real intraday/order data (none exists in this
            # project). Kept as an explicit, separate field so the
            # acknowledgment can never be read as validation.
            "empirically_validated": False,
            "trading_calendar_checked": True,
            "max_gap_days": max_gap_days,
            "largest_observed_gap_days": max((g for _, _, g in calendar_gaps), default=0),
            "source": "See execution_timing.py and PHASE4_EXECUTION_REALISM.md for the SBI "
                      "10:30-14:00 same-day-close window sourcing and this sandbox's egress block.",
        },
        "walk_forward_validation": walk_forward,
        "lot_model_comparison": lot_comparison,
        "failure_mode_sensitivity": failure_modes,
        "caveats": [
            "Unvalidated research output, NOT investment results.",
            "timing_preflight.same_day_close_fill_assumption_acknowledged=True records that this "
            "report-builder passed the required acknowledgment, not that the SBI 10:30-14:00 "
            "same-day-close assumption was empirically tested -- see empirically_validated=False "
            "in that same section; see PHASE5_UNBIASED_VALIDATION.md Priority 0 for the audit that "
            "flagged this distinction.",
            "See ROBUSTNESS_AUDIT.md (Phase 2) and PHASE3_SKABU_COMPARISON.md (Phase 3) for caveats "
            "that still apply unchanged (survivorship/selection bias, dividend-adjustment uncertainty, "
            "short ~2-year sample, S-Kabu rule sourcing).",
            "walk_forward_validation windows are date-range slices of a single full-period run, not "
            "independently re-estimated from a blank slate for each window -- see its own warmup_note.",
            "failure_mode_sensitivity cases are deterministic stress scenarios (cash-equivalent no-fill, "
            "one-session delay, 5x stressed cost), not measured or predicted real-world frequencies.",
            "No parameter was tuned on any split, window, or failure-mode case to make the past look "
            "more profitable.",
        ],
    }


def build_parser():
    parser = argparse.ArgumentParser(
        description="Phase 4: execution-realism and out-of-sample validation report "
                    "(local-only, compact JSON output, no network access)")
    parser.add_argument("prices_csv", help="local path to adjusted_prices.csv (columns: date,ticker,close)")
    parser.add_argument("--capital", type=float, default=1_000_000)
    parser.add_argument("--lookback", type=int, default=126)
    parser.add_argument("--max-names", type=int, default=5)
    parser.add_argument("--cost-bps", type=float, default=20)
    parser.add_argument("--lot-size", type=int, default=None,
                         help="e.g. 100 for whole-lot rounding; omit for fractional shares (research mode)")
    parser.add_argument("--n-splits", type=int, default=2)
    parser.add_argument("--comparison-cost-bps", type=float, default=DEFAULT_COMPARISON_COST_BPS)
    parser.add_argument("--out", help="optional local file path to also write the JSON to")
    return parser


def main():
    args = build_parser().parse_args()
    try:
        report = build_phase4_report(
            args.prices_csv, capital=args.capital, lookback=args.lookback, max_names=args.max_names,
            cost_bps=args.cost_bps, lot_size=args.lot_size, n_splits=args.n_splits,
            comparison_cost_bps=args.comparison_cost_bps,
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
