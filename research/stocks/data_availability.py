"""Phase 6: explicit separation of what J-Quants API V2's Free plan can
and cannot supply, so that any point-in-time universe construction work
(universe.py) never silently assumes availability of data this project
does not actually have -- in particular, it must never fabricate or
assume delisted-ticker history to paper over a real gap.

Sourced from this project's own confirmed-via-web-search findings
(DATA_READINESS_REPORT.md, 2026-10-09; direct fetch of jpx-jquants.com is
blocked by this sandbox's egress policy) and DATA_EXECUTION_GATE.md's
existing notes. This module adds no new claims about J-Quants beyond what
those documents already record -- it only organizes them into a
machine-checkable reference.
"""

AVAILABLE_VIA_JQUANTS_FREE = {
    "listed_company_master": (
        "The CURRENT listed-company list (as of the query date) -- NOT a historical, "
        "point-in-time snapshot of who was listed on a past date."
    ),
    "daily_ohlc_equities": (
        "Daily four-value (open/high/low/close) adjusted prices. Roughly 2 years of "
        "history, excluding the most recent ~12 weeks."
    ),
    "financial_summary": "Financial summary figures only, not full financial-statement detail.",
}

NOT_AVAILABLE_VIA_JQUANTS_FREE = {
    "topix_daily_ohlc": (
        "TOPIX daily OHLC is not part of the Free plan; see ROBUSTNESS_AUDIT.md and "
        "baselines.topix_baseline_from_csv()'s not_computed path -- no value is invented."
    ),
    "historical_delisted_company_list": (
        "No endpoint confirmed in this project's research for a POINT-IN-TIME history "
        "of which companies were listed/delisted on past dates -- only the CURRENT "
        "listed-company list is available. A ticker delisted before today would not "
        "appear in that list even if it was legitimately tradeable during part of this "
        "project's backtest window. This is the single biggest reason "
        "universe.bias_status() reports bias_unresolved=True by default: without this "
        "data, a present-day ticker list cannot be verified as a complete historical "
        "universe, and must never be treated as one."
    ),
    "intraday_minute_or_tick_data": (
        "Added to J-Quants V2 in 2026-01, but gated behind paid tiers; the Free plan "
        "remains daily bars only."
    ),
    "point_in_time_sector_or_category_history": (
        "No confirmed source for WHEN a company's sector/category classification "
        "changed historically -- only its current classification, if anything."
    ),
    "csv_bulk_download": "Light plan and above only; the Free plan is per-request API calls only.",
}


def assert_no_delisted_ticker_fabrication(point_in_time_events):
    """Guard against the exact mistake this phase warns against: silently
    treating "every ticker in today's price data" as "every ticker that
    was ever tradeable during the backtest window," which would hide a
    delisted name's absence rather than flag it as a known gap.

    Raises ValueError if point_in_time_events is empty/None -- i.e. if no
    point-in-time listing/delisting history was supplied at all, this
    function refuses to let a caller silently proceed as though a
    present-day ticker list were a safe stand-in for one. The correct
    response in that case is universe.bias_status(has_point_in_time_metadata=False)
    and bias_unresolved=True, not a workaround here.

    Returns True (does not evaluate the events for correctness -- that is
    universe.validate_metadata_schema()'s job) when events were supplied,
    since at that point SOME point-in-time information exists to reason
    about delistings from, even if incomplete."""
    if not point_in_time_events:
        raise ValueError(
            "no point-in-time listing/delisting history was supplied -- J-Quants Free only "
            "exposes the CURRENT listed-company list (see "
            "NOT_AVAILABLE_VIA_JQUANTS_FREE['historical_delisted_company_list']), so a "
            "present-day ticker list must never be treated as a complete historical universe. "
            "Call universe.bias_status(has_point_in_time_metadata=False) and report "
            "bias_unresolved=True instead of proceeding."
        )
    return True
