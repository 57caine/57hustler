import json
import os
import subprocess
import sys
import tempfile
import unittest
from datetime import date, timedelta

from phase5_report import build_phase5_report
from preregistration import PRE_REGISTERED_PARAMS, PRE_REGISTERED_MANIFEST_HASH


def multi_ticker_uptrend(days=800, n=3):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    return {
        f"T{k}": {d: 100 + k * 10 + i * (1 + 0.1 * k) for i, d in enumerate(dates)}
        for k in range(n)
    }


def write_prices_csv(path, tickers, days=800):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    with open(path, "w", encoding="utf-8") as f:
        f.write("date,ticker,close\n")
        for t_idx, t in enumerate(tickers):
            for i, d in enumerate(dates):
                f.write(f"{d.isoformat()},{t},{100 + i * (1 + t_idx * 0.1)}\n")


class BuildPhase5ReportTests(unittest.TestCase):
    def _write_csv(self, tickers=("A", "B", "C"), days=800):
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        write_prices_csv(csv_path, tickers, days=days)
        return csv_path, tmpdir

    def test_has_all_required_top_level_keys(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path)
        for key in ["pre_registered_parameters", "pre_registered_manifest_hash", "universe",
                    "holdout_validation", "benchmark_comparison", "data_required",
                    "bias_unresolved", "oos_status", "readiness_for_real_trading", "caveats"]:
            self.assertIn(key, report)

    def test_uses_pre_registered_parameters_unchanged(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path)
        self.assertEqual(report["pre_registered_parameters"], PRE_REGISTERED_PARAMS)
        self.assertEqual(report["pre_registered_manifest_hash"], PRE_REGISTERED_MANIFEST_HASH)

    def test_bias_unresolved_by_default_no_metadata_supplied(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path)
        self.assertTrue(report["bias_unresolved"])
        self.assertGreater(len(report["data_required"]), 0)
        self.assertIn("universe_tickers", report["benchmark_comparison"])

    def test_bias_resolved_when_metadata_flag_set(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path, has_point_in_time_metadata=True)
        self.assertFalse(report["bias_unresolved"])
        self.assertEqual(report["data_required"], [])

    def test_readiness_for_real_trading_always_false(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path, has_point_in_time_metadata=True)
        self.assertFalse(report["readiness_for_real_trading"])

    def test_oos_status_matches_holdout_validation(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path)
        self.assertEqual(report["oos_status"], report["holdout_validation"]["oos_status"])
        self.assertIn(report["oos_status"], ("validated_with_caveats", "not_validated"))

    def test_benchmark_has_matched_one_share_baselines(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path)
        bc = report["benchmark_comparison"]
        self.assertEqual(bc["buy_and_hold_1_share_zero_cost"]["lot_size"], 1)
        self.assertEqual(bc["buy_and_hold_1_share_same_cost_as_strategy"]["lot_size"], 1)
        self.assertEqual(bc["buy_and_hold_1_share_zero_cost"]["cost_bps"]
                          if "cost_bps" in bc["buy_and_hold_1_share_zero_cost"] else 0, 0)

    def test_benchmark_baselines_share_start_date_and_capital_with_strategy(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path, capital=500_000)
        bc = report["benchmark_comparison"]
        self.assertEqual(bc["strategy"]["initial"], 500_000)
        self.assertEqual(bc["buy_and_hold_1_share_zero_cost"]["initial"], 500_000)
        self.assertEqual(bc["buy_and_hold_1_share_zero_cost"]["start"], bc["start"])

    def test_topix_not_computed_without_csv(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path)
        self.assertEqual(report["benchmark_comparison"]["topix"]["status"], "not_computed")

    def test_topix_computed_when_csv_supplied(self):
        csv_path, tmpdir = self._write_csv()
        topix_path = os.path.join(tmpdir, "topix.csv")
        with open(topix_path, "w", encoding="utf-8") as f:
            f.write("date,close\n2024-01-01,2000\n2026-01-01,2200\n")
        report = build_phase5_report(csv_path, topix_csv=topix_path)
        self.assertEqual(report["benchmark_comparison"]["topix"]["name"], "topix_buy_and_hold")

    def test_output_is_compact_no_raw_curves_anywhere(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path)
        text = json.dumps(report, ensure_ascii=False)
        self.assertNotIn("equity_curve", text)
        self.assertNotIn("final_positions", text)
        self.assertNotIn("rebalance_log", text)

    def test_caveats_present(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path)
        self.assertGreater(len(report["caveats"]), 0)

    def test_no_parameter_optimization_note_present(self):
        csv_path, _ = self._write_csv()
        report = build_phase5_report(csv_path)
        self.assertIn("no_parameter_optimization", report["benchmark_comparison"])


class Phase5ReportCliTests(unittest.TestCase):
    """Runs the actual CLI as a subprocess -- no network access occurs
    (the script itself makes none), confirming the entry point works end
    to end, not just the library function."""

    def setUp(self):
        self.tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(self.tmpdir, ignore_errors=True))
        self.csv_path = os.path.join(self.tmpdir, "adjusted_prices.csv")
        write_prices_csv(self.csv_path, ["A", "B", "C"])
        self.script_dir = os.path.dirname(os.path.abspath(__file__))

    def run_cli(self, *extra_args):
        return subprocess.run(
            [sys.executable, os.path.join(self.script_dir, "phase5_report.py"), self.csv_path, *extra_args],
            capture_output=True, text=True, cwd=self.script_dir,
        )

    def test_cli_runs_and_prints_valid_json(self):
        proc = self.run_cli()
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        report = json.loads(proc.stdout)
        self.assertIn("oos_status", report)
        self.assertIn("bias_unresolved", report)
        self.assertFalse(report["readiness_for_real_trading"])

    def test_cli_writes_out_file(self):
        out_path = os.path.join(self.tmpdir, "out.json")
        proc = self.run_cli("--out", out_path)
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        self.assertTrue(os.path.isfile(out_path))
        with open(out_path, encoding="utf-8") as f:
            report = json.load(f)
        self.assertIn("benchmark_comparison", report)

    def test_cli_does_not_expose_strategy_parameter_flags(self):
        proc = self.run_cli("--help")
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        for flag in ["--lookback", "--max-names", "--cost-bps"]:
            self.assertNotIn(flag, proc.stdout)

    def test_cli_rejects_bad_csv_without_crashing(self):
        bad_path = os.path.join(self.tmpdir, "bad.csv")
        with open(bad_path, "w", encoding="utf-8") as f:
            f.write("date,ticker,close\n2024-01-01,X,nan\n")
        proc = subprocess.run(
            [sys.executable, os.path.join(self.script_dir, "phase5_report.py"), bad_path],
            capture_output=True, text=True, cwd=self.script_dir,
        )
        self.assertNotEqual(proc.returncode, 0)
        self.assertIn("stopped:", proc.stderr)


if __name__ == "__main__":
    unittest.main()
