"""Validate research CSV before any backtest. No network or trading access."""
import csv
import json
import sys
from collections import defaultdict
from datetime import date

def audit(path, min_rows=126):
    by_ticker=defaultdict(list)
    with open(path,encoding="utf-8",newline="") as f:
        reader=csv.DictReader(f)
        if not {"date","ticker","close"}.issubset(reader.fieldnames or []):
            raise ValueError("required columns: date,ticker,close")
        for line,row in enumerate(reader,start=2):
            ticker=(row["ticker"] or "").strip()
            if not ticker:
                raise ValueError(f"empty ticker at line {line}")
            d=date.fromisoformat(row["date"])
            p=float(row["close"])
            if not (0 < p < float("inf")):
                raise ValueError(f"nonfinite or nonpositive price at line {line}")
            by_ticker[ticker].append((d,p))
    if not by_ticker:
        raise ValueError("empty input")
    report={"source":path,"status":"quality_check_only","tickers":{},"warnings":[]}
    for ticker,rows in sorted(by_ticker.items()):
        days=[d for d,_ in rows]
        if len(set(days))!=len(days):
            raise ValueError(f"duplicate dates: {ticker}")
        ordered=days==sorted(days)
        if not ordered:
            report["warnings"].append(f"{ticker}: unsorted rows")
        if len(rows)<min_rows:
            report["warnings"].append(f"{ticker}: insufficient history for 126-day lookback")
        if any(d.weekday()>=5 for d in days):
            report["warnings"].append(f"{ticker}: weekend dates (check exchange calendar)")
        report["tickers"][ticker]={"rows":len(rows),"start":min(days).isoformat(),"end":max(days).isoformat(),"sorted":ordered}
    date_sets=[set(d for d,_ in rows) for rows in by_ticker.values()]
    report["common_dates"]=len(set.intersection(*date_sets))
    if report["common_dates"]<min_rows+3:
        report["warnings"].append("insufficient common observations for current backtester")
    report["warnings"].append("NOT VERIFIED: source license, split adjustment, dividends, survivorship, release times, tradable lots")
    return report

if __name__=="__main__":
    if len(sys.argv)!=2:
        sys.exit("usage: python audit_data.py adjusted_prices.csv")
    print(json.dumps(audit(sys.argv[1]),ensure_ascii=False,indent=2))
