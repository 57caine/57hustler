"""Phase 5 CLI: unbiased-universe and genuinely out-of-sample validation
report. Ties together:

  - universe.bias_status(): an honest statement that survivorship-bias-free
    universe construction is NOT possible with this project's current
    local data (see universe.py for the schema/validator/builder that
    WOULD support it if real point-in-time metadata is ever supplied).
  - preregistration.holdout_protocol_report(): a genuine, pre-registered,
    chronological development/holdout test (NOT a slice of one combined
    run -- contrast with walk_forward.py from Phase 4, which is a
    legitimate reporting tool but not a held-out test; see
    PHASE5_UNBIASED_VALIDATION.md Priority 0 for why).
  - A 1-share buy-and-hold baseline matched on start date, cash, and cost
    assumption to the pre-registered strategy, plus concentration/
    turnover/cost/drawdown figures and TOPIX only if a local CSV is
    supplied (never invented).

This CLI intentionally does NOT expose lookback/max_names/cost_bps as
flags. Phase 5's whole point is that strategy parameters are fixed BEFORE
looking at any holdout result -- a CLI flag that lets someone quietly
change them between a "development" run and a "holdout" run would defeat
that. Every run through this entry point uses preregistration.py's
PRE_REGISTERED_PARAMS; the manifest hash is still reported for
transparency, and preregistration.holdout_protocol_report()'s own
contamination check (expected_manifest_hash) exists for any other caller
that does accept arbitrary parameters.

Local-only: reads a local CSV, makes no network calls, places no real
orders, connects to no brokerage. Prints ONE compact JSON summary that
excludes raw prices and equity curves. See PHASE5_UNBIASED_VALIDATION.md
for the full narrative and known limitations.
"""
import argparse
import json
import sys

import backtest
import baselines
import universe
from preregistration import PRE_REGISTERED_PARAMS, PRE_REGISTERED_MANIFEST_HASH, holdout_protocol_report

# Officially zero commission AND spread for SBI S-Kabu under "Zero
# Revolution" -- see skabu_model.py for the sourcing and its own caveats.
SKABU_COST_BPS_ZERO = 0


def _strip_bulk(d):
    return {k: v for k, v in d.items() if k not in ("equity_curve", "final_positions", "rebalance_log")}


def _matched_benchmark_comparison(prices, capital, params, topix_csv=None):
    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    start, end = common[0], common[-1]

    strategy_result = backtest.run(prices, capital=capital, **params)
    # Both baselines share the SAME start date (common[0], same as the
    # strategy run), the SAME starting cash, and 1-share lots -- only the
    # cost assumption differs between the two, isolating how much of any
    # gap is "zero S-Kabu cost" versus the strategy's own signal.
    bh_1_share_zero_cost = baselines.buy_and_hold_equal_weight(
        prices, capital=capital, cost_bps=SKABU_COST_BPS_ZERO, lot_size=1)
    bh_1_share_same_cost_as_strategy = baselines.buy_and_hold_equal_weight(
        prices, capital=capital, cost_bps=params["cost_bps"], lot_size=1)
    cash = baselines.cash_baseline(capital, start, end)

    if topix_csv:
        topix = baselines.topix_baseline_from_csv(topix_csv, capital=capital, start=start, end=end)
    else:
        topix = {
            "name": "topix_buy_and_hold",
            "status": "not_computed",
            "reason": "no local --topix-csv supplied; no benchmark value has been invented",
        }

    return {
        # Listing the actual tickers is transparency, NOT a claim that
        # this is a point-in-time, survivorship-bias-free universe -- see
        # the top-level bias_unresolved/data_required flags.
        "universe_tickers": sorted(prices),
        "start": start.isoformat(),
        "end": end.isoformat(),
        "strategy": _strip_bulk(strategy_result),
        "buy_and_hold_1_share_zero_cost": _strip_bulk(bh_1_share_zero_cost),
        "buy_and_hold_1_share_same_cost_as_strategy": _strip_bulk(bh_1_share_same_cost_as_strategy),
        "cash": cash,
        "topix": topix,
        "concentration_turnover_cost": {
            "max_position_cap_pct_of_cash": 20,
            "note": "backtest.run() caps any single position at min(equal_weight, 20% of current "
                    "cash) at every rebalance; not relaxed or re-tuned here.",
            "turnover_ratio": strategy_result["turnover_ratio"],
            "notional_traded": strategy_result["notional_traded"],
            "cost_bps": strategy_result["cost_bps"],
            "max_drawdown_pct": strategy_result["max_drawdown_pct"],
        },
        "dividend_and_tax_uncertainty": (
            "Whether the adjusted-close series already reflects dividends beyond splits/rights "
            "could not be confirmed from this environment (same caveat as ROBUSTNESS_AUDIT.md). "
            "Tax is reported, if at all, as a separate simplified scenario "
            "(backtest.after_tax_summary) -- never folded into position sizing or the comparison "
            "above. Both are reported as uncertainty, not invented accuracy."
        ),
        "no_parameter_optimization": (
            "This comparison re-uses the single pre-registered parameter set "
            "(preregistration.PRE_REGISTERED_PARAMS) for the strategy; nothing here was searched "
            "or adjusted to produce a better headline return."
        ),
    }


def build_phase5_report(prices_csv, capital=1_000_000, development_fraction=0.7, topix_csv=None,
                         has_point_in_time_metadata=False):
    prices = backtest.load(prices_csv)
    params = PRE_REGISTERED_PARAMS

    bias = universe.bias_status(has_point_in_time_metadata)
    holdout = holdout_protocol_report(
        prices, lookback=params["lookback"], max_names=params["max_names"], cost_bps=params["cost_bps"],
        lot_size=params["lot_size"], capital=capital, development_fraction=development_fraction,
        expected_manifest_hash=PRE_REGISTERED_MANIFEST_HASH,
    )
    benchmark = _matched_benchmark_comparison(prices, capital, params, topix_csv=topix_csv)

    return {
        "pre_registered_parameters": params,
        "pre_registered_manifest_hash": PRE_REGISTERED_MANIFEST_HASH,
        "universe": {"tickers_used": sorted(prices), **bias},
        "holdout_validation": holdout,
        "benchmark_comparison": benchmark,
        "data_required": bias["data_required"],
        "bias_unresolved": bias["bias_unresolved"],
        "oos_status": holdout["oos_status"],
        "readiness_for_real_trading": False,
        "caveats": [
            "Unvalidated research output, NOT investment results. readiness_for_real_trading is "
            "hardcoded False in every Phase 5 report -- this flag is not meant to ever flip to True "
            "from this project alone.",
            "bias_unresolved=True (see universe.py / data_required) whenever real point-in-time "
            "listing/sector/corporate-action metadata was not supplied -- which is the case for "
            "this project's actual local data today. The 10 (or however many) symbols in the "
            "supplied CSV are a present-day-selected set with an unverified selection process; "
            "universe_tickers above is transparency about WHAT was used, not a claim that it is "
            "survivorship-bias-free.",
            "oos_status reflects preregistration.py's genuine chronological development/holdout "
            "split with a manifest-hash contamination check -- a stronger claim than Phase 4's "
            "walk_forward_report(), which slices a single combined run and is not a held-out test. "
            "'validated_with_caveats' still means only 'ran without a known defect and met minimum "
            "sample/trade thresholds', not 'statistically significant' or 'proven profitable'.",
            "This CLI does not expose strategy parameters as flags; every run uses the single "
            "pre_registered_parameters above. See PHASE5_UNBIASED_VALIDATION.md for why.",
            "See ROBUSTNESS_AUDIT.md (Phase 2), PHASE3_SKABU_COMPARISON.md (Phase 3), and "
            "PHASE4_EXECUTION_REALISM.md (Phase 4) for caveats that still apply unchanged "
            "(short ~2-year sample, dividend-adjustment uncertainty, S-Kabu rule sourcing, "
            "liquidity/concentration gaps).",
        ],
    }


def build_parser():
    parser = argparse.ArgumentParser(
        description="Phase 5: unbiased-universe and genuinely out-of-sample validation report "
                    "(local-only, compact JSON output, no network access, no parameter flags)")
    parser.add_argument("prices_csv", help="local path to adjusted_prices.csv (columns: date,ticker,close)")
    parser.add_argument("--capital", type=float, default=1_000_000)
    parser.add_argument("--development-fraction", type=float, default=0.7,
                         help="fraction of history used for the development period; the remainder "
                              "is the untouched, strictly-later holdout period")
    parser.add_argument("--topix-csv",
                         help="optional local TOPIX CSV (date,close); omit to report TOPIX as not computed")
    parser.add_argument("--out", help="optional local file path to also write the JSON to")
    return parser


def main():
    args = build_parser().parse_args()
    try:
        report = build_phase5_report(
            args.prices_csv, capital=args.capital, development_fraction=args.development_fraction,
            topix_csv=args.topix_csv,
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
