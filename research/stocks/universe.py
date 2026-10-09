"""Phase 5 Priority 1: point-in-time universe construction.

Avoids hindsight universe selection: a strategy must only use information
that was actually knowable AS OF each decision date (listing status,
sector/category membership, corporate actions, delistings, and price
availability) -- never a present-day ticker list projected backward in
time and called "the universe."

HARD LIMITATION, stated explicitly rather than hidden: this project's
actual local data (adjusted_prices.csv, 10 hand-picked symbols) carries NO
point-in-time metadata of this kind -- those 10 symbols are themselves a
present-day-selected survivor set with an unverified selection process.
This module cannot retroactively make the existing Phase 1-4 analysis
survivorship-bias-free; see bias_status() below and
PHASE5_UNBIASED_VALIDATION.md. What this module DOES provide: a reusable
schema, validator, and point-in-time universe builder, exercised here only
against synthetic fixtures (see test_universe.py), so the mechanics exist
and are tested if/when real point-in-time metadata is ever supplied. No
real metadata is fetched, invented, or required by anything in this phase.
"""
from datetime import date

REQUIRED_EVENT_FIELDS = {"ticker", "event_type", "effective_date"}
VALID_EVENT_TYPES = {
    "listed", "delisted", "sector_set", "corporate_action",
    "price_available", "price_unavailable",
}


def validate_metadata_schema(events):
    """events: list of dicts, each describing one point-in-time event.

    Required fields: ticker (non-empty str), event_type (one of
    VALID_EVENT_TYPES), effective_date (a date object -- the date the
    event's information was actually KNOWABLE, not merely the date the
    event itself is dated to describe; e.g. a delisting announced on day T
    but effective on day T+30 should generally use T as effective_date here
    to avoid lookahead). This module cannot by itself detect which day a
    caller meant -- that discipline is the caller's responsibility and is
    documented here as a real limitation, not silently assumed correct.

    Raises ValueError on any schema violation; returns the validated list
    unchanged on success."""
    if not isinstance(events, list) or not events:
        raise ValueError("events must be a non-empty list")
    for i, e in enumerate(events):
        if not isinstance(e, dict):
            raise ValueError(f"event {i} is not a dict")
        missing = REQUIRED_EVENT_FIELDS - e.keys()
        if missing:
            raise ValueError(f"event {i} missing required fields: {sorted(missing)}")
        if not isinstance(e["ticker"], str) or not e["ticker"]:
            raise ValueError(f"event {i} has an invalid ticker")
        if e["event_type"] not in VALID_EVENT_TYPES:
            raise ValueError(f"event {i} has an unknown event_type {e['event_type']!r}")
        if not isinstance(e["effective_date"], date):
            raise ValueError(f"event {i} effective_date must be a date object")
    return events


def build_point_in_time_universe(events, as_of_date, sector=None):
    """The sorted list of tickers considered IN the universe as of
    as_of_date, using ONLY events whose effective_date <= as_of_date --
    anything dated after as_of_date is excluded BY CONSTRUCTION, so no
    future information (a delisting or sector change not yet knowable on
    as_of_date) can leak into the selection.

    A ticker is included only if its most recent status-defining event as
    of that date says 'listed' (not 'delisted'), and its most recent
    availability event (if any) does not say 'price_unavailable'. If
    `sector` is given, its most recent 'sector_set' event as of that date
    must also match."""
    events = validate_metadata_schema(events)
    if not isinstance(as_of_date, date):
        raise ValueError("as_of_date must be a date object")

    knowable = [e for e in events if e["effective_date"] <= as_of_date]
    by_ticker = {}
    for e in knowable:
        by_ticker.setdefault(e["ticker"], []).append(e)

    universe = []
    for ticker, evs in by_ticker.items():
        evs_sorted = sorted(evs, key=lambda e: e["effective_date"])
        status = None
        price_ok = True
        current_sector = None
        for e in evs_sorted:
            if e["event_type"] in ("listed", "delisted"):
                status = e["event_type"]
            elif e["event_type"] in ("price_available", "price_unavailable"):
                price_ok = e["event_type"] == "price_available"
            elif e["event_type"] == "sector_set":
                current_sector = e.get("sector")
        if status != "listed":
            continue
        if not price_ok:
            continue
        if sector is not None and current_sector != sector:
            continue
        universe.append(ticker)
    return sorted(universe)


def bias_status(has_point_in_time_metadata):
    """Explicit, non-fabricated statement of whether survivorship-bias-free
    validation is actually possible given what data exists right now.
    Never substitutes a present-day ticker list and silently calls the
    result unbiased -- see module docstring."""
    if has_point_in_time_metadata:
        return {
            "bias_unresolved": False,
            "data_required": [],
            "note": "Point-in-time metadata was supplied; universe construction used only "
                    "information knowable as of each decision date.",
        }
    return {
        "bias_unresolved": True,
        "data_required": [
            "point-in-time listing status per ticker (listed/delisted dates, as KNOWN at the time)",
            "point-in-time sector/category membership",
            "corporate-action history (splits, name changes, mergers)",
            "a selection process for which tickers enter/leave the tracked universe, "
            "independent of their subsequent performance",
        ],
        "note": "This project's current local data (adjusted_prices.csv, 10 hand-picked "
                "symbols) carries NONE of the above -- the 10 symbols are themselves a "
                "present-day-selected survivor set with an unverified selection process. "
                "Survivorship-bias-free validation is NOT POSSIBLE with current data. "
                "This is stated plainly rather than worked around by substituting a "
                "present-day ticker list and calling it unbiased.",
    }
