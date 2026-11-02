import json
import os
import subprocess
import sys
import tempfile
import unittest
from datetime import date, timedelta

from phase4_report import build_phase4_report, SLIPPAGE_STRESS_COST_BPS


def multi_ticker_uptrend(days=430, n=3):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    return {
        f"T{k}": {d: 100 + k * 10 + i * (1 + 0.1 * k) for i, d in enumerate(dates)}
        for k in range(n)
    }


def write_prices_csv(path, tickers, days=430):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    with open(path, "w", encoding="utf-8") as f:
        f.write("date,ticker,close\n")
        for t_idx, t in enumerate(tickers):
            for i, d in enumerate(dates):
                f.write(f"{d.isoformat()},{t},{100 + i * (1 + t_idx * 0.1)}\n")


class BuildPhase4ReportTests(unittest.TestCase):
    def test_has_all_required_sections(self):
        prices = multi_ticker_uptrend()
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        write_prices_csv(csv_path, sorted(prices))
        report = build_phase4_report(csv_path, lookback=60)
        for key in ["period", "parameters", "timing_preflight", "walk_forward_validation",
                    "lot_model_comparison", "failure_mode_sensitivity", "caveats"]:
            self.assertIn(key, report)

    def test_timing_preflight_checked_the_calendar(self):
        prices = multi_ticker_uptrend()
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        write_prices_csv(csv_path, sorted(prices))
        report = build_phase4_report(csv_path, lookback=60)
        preflight = report["timing_preflight"]
        self.assertTrue(preflight["same_day_close_fill_assumption_acknowledged"])
        self.assertTrue(preflight["trading_calendar_checked"])
        # Daily consecutive dates in the fixture -> every gap is 1 day.
        self.assertEqual(preflight["largest_observed_gap_days"], 1)

    def test_acknowledgment_is_not_conflated_with_empirical_validation(self):
        # Phase 5 Priority 0: an explicit boolean acknowledgment is not
        # empirical validation -- this must stay False regardless of the
        # acknowledgment flag above.
        prices = multi_ticker_uptrend()
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        write_prices_csv(csv_path, sorted(prices))
        report = build_phase4_report(csv_path, lookback=60)
        self.assertFalse(report["timing_preflight"]["empirically_validated"])

    def test_anomalous_calendar_gap_is_rejected_not_silently_accepted(self):
        dates1 = [date(2024, 1, 1) + timedelta(days=i) for i in range(200)]
        dates2 = [dates1[-1] + timedelta(days=45 + i) for i in range(200)]  # implausible gap
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        with open(csv_path, "w", encoding="utf-8") as f:
            f.write("date,ticker,close\n")
            for i, d in enumerate(dates1 + dates2):
                f.write(f"{d.isoformat()},X,{100 + i}\n")
        with self.assertRaises(ValueError):
            build_phase4_report(csv_path, lookback=60)

    def test_failure_mode_sensitivity_has_all_cases(self):
        prices = multi_ticker_uptrend()
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        write_prices_csv(csv_path, sorted(prices))
        report = build_phase4_report(csv_path, lookback=60)
        fm = report["failure_mode_sensitivity"]
        for key in ["baseline", "no_fill", "one_session_execution_delay", "worse_execution_slippage", "notes"]:
            self.assertIn(key, fm)
        self.assertEqual(fm["worse_execution_slippage"]["stress_cost_bps"], SLIPPAGE_STRESS_COST_BPS)
        self.assertGreater(len(fm["notes"]), 0)

    def test_no_fill_case_matches_plain_cash_baseline(self):
        prices = multi_ticker_uptrend()
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        write_prices_csv(csv_path, sorted(prices))
        report = build_phase4_report(csv_path, capital=1_000_000, lookback=60)
        no_fill = report["failure_mode_sensitivity"]["no_fill"]
        self.assertEqual(no_fill["final"], 1_000_000)
        self.assertEqual(no_fill["return_pct"], 0.0)

    def test_lot_model_comparison_uses_matching_baselines(self):
        prices = multi_ticker_uptrend()
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        write_prices_csv(csv_path, sorted(prices))
        report = build_phase4_report(csv_path, lookback=60)
        models = report["lot_model_comparison"]["models"]
        self.assertEqual(
            models["skabu_1_share_zero_cost"]["result"]["lot_size"],
            models["buy_and_hold_skabu_1_share_zero_cost"]["result"]["lot_size"],
        )

    def test_output_is_compact_no_raw_curves_anywhere(self):
        # Phase 5 regression test: lot_model_comparison (sourced from
        # skabu_model.compare_lot_models()) used to leak rebalance_log --
        # a raw-ish per-rebalance-event log -- because that module's own
        # compacting helper dropped only equity_curve/final_positions.
        prices = multi_ticker_uptrend()
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        write_prices_csv(csv_path, sorted(prices))
        report = build_phase4_report(csv_path, lookback=60)
        text = json.dumps(report, ensure_ascii=False)
        self.assertNotIn("equity_curve", text)
        self.assertNotIn("final_positions", text)
        self.assertNotIn("rebalance_log", text)

    def test_no_parameter_tuning_same_cost_bps_and_lookback_everywhere(self):
        prices = multi_ticker_uptrend()
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        write_prices_csv(csv_path, sorted(prices))
        report = build_phase4_report(csv_path, lookback=60, cost_bps=37)
        self.assertEqual(report["walk_forward_validation"]["full_period_result"]["cost_bps"], 37)
        self.assertEqual(report["failure_mode_sensitivity"]["baseline"]["cost_bps"], 37)

    def test_caveats_present(self):
        prices = multi_ticker_uptrend()
        tmpdir = tempfile.mkdtemp()
        self.addCleanup(lambda: __import__("shutil").rmtree(tmpdir, ignore_errors=True))
        csv_path = os.path.join(tmpdir, "prices.csv")
        write_prices_csv(csv_path, sorted(prices))
        report = build_phase4_report(csv_path, lookback=60)
        self.assertGreater(len(report["caveats"]), 0)


class Phase4ReportCliTests(unittest.TestCase):
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
            [sys.executable, os.path.join(self.script_dir, "phase4_report.py"), self.csv_path, *extra_args],
            capture_output=True, text=True, cwd=self.script_dir,
        )

    def test_cli_runs_and_prints_valid_json(self):
        proc = self.run_cli("--lookback", "60")
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        report = json.loads(proc.stdout)
        self.assertIn("walk_forward_validation", report)
        self.assertIn("failure_mode_sensitivity", report)

    def test_cli_writes_out_file(self):
        out_path = os.path.join(self.tmpdir, "out.json")
        proc = self.run_cli("--lookback", "60", "--out", out_path)
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        self.assertTrue(os.path.isfile(out_path))
        with open(out_path, encoding="utf-8") as f:
            report = json.load(f)
        self.assertIn("lot_model_comparison", report)

    def test_cli_rejects_bad_csv_without_crashing(self):
        bad_path = os.path.join(self.tmpdir, "bad.csv")
        with open(bad_path, "w", encoding="utf-8") as f:
            f.write("date,ticker,close\n2024-01-01,X,nan\n")
        proc = subprocess.run(
            [sys.executable, os.path.join(self.script_dir, "phase4_report.py"), bad_path],
            capture_output=True, text=True, cwd=self.script_dir,
        )
        self.assertNotEqual(proc.returncode, 0)
        self.assertIn("stopped:", proc.stderr)


if __name__ == "__main__":
    unittest.main()
