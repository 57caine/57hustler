import os
import tempfile
import unittest
from datetime import date

from oos_ledger import (
    load_ledger,
    save_ledger,
    find_overlapping_entries,
    assert_window_not_already_evaluated,
    record_window,
    record_evaluation,
    suggest_next_window_start,
)


class LoadSaveLedgerTests(unittest.TestCase):
    def test_missing_file_returns_empty_ledger(self):
        ledger = load_ledger(path="/nonexistent/path/does-not-exist.json")
        self.assertEqual(ledger, {"entries": []})

    def test_round_trips_through_save_and_load(self):
        ledger = record_window({"entries": []}, date(2025, 1, 1), date(2025, 3, 31), "abc123", "reserved")
        with tempfile.TemporaryDirectory() as tmpdir:
            path = os.path.join(tmpdir, "ledger.json")
            save_ledger(ledger, path=path)
            reloaded = load_ledger(path=path)
        self.assertEqual(reloaded, ledger)


class RecordWindowTests(unittest.TestCase):
    def test_appends_without_mutating_input(self):
        original = {"entries": []}
        updated = record_window(original, date(2025, 1, 1), date(2025, 3, 31), "abc123", "reserved")
        self.assertEqual(original, {"entries": []})
        self.assertEqual(len(updated["entries"]), 1)
        self.assertEqual(updated["entries"][0]["start"], "2025-01-01")
        self.assertEqual(updated["entries"][0]["status"], "reserved")

    def test_rejects_invalid_status(self):
        with self.assertRaises(ValueError):
            record_window({"entries": []}, date(2025, 1, 1), date(2025, 3, 31), "abc123", "bogus")

    def test_rejects_start_after_end(self):
        with self.assertRaises(ValueError):
            record_window({"entries": []}, date(2025, 3, 31), date(2025, 1, 1), "abc123", "reserved")

    def test_rejects_non_date_inputs(self):
        with self.assertRaises(ValueError):
            record_window({"entries": []}, "2025-01-01", date(2025, 3, 31), "abc123", "reserved")


class RecordEvaluationTests(unittest.TestCase):
    def test_records_as_evaluated_with_oos_status_in_note(self):
        ledger = record_evaluation({"entries": []}, date(2025, 1, 1), date(2025, 3, 31), "abc123",
                                     "validated_with_caveats", note="see report")
        entry = ledger["entries"][0]
        self.assertEqual(entry["status"], "evaluated")
        self.assertIn("validated_with_caveats", entry["note"])
        self.assertIn("see report", entry["note"])

    def test_stores_no_raw_price_or_curve_data(self):
        import json
        ledger = record_evaluation({"entries": []}, date(2025, 1, 1), date(2025, 3, 31), "abc123",
                                     "not_validated")
        text = json.dumps(ledger, ensure_ascii=False)
        self.assertNotIn("equity_curve", text)
        self.assertNotIn("final_positions", text)
        self.assertNotIn("rebalance_log", text)


class FindOverlappingEntriesTests(unittest.TestCase):
    def setUp(self):
        self.ledger = record_window({"entries": []}, date(2025, 6, 1), date(2025, 8, 31), "h1", "evaluated")
        self.ledger = record_window(self.ledger, date(2025, 9, 1), date(2025, 11, 30), "h2", "reserved")

    def test_finds_overlap(self):
        overlaps = find_overlapping_entries(self.ledger, date(2025, 7, 1), date(2025, 7, 15))
        self.assertEqual(len(overlaps), 1)
        self.assertEqual(overlaps[0]["manifest_hash"], "h1")

    def test_no_overlap_returns_empty(self):
        overlaps = find_overlapping_entries(self.ledger, date(2026, 1, 1), date(2026, 2, 1))
        self.assertEqual(overlaps, [])

    def test_status_filter_restricts_matches(self):
        overlaps = find_overlapping_entries(self.ledger, date(2025, 10, 1), date(2025, 10, 15),
                                              statuses=("evaluated",))
        self.assertEqual(overlaps, [])
        overlaps = find_overlapping_entries(self.ledger, date(2025, 10, 1), date(2025, 10, 15),
                                              statuses=("reserved",))
        self.assertEqual(len(overlaps), 1)


class AssertWindowNotAlreadyEvaluatedTests(unittest.TestCase):
    def test_raises_on_overlap_with_evaluated_entry(self):
        ledger = record_evaluation({"entries": []}, date(2025, 6, 1), date(2025, 8, 31), "h1",
                                     "validated_with_caveats")
        with self.assertRaises(ValueError):
            assert_window_not_already_evaluated(ledger, date(2025, 7, 1), date(2025, 7, 31))

    def test_does_not_raise_on_overlap_with_reserved_only_entry(self):
        ledger = record_window({"entries": []}, date(2025, 6, 1), date(2025, 8, 31), "h1", "reserved")
        assert_window_not_already_evaluated(ledger, date(2025, 7, 1), date(2025, 7, 31))  # must not raise

    def test_does_not_raise_when_no_overlap(self):
        ledger = record_evaluation({"entries": []}, date(2025, 6, 1), date(2025, 8, 31), "h1",
                                     "validated_with_caveats")
        assert_window_not_already_evaluated(ledger, date(2026, 1, 1), date(2026, 2, 1))  # must not raise

    def test_empty_ledger_never_raises(self):
        assert_window_not_already_evaluated({"entries": []}, date(2025, 1, 1), date(2025, 2, 1))


class SuggestNextWindowStartTests(unittest.TestCase):
    def test_day_after_latest_end_across_all_statuses(self):
        ledger = record_window({"entries": []}, date(2025, 1, 1), date(2025, 3, 31), "h1", "reserved")
        ledger = record_evaluation(ledger, date(2025, 4, 1), date(2025, 6, 30), "h1", "validated_with_caveats")
        self.assertEqual(suggest_next_window_start(ledger), date(2025, 7, 1))

    def test_returns_fallback_when_ledger_empty(self):
        self.assertEqual(suggest_next_window_start({"entries": []}, fallback=date(2024, 1, 1)), date(2024, 1, 1))
        self.assertIsNone(suggest_next_window_start({"entries": []}))


if __name__ == "__main__":
    unittest.main()
