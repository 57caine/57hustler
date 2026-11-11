"""Phase 6: a small, git-tracked ledger of OOS (out-of-sample) windows that
have been DESIGNATED or EVALUATED as holdout, so a later verification run
does not silently treat an already-consumed calendar period as still-
untouched data. Contains NO raw prices, equity curves, or fabricated
performance figures -- only period bounds, the manifest hash of the
parameters involved, a status, and bookkeeping metadata.

Two statuses matter for enforcement:
  - "reserved": this window has been DESIGNATED as a holdout test window
    (e.g. agreed on with the owner) but no real result has been reported
    back yet. A reserved window does NOT block a real run against it --
    reserving a window is exactly what lets that one real run happen.
  - "evaluated": a real result (from the owner's own Mac run against real
    data) has actually been reported and recorded here. An evaluated
    window DOES block any later attempt to treat the same calendar period
    as fresh, untouched data -- see assert_window_not_already_evaluated().

Promoting an entry from "reserved" to "evaluated" happens via
record_evaluation(), and must only be called once a real figure has
actually been reported back (e.g. in a future session) -- this module
does not fabricate that promotion on its own, and nothing in this phase
calls record_evaluation() with invented numbers.
"""
import json
import os
from datetime import date, datetime, timedelta, timezone

LEDGER_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "oos_ledger.json")

VALID_STATUSES = {"reserved", "evaluated"}


def load_ledger(path=LEDGER_PATH):
    if not os.path.exists(path):
        return {"entries": []}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_ledger(ledger, path=LEDGER_PATH):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(ledger, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")


def _overlaps(a_start, a_end, b_start, b_end):
    return a_start <= b_end and b_start <= a_end


def find_overlapping_entries(ledger, holdout_start, holdout_end, statuses=None):
    """Entries in the ledger whose [start, end] range overlaps
    [holdout_start, holdout_end]. Pass statuses (an iterable) to restrict
    to entries with one of those statuses; omit it to match any status."""
    out = []
    for e in ledger.get("entries", []):
        if statuses is not None and e["status"] not in statuses:
            continue
        es, ee = date.fromisoformat(e["start"]), date.fromisoformat(e["end"])
        if _overlaps(es, ee, holdout_start, holdout_end):
            out.append(e)
    return out


def assert_window_not_already_evaluated(ledger, holdout_start, holdout_end):
    """Raise if the requested window overlaps an ALREADY-EVALUATED OOS
    window -- the enforcement half of the ledger: a period that already
    produced a real, recorded result must not later be re-treated as
    fresh, untouched data (which would be reusing a consumed holdout, a
    subtle form of look-ahead across sessions/time). Overlap with a
    merely "reserved" entry is NOT raised here -- that is the expected,
    single real run a reservation exists to permit."""
    if not isinstance(holdout_start, date) or not isinstance(holdout_end, date):
        raise ValueError("holdout_start and holdout_end must be date objects")
    overlaps = find_overlapping_entries(ledger, holdout_start, holdout_end, statuses=("evaluated",))
    if overlaps:
        periods = ", ".join(f"[{e['start']}, {e['end']}]" for e in overlaps)
        raise ValueError(
            f"requested OOS window [{holdout_start.isoformat()}, {holdout_end.isoformat()}] overlaps "
            f"{len(overlaps)} already-EVALUATED holdout window(s) ({periods}); treating this as fresh, "
            f"untouched data would be reusing a consumed holdout period -- see oos_ledger.json"
        )


def record_window(ledger, holdout_start, holdout_end, manifest_hash, status, note="", recorded_at=None):
    """Append a new entry (reserved or evaluated) and return the updated
    ledger. Does not mutate the input ledger dict in place."""
    if status not in VALID_STATUSES:
        raise ValueError(f"status must be one of {sorted(VALID_STATUSES)}")
    if not isinstance(holdout_start, date) or not isinstance(holdout_end, date):
        raise ValueError("holdout_start and holdout_end must be date objects")
    if holdout_start > holdout_end:
        raise ValueError("holdout_start must not be after holdout_end")
    entry = {
        "start": holdout_start.isoformat(),
        "end": holdout_end.isoformat(),
        "manifest_hash": manifest_hash,
        "status": status,
        "note": note,
        "recorded_at": recorded_at or datetime.now(timezone.utc).isoformat(),
    }
    return {"entries": ledger.get("entries", []) + [entry]}


def record_evaluation(ledger, holdout_start, holdout_end, manifest_hash, oos_status, note="", recorded_at=None):
    """Promote a window to 'evaluated' once a REAL result has actually
    been reported (never invented here). oos_status is
    preregistration.py's own "validated_with_caveats"/"not_validated"
    string, recorded as part of the note for traceability -- no raw
    prices, equity curves, or P&L figures are stored."""
    full_note = f"oos_status={oos_status}. {note}".strip()
    return record_window(ledger, holdout_start, holdout_end, manifest_hash, "evaluated",
                          note=full_note, recorded_at=recorded_at)


def suggest_next_window_start(ledger, fallback=None):
    """The day after the latest END date among ALL recorded entries
    (reserved or evaluated) -- a mechanical, non-cherry-pickable starting
    point for the NEXT OOS window once new data arrives, so a future
    session does not have to (and should not) eyeball which period "looks
    like a good holdout." Returns `fallback` if the ledger has no entries
    yet (the caller decides what to do with no prior history)."""
    entries = ledger.get("entries", [])
    if not entries:
        return fallback
    latest_end = max(date.fromisoformat(e["end"]) for e in entries)
    return latest_end + timedelta(days=1)
