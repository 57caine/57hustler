import unittest
from datetime import date, timedelta

from metrics import monthly_returns, worst_month, drawdown_durations


def curve_from(values_by_date):
    return [(d.isoformat(), v) for d, v in sorted(values_by_date.items())]


class MonthlyReturnsTests(unittest.TestCase):
    def test_two_months_one_return(self):
        curve = curve_from({
            date(2024, 1, 31): 1_000_000,
            date(2024, 2, 29): 1_100_000,
        })
        rows = monthly_returns(curve)
        self.assertEqual(rows, [{"month": "2024-02", "return_pct": 10.0}])

    def test_empty_curve_returns_empty(self):
        self.assertEqual(monthly_returns([]), [])

    def test_uses_last_observation_of_each_month(self):
        curve = curve_from({
            date(2024, 1, 15): 999,
            date(2024, 1, 31): 1_000_000,
            date(2024, 2, 10): 500,
            date(2024, 2, 28): 1_050_000,
        })
        rows = monthly_returns(curve)
        self.assertEqual(rows, [{"month": "2024-02", "return_pct": 5.0}])


class WorstMonthTests(unittest.TestCase):
    def test_picks_most_negative_month(self):
        curve = curve_from({
            date(2024, 1, 31): 1_000_000,
            date(2024, 2, 29): 1_100_000,
            date(2024, 3, 31): 900_000,
        })
        w = worst_month(curve)
        self.assertEqual(w["month"], "2024-03")
        self.assertLess(w["return_pct"], 0)

    def test_empty_curve_returns_none(self):
        self.assertIsNone(worst_month([]))


class DrawdownDurationsTests(unittest.TestCase):
    def test_single_recovered_drawdown(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(6)]
        values = [100, 90, 80, 85, 95, 110]  # peak@0, trough@2, recovers>peak@5
        curve = list(zip([d.isoformat() for d in dates], values))
        episodes = drawdown_durations(curve)
        self.assertEqual(len(episodes), 1)
        ep = episodes[0]
        self.assertEqual(ep["peak_date"], dates[0].isoformat())
        self.assertEqual(ep["trough_date"], dates[2].isoformat())
        self.assertEqual(ep["recovery_date"], dates[5].isoformat())
        self.assertEqual(ep["depth_pct"], -20.0)
        self.assertEqual(ep["duration_days"], 5)

    def test_unrecovered_drawdown_has_none_duration(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(4)]
        values = [100, 90, 80, 85]  # still underwater at the end
        curve = list(zip([d.isoformat() for d in dates], values))
        episodes = drawdown_durations(curve)
        self.assertEqual(len(episodes), 1)
        self.assertIsNone(episodes[0]["recovery_date"])
        self.assertIsNone(episodes[0]["duration_days"])

    def test_no_drawdown_means_no_episodes(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(4)]
        values = [100, 101, 102, 103]
        curve = list(zip([d.isoformat() for d in dates], values))
        self.assertEqual(drawdown_durations(curve), [])

    def test_empty_curve_returns_empty_list(self):
        self.assertEqual(drawdown_durations([]), [])


if __name__ == "__main__":
    unittest.main()
