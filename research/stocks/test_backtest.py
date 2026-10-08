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

if __name__=="__main__":
    unittest.main()
