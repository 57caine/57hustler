import unittest
from datetime import date

from data_availability import (
    AVAILABLE_VIA_JQUANTS_FREE,
    NOT_AVAILABLE_VIA_JQUANTS_FREE,
    assert_no_delisted_ticker_fabrication,
)


class ReferenceTablesTests(unittest.TestCase):
    def test_available_and_not_available_do_not_overlap(self):
        self.assertEqual(set(AVAILABLE_VIA_JQUANTS_FREE) & set(NOT_AVAILABLE_VIA_JQUANTS_FREE), set())

    def test_both_tables_nonempty_with_nonempty_descriptions(self):
        for table in (AVAILABLE_VIA_JQUANTS_FREE, NOT_AVAILABLE_VIA_JQUANTS_FREE):
            self.assertGreater(len(table), 0)
            for key, description in table.items():
                self.assertIsInstance(description, str)
                self.assertGreater(len(description), 0, msg=f"{key} has an empty description")

    def test_historical_delisted_company_list_is_flagged_unavailable(self):
        # This is the specific gap that makes universe.py's real-data path
        # unsafe without point-in-time metadata -- must stay documented.
        self.assertIn("historical_delisted_company_list", NOT_AVAILABLE_VIA_JQUANTS_FREE)

    def test_topix_is_flagged_unavailable(self):
        self.assertIn("topix_daily_ohlc", NOT_AVAILABLE_VIA_JQUANTS_FREE)


class AssertNoDelistedTickerFabricationTests(unittest.TestCase):
    def test_raises_on_empty_events(self):
        with self.assertRaises(ValueError):
            assert_no_delisted_ticker_fabrication([])

    def test_raises_on_none(self):
        with self.assertRaises(ValueError):
            assert_no_delisted_ticker_fabrication(None)

    def test_passes_when_events_supplied(self):
        events = [{"ticker": "AAA", "event_type": "listed", "effective_date": date(2024, 1, 1)}]
        self.assertTrue(assert_no_delisted_ticker_fabrication(events))

    def test_error_message_points_to_bias_status_workflow(self):
        try:
            assert_no_delisted_ticker_fabrication([])
            self.fail("expected ValueError")
        except ValueError as e:
            self.assertIn("bias_unresolved", str(e))


if __name__ == "__main__":
    unittest.main()
