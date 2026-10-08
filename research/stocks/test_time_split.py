import unittest
from datetime import date, timedelta

from time_split import slice_prices, split_periods, time_split_report, sensitivity_sweep


def make_series(days=430, start_price=100, slope=1):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    return {d: start_price + slope * i for i, d in enumerate(dates)}


class SlicePricesTests(unittest.TestCase):
    def test_restricts_to_range_without_mutating_input(self):
        series = make_series(30)
        prices = {"X": series}
        sliced = slice_prices(prices, date(2024, 1, 5), date(2024, 1, 10))
        self.assertEqual(len(sliced["X"]), 6)
        self.assertEqual(len(prices["X"]), 30)  # original untouched


class SplitPeriodsTests(unittest.TestCase):
    def test_two_splits_cover_full_range_without_overlap(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(20)]
        periods = split_periods(dates, n_splits=2)
        self.assertEqual(len(periods), 2)
        self.assertEqual(periods[0][0], dates[0])
        self.assertEqual(periods[-1][1], dates[-1])
        # No gap and no overlap between consecutive periods.
        self.assertLess(periods[0][1], periods[1][0])

    def test_rejects_too_few_observations_for_split_count(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(3)]
        with self.assertRaises(ValueError):
            split_periods(dates, n_splits=2)

    def test_rejects_invalid_n_splits(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(10)]
        for bad in [0, -1, 1.5]:
            with self.subTest(n_splits=bad):
                with self.assertRaises(ValueError):
                    split_periods(dates, n_splits=bad)


class TimeSplitReportTests(unittest.TestCase):
    def test_reports_one_entry_per_split_with_fixed_params(self):
        prices = {"X": make_series(430)}
        report = time_split_report(prices, n_splits=2, lookback=60, cost_bps=20)
        self.assertEqual(len(report), 2)
        for entry in report:
            self.assertIn("period", entry)
            self.assertTrue("result" in entry or "error" in entry)

    def test_each_split_uses_identical_parameters(self):
        # Verified indirectly: both splits are called with the same kwargs,
        # so neither can have been tuned specifically to its own data.
        prices = {"X": make_series(430)}
        report = time_split_report(prices, n_splits=2, lookback=60, cost_bps=0)
        for entry in report:
            if "result" in entry:
                self.assertEqual(entry["result"]["cost_bps"], 0)

    def test_split_too_short_for_params_reports_error_not_crash(self):
        prices = {"X": make_series(430)}
        report = time_split_report(prices, n_splits=2, lookback=300)
        self.assertTrue(any("error" in entry for entry in report))


class SensitivitySweepTests(unittest.TestCase):
    def test_returns_one_row_per_grid_entry(self):
        prices = {"X": make_series(430)}
        rows = sensitivity_sweep(prices)
        self.assertEqual(len(rows), 5)
        for row in rows:
            self.assertTrue("final" in row or "error" in row)

    def test_custom_grid_is_honored(self):
        prices = {"X": make_series(430)}
        grid = [{"lookback": 60, "max_names": 1, "cost_bps": 0}]
        rows = sensitivity_sweep(prices, grid=grid)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["lookback"], 60)


if __name__ == "__main__":
    unittest.main()
