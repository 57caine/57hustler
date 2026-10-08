"""Research-only, long-only monthly momentum backtest. Standard library only.
CSV columns: date,ticker,close. Dates ISO YYYY-MM-DD, adjusted close required.
Orders use NEXT observed trading day's close (conservative proxy; not live fill).
No commissions/tax assumptions embedded: report gross and explicit cost-adjusted values.
"""
import csv
import sys
from collections import defaultdict
from datetime import date

def load(path):
    prices = defaultdict(dict)
    with open(path, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            d = date.fromisoformat(r["date"])
            p = float(r["close"])
            if p <= 0 or d in prices[r["ticker"]]:
                raise ValueError("invalid or duplicate price")
            prices[r["ticker"]][d] = p
    if not prices:
        raise ValueError("empty prices")
    return prices

def run(prices, capital=1_000_000, lookback=126, max_names=5, cost_bps=20):
    """Signals at month-end using only observations <= signal day.
    Rebalance at next common observation close; fractional shares are used
    solely for research and must not be interpreted as executable Japanese lots.
    """
    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    if len(common) < lookback + 3:
        raise ValueError("insufficient common history")
    cash = float(capital)
    shares = defaultdict(float)
    trades = 0
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
                    cash += shares[t] * prices[t][d] * (1-cost_bps/10000)
                    shares[t] = 0
                    trades += 1
            budget = cash / len(chosen) if chosen else 0
            for t in chosen:
                spend = budget / (1+cost_bps/10000)
                shares[t] = spend / prices[t][d]
                cash -= budget
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
            "equity_curve":curve}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python research/stocks/backtest.py adjusted_prices.csv")
    import json
    print(json.dumps(run(load(sys.argv[1])),ensure_ascii=False,indent=2))
