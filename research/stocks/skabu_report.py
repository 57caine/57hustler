"""Phase 3 CLI: compare the fractional-share, 100-share-lot, and SBI S-Kabu
1-share models (plus the buy-and-hold baseline) on the same local CSV, and
print a compact JSON summary. No network access, no API key, no brokerage
connectivity. See skabu_model.py for the S-Kabu rules and their sourcing/
caveats.
"""
import argparse
import json
import sys

import backtest
from skabu_model import compare_lot_models, DEFAULT_COMPARISON_COST_BPS


def build_parser():
    parser = argparse.ArgumentParser(
        description="Phase 3: fractional vs 100-share vs S-Kabu 1-share comparison (local-only, compact JSON)")
    parser.add_argument("prices_csv", help="local path to adjusted_prices.csv (columns: date,ticker,close)")
    parser.add_argument("--capital", type=float, default=1_000_000)
    parser.add_argument("--lookback", type=int, default=126)
    parser.add_argument("--max-names", type=int, default=5)
    parser.add_argument("--comparison-cost-bps", type=float, default=DEFAULT_COMPARISON_COST_BPS,
                         help="cost_bps used for the fractional/100-share/baseline models, and for the "
                              "skabu_1_share_same_cost_as_lots sensitivity row")
    parser.add_argument("--out", help="optional local file path to also write the JSON to")
    return parser


def main():
    args = build_parser().parse_args()
    try:
        prices = backtest.load(args.prices_csv)
        report = compare_lot_models(prices, capital=args.capital, lookback=args.lookback,
                                     max_names=args.max_names, comparison_cost_bps=args.comparison_cost_bps)
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
