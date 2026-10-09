import json
import os
import subprocess
import sys
import tempfile
import unittest
from datetime import date, timedelta

import backtest
import time_split
from oos_window_comparison import (
    oos_vs_buy_and_hold_report,
    DEFAULT_OOS_START,
    DEFAULT_OOS_END,
    POSITION_CONCENTRATION_CAP_PCT_OF_CASH,
)
from preregistration import PRE_REGISTERED_PARAMS
import oos_ledger


def uptrend_then_flat_from_oos(n=5, flat_from=DEFAULT_OOS_START, end=DEFAULT_OOS_END, start=date(2024, 1, 1)):
    """n tickers that trend upward (with trades happening along the way)
    right up to `flat_from`, then hold perfectly flat at whatever price
    they reached -- used to engineer a fixture where at least one trade is
    guaranteed to happen during warmup/development (before flat_from) that
    must NOT be counted in the OOS evaluation window."""
    total_days = (end - start).days + 1
    dates = [start + timedelta(days=i) for i in range(total_days)]
    prices = {}
    for k in range(n):
        series = {}
        last_trend_price = None
        for d in dates:
            if d < flat_from:
                i = (d - start).days
                p = 100 + k * 10 + i * (1 + 0.05 * k)
                series[d] = p
                last_trend_price = p
            else:
                series[d] = last_trend_price
        prices[f"T{k}"] = series
    return prices


def write_prices_csv(path, tickers, start=date(2024, 1, 1), end=DEFAULT_OOS_END):
    total_days = (end - start).days + 1
    dates = [start + timedelta(days=i) for i in range(total_days)]
    with open(path, "w", encoding="utf-8") as f:
        f.write("date,ticker,close\n")
        for t_idx, t in enumerate(tickers):
            for i, d in enumerate(dates):
                f.write(f"{d.isoformat()},{t},{100 + i * (1 + t_idx * 0.1)}\n")


class OosVsBuyAndHoldReportTests(unittest.TestCase):
    def test_oos_window_defaults_match_the_specified_period(self):
        prices = uptrend_then_flat_from_oos()
        report = oos_vs_buy_and_hold_report(prices, capital=1_000_000)
        self.assertEqual(report["oos_window"]["requested_start"], DEFAULT_OOS_START.isoformat())
        self.assertEqual(report["oos_window"]["requested_end"], DEFAULT_OOS_END.isoformat())

    def test_buy_and_hold_matches_strategy_on_period_capital_tickers_and_cost(self):
        prices = uptrend_then_flat_from_oos()
        report = oos_vs_buy_and_hold_report(prices, capital=1_000_000)
        bc = report["buy_and_hold"]
        self.assertIsNotNone(bc, msg=report.get("buy_and_hold_error"))
        # Same realized OOS period as the strategy's holdout evaluation.
        self.assertEqual(bc["start"], report["oos_window"]["actual_start"])
        self.assertEqual(bc["end"], report["oos_window"]["actual_end"])
        # Same starting capital.
        self.assertEqual(bc["initial"], 1_000_000)
        # Same ticker universe -- every ticker in the supplied price data.
        self.assertEqual(sorted(bc["tickers"]), sorted(prices))
        # Same cost/lot assumptions as the pre-registered strategy params.
        self.assertEqual(bc["cost_bps"], report["parameters"]["cost_bps"])
        self.assertEqual(bc["lot_size"], report["parameters"]["lot_size"])

    def test_uses_pre_registered_parameters_by_default(self):
        prices = uptrend_then_flat_from_oos()
        report = oos_vs_buy_and_hold_report(prices, capital=1_000_000)
        self.assertEqual(report["parameters"], PRE_REGISTERED_PARAMS)

    def test_known_constraints_documents_cost_lot_and_selection_bias(self):
        prices = uptrend_then_flat_from_oos()
        report = oos_vs_buy_and_hold_report(prices, capital=1_000_000)
        kc = report["known_constraints"]
        self.assertEqual(kc["trading_cost_bps"], report["parameters"]["cost_bps"])
        self.assertEqual(kc["lot_size"], report["parameters"]["lot_size"])
        self.assertEqual(kc["position_concentration_cap_pct_of_cash"], POSITION_CONCENTRATION_CAP_PCT_OF_CASH)
        self.assertIn("ticker_selection_bias", kc)
        self.assertGreater(len(kc["ticker_selection_bias"]), 0)

    def test_oos_trade_count_matches_independently_filtered_rebalance_log(self):
        # Direct, independent cross-check: re-derive the expected OOS trade
        # count by running backtest.run() ourselves on the same
        # warmup+OOS slice and filtering rebalance_log by date manually
        # (duplicating none of oos_window_comparison's / preregistration's
        # own filtering code), then compare against the report's own
        # figure.
        #
        # Note on what this test can and cannot show: with warmup sized at
        # EXACTLY `lookback` days (preregistration.py's design),
        # backtest.run()'s own `i > lookback` guard makes it mathematically
        # impossible for a trade to be dated before the OOS window even
        # starts within this dedicated run -- the earliest a signal can
        # fire is one day past the warmup/holdout boundary, which already
        # falls inside the OOS window. So raw["trades"] and
        # expected_oos_trades are expected to be EQUAL here, confirming no
        # warmup trade exists to leak in the first place for this specific
        # slicing design. The general-purpose exclusion mechanism itself
        # (for cases where it DOES matter, e.g. a longer pre-window history)
        # is proven directly against a controlled synthetic equity curve/
        # rebalance log in test_preregistration.py's EvaluationWindowResultTests.
        prices = uptrend_then_flat_from_oos()
        report = oos_vs_buy_and_hold_report(prices, capital=1_000_000)
        params = report["parameters"]

        common = sorted(set.intersection(*(set(x) for x in prices.values())))
        development = [d for d in common if d < DEFAULT_OOS_START]
        warmup = development[-params["lookback"]:]
        oos_dates = [d for d in common if DEFAULT_OOS_START <= d <= DEFAULT_OOS_END]

        run_prices = time_split.slice_prices(prices, warmup[0], oos_dates[-1])
        raw = backtest.run(run_prices, capital=1_000_000, **params)
        oos_start_iso, oos_end_iso = DEFAULT_OOS_START.isoformat(), DEFAULT_OOS_END.isoformat()
        pre_oos_trades = sum(e["trades"] for e in raw["rebalance_log"] if e["date"] < oos_start_iso)
        expected_oos_trades = sum(e["trades"] for e in raw["rebalance_log"]
                                   if oos_start_iso <= e["date"] <= oos_end_iso)

        self.assertEqual(pre_oos_trades, 0)  # structurally guaranteed by the lookback-sized warmup
        self.assertGreater(expected_oos_trades, 0)  # the fixture does trade somewhere
        self.assertEqual(report["strategy"]["holdout_result"]["trades"], expected_oos_trades)
        # Zero trades during warmup also means zero P&L during warmup --
        # equity at the OOS window's own start is still the untouched
        # initial capital, confirming no warmup gain/loss is baked into
        # the reported OOS return either.
        self.assertEqual(report["strategy"]["holdout_result"]["start_value"], 1_000_000)

    def test_output_is_compact_no_raw_curves_anywhere(self):
        prices = uptrend_then_flat_from_oos()
        report = oos_vs_buy_and_hold_report(prices, capital=1_000_000)
        text = json.dumps(report, ensure_ascii=False)
        self.assertNotIn("equity_curve", text)
        self.assertNotIn("final_positions", text)
        self.assertNotIn("rebalance_log", text)

    def test_caveats_present(self):
        prices = uptrend_then_flat_from_oos()
        report = oos_vs_buy_and_hold_report(prices, capital=1_000_000)
        self.assertGreater(len(report["caveats"]), 0)

    def test_empty_oos_window_reports_not_validated_not_crash(self):
        prices = uptrend_then_flat_from_oos(end=date(2025, 6, 30))  # ends before the OOS window starts
        report = oos_vs_buy_and_hold_report(prices, capital=1_000_000)
        self.assertEqual(report["oos_status"], "not_validated")
        self.assertIsNone(report["buy_and_hold"])

    def test_custom_oos_window_is_honored(self):
        prices = uptrend_then_flat_from_oos(end=date(2026, 12, 31))
        custom_start, custom_end = date(2026, 7, 1), date(2026, 9, 30)
        report = oos_vs_buy_and_hold_report(prices, capital=1_000_000, oos_start=custom_start, oos_end=custom_end)
        self.assertEqual(report["oos_window"]["requested_start"], custom_start.isoformat())
        self.assertEqual(report["oos_window"]["requested_end"], custom_end.isoformat())

    def test_no_ledger_check_by_default(self):
        # Omitting `ledger` (the default) must never raise, even though an
        # "evaluated" entry covering the exact same window would raise if
        # a ledger WERE passed -- confirming existing callers that never
        # pass `ledger` are completely unaffected by Phase 6's addition.
        prices = uptrend_then_flat_from_oos()
        report = oos_vs_buy_and_hold_report(prices, capital=1_000_000)  # must not raise
        self.assertIn("oos_status", report)

    def test_raises_when_ledger_marks_window_already_evaluated(self):
        prices = uptrend_then_flat_from_oos()
        ledger = oos_ledger.record_evaluation({"entries": []}, DEFAULT_OOS_START, DEFAULT_OOS_END,
                                                "some-hash", "validated_with_caveats")
        with self.assertRaises(ValueError):
            oos_vs_buy_and_hold_report(prices, capital=1_000_000, ledger=ledger)

    def test_does_not_raise_when_ledger_only_has_reserved_entry(self):
        prices = uptrend_then_flat_from_oos()
        ledger = oos_ledger.record_window({"entries": []}, DEFAULT_OOS_START, DEFAULT_OOS_END,
                                            "some-hash", "reserved")
        oos_vs_buy_and_hold_report(prices, capital=1_000_000, ledger=ledger)  # must not raise


class OosWindowComparisonCliTests(unittest.TestCase):
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
            [sys.executable, os.path.join(self.script_dir, "oos_window_comparison.py"), self.csv_path, *extra_args],
            capture_output=True, text=True, cwd=self.script_dir,
        )

    def test_cli_runs_and_prints_valid_json(self):
        proc = self.run_cli()
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        report = json.loads(proc.stdout)
        self.assertIn("oos_window", report)
        self.assertIn("known_constraints", report)

    def test_cli_writes_out_file(self):
        out_path = os.path.join(self.tmpdir, "out.json")
        proc = self.run_cli("--out", out_path)
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        self.assertTrue(os.path.isfile(out_path))
        with open(out_path, encoding="utf-8") as f:
            report = json.load(f)
        self.assertIn("buy_and_hold", report)

    def test_cli_does_not_expose_strategy_parameter_flags(self):
        proc = self.run_cli("--help")
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        for flag in ["--lookback", "--max-names", "--cost-bps"]:
            self.assertNotIn(flag, proc.stdout)

    def test_cli_honors_custom_oos_window_flags(self):
        proc = self.run_cli("--oos-start", "2024-06-01", "--oos-end", "2024-08-31")
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        report = json.loads(proc.stdout)
        self.assertEqual(report["oos_window"]["requested_start"], "2024-06-01")
        self.assertEqual(report["oos_window"]["requested_end"], "2024-08-31")

    def test_cli_record_ledger_writes_evaluated_entry_to_custom_path(self):
        ledger_path = os.path.join(self.tmpdir, "test_ledger.json")
        proc = self.run_cli("--oos-start", "2024-06-01", "--oos-end", "2024-08-31",
                             "--ledger-path", ledger_path, "--record-ledger")
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)
        self.assertTrue(os.path.isfile(ledger_path))
        with open(ledger_path, encoding="utf-8") as f:
            ledger = json.load(f)
        self.assertEqual(len(ledger["entries"]), 1)
        self.assertEqual(ledger["entries"][0]["status"], "evaluated")
        self.assertEqual(ledger["entries"][0]["start"], "2024-06-01")

    def test_cli_rejects_reusing_an_already_evaluated_window(self):
        ledger_path = os.path.join(self.tmpdir, "test_ledger.json")
        first = self.run_cli("--oos-start", "2024-06-01", "--oos-end", "2024-08-31",
                              "--ledger-path", ledger_path, "--record-ledger")
        self.assertEqual(first.returncode, 0, msg=first.stderr)

        second = self.run_cli("--oos-start", "2024-07-01", "--oos-end", "2024-07-15",
                               "--ledger-path", ledger_path)
        self.assertNotEqual(second.returncode, 0)
        self.assertIn("stopped:", second.stderr)

        third = self.run_cli("--oos-start", "2024-07-01", "--oos-end", "2024-07-15",
                              "--ledger-path", ledger_path, "--ignore-ledger")
        self.assertEqual(third.returncode, 0, msg=third.stderr)

    def test_cli_rejects_bad_csv_without_crashing(self):
        bad_path = os.path.join(self.tmpdir, "bad.csv")
        with open(bad_path, "w", encoding="utf-8") as f:
            f.write("date,ticker,close\n2024-01-01,X,nan\n")
        proc = subprocess.run(
            [sys.executable, os.path.join(self.script_dir, "oos_window_comparison.py"), bad_path],
            capture_output=True, text=True, cwd=self.script_dir,
        )
        self.assertNotEqual(proc.returncode, 0)
        self.assertIn("stopped:", proc.stderr)


if __name__ == "__main__":
    unittest.main()
