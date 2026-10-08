import csv
import os
import tempfile
import unittest
from datetime import date, timedelta
from backtest import load, run

class TestResearchBacktest(unittest.TestCase):
    def test_no_history(self):
        with self.assertRaises(ValueError):
            run({"8035":{date(2025,1,1):100}},lookback=2)
    def test_no_future_price_used_for_signal(self):
        # All momentum before first rebalance is flat; a future jump cannot
        # cause an earlier buy. Check no trades for short history.
        dates=[date(2025,1,1)+timedelta(days=i) for i in range(75)]
        series={d:100.0 for d in dates}
        series[dates[-1]]=1000.0
        out=run({"TEST":series},lookback=60)
        self.assertEqual(out["trades"],0)
    def test_duplicate_rejected(self):
        with tempfile.NamedTemporaryFile(mode="w",suffix=".csv",delete=False) as f:
            f.write("date,ticker,close\n2025-01-01,X,100\n2025-01-01,X,101\n")
            path=f.name
        try:
            with self.assertRaises(ValueError):
                load(path)
        finally:
            os.unlink(path)



class TestResearchProperties(unittest.TestCase):
    def test_future_shock_cannot_change_past_equity(self):
        dates = [date(2024,1,1)+timedelta(days=i) for i in range(430)]
        baseline = {d:100+i*0.2 for i,d in enumerate(dates)}
        changed = baseline.copy()
        changed[dates[-1]] = baseline[dates[-1]]*10
        a=run({'X':baseline},lookback=60)
        b=run({'X':changed},lookback=60)
        self.assertEqual(a['equity_curve'][:-1],b['equity_curve'][:-1])

    def test_flat_market_no_trades(self):
        dates=[date(2024,1,1)+timedelta(days=i) for i in range(430)]
        out=run({'X':{d:100 for d in dates}},lookback=60)
        self.assertEqual(out['trades'],0)
        self.assertEqual(out['final'],1_000_000)

    def test_uptrend_buys_and_costs_reduce_result(self):
        dates=[date(2024,1,1)+timedelta(days=i) for i in range(430)]
        series={d:100+i for i,d in enumerate(dates)}
        zero=run({'X':series},lookback=60,cost_bps=0)
        costly=run({'X':series},lookback=60,cost_bps=20)
        self.assertGreater(zero['trades'],0)
        self.assertLess(costly['final'],zero['final'])

    def test_one_name_keeps_most_capital_as_cash(self):
        dates=[date(2024,1,1)+timedelta(days=i) for i in range(430)]
        series={d:100+i for i,d in enumerate(dates)}
        result=run({'X':series},lookback=60,cost_bps=0)
        self.assertGreater(result['trades'],0)
        # A 20% initial allocation cannot outperform a 100% buy-and-hold
        # in this monotonically increasing synthetic series.
        self.assertLess(result['final'],1_000_000*series[dates[-1]]/series[dates[0]])

if __name__=="__main__":
    unittest.main()
