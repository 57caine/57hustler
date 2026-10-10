# Phase 3: SBI S-Kabu (単元未満株, 1-share) model and lot-size comparison (2026-10-08)

Follows Phase 2 (`ROBUSTNESS_AUDIT.md`), where the 100-share-lot model brought the
owner's local run down to +1.28%. Phase 3 adds a 1-share model matching SBI
Securities' S-Kabu service and compares it against the existing fractional-share
and 100-share-lot models, plus the buy-and-hold baseline — same local-only, no
network, no brokerage, no `main` merge rules as before.

## 1. SBI S-Kabu rules used, and how they were sourced

This sandbox's egress policy blocks fetching `sbisec.co.jp` directly (confirmed
via the agent-proxy's status log — the same restriction already hit against
`jpx-jquants.com`/`api.jquants.com` earlier in this project). The rules below
were therefore **confirmed via web search of SBI's own official domain**
(`sbisec.co.jp` / `search.sbisec.co.jp`), not by directly reading the page from
this environment. **Re-verify against the official page —
`https://search.sbisec.co.jp/v2/popwin/attention/trading/stock_07.html` — before
relying on this for a real decision.**

- Market orders only: no limit price, no order duration.
- Four order-time windows determine execution (current timing, after TSE's 2024
  trading-hours extension moved the cutoff from 13:30 to 14:00):
  - `00:00–07:00` → that day's morning-session **opening** price
  - `07:00–10:30` → that day's afternoon-session **opening** price
  - `10:30–14:00` → that day's afternoon-session **closing** price
  - `14:00–24:00` → the next business day's morning-session opening price
  - An order unfilled at its opening-price session rolls to that day's
    closing-price session; one still unfilled there expires. A stop-priced
    ("ストップ配分") close allocates no S-Kabu orders at all.
- Trading unit is **1 share**, not the usual 100-share lot.
- Under SBI's "Zero Revolution" program (net-trading course + paperless
  statement delivery), S-Kabu commission **and spread are both zero**. This is
  SBI-specific — a comparably-named service at another broker (e.g. Rakuten's
  "Kabu Mini") has been reported to still carry a spread even when
  commission-free.

## 2. What is modeled, and what is explicitly NOT (avoiding impossible trades)

This project's data is **daily adjusted close only** — there is no intraday
opening-price data anywhere in these CSVs, and none was fetched for this task
(no network calls were made; `fetch_jquants.py` is unchanged).

- **Modeled:** only the `10:30–14:00 → same-day closing price` bucket. A
  decision made after a prior day's close and placed the next morning
  plausibly falls in the `07:00–14:00` range; closing-price execution is the
  one bucket in that range this data can actually support, and it matches how
  `backtest.run()` already executes (next observed trading day's close) — so
  reusing it introduces no new lookahead.
- **Not modeled, stated explicitly rather than hidden:** the three
  opening-price buckets, the roll-to-close/expiry mechanics, and
  stop-allocation non-execution. Reconstructing any of those would require
  inventing intraday prices this project does not have — that would be
  simulating a trade this data cannot actually prove was possible, which the
  task explicitly rules out.

## 3. The four models compared (`skabu_model.py`)

All four — and the buy-and-hold baseline — run with the **same** `lookback` and
`max_names`; nothing is tuned per model.

| Model | `lot_size` | `cost_bps` | What it represents |
|---|---|---|---|
| `fractional_shares` | `None` | 20 (configurable) | Phase 1's original research-only model, unchanged |
| `lot_100_shares` | 100 | 20 (configurable) | Phase 2's realistic standard-lot model, unchanged |
| `skabu_1_share_zero_cost` | 1 | **0** (official) | S-Kabu with its actual, officially-sourced zero commission/spread |
| `skabu_1_share_same_cost_as_lots` | 1 | 20 (configurable) | **Sensitivity row**: the same 1-share model, but charged the same generic friction as the other two, to show how much of any S-Kabu advantage is simply "zero cost" rather than "finer-grained sizing" |

`buy_and_hold_equal_weight` (Phase 2's baseline, same 10 symbols, no
rebalancing) and `cash` are included unchanged for reference.

## 4. Overfitting guard (why this isn't just picking the model that wins)

- Every model shares the same `lookback`/`max_names` — none was searched or
  adjusted to produce a better number for any one of them.
- The `skabu_1_share_same_cost_as_lots` row exists specifically so that an
  S-Kabu result that looks better than the 100-share model cannot be silently
  attributed to finer position sizing when it's actually (partly or wholly) the
  zero-cost assumption — the same strategy at the same cost as the other models
  is reported right next to the zero-cost version.
- All of Phase 2's standing caveats (short ~2-year sample, survivorship/
  selection bias in how the 10 symbols were chosen, unverified dividend
  adjustment) apply unchanged here — see `ROBUSTNESS_AUDIT.md`. Phase 3 does not
  re-tune the strategy's own parameters against this comparison; it only adds a
  different execution/lot-size assumption to the same signal.

## 5. Monthly P&L, max drawdown, trade count

Every model's entry in `skabu_report.py`'s output includes `result.trades`,
`result.max_drawdown_pct`, and a `monthly_returns` list (last-observation-of-
month-over-month %, from `metrics.py`, same definitions as Phase 2) plus
`drawdown_episodes`. The raw `equity_curve`/`final_positions` are stripped from
the JSON for compactness, same convention as Phase 2's `report.py`.

## 6. Running this on your Mac

```bash
cd /path/to/57hustler/research/stocks

# 1) Run the full test suite (97 tests as of Phase 3; standard library only,
#    no network, no key).
python3 -m unittest discover -v

# 2) Compare the four lot models + buy-and-hold on your existing local CSV.
python3 skabu_report.py ~/Desktop/stock-research-all10/adjusted_prices.csv \
  --lookback 126 --max-names 5 --comparison-cost-bps 20 \
  --out ~/Desktop/stock-research-all10/skabu_comparison.json
```

`skabu_comparison.json` is written locally only and contains no raw per-day
price series — only the summary figures, monthly returns, drawdown episodes,
and caveats described above.
