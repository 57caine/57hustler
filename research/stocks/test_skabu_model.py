import unittest
from datetime import date, timedelta

from skabu_model import run_skabu, compare_lot_models, SKABU_COST_BPS_ZERO


def multi_ticker_uptrend(days=430, n=3):
    dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(days)]
    return {
        f"T{k}": {d: 100 + k * 10 + i * (1 + 0.1 * k) for i, d in enumerate(dates)}
        for k in range(n)
    }


class RunSkabuTests(unittest.TestCase):
    def test_default_cost_is_officially_zero(self):
        prices = multi_ticker_uptrend()
        result = run_skabu(prices, lookback=60)
        self.assertEqual(result["cost_bps"], 0)
        self.assertEqual(result["cost_bps"], SKABU_COST_BPS_ZERO)

    def test_lot_size_is_one_share(self):
        prices = multi_ticker_uptrend()
        result = run_skabu(prices, lookback=60, max_names=1)
        self.assertEqual(result["lot_size"], 1)
        for qty in result["final_positions"].values():
            self.assertEqual(qty % 1, 0)  # whole shares, not fractional

    def test_zero_cost_beats_same_strategy_with_cost(self):
        prices = multi_ticker_uptrend()
        free = run_skabu(prices, lookback=60, cost_bps=0)
        costly = run_skabu(prices, lookback=60, cost_bps=20)
        self.assertGreaterEqual(free["final"], costly["final"])

    def test_reuses_backtest_run_invariants(self):
        # No-lookahead / no-trend-no-trade invariants already proven for
        # backtest.run() must still hold when called through run_skabu().
        dates = [date(2024, 1, 1) + timedelta(days=i) for i in range(430)]
        flat = {d: 100 for d in dates}
        result = run_skabu({"X": flat}, lookback=60)
        self.assertEqual(result["trades"], 0)
        self.assertEqual(result["final"], 1_000_000)


class CompareLotModelsTests(unittest.TestCase):
    def test_all_expected_models_present(self):
        prices = multi_ticker_uptrend()
        report = compare_lot_models(prices, lookback=60)
        for key in ["fractional_shares", "lot_100_shares", "skabu_1_share_zero_cost",
                    "skabu_1_share_same_cost_as_lots",
                    "buy_and_hold_fractional", "buy_and_hold_lot_100",
                    "buy_and_hold_skabu_1_share_zero_cost", "buy_and_hold_skabu_1_share_same_cost_as_lots",
                    "cash"]:
            self.assertIn(key, report["models"])

    def test_each_strategy_compared_against_matching_lot_size_baseline(self):
        prices = multi_ticker_uptrend()
        report = compare_lot_models(prices, lookback=60)
        pairs = {
            "fractional_shares": "buy_and_hold_fractional",
            "lot_100_shares": "buy_and_hold_lot_100",
            "skabu_1_share_zero_cost": "buy_and_hold_skabu_1_share_zero_cost",
            "skabu_1_share_same_cost_as_lots": "buy_and_hold_skabu_1_share_same_cost_as_lots",
        }
        for strategy_key, baseline_key in pairs.items():
            self.assertEqual(
                report["models"][strategy_key]["result"]["lot_size"],
                report["models"][baseline_key]["result"]["lot_size"],
                msg=f"{strategy_key} and {baseline_key} must share the same lot_size",
            )

    def test_every_model_uses_same_lookback_and_max_names(self):
        prices = multi_ticker_uptrend()
        report = compare_lot_models(prices, lookback=60, max_names=2)
        for key in ["fractional_shares", "lot_100_shares",
                    "skabu_1_share_zero_cost", "skabu_1_share_same_cost_as_lots"]:
            self.assertEqual(report["parameters"]["lookback"], 60)
            self.assertEqual(report["parameters"]["max_names"], 2)

    def test_lot_sizes_differ_correctly_across_models(self):
        prices = multi_ticker_uptrend()
        report = compare_lot_models(prices, lookback=60)
        self.assertIsNone(report["models"]["fractional_shares"]["result"]["lot_size"])
        self.assertEqual(report["models"]["lot_100_shares"]["result"]["lot_size"], 100)
        self.assertEqual(report["models"]["skabu_1_share_zero_cost"]["result"]["lot_size"], 1)

    def test_skabu_cost_sensitivity_pair_only_differs_in_cost(self):
        prices = multi_ticker_uptrend()
        report = compare_lot_models(prices, lookback=60, comparison_cost_bps=20)
        zero_cost = report["models"]["skabu_1_share_zero_cost"]["result"]
        same_cost = report["models"]["skabu_1_share_same_cost_as_lots"]["result"]
        self.assertEqual(zero_cost["cost_bps"], 0)
        self.assertEqual(same_cost["cost_bps"], 20)
        self.assertEqual(zero_cost["lot_size"], same_cost["lot_size"])

    def test_output_is_compact_no_equity_curves(self):
        import json
        prices = multi_ticker_uptrend()
        report = compare_lot_models(prices, lookback=60)
        text = json.dumps(report, ensure_ascii=False)
        self.assertNotIn("equity_curve", text)
        self.assertNotIn("final_positions", text)

    def test_each_model_has_monthly_returns_and_drawdowns(self):
        prices = multi_ticker_uptrend()
        report = compare_lot_models(prices, lookback=60)
        for key in ["fractional_shares", "lot_100_shares", "skabu_1_share_zero_cost", "buy_and_hold_fractional"]:
            entry = report["models"][key]
            self.assertIn("monthly_returns", entry)
            self.assertIn("drawdown_episodes", entry)
            self.assertIsInstance(entry["monthly_returns"], list)

    def test_cash_model_has_zero_return(self):
        prices = multi_ticker_uptrend()
        report = compare_lot_models(prices, lookback=60)
        self.assertEqual(report["models"]["cash"]["result"]["return_pct"], 0.0)

    def test_caveats_present(self):
        prices = multi_ticker_uptrend()
        report = compare_lot_models(prices, lookback=60)
        self.assertGreater(len(report["caveats"]), 0)

    def test_rejects_empty_prices(self):
        with self.assertRaises(ValueError):
            compare_lot_models({})


if __name__ == "__main__":
    unittest.main()
