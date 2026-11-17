"""Phase 2 robustness-audit CLI. Runs locally only: the momentum backtest,
an independent buy-and-hold and cash baseline, time-split validation, a
fixed sensitivity sweep, monthly/drawdown/worst-month metrics, and a
separately-reported after-tax scenario -- then prints ONE compact JSON
summary that deliberately excludes raw prices and equity curves, so it is
safe to paste or share without leaking the full price history.

No network access. No API key. Reads only the local CSV path(s) given on
the command line; never uploads or transmits them anywhere.
"""
import argparse
import json
import sys

import audit_data
import backtest
import baselines
import metrics
import time_split

CAVEATS = [
    "Unvalidated research output, NOT investment results.",
    "The 10 symbols were pre-selected outside this codebase; whether that selection used "
    "information from after the sample start date (survivorship/selection bias) could not "
    "be verified here.",
    "~2 years of history with monthly rebalancing gives very few independent observations; "
    "time-split and sensitivity results should be read as illustrative, not statistically powerful.",
    "The sensitivity grid is fixed and chosen before running, not a parameter search -- "
    "no result here has been tuned against held-out data.",
    "cost_bps bundles commission and spread into a single assumption; they are not modeled separately.",
    "after_tax_scenario is a simplified, single-rate approximation; see its own 'note' field.",
    "Whether the data source's adjusted close also adjusts for dividends (beyond splits/rights) "
    "could not be confirmed from this environment; treat dividend handling as unverified.",
    "Signal timing is point-in-time by construction (signal uses only the prior trading day's "
    "close; execution is at the next trading day's close) -- see test_backtest.py's "
    "test_no_future_price_used_for_signal / test_future_shock_cannot_change_past_equity, which "
    "assert this directly against synthetic data.",
]


def _without_bulk_fields(d):
    """Shallow copy dropping fields not needed in a compact summary
    (equity curves, per-ticker position maps, and -- Phase 5 fix, this
    used to omit it -- the per-rebalance-event rebalance_log Phase 4
    added to backtest.run()'s result)."""
    drop = {"equity_curve", "final_positions", "rebalance_log"}
    return {k: v for k, v in d.items() if k not in drop}


def build_report(prices_csv, topix_csv=None, capital=1_000_000, lookback=126,
                  max_names=5, cost_bps=20, lot_size=None, tax_rate=0.20315,
                  n_splits=2, min_rows=126):
    audit_report = audit_data.audit(prices_csv, min_rows=min_rows)

    prices = backtest.load(prices_csv)
    main_result = backtest.run(prices, capital=capital, lookback=lookback,
                                max_names=max_names, cost_bps=cost_bps, lot_size=lot_size)
    tax = backtest.after_tax_summary(main_result, tax_rate=tax_rate)

    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    start, end = common[0], common[-1]

    bh = baselines.buy_and_hold_equal_weight(prices, capital=capital, cost_bps=cost_bps, lot_size=lot_size)
    cash = baselines.cash_baseline(capital, start, end)
    if topix_csv:
        topix = baselines.topix_baseline_from_csv(topix_csv, capital=capital, start=start, end=end)
    else:
        topix = {
            "name": "topix_buy_and_hold",
            "status": "not_computed",
            "reason": "J-Quants Free does not provide TOPIX OHLC and no local --topix-csv was supplied; "
                      "no benchmark value has been invented",
        }

    splits = time_split.time_split_report(prices, n_splits=n_splits, capital=capital,
                                            lookback=lookback, max_names=max_names,
                                            cost_bps=cost_bps, lot_size=lot_size)
    sensitivity = time_split.sensitivity_sweep(prices, capital=capital)

    monthly = metrics.monthly_returns(main_result["equity_curve"])
    worst = metrics.worst_month(main_result["equity_curve"])
    drawdowns = metrics.drawdown_durations(main_result["equity_curve"])

    for entry in splits:
        if "result" in entry:
            entry["result"] = _without_bulk_fields(entry["result"])

    return {
        "data_quality": {
            "status": audit_report["status"],
            "tickers": len(audit_report["tickers"]),
            "common_dates": audit_report["common_dates"],
            "warnings": audit_report["warnings"],
        },
        "period": {"start": start.isoformat(), "end": end.isoformat(), "observations": len(common)},
        "momentum_strategy": _without_bulk_fields(main_result),
        "after_tax_scenario": tax,
        "baselines": {
            "buy_and_hold_equal_weight": _without_bulk_fields(bh),
            "cash": cash,
            "topix": topix,
        },
        "time_split_validation": splits,
        "sensitivity_sweep": sensitivity,
        "monthly_returns": monthly,
        "worst_month": worst,
        "drawdown_episodes": drawdowns,
        "caveats": CAVEATS,
    }


def build_parser():
    parser = argparse.ArgumentParser(
        description="Phase 2 robustness-audit report (local-only, compact JSON output, no network access)")
    parser.add_argument("prices_csv", help="local path to adjusted_prices.csv (columns: date,ticker,close)")
    parser.add_argument("--topix-csv",
                         help="optional local TOPIX CSV (date,close); omit to report TOPIX as not computed")
    parser.add_argument("--capital", type=float, default=1_000_000)
    parser.add_argument("--lookback", type=int, default=126)
    parser.add_argument("--max-names", type=int, default=5)
    parser.add_argument("--cost-bps", type=float, default=20)
    parser.add_argument("--lot-size", type=int, default=None,
                         help="e.g. 100 for whole-lot rounding; omit for fractional shares (research mode)")
    parser.add_argument("--tax-rate", type=float, default=0.20315)
    parser.add_argument("--n-splits", type=int, default=2)
    parser.add_argument("--out", help="optional local file path to also write the JSON to")
    return parser


def main():
    args = build_parser().parse_args()
    try:
        report = build_report(
            args.prices_csv, topix_csv=args.topix_csv, capital=args.capital, lookback=args.lookback,
            max_names=args.max_names, cost_bps=args.cost_bps, lot_size=args.lot_size,
            tax_rate=args.tax_rate, n_splits=args.n_splits,
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
