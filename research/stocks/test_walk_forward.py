import unittest
from datetime import date, timedelta

from walk_forward import walk_forward_report
import backtest
import time_split


def uptrend(days=430):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    return {d: 100 + i for i, d in enumerate(dates)}


class WalkForwardReportTests(unittest.TestCase):
    def test_two_windows_cover_the_full_period(self):
        prices = {"X": uptrend()}
        report = walk_forward_report(prices, lookback=60, n_splits=2)
        self.assertEqual(len(report["windows"]), 2)
        common = sorted(prices["X"])
        self.assertEqual(report["windows"][0]["period"]["start"], common[0].isoformat())
        self.assertEqual(report["windows"][-1]["period"]["end"], common[-1].isoformat())

    def test_no_bulk_fields_in_full_period_result(self):
        prices = {"X": uptrend()}
        report = walk_forward_report(prices, lookback=60, n_splits=2)
        self.assertNotIn("equity_curve", report["full_period_result"])
        self.assertNotIn("final_positions", report["full_period_result"])
        self.assertNotIn("rebalance_log", report["full_period_result"])

    def test_windows_use_real_history_not_independent_warmup(self):
        # The whole point of the fix: the SECOND window should have many
        # more usable observations than an independently-resliced run would
        # (which would burn ~lookback days purely on warm-up).
        prices = {"X": uptrend()}
        report = walk_forward_report(prices, lookback=60, n_splits=2)
        second_window_obs = report["windows"][1]["period"]["observations"]

        # What time_split.py's independent re-slicing would face instead:
        common = sorted(prices["X"])
        periods = time_split.split_periods(common, n_splits=2)
        second_period_len = sum(1 for d in common if periods[1][0] <= d <= periods[1][1])
        self.assertEqual(second_window_obs, second_period_len)  # same date range...
        # ...but unlike an independent re-run, the full-run result actually
        # has trades happening from very early in that window, since lookback
        # was already satisfied using real prior history.
        self.assertGreater(report["windows"][1]["trades_in_window"], 0)

    def test_no_parameter_tuning_per_window_same_cost_bps_everywhere(self):
        prices = {"X": uptrend()}
        report = walk_forward_report(prices, lookback=60, cost_bps=37, n_splits=2)
        self.assertEqual(report["full_period_result"]["cost_bps"], 37)

    def test_window_return_pct_matches_its_own_slice(self):
        prices = {"X": uptrend()}
        report = walk_forward_report(prices, lookback=60, n_splits=2)
        w = report["windows"][0]
        expected = round((w["end_value"] / w["start_value"] - 1) * 100, 2)
        self.assertEqual(w["return_pct"], expected)

    def test_warmup_note_present_and_nonempty(self):
        prices = {"X": uptrend()}
        report = walk_forward_report(prices, lookback=60, n_splits=2)
        self.assertIsInstance(report["warmup_note"], str)
        self.assertGreater(len(report["warmup_note"]), 0)

    def test_flat_market_zero_trades_in_every_window(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(430)]
        prices = {"X": {d: 100 for d in dates}}
        report = walk_forward_report(prices, lookback=60, n_splits=2)
        for w in report["windows"]:
            self.assertEqual(w["trades_in_window"], 0)

    def test_propagates_backtest_validation_errors(self):
        prices = {"X": uptrend(50)}  # too short for lookback=60
        with self.assertRaises(ValueError):
            walk_forward_report(prices, lookback=60, n_splits=2)


if __name__ == "__main__":
    unittest.main()
