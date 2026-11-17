import json
import os
import tempfile
import unittest
from datetime import date, timedelta

from report import build_report, _without_bulk_fields


def write_prices_csv(path, tickers, days=260, start_price=100):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    with open(path, "w", encoding="utf-8") as f:
        f.write("date,ticker,close\n")
        for t_idx, t in enumerate(tickers):
            for i, d in enumerate(dates):
                price = start_price + i * (1 + t_idx)
                f.write(f"{d.isoformat()},{t},{price}\n")


class WithoutBulkFieldsTests(unittest.TestCase):
    def test_drops_equity_curve_and_positions(self):
        d = {"final": 1, "equity_curve": [("2024-01-01", 1)], "final_positions": {"X": 1}, "trades": 2}
        out = _without_bulk_fields(d)
        self.assertNotIn("equity_curve", out)
        self.assertNotIn("final_positions", out)
        self.assertEqual(out["final"], 1)
        self.assertEqual(out["trades"], 2)

    def test_drops_rebalance_log(self):
        # Phase 5 regression test: this used to leak rebalance_log (a
        # raw-ish per-rebalance-event log Phase 4 added to backtest.run())
        # into every "compact" report built from this function.
        d = {"final": 1, "rebalance_log": [{"date": "2024-01-01", "trades": 2}]}
        out = _without_bulk_fields(d)
        self.assertNotIn("rebalance_log", out)


class BuildReportTests(unittest.TestCase):
    def setUp(self):
        self.tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(self.tmpdir, ignore_errors=True))
        self.csv_path = os.path.join(self.tmpdir, "adjusted_prices.csv")
        write_prices_csv(self.csv_path, ["A", "B", "C"], days=260)

    def test_report_is_json_serializable_and_compact(self):
        report = build_report(self.csv_path, lookback=60, n_splits=2, min_rows=60)
        text = json.dumps(report, ensure_ascii=False)
        self.assertNotIn("equity_curve", text)
        self.assertNotIn("final_positions", text)
        self.assertNotIn("rebalance_log", text)

    def test_report_has_all_required_sections(self):
        report = build_report(self.csv_path, lookback=60, n_splits=2, min_rows=60)
        for key in ["data_quality", "period", "momentum_strategy", "after_tax_scenario",
                    "baselines", "time_split_validation", "sensitivity_sweep",
                    "monthly_returns", "worst_month", "drawdown_episodes", "caveats"]:
            self.assertIn(key, report)

    def test_topix_not_computed_without_csv(self):
        report = build_report(self.csv_path, lookback=60, n_splits=2, min_rows=60)
        self.assertEqual(report["baselines"]["topix"]["status"], "not_computed")

    def test_topix_computed_when_csv_supplied(self):
        topix_path = os.path.join(self.tmpdir, "topix.csv")
        with open(topix_path, "w", encoding="utf-8") as f:
            f.write("date,close\n2024-01-01,2000\n2024-09-01,2200\n")
        report = build_report(self.csv_path, topix_csv=topix_path, lookback=60, n_splits=2, min_rows=60)
        self.assertEqual(report["baselines"]["topix"]["name"], "topix_buy_and_hold")
        self.assertNotIn("status", report["baselines"]["topix"])

    def test_bad_csv_stops_before_backtest_with_clear_error(self):
        bad_path = os.path.join(self.tmpdir, "bad.csv")
        with open(bad_path, "w", encoding="utf-8") as f:
            f.write("date,ticker,close\n2024-01-01,X,nan\n")
        with self.assertRaises(ValueError):
            build_report(bad_path)

    def test_caveats_are_present_and_nonempty(self):
        report = build_report(self.csv_path, lookback=60, n_splits=2, min_rows=60)
        self.assertGreater(len(report["caveats"]), 0)
        self.assertTrue(all(isinstance(c, str) and c for c in report["caveats"]))


if __name__ == "__main__":
    unittest.main()
