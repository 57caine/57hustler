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

def run(prices, capital=1_000_000, lookback=126, max_names=5, cost_bps=20, lot_size=None,
        execution_delay_sessions=0):
    """Signals at month-end using only observations <= signal day.
    Rebalance at next common observation close. With the default
    lot_size=None, fractional shares are used (unchanged from the original
    behavior) solely for research and must not be interpreted as executable
    Japanese lots. Pass lot_size (e.g. 100) for the realistic whole-lot mode:
    each buy is rounded down to a multiple of lot_size and the rounding
    remainder stays in cash, same as the existing 20%-cap logic already does.

    execution_delay_sessions (new, default 0 = EXACT original behavior: the
    rebalance executes immediately at the signal's own next-common-day,
    identical to every prior version of this function). Pass a positive
    integer to defer the actual trade to that many additional trading days
    later -- a deterministic stand-in for "the order did not fill in its
    expected session and instead filled a full session later, at the next
    close this data actually has," used as a Phase 4 sensitivity case for
    nonfill / one-session execution delay. If a later signal fires before a
    deferred trade has executed, the newer signal replaces the pending one
    (most recent decision wins); result["overlapping_signals_discarded"]
    counts how often this happened.
    """
    if not prices or not math.isfinite(capital) or capital <= 0:
        raise ValueError("positive finite capital and nonempty prices required")
    if not isinstance(lookback, int) or lookback < 1 or not isinstance(max_names, int) or max_names < 1:
        raise ValueError("positive integer lookback and max_names required")
    if not math.isfinite(cost_bps) or not 0 <= cost_bps < 10000:
        raise ValueError("cost_bps must be between 0 and 10000")
    if lot_size is not None and (not isinstance(lot_size, int) or lot_size < 1):
        raise ValueError("lot_size must be a positive integer or None")
    if not isinstance(execution_delay_sessions, int) or execution_delay_sessions < 0:
        raise ValueError("execution_delay_sessions must be a non-negative integer")
    common = sorted(set.intersection(*(set(x) for x in prices.values())))
    if len(common) < lookback + 3:
        raise ValueError("insufficient common history")
    cash = float(capital)
    shares = defaultdict(float)
    cost_basis = defaultdict(float)
    trades = 0
    notional_traded = 0.0
    realized_gain_total = 0.0
    overlapping_signals_discarded = 0
    curve = []
    rebalance_log = []
    pending_chosen = None
    pending_execute_at = None

    def execute_rebalance(chosen, trade_date):
        nonlocal cash, trades, notional_traded, realized_gain_total
        trades_before = trades
        # Sell old holdings, then equal-weight buy using available equity.
        for t in list(shares):
            if shares[t] > 0:
                gross = shares[t] * prices[t][trade_date]
                proceeds = gross * (1 - cost_bps / 10000)
                cash += proceeds
                realized_gain_total += proceeds - cost_basis[t]
                notional_traded += gross
                shares[t] = 0
                cost_basis[t] = 0.0
                trades += 1
        budget = min(cash / len(chosen), cash * 0.20) if chosen else 0
        for t in chosen:
            spend = budget / (1 + cost_bps / 10000)
            raw_qty = spend / prices[t][trade_date]
            if lot_size:
                qty = math.floor(raw_qty / lot_size) * lot_size
                if qty <= 0:
                    shares[t] = 0
                    cost_basis[t] = 0.0
                    continue
                cash -= qty * prices[t][trade_date] * (1 + cost_bps / 10000)
                shares[t] = qty
                cost_basis[t] = qty * prices[t][trade_date]
                notional_traded += qty * prices[t][trade_date]
            else:
                shares[t] = raw_qty
                cash -= budget
                cost_basis[t] = raw_qty * prices[t][trade_date]
                notional_traded += raw_qty * prices[t][trade_date]
            trades += 1
        return trades - trades_before

    for i, d in enumerate(common):
        if pending_execute_at is not None and i == pending_execute_at:
            n = execute_rebalance(pending_chosen, d)
            rebalance_log.append({"date": d.isoformat(), "trades": n})
            pending_chosen, pending_execute_at = None, None

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

            if execution_delay_sessions == 0:
                # Execute immediately, in this same iteration -- byte-for-byte
                # the original (pre-Phase-4) code path.
                n = execute_rebalance(chosen, d)
                rebalance_log.append({"date": d.isoformat(), "trades": n})
            else:
                if pending_execute_at is not None:
                    overlapping_signals_discarded += 1
                pending_chosen = chosen
                pending_execute_at = min(i + execution_delay_sessions, len(common) - 1)
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
            "execution_delay_sessions":execution_delay_sessions,
            "overlapping_signals_discarded":overlapping_signals_discarded,
            "notional_traded":round(notional_traded,2),
            "turnover_ratio":round(notional_traded/capital,2),
            "realized_gain_total":round(realized_gain_total,2),
            "final_positions":{t: q for t, q in shares.items() if q},
            "rebalance_log":rebalance_log,
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
