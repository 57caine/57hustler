import unittest
from datetime import date, timedelta

from preregistration import (
    freeze_params,
    verify_manifest,
    chronological_holdout_split,
    holdout_protocol_report,
    _evaluation_window_result,
    PRE_REGISTERED_PARAMS,
    PRE_REGISTERED_MANIFEST_HASH,
)


def multi_ticker_uptrend(days=430, n=3):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    return {
        f"T{k}": {d: 100 + k * 10 + i * (1 + 0.1 * k) for i, d in enumerate(dates)}
        for k in range(n)
    }


def flat_market(days=430):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    return {"X": {d: 100 for d in dates}}


def ten_ticker_uptrend(days=425):
    # Shape matches the real-data report that surfaced this bug: 10
    # tickers x 425 trading days, development_fraction=0.7 (default) ->
    # development=298, holdout=127 -- previously too short on its own
    # against lookback=126 (needs lookback+3=129).
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    return {
        f"T{k}": {d: 100 + k * 10 + i * (1 + 0.05 * k) for i, d in enumerate(dates)}
        for k in range(10)
    }


class FreezeAndVerifyManifestTests(unittest.TestCase):
    def test_same_params_produce_same_hash(self):
        _, h1 = freeze_params(126, 5, 20)
        _, h2 = freeze_params(126, 5, 20)
        self.assertEqual(h1, h2)

    def test_different_params_produce_different_hash(self):
        _, h1 = freeze_params(126, 5, 20)
        _, h2 = freeze_params(60, 5, 20)
        self.assertNotEqual(h1, h2)

    def test_verify_manifest_true_for_matching_params(self):
        params, h = freeze_params(126, 5, 20, lot_size=100)
        self.assertTrue(verify_manifest(params, h))

    def test_verify_manifest_false_after_tampering(self):
        params, h = freeze_params(126, 5, 20)
        tampered = dict(params, cost_bps=0)
        self.assertFalse(verify_manifest(tampered, h))

    def test_pre_registered_manifest_is_internally_consistent(self):
        self.assertTrue(verify_manifest(PRE_REGISTERED_PARAMS, PRE_REGISTERED_MANIFEST_HASH))
        self.assertEqual(PRE_REGISTERED_PARAMS["lookback"], 126)
        self.assertEqual(PRE_REGISTERED_PARAMS["max_names"], 5)
        self.assertEqual(PRE_REGISTERED_PARAMS["cost_bps"], 20)


class ChronologicalHoldoutSplitTests(unittest.TestCase):
    def test_development_strictly_before_holdout(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(100)]
        dev, holdout = chronological_holdout_split(dates, development_fraction=0.7)
        self.assertLess(dev[-1], holdout[0])
        self.assertEqual(dev + holdout, dates)

    def test_rejects_empty_input(self):
        with self.assertRaises(ValueError):
            chronological_holdout_split([])

    def test_rejects_unsorted_input(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(10)]
        with self.assertRaises(ValueError):
            chronological_holdout_split(list(reversed(dates)))

    def test_rejects_out_of_range_fraction(self):
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(10)]
        for bad in [0, 1, 1.5, -0.1]:
            with self.subTest(fraction=bad):
                with self.assertRaises(ValueError):
                    chronological_holdout_split(dates, development_fraction=bad)

    def test_rejects_too_few_observations(self):
        with self.assertRaises(ValueError):
            chronological_holdout_split([date(2024, 1, 1)])


class HoldoutProtocolReportTests(unittest.TestCase):
    def test_sufficient_data_is_validated_with_caveats(self):
        prices = multi_ticker_uptrend()
        report = holdout_protocol_report(prices, lookback=60, max_names=2, cost_bps=20,
                                           development_fraction=0.7)
        self.assertEqual(report["oos_status"], "validated_with_caveats")
        self.assertIn("development_result", report)
        self.assertIn("holdout_result", report)
        self.assertGreater(report["holdout_result"]["trades"], 0)

    def test_development_strictly_precedes_holdout_period(self):
        prices = multi_ticker_uptrend()
        report = holdout_protocol_report(prices, lookback=60, max_names=2, cost_bps=20)
        self.assertLess(report["development_period"]["end"], report["holdout_period"]["start"])

    def test_contamination_detected_when_hash_mismatches(self):
        prices = multi_ticker_uptrend()
        _, wrong_hash = freeze_params(126, 5, 20)
        report = holdout_protocol_report(prices, lookback=60, max_names=2, cost_bps=20,
                                           expected_manifest_hash=wrong_hash)
        self.assertEqual(report["oos_status"], "not_validated")
        self.assertIn("contamination", report["reason"])

    def test_matching_expected_hash_passes_contamination_check(self):
        prices = multi_ticker_uptrend()
        params, correct_hash = freeze_params(60, 2, 20)
        report = holdout_protocol_report(prices, lookback=60, max_names=2, cost_bps=20,
                                           expected_manifest_hash=correct_hash)
        self.assertNotEqual(report.get("reason", ""), "contamination detected")
        self.assertIn(report["oos_status"], ("validated_with_caveats", "not_validated"))

    def test_tiny_holdout_is_flagged_not_validated(self):
        prices = multi_ticker_uptrend()
        report = holdout_protocol_report(prices, lookback=60, max_names=2, cost_bps=20,
                                           development_fraction=0.97)
        self.assertEqual(report["oos_status"], "not_validated")
        self.assertTrue(any("statistically weak" in w for w in report["warnings"]))

    def test_flat_market_zero_trades_is_not_validated(self):
        prices = flat_market()
        report = holdout_protocol_report(prices, lookback=60, max_names=1, cost_bps=20)
        self.assertEqual(report["oos_status"], "not_validated")
        self.assertTrue(any("too few" in w for w in report["warnings"]))

    def test_insufficient_history_for_lookback_reports_not_validated_not_crash(self):
        prices = multi_ticker_uptrend(days=50)
        report = holdout_protocol_report(prices, lookback=60, max_names=2, cost_bps=20)
        self.assertEqual(report["oos_status"], "not_validated")
        self.assertIn("reason", report)

    def test_output_is_compact_no_bulk_fields(self):
        import json
        prices = multi_ticker_uptrend()
        report = holdout_protocol_report(prices, lookback=60, max_names=2, cost_bps=20)
        text = json.dumps(report, ensure_ascii=False)
        self.assertNotIn("equity_curve", text)
        self.assertNotIn("final_positions", text)
        self.assertNotIn("rebalance_log", text)

    def test_holdout_shorter_than_lookback_plus_three_no_longer_fails_outright(self):
        # Regression test for the exact real-data report that surfaced this
        # bug: 10 tickers x 425 trading days, development_fraction=0.7 (the
        # default) -> development=298, holdout=127, lookback=126. Before the
        # warmup fix, a holdout slice run on its OWN 127 observations was
        # below backtest.run()'s own lookback+3=129 minimum and failed
        # outright with "insufficient common history" -- the holdout could
        # never produce a single signal no matter how long the underlying
        # history was. It must not fail for that reason any more.
        prices = ten_ticker_uptrend(days=425)
        report = holdout_protocol_report(prices, lookback=126, max_names=5, cost_bps=20)
        self.assertEqual(report["development_period"]["observations"], 298)
        self.assertEqual(report["holdout_period"]["observations"], 127)
        self.assertNotIn("insufficient common history", report.get("reason", ""))
        self.assertIn("holdout_result", report)
        self.assertIn("development_result", report)

    def test_warmup_period_reported_with_lookback_length_from_development_tail(self):
        prices = ten_ticker_uptrend(days=425)
        report = holdout_protocol_report(prices, lookback=126, max_names=5, cost_bps=20)
        self.assertIn("warmup_period", report)
        self.assertEqual(report["warmup_period"]["observations"], 126)
        # Warmup must end exactly where the holdout period begins (the day
        # before it, since both are drawn from the same sorted date list).
        self.assertLess(report["warmup_period"]["end"], report["holdout_period"]["start"])

    def test_development_result_unaffected_by_warmup_reuse(self):
        # The development evaluation must be computed from the FULL
        # development period regardless of whether its tail is also reused
        # as warmup for the holdout run -- the two evaluations stay strictly
        # separate (requirement: development and holdout evaluated
        # independently).
        import backtest
        import time_split as ts
        prices = ten_ticker_uptrend(days=425)
        report = holdout_protocol_report(prices, lookback=126, max_names=5, cost_bps=20)
        common = sorted(set.intersection(*(set(x) for x in prices.values())))
        development_dates, _ = chronological_holdout_split(common, 0.7)
        development_prices = ts.slice_prices(prices, development_dates[0], development_dates[-1])
        standalone = backtest.run(development_prices, capital=1_000_000, lookback=126, max_names=5, cost_bps=20,
                                   lot_size=None)
        self.assertEqual(report["development_result"]["final"], standalone["final"])
        self.assertEqual(report["development_result"]["trades"], standalone["trades"])

    def test_holdout_result_internally_consistent_with_its_own_start_value(self):
        # The holdout evaluation window's return_pct must be derived from
        # its OWN start_value (the equity at the holdout period's own
        # start), never from the original capital constant. Note:
        # start_value can legitimately still equal the initial capital --
        # with warmup sized at exactly `lookback` days, backtest.run()'s
        # `i > lookback` guard means no trade is even possible until one
        # day past the warmup/holdout boundary, so the very first holdout
        # observation often has no trade behind it yet. That is expected,
        # not evidence the warmup was skipped -- see EvaluationWindowResultTests
        # below for a direct, controlled test of the exclusion logic itself.
        prices = ten_ticker_uptrend(days=425)
        report = holdout_protocol_report(prices, lookback=126, max_names=5, cost_bps=20)
        holdout = report["holdout_result"]
        self.assertEqual(round((holdout["end_value"] / holdout["start_value"] - 1) * 100, 2),
                          holdout["return_pct"])


class EvaluationWindowResultTests(unittest.TestCase):
    """Direct tests of the warmup-exclusion helper, isolated from
    holdout_protocol_report() so the slicing logic itself is verifiable
    without needing a full backtest run shaped just right."""

    def _run_result(self, curve, rebalance_log):
        return {"equity_curve": curve, "rebalance_log": rebalance_log, "cost_bps": 20, "lot_size": None}

    def test_excludes_warmup_trades_from_trade_count(self):
        curve = [("2024-01-01", 1_000_000), ("2024-01-02", 1_050_000), ("2024-01-03", 1_060_000)]
        rebalance_log = [{"date": "2024-01-01", "trades": 3}, {"date": "2024-01-03", "trades": 2}]
        result = _evaluation_window_result(self._run_result(curve, rebalance_log),
                                            window_start_iso="2024-01-02", window_end_iso="2024-01-03")
        self.assertEqual(result["trades"], 2)  # only the 01-03 event, not the warmup-dated 01-01 one

    def test_start_value_is_window_start_not_original_capital(self):
        curve = [("2024-01-01", 1_000_000), ("2024-01-02", 1_200_000), ("2024-01-03", 1_260_000)]
        result = _evaluation_window_result(self._run_result(curve, []),
                                            window_start_iso="2024-01-02", window_end_iso="2024-01-03")
        self.assertEqual(result["start_value"], 1_200_000)
        self.assertEqual(result["return_pct"], round((1_260_000 / 1_200_000 - 1) * 100, 2))

    def test_returns_none_when_window_too_short(self):
        curve = [("2024-01-01", 1_000_000), ("2024-01-02", 1_050_000)]
        result = _evaluation_window_result(self._run_result(curve, []),
                                            window_start_iso="2024-01-05", window_end_iso="2024-01-06")
        self.assertIsNone(result)

    def test_single_observation_in_window_returns_none(self):
        curve = [("2024-01-01", 1_000_000), ("2024-01-02", 1_050_000)]
        result = _evaluation_window_result(self._run_result(curve, []),
                                            window_start_iso="2024-01-02", window_end_iso="2024-01-02")
        self.assertIsNone(result)

    def test_statistical_power_note_present(self):
        prices = multi_ticker_uptrend()
        report = holdout_protocol_report(prices, lookback=60, max_names=2, cost_bps=20)
        self.assertIsInstance(report["statistical_power_note"], str)
        self.assertGreater(len(report["statistical_power_note"]), 0)


if __name__ == "__main__":
    unittest.main()
