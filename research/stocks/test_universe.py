import unittest
from datetime import date

from universe import validate_metadata_schema, build_point_in_time_universe, bias_status


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


if __name__ == "__main__":
    unittest.main()
