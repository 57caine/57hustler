import unittest
from datetime import date

from universe import (
    validate_metadata_schema,
    build_point_in_time_universe,
    point_in_time_universe_series,
    bias_status,
)


def listed(ticker, d):
    return {"ticker": ticker, "event_type": "listed", "effective_date": d}


def delisted(ticker, d):
    return {"ticker": ticker, "event_type": "delisted", "effective_date": d}


class ValidateMetadataSchemaTests(unittest.TestCase):
    def test_accepts_valid_events(self):
        events = [listed("AAA", date(2024, 1, 1))]
        self.assertEqual(validate_metadata_schema(events), events)

    def test_rejects_empty_list(self):
        with self.assertRaises(ValueError):
            validate_metadata_schema([])

    def test_rejects_non_list(self):
        with self.assertRaises(ValueError):
            validate_metadata_schema("not a list")

    def test_rejects_missing_field(self):
        with self.assertRaises(ValueError):
            validate_metadata_schema([{"ticker": "AAA", "event_type": "listed"}])

    def test_rejects_unknown_event_type(self):
        with self.assertRaises(ValueError):
            validate_metadata_schema([{"ticker": "AAA", "event_type": "bogus",
                                       "effective_date": date(2024, 1, 1)}])

    def test_rejects_non_date_effective_date(self):
        with self.assertRaises(ValueError):
            validate_metadata_schema([{"ticker": "AAA", "event_type": "listed",
                                       "effective_date": "2024-01-01"}])

    def test_rejects_empty_ticker(self):
        with self.assertRaises(ValueError):
            validate_metadata_schema([{"ticker": "", "event_type": "listed",
                                       "effective_date": date(2024, 1, 1)}])


class BuildPointInTimeUniverseTests(unittest.TestCase):
    def test_listed_ticker_is_included(self):
        events = [listed("AAA", date(2024, 1, 1))]
        universe = build_point_in_time_universe(events, date(2024, 6, 1))
        self.assertEqual(universe, ["AAA"])

    def test_delisted_before_as_of_date_is_excluded(self):
        events = [listed("AAA", date(2024, 1, 1)), delisted("AAA", date(2024, 3, 1))]
        universe = build_point_in_time_universe(events, date(2024, 6, 1))
        self.assertEqual(universe, [])

    def test_delisting_not_yet_knowable_does_not_leak_into_earlier_universe(self):
        # The whole point of point-in-time construction: a delisting dated
        # AFTER as_of_date must not affect a universe built AS OF an
        # earlier date. This is the no-lookahead guarantee for universe
        # construction (the Phase 4 backtest.run() guarantee is separate
        # and covered by test_backtest.py).
        events = [listed("AAA", date(2024, 1, 1)), delisted("AAA", date(2024, 6, 1))]
        universe_before = build_point_in_time_universe(events, date(2024, 3, 1))
        universe_after = build_point_in_time_universe(events, date(2024, 9, 1))
        self.assertEqual(universe_before, ["AAA"])
        self.assertEqual(universe_after, [])

    def test_price_unavailable_excludes_ticker(self):
        events = [
            listed("AAA", date(2024, 1, 1)),
            {"ticker": "AAA", "event_type": "price_unavailable", "effective_date": date(2024, 2, 1)},
        ]
        universe = build_point_in_time_universe(events, date(2024, 6, 1))
        self.assertEqual(universe, [])

    def test_sector_filter_matches_most_recent_sector_as_of_date(self):
        events = [
            listed("AAA", date(2024, 1, 1)),
            {"ticker": "AAA", "event_type": "sector_set", "effective_date": date(2024, 1, 1),
             "sector": "tech"},
            {"ticker": "AAA", "event_type": "sector_set", "effective_date": date(2024, 6, 1),
             "sector": "finance"},
        ]
        self.assertEqual(build_point_in_time_universe(events, date(2024, 3, 1), sector="tech"), ["AAA"])
        self.assertEqual(build_point_in_time_universe(events, date(2024, 3, 1), sector="finance"), [])
        self.assertEqual(build_point_in_time_universe(events, date(2024, 9, 1), sector="finance"), ["AAA"])

    def test_multiple_tickers_filtered_independently(self):
        events = [
            listed("AAA", date(2024, 1, 1)),
            listed("BBB", date(2024, 1, 1)),
            delisted("BBB", date(2024, 2, 1)),
        ]
        self.assertEqual(build_point_in_time_universe(events, date(2024, 6, 1)), ["AAA"])

    def test_rejects_non_date_as_of_date(self):
        with self.assertRaises(ValueError):
            build_point_in_time_universe([listed("AAA", date(2024, 1, 1))], "2024-06-01")

    def test_propagates_schema_validation_errors(self):
        with self.assertRaises(ValueError):
            build_point_in_time_universe([], date(2024, 1, 1))


class BiasStatusTests(unittest.TestCase):
    def test_without_metadata_bias_is_unresolved(self):
        status = bias_status(False)
        self.assertTrue(status["bias_unresolved"])
        self.assertGreater(len(status["data_required"]), 0)

    def test_with_metadata_bias_is_resolved(self):
        status = bias_status(True)
        self.assertFalse(status["bias_unresolved"])
        self.assertEqual(status["data_required"], [])


class PointInTimeUniverseSeriesTests(unittest.TestCase):
    def test_one_entry_per_date_in_order(self):
        events = [listed("AAA", date(2024, 1, 1)), listed("BBB", date(2024, 1, 1))]
        dates = [date(2024, 2, 1), date(2024, 3, 1), date(2024, 4, 1)]
        series = point_in_time_universe_series(events, dates)
        self.assertEqual([e["as_of"] for e in series], [d.isoformat() for d in dates])
        for e in series:
            self.assertEqual(e["universe"], ["AAA", "BBB"])

    def test_first_entry_has_no_added_or_removed(self):
        events = [listed("AAA", date(2024, 1, 1))]
        series = point_in_time_universe_series(events, [date(2024, 2, 1)])
        self.assertEqual(series[0]["added"], [])
        self.assertEqual(series[0]["removed"], [])

    def test_delisting_between_rebalance_dates_shows_up_as_removed(self):
        events = [
            listed("AAA", date(2024, 1, 1)),
            listed("BBB", date(2024, 1, 1)),
            delisted("BBB", date(2024, 2, 15)),
        ]
        dates = [date(2024, 2, 1), date(2024, 3, 1)]
        series = point_in_time_universe_series(events, dates)
        self.assertEqual(series[0]["universe"], ["AAA", "BBB"])
        self.assertEqual(series[1]["universe"], ["AAA"])
        self.assertEqual(series[1]["removed"], ["BBB"])
        self.assertEqual(series[1]["added"], [])

    def test_newly_listed_ticker_shows_up_as_added(self):
        events = [listed("AAA", date(2024, 1, 1)), listed("BBB", date(2024, 2, 20))]
        dates = [date(2024, 2, 1), date(2024, 3, 1)]
        series = point_in_time_universe_series(events, dates)
        self.assertEqual(series[0]["universe"], ["AAA"])
        self.assertEqual(series[1]["universe"], ["AAA", "BBB"])
        self.assertEqual(series[1]["added"], ["BBB"])

    def test_later_date_universe_never_affects_earlier_date_universe(self):
        # The no-lookahead guarantee, applied across the whole series: an
        # event dated after the FIRST rebalance date must not change what
        # that first date's own universe looks like, no matter what later
        # dates are also requested in the same call.
        events = [listed("AAA", date(2024, 1, 1)), delisted("AAA", date(2024, 6, 1))]
        dates = [date(2024, 2, 1), date(2024, 3, 1), date(2024, 4, 1)]
        series_with_future_delisting = point_in_time_universe_series(events, dates)
        series_without_delisting = point_in_time_universe_series(events[:1], dates)
        self.assertEqual(series_with_future_delisting, series_without_delisting)

    def test_sector_filter_applies_to_every_date(self):
        events = [
            listed("AAA", date(2024, 1, 1)),
            {"ticker": "AAA", "event_type": "sector_set", "effective_date": date(2024, 1, 1), "sector": "tech"},
            listed("BBB", date(2024, 1, 1)),
            {"ticker": "BBB", "event_type": "sector_set", "effective_date": date(2024, 1, 1), "sector": "water"},
        ]
        dates = [date(2024, 2, 1), date(2024, 3, 1)]
        series = point_in_time_universe_series(events, dates, sector="water")
        self.assertTrue(all(e["universe"] == ["BBB"] for e in series))

    def test_rejects_empty_dates(self):
        with self.assertRaises(ValueError):
            point_in_time_universe_series([listed("AAA", date(2024, 1, 1))], [])

    def test_rejects_unsorted_dates(self):
        events = [listed("AAA", date(2024, 1, 1))]
        dates = [date(2024, 3, 1), date(2024, 2, 1)]
        with self.assertRaises(ValueError):
            point_in_time_universe_series(events, dates)

    def test_propagates_schema_validation_errors(self):
        with self.assertRaises(ValueError):
            point_in_time_universe_series([], [date(2024, 1, 1)])


if __name__ == "__main__":
    unittest.main()
