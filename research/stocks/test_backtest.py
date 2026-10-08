import csv
import os
import tempfile
import unittest
from datetime import date, timedelta
from backtest import load, run, after_tax_summary

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

    def test_nonfinite_csv_price_rejected(self):
        for bad in ["nan", "inf", "-inf"]:
            with self.subTest(price=bad):
                with tempfile.NamedTemporaryFile(mode="w",suffix=".csv",delete=False) as f:
                    f.write(f"date,ticker,close\\n2025-01-01,X,{bad}\\n")
                    path=f.name
                try:
                    with self.assertRaises(ValueError):
                        load(path)
                finally:
                    os.unlink(path)

    def test_invalid_parameters_rejected(self):
        dates=[date(2024,1,1)+timedelta(days=i) for i in range(100)]
        series={"X":{d:100 for d in dates}}
        for params in [{"capital":0},{"capital":float("nan")},{"lookback":0},
                       {"max_names":0},{"cost_bps":-1},{"cost_bps":10000}]:
            with self.subTest(params=params):
                with self.assertRaises(ValueError):
                    run(series,**params)

class TestRealisticLotsFeesAndTax(unittest.TestCase):
    """Phase 2 robustness audit additions: whole-lot rounding, notional/
    turnover tracking, realized-gain tracking, and a separately-reported
    tax scenario. All synthetic data, no network access."""

    def _uptrend(self, days=430):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
        return {d: 100 + i for i, d in enumerate(dates)}

    def test_default_lot_size_preserves_original_values(self):
        series = self._uptrend()
        result = run({'X': series}, lookback=60, cost_bps=20)
        self.assertIsNone(result["lot_size"])
        # Golden value from an actual run of this exact series/params, confirming
        # the default (lot_size=None) path is numerically unchanged from before.
        self.assertEqual(result["final"], 1_224_060.21)

    def test_lot_size_rounds_every_position_to_a_multiple(self):
        series = self._uptrend()
        result = run({'X': series}, lookback=60, max_names=1, cost_bps=0, lot_size=100)
        self.assertTrue(result["final_positions"], "expected at least one open position")
        for qty in result["final_positions"].values():
            self.assertEqual(qty % 100, 0)

    def test_invalid_lot_size_rejected(self):
        series = {"X": self._uptrend(100)}
        for bad in [0, -5, 2.5, "100"]:
            with self.subTest(lot_size=bad):
                with self.assertRaises(ValueError):
                    run(series, lookback=10, lot_size=bad)

    def test_notional_traded_and_turnover_ratio_consistent(self):
        series = self._uptrend()
        result = run({'X': series}, lookback=60, cost_bps=0)
        self.assertGreater(result["notional_traded"], 0)
        # Both fields are independently rounded to 2 decimals, so compare loosely.
        self.assertAlmostEqual(result["turnover_ratio"], result["notional_traded"] / result["initial"], places=2)

    def test_no_trades_means_zero_notional_and_realized_gain(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(430)]
        result = run({'X': {d: 100 for d in dates}}, lookback=60)
        self.assertEqual(result["trades"], 0)
        self.assertEqual(result["notional_traded"], 0.0)
        self.assertEqual(result["realized_gain_total"], 0.0)
        self.assertEqual(result["final_positions"], {})

    def test_realized_gain_positive_in_steady_uptrend(self):
        series = self._uptrend()
        result = run({'X': series}, lookback=60, cost_bps=0)
        self.assertGreater(result["realized_gain_total"], 0)

    def test_after_tax_summary_reduces_final_by_estimated_tax(self):
        series = self._uptrend()
        result = run({'X': series}, lookback=60, cost_bps=0)
        tax = after_tax_summary(result, tax_rate=0.20315)
        self.assertEqual(tax["final_after_tax"], round(result["final"] - tax["estimated_tax"], 2))
        self.assertAlmostEqual(tax["estimated_tax"], result["realized_gain_total"] * 0.20315, places=2)

    def test_after_tax_summary_never_mutates_original_result(self):
        series = self._uptrend()
        result = run({'X': series}, lookback=60, cost_bps=0)
        before = dict(result)
        after_tax_summary(result)
        self.assertEqual(result, before)

    def test_after_tax_summary_rejects_invalid_rate(self):
        series = self._uptrend()
        result = run({'X': series}, lookback=60, cost_bps=0)
        for bad in [-0.1, 1.0, float("nan")]:
            with self.subTest(tax_rate=bad):
                with self.assertRaises(ValueError):
                    after_tax_summary(result, tax_rate=bad)


if __name__=="__main__":
    unittest.main()
