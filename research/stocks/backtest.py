"""Research-only, long-only monthly momentum backtest. Standard library only.
CSV columns: date,ticker,close. Dates ISO YYYY-MM-DD, adjusted close required.
Orders use NEXT observed trading day's close (conservative proxy; not live fill).
No commissions/tax assumptions embedded: report gross and explicit cost-adjusted values.

lot_size (new, optional, default None): when None, run() behaves exactly as
before (fractional shares, for research only). Pass an integer (e.g. 100) to
round every buy down to whole lots, retaining the rounding remainder as cash
-- this is the realistic mode. Tax is deliberately NOT part of run(); see
after_tax_summary() below, which is a separate, clearly-labeled scenario
applied to the already-computed result, never mixed into position sizing.
"""
import csv
import sys
import math
from collections import defaultdict
from datetime import date

def load(path):
    prices = defaultdict(dict)
    with open(path, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            d = date.fromisoformat(r["date"])
            p = float(r["close"])
            if not math.isfinite(p) or p <= 0 or d in prices[r["ticker"]]:
                raise ValueError("invalid or duplicate price")
            prices[r["ticker"]][d] = p
    if not prices:
        raise ValueError("empty prices")
    return prices

def run(prices, capital=1_000_000, lookback=126, max_names=5, cost_bps=20, lot_size=None):
    """Signals at month-end using only observations <= signal day.
    Rebalance at next common observation close. With the default
    lot_size=None, fractional shares are used (unchanged from the original
    behavior) solely for research and must not be interpreted as executable
    Japanese lots. Pass lot_size (e.g. 100) for the realistic whole-lot mode:
    each buy is rounded down to a multiple of lot_size and the rounding
    remainder stays in cash, same as the existing 20%-cap logic already does.
    """
    if not prices or not math.isfinite(capital) or capital <= 0:
        raise ValueError("positive finite capital and nonempty prices required")
    if not isinstance(lookback, int) or lookback < 1 or not isinstance(max_names, int) or max_names < 1:
        raise ValueError("positive integer lookback and max_names required")
    if not math.isfinite(cost_bps) or not 0 <= cost_bps < 10000:
        raise ValueError("cost_bps must be between 0 and 10000")
    if lot_size is not None and (not isinstance(lot_size, int) or lot_size < 1):
        raise ValueError("lot_size must be a positive integer or None")
    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    if len(common) < lookback + 3:
        raise ValueError("insufficient common history")
    cash = float(capital)
    shares = defaultdict(float)
    cost_basis = defaultdict(float)
    trades = 0
    notional_traded = 0.0
    realized_gain_total = 0.0
    curve = []
    for i, d in enumerate(common):
        if i and (common[i-1].year, common[i-1].month) != (d.year, d.month) and i > lookback:
            signal_i = i-1
            ranking = []
            for ticker, series in prices.items():
                old = common[signal_i-lookback]
                now = common[signal_i]
                momentum = series[now] / series[old] - 1
                if momentum > 0:
                    ranking.append((momentum, ticker))
            chosen = [t for _, t in sorted(ranking, reverse=True)[:max_names]]
            # Sell old holdings, then equal-weight buy using available equity.
            for t in list(shares):
                if shares[t] > 0:
                    gross = shares[t] * prices[t][d]
                    proceeds = gross * (1-cost_bps/10000)
                    cash += proceeds
                    realized_gain_total += proceeds - cost_basis[t]
                    notional_traded += gross
                    shares[t] = 0
                    cost_basis[t] = 0.0
                    trades += 1
            budget = min(cash / len(chosen), cash * 0.20) if chosen else 0
            for t in chosen:
                spend = budget / (1+cost_bps/10000)
                raw_qty = spend / prices[t][d]
                if lot_size:
                    qty = math.floor(raw_qty / lot_size) * lot_size
                    if qty <= 0:
                        shares[t] = 0
                        cost_basis[t] = 0.0
                        continue
                    cash -= qty * prices[t][d] * (1+cost_bps/10000)
                    shares[t] = qty
                    cost_basis[t] = qty * prices[t][d]
                    notional_traded += qty * prices[t][d]
                else:
                    shares[t] = raw_qty
                    cash -= budget
                    cost_basis[t] = raw_qty * prices[t][d]
                    notional_traded += raw_qty * prices[t][d]
                trades += 1
        equity = cash + sum(q * prices[t][d] for t,q in shares.items())
        curve.append((d.isoformat(), round(equity,2)))
    peak = capital
    dd = 0.0
    for _, v in curve:
        peak = max(peak, v)
        dd = min(dd, v/peak-1)
    return {"initial":capital,"final":curve[-1][1],"return_pct":round((curve[-1][1]/capital-1)*100,2),
            "max_drawdown_pct":round(dd*100,2),"trades":trades,"cost_bps":cost_bps,
            "lot_size":lot_size,
            "notional_traded":round(notional_traded,2),
            "turnover_ratio":round(notional_traded/capital,2),
            "realized_gain_total":round(realized_gain_total,2),
            "final_positions":{t: q for t, q in shares.items() if q},
            "equity_curve":curve}


def after_tax_summary(result, tax_rate=0.20315):
    """Capital-gains tax applied only to net realized gains, as a SEPARATE
    reported scenario -- never mixed into run()'s position sizing or
    returned equity curve. Simplified: a single flat rate applied once to
    the backtest's total realized_gain_total; see the "note" field for what
    this ignores."""
    if not math.isfinite(tax_rate) or not 0 <= tax_rate < 1:
        raise ValueError("tax_rate must be in [0, 1)")
    realized_gain = result.get("realized_gain_total", 0.0)
    tax = max(0.0, realized_gain) * tax_rate
    return {
        "tax_rate": tax_rate,
        "realized_gain_total": round(realized_gain, 2),
        "estimated_tax": round(tax, 2),
        "final_after_tax": round(result["final"] - tax, 2),
        "note": ("Simplified: taxes only the net realized gain at a single flat rate, once, "
                 "at the end. Ignores loss carryforward, NISA/tax-advantaged accounts, "
                 "withholding timing, and unrealized gains on any still-open position. "
                 "NOT a tax projection."),
    }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python research/stocks/backtest.py adjusted_prices.csv")
    import json
    print(json.dumps(run(load(sys.argv[1])),ensure_ascii=False,indent=2))
