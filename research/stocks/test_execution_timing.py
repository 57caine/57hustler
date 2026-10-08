import unittest
from datetime import date, timedelta

from execution_timing import (
    validate_trading_gap,
    validate_trading_calendar,
    assert_same_day_close_fill_assumption_holds,
    MAX_PLAUSIBLE_GAP_DAYS,
)


def weekdays_only(start, n):
    out = []
    d = start
    while len(out) < n:
        if d.weekday() < 5:
            out.append(d)
        d += timedelta(days=1)
    return out


class ValidateTradingGapTests(unittest.TestCase):
    def test_ordinary_weekend_gap_is_fine(self):
        self.assertEqual(validate_trading_gap(date(2024, 1, 5), date(2024, 1, 8)), 3)  # Fri -> Mon

    def test_single_day_gap_is_fine(self):
        self.assertEqual(validate_trading_gap(date(2024, 1, 2), date(2024, 1, 3)), 1)

    def test_long_holiday_gap_within_threshold_is_fine(self):
        self.assertEqual(
            validate_trading_gap(date(2024, 12, 29), date(2025, 1, 6), max_gap_days=10), 8)

    def test_zero_or_negative_gap_rejected(self):
        with self.assertRaises(ValueError):
            validate_trading_gap(date(2024, 1, 5), date(2024, 1, 5))
        with self.assertRaises(ValueError):
            validate_trading_gap(date(2024, 1, 5), date(2024, 1, 4))

    def test_anomalously_large_gap_rejected(self):
        with self.assertRaises(ValueError):
            validate_trading_gap(date(2024, 1, 1), date(2024, 3, 1))

    def test_rejects_non_date_inputs(self):
        with self.assertRaises(ValueError):
            validate_trading_gap("2024-01-01", date(2024, 1, 2))


class ValidateTradingCalendarTests(unittest.TestCase):
    def test_ordinary_weekday_calendar_passes(self):
        dates = weekdays_only(date(2024, 1, 1), 60)
        gaps = validate_trading_calendar(dates)
        self.assertEqual(len(gaps), 59)

    def test_realistic_calendar_with_one_long_holiday_still_passes(self):
        # A normal run of weekdays, then a Golden-Week-sized gap, then more weekdays.
        part1 = weekdays_only(date(2024, 4, 1), 20)
        part2 = weekdays_only(part1[-1] + timedelta(days=9), 20)
        dates = part1 + part2
        gaps = validate_trading_calendar(dates, max_gap_days=MAX_PLAUSIBLE_GAP_DAYS)
        self.assertEqual(len(gaps), len(dates) - 1)

    def test_data_gap_longer_than_any_real_holiday_is_rejected(self):
        part1 = weekdays_only(date(2024, 1, 1), 20)
        part2 = weekdays_only(part1[-1] + timedelta(days=45), 20)  # implausible gap
        dates = part1 + part2
        with self.assertRaises(ValueError):
            validate_trading_calendar(dates)

    def test_empty_calendar_rejected(self):
        with self.assertRaises(ValueError):
            validate_trading_calendar([])

    def test_unsorted_calendar_rejected(self):
        dates = weekdays_only(date(2024, 1, 1), 10)
        with self.assertRaises(ValueError):
            validate_trading_calendar(list(reversed(dates)))


class AssertSameDayCloseFillAssumptionTests(unittest.TestCase):
    def test_raises_when_not_acknowledged(self):
        with self.assertRaises(ValueError):
            assert_same_day_close_fill_assumption_holds(False)

    def test_raises_on_falsy_default(self):
        with self.assertRaises(TypeError):
            assert_same_day_close_fill_assumption_holds()

    def test_passes_when_explicitly_acknowledged(self):
        assert_same_day_close_fill_assumption_holds(True)  # must not raise


if __name__ == "__main__":
    unittest.main()
