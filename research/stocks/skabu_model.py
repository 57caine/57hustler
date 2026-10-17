"""Phase 3: SBI Securities S-Kabu (単元未満株, 1-share trading) model and a
side-by-side comparison against the existing fractional-share and 100-share
lot models, plus the buy-and-hold baseline. Standard library only, no
network access, no brokerage connectivity, no real orders.

SBI S-Kabu rules used here -- confirmed via web search against SBI's own
official domain (sbisec.co.jp / search.sbisec.co.jp) in October 2026. This
sandbox's egress policy blocks directly fetching sbisec.co.jp (confirmed via
the agent-proxy's own status log, same restriction already hit against
jpx-jquants.com / api.jquants.com earlier in this project), so these are
"confirmed via search of SBI's own official page," not "directly read by
this script." Re-verify against
https://search.sbisec.co.jp/v2/popwin/attention/trading/stock_07.html
(the official S-Kabu trading-rules page) before relying on this for any
real decision.

Official rules, as found:
- Market orders only: no limit price, no order duration can be specified.
- Four order-time windows determine execution (current timing, after the
  2024 TSE trading-hours extension moved the cutoff from 13:30 to 14:00):
    00:00-07:00 -> that day's MORNING-session OPENING price
    07:00-10:30 -> that day's AFTERNOON-session OPENING price
    10:30-14:00 -> that day's AFTERNOON-session CLOSING price
    14:00-24:00 -> the NEXT business day's morning-session opening price
  An order unfilled at its scheduled opening-price session rolls to that
  day's closing-price session; one still unfilled there expires. A
  stop-priced ("ストップ配分") close allocates no S-Kabu orders at all.
- Trading unit is 1 share, not the usual 100-share lot.
- Under SBI's "Zero Revolution" program (net-trading course + paperless
  statement delivery), S-Kabu commission AND spread are BOTH zero. This is
  specific to SBI: a comparably-named service at another broker (e.g.
  Rakuten's "Kabu Mini") has been reported to still carry a spread even
  when nominally commission-free.
- Dual-listed issues may execute against a different market's price; none
  of this project's 10 symbols are flagged as dual-listed in the local data,
  but that has not been separately verified against an issue master.

What this module does and does NOT simulate, given only DAILY CLOSE prices
(no intraday opening-price data exists anywhere in this project's CSVs,
and none is fetched here -- fetch_jquants.py still only pulls AdjC):
- Models ONLY the 10:30-14:00 -> same-day CLOSING price bucket. A decision
  made after a prior trading day's close and placed the next morning
  plausibly falls in the 07:00-14:00 range; closing-price execution is the
  one bucket in that range this data can actually support, and matches how
  backtest.run() already executes (next observed trading day's close) --
  so no new lookahead is introduced by reusing it here.
- Does NOT model the three opening-price buckets, the roll-to-close/expiry
  mechanics, or stop-allocation non-execution. Reconstructing any of those
  would require inventing intraday prices this project does not have.
  These remain real, unmodeled, explicitly-stated gaps, not assumed away.

Nothing here tunes parameters per model to make one look better: every
model in compare_lot_models() receives the SAME lookback/max_names.
"""
import backtest
import baselines
import metrics

# Officially zero commission AND zero spread for S-Kabu under Zero Revolution.
SKABU_COST_BPS_ZERO = 0
# Same generic friction assumption already used for the other lot models
# (Phase 1/2), offered here only so the cost assumption's own effect on the
# S-Kabu result is visible, not hidden behind a single always-zero number.
DEFAULT_COMPARISON_COST_BPS = 20


def run_skabu(prices, capital=1_000_000, lookback=126, max_names=5, cost_bps=SKABU_COST_BPS_ZERO):
    """1-share-lot model, reusing backtest.run()'s existing, already-tested
    lot_size machinery with lot_size=1. cost_bps defaults to the officially
    sourced zero; pass a different value only to test sensitivity to that
    assumption."""
    return backtest.run(prices, capital=capital, lookback=lookback, max_names=max_names,
                         cost_bps=cost_bps, lot_size=1)


def _without_bulk_fields(d):
    # Phase 5 fix: this used to drop only equity_curve/final_positions,
    # silently leaking the per-rebalance-event rebalance_log Phase 4 added
    # to backtest.run()'s result into every model's "compact" result here
    # (confirmed leaking into compare_lot_models()'s JSON output, and from
    # there into phase4_report.py's lot_model_comparison section).
    drop = {"equity_curve", "final_positions", "rebalance_log"}
    return {k: v for k, v in d.items() if k not in drop}


def compare_lot_models(prices, capital=1_000_000, lookback=126, max_names=5,
                        comparison_cost_bps=DEFAULT_COMPARISON_COST_BPS):
    """Runs every model with the SAME lookback/max_names -- none is tuned
    per model. Returns a dict keyed by model name, each value containing
    the stripped backtest result plus monthly_returns/drawdown_episodes/
    worst_month derived from its own equity curve, so Phase 2's metrics are
    available per model without re-deriving them by hand."""
    if not prices:
        raise ValueError("empty prices")

    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    if not common:
        raise ValueError("no common trading dates across tickers")
    start, end = common[0], common[-1]

    raw_models = {
        "fractional_shares": backtest.run(prices, capital=capital, lookback=lookback,
                                           max_names=max_names, cost_bps=comparison_cost_bps, lot_size=None),
        "lot_100_shares": backtest.run(prices, capital=capital, lookback=lookback,
                                        max_names=max_names, cost_bps=comparison_cost_bps, lot_size=100),
        "skabu_1_share_zero_cost": run_skabu(prices, capital=capital, lookback=lookback,
                                              max_names=max_names, cost_bps=SKABU_COST_BPS_ZERO),
        "skabu_1_share_same_cost_as_lots": run_skabu(prices, capital=capital, lookback=lookback,
                                                      max_names=max_names, cost_bps=comparison_cost_bps),
    }

    models = {}
    for name, result in raw_models.items():
        models[name] = {
            "result": _without_bulk_fields(result),
            "monthly_returns": metrics.monthly_returns(result["equity_curve"]),
            "worst_month": metrics.worst_month(result["equity_curve"]),
            "drawdown_episodes": metrics.drawdown_durations(result["equity_curve"]),
        }

    # Phase 4 fix: each lot-size model is compared against a buy-and-hold
    # baseline using the SAME lot_size and cost assumption as that model --
    # not a single generic fractional-share baseline reused for every one.
    # An earlier (Phase 3) version of this comparison made exactly that
    # mistake, which the owner's Phase 4 review flagged as a false/mismatched
    # comparison; fixed here, not hidden.
    baseline_specs = {
        "buy_and_hold_fractional": {"lot_size": None, "cost_bps": comparison_cost_bps},
        "buy_and_hold_lot_100": {"lot_size": 100, "cost_bps": comparison_cost_bps},
        "buy_and_hold_skabu_1_share_zero_cost": {"lot_size": 1, "cost_bps": SKABU_COST_BPS_ZERO},
        "buy_and_hold_skabu_1_share_same_cost_as_lots": {"lot_size": 1, "cost_bps": comparison_cost_bps},
    }
    for name, spec in baseline_specs.items():
        bh = baselines.buy_and_hold_equal_weight(prices, capital=capital, **spec)
        models[name] = {
            "result": _without_bulk_fields(bh),
            "monthly_returns": metrics.monthly_returns(bh["equity_curve"]),
            "worst_month": metrics.worst_month(bh["equity_curve"]),
            "drawdown_episodes": metrics.drawdown_durations(bh["equity_curve"]),
        }

    cash = baselines.cash_baseline(capital, start, end)
    models["cash"] = {"result": cash, "monthly_returns": [], "worst_month": None, "drawdown_episodes": []}

    return {
        "period": {"start": start.isoformat(), "end": end.isoformat(), "observations": len(common)},
        "parameters": {"capital": capital, "lookback": lookback, "max_names": max_names,
                        "comparison_cost_bps": comparison_cost_bps},
        "models": models,
        "caveats": [
            "Unvalidated research output, NOT investment results.",
            "S-Kabu rules were confirmed via web search of SBI's own official domain, not by directly "
            "fetching sbisec.co.jp (blocked by this sandbox's egress policy) -- re-verify against the "
            "official page before relying on this for a real decision.",
            "Only the 10:30-14:00 -> same-day-close execution bucket is modeled; the three opening-price "
            "buckets, roll-to-close/expiry, and stop-allocation non-execution are NOT modeled, because this "
            "project has no intraday opening-price data to model them from.",
            "skabu_1_share_zero_cost uses the officially-zero S-Kabu commission+spread; "
            "skabu_1_share_same_cost_as_lots re-runs the identical model at the other models' cost_bps "
            "purely to show how much of the difference is the cost assumption itself.",
            "All four lot models and all buy-and-hold baselines use the SAME lookback/max_names; none was "
            "tuned per model.",
            "Each lot-size model (fractional/100-share/1-share) is compared against a buy-and-hold "
            "baseline using that SAME lot_size and cost assumption -- see the Phase 4 fix note in "
            "this module's source for why a single shared baseline would have been a mismatched "
            "comparison.",
            "See ROBUSTNESS_AUDIT.md for the Phase 2 caveats (survivorship/selection bias, dividend-adjustment "
            "uncertainty, short ~2-year sample), which apply unchanged here.",
        ],
    }
