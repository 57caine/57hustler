import json
import os
import subprocess
import sys
import tempfile
import unittest
from datetime import date, timedelta


def write_prices_csv(path, tickers, days=260):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    with open(path, "w", encoding="utf-8") as f:
        f.write("date,ticker,close\n")
        for t_idx, t in enumerate(tickers):
            for i, d in enumerate(dates):
                f.write(f"{d.isoformat()},{t},{100 + i * (1 + t_idx * 0.1)}\n")


class SkabuReportCliTests(unittest.TestCase):
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
            [sys.executable, os.path.join(self.script_dir, "skabu_report.py"), self.csv_path, *extra_args],
            capture_output=True, text=True, cwd=self.script_dir,
        )

    def test_cli_runs_and_prints_valid_json(self):
        proc = self.run_cli("--lookback", "60")
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        report = json.loads(proc.stdout)
        self.assertIn("models", report)
        self.assertIn("skabu_1_share_zero_cost", report["models"])

    def test_cli_writes_out_file(self):
        out_path = os.path.join(self.tmpdir, "out.json")
        proc = self.run_cli("--lookback", "60", "--out", out_path)
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        self.assertTrue(os.path.isfile(out_path))
        with open(out_path, encoding="utf-8") as f:
            report = json.load(f)
        self.assertIn("models", report)

    def test_cli_rejects_bad_csv_without_crashing(self):
        bad_path = os.path.join(self.tmpdir, "bad.csv")
        with open(bad_path, "w", encoding="utf-8") as f:
            f.write("date,ticker,close\n2024-01-01,X,nan\n")
        proc = subprocess.run(
            [sys.executable, os.path.join(self.script_dir, "skabu_report.py"), bad_path],
            capture_output=True, text=True, cwd=self.script_dir,
        )
        self.assertNotEqual(proc.returncode, 0)
        self.assertIn("stopped:", proc.stderr)


if __name__ == "__main__":
    unittest.main()
