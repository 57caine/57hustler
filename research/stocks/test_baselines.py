import os
import tempfile
import unittest
from datetime import date, timedelta

from baselines import cash_baseline, buy_and_hold_equal_weight, topix_baseline_from_csv


class CashBaselineTests(unittest.TestCase):
    def test_cash_never_changes(self):
        result = cash_baseline(1_000_000, date(2024, 1, 1), date(2025, 1, 1))
        self.assertEqual(result["final"], 1_000_000)
        self.assertEqual(result["return_pct"], 0.0)
        self.assertEqual(result["max_drawdown_pct"], 0.0)

    def test_rejects_invalid_capital(self):
        for bad in [0, -1, float("nan"), float("inf")]:
            with self.subTest(capital=bad):
                with self.assertRaises(ValueError):
                    cash_baseline(bad, date(2024, 1, 1), date(2024, 1, 2))


class BuyAndHoldEqualWeightTests(unittest.TestCase):
    def _two_ticker_prices(self, days=100):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
        return {
            "A": {d: 100 + i for i, d in enumerate(dates)},
            "B": {d: 200 + i * 2 for i, d in enumerate(dates)},
        }

    def test_equal_weight_split_across_tickers(self):
        prices = self._two_ticker_prices()
        result = buy_and_hold_equal_weight(prices, capital=1_000_000, cost_bps=0)
        self.assertEqual(result["tickers"], ["A", "B"])
        self.assertGreater(result["final"], 0)
        self.assertIn("equity_curve", result)

    def test_zero_cost_uptrend_beats_initial_capital(self):
        prices = self._two_ticker_prices()
        result = buy_and_hold_equal_weight(prices, capital=1_000_000, cost_bps=0)
        self.assertGreater(result["final"], 1_000_000)

    def test_cost_reduces_result_versus_zero_cost(self):
        prices = self._two_ticker_prices()
        free = buy_and_hold_equal_weight(prices, capital=1_000_000, cost_bps=0)
        costly = buy_and_hold_equal_weight(prices, capital=1_000_000, cost_bps=50)
        self.assertLess(costly["final"], free["final"])

    def test_lot_size_rounds_holdings(self):
        prices = self._two_ticker_prices()
        result = buy_and_hold_equal_weight(prices, capital=1_000_000, cost_bps=0, lot_size=100)
        self.assertEqual(result["lot_size"], 100)

    def test_rejects_empty_prices(self):
        with self.assertRaises(ValueError):
            buy_and_hold_equal_weight({}, capital=1_000_000)

    def test_rejects_invalid_lot_size(self):
        prices = self._two_ticker_prices()
        with self.assertRaises(ValueError):
            buy_and_hold_equal_weight(prices, lot_size=-1)


class TopixFromCsvTests(unittest.TestCase):
    """TOPIX is only ever computed from a user-supplied local CSV -- these
    tests use a synthetic, clearly-fake series, never real market data."""

    def _write_csv(self, rows):
        f = tempfile.NamedTemporaryFile(mode="w", suffix=".csv", delete=False)
        with f:
            f.write("date,close\n" + rows)
        self.addCleanup(lambda: os.unlink(f.name))
        return f.name

    def test_computes_return_from_supplied_csv(self):
        path = self._write_csv("2024-01-01,1000\n2024-06-01,1100\n2024-12-31,1200\n")
        result = topix_baseline_from_csv(path, capital=1_000_000)
        self.assertEqual(result["name"], "topix_buy_and_hold")
        self.assertAlmostEqual(result["return_pct"], 20.0, places=2)
        self.assertIn(path, result["source"])

    def test_window_restricts_to_start_end(self):
        path = self._write_csv("2024-01-01,1000\n2024-06-01,500\n2024-12-31,1200\n")
        result = topix_baseline_from_csv(path, capital=1_000_000, start=date(2024, 6, 1), end=date(2024, 12, 31))
        self.assertAlmostEqual(result["return_pct"], 140.0, places=2)

    def test_rejects_nonpositive_price(self):
        path = self._write_csv("2024-01-01,1000\n2024-06-01,-5\n")
        with self.assertRaises(ValueError):
            topix_baseline_from_csv(path)

    def test_rejects_insufficient_history(self):
        path = self._write_csv("2024-01-01,1000\n")
        with self.assertRaises(ValueError):
            topix_baseline_from_csv(path)


if __name__ == "__main__":
    unittest.main()
