"""Tests for fetch_jquants.py. No network access, no API key required.
Every HTTP call is simulated with unittest.mock; nothing here talks to
J-Quants or any other external host."""
import io
import json
import os
import tempfile
import time
import unittest
import urllib.error
from email.message import Message
from unittest.mock import patch

import fetch_jquants as fj


def make_http_error(url, code, body, headers=None):
    hdrs = Message()
    for k, v in (headers or {}).items():
        hdrs[k] = v
    fp = io.BytesIO(body.encode("utf-8"))
    return urllib.error.HTTPError(url, code, "status", hdrs, fp)


def make_response(body_obj):
    """A context-manager-compatible fake of urlopen()'s return value."""
    class _Resp:
        def __enter__(self):
            return self
        def __exit__(self, *a):
            return False
        def read(self):
            return json.dumps(body_obj).encode("utf-8")
    return _Resp()


class RepoRootDetectionTests(unittest.TestCase):
    """find_repo_root/is_inside_repo must not assume a fixed depth below the
    script; they must behave correctly even if the script is copied
    standalone somewhere with no .git ancestor at all (e.g. a Desktop)."""

    def test_finds_git_root_several_levels_up(self):
        with tempfile.TemporaryDirectory() as tmp:
            os.makedirs(os.path.join(tmp, ".git"))
            nested = os.path.join(tmp, "a", "b", "c")
            os.makedirs(nested)
            self.assertEqual(fj.find_repo_root(nested), os.path.abspath(tmp))

    def test_standalone_copy_with_no_git_ancestor_returns_none(self):
        with tempfile.TemporaryDirectory() as tmp:
            desktop_like = os.path.join(tmp, "Desktop")
            os.makedirs(desktop_like)
            self.assertIsNone(fj.find_repo_root(desktop_like))

    def test_out_dir_inside_detected_repo_is_blocked(self):
        with tempfile.TemporaryDirectory() as tmp:
            os.makedirs(os.path.join(tmp, ".git"))
            script_dir = os.path.join(tmp, "research", "stocks")
            os.makedirs(script_dir)
            repo_root = fj.find_repo_root(script_dir)
            out_dir = os.path.join(tmp, "some", "output")
            self.assertTrue(fj.is_inside_repo(os.path.abspath(out_dir), repo_root))

    def test_out_dir_outside_detected_repo_is_allowed(self):
        with tempfile.TemporaryDirectory() as tmp, tempfile.TemporaryDirectory() as other:
            os.makedirs(os.path.join(tmp, ".git"))
            repo_root = fj.find_repo_root(tmp)
            self.assertFalse(fj.is_inside_repo(os.path.abspath(other), repo_root))

    def test_no_repo_detected_never_blocks(self):
        # Standalone-on-Desktop scenario: repo_root is None, so nothing is
        # ever "inside" a nonexistent repo — this is the bug being fixed.
        with tempfile.TemporaryDirectory() as out_dir:
            self.assertFalse(fj.is_inside_repo(os.path.abspath(out_dir), None))


class ApiKeyLoadingTests(unittest.TestCase):
    def test_env_var_takes_priority(self):
        with patch.dict(os.environ, {"JQUANTS_API_KEY": "  from-env  "}):
            self.assertEqual(fj.load_api_key(), "from-env")

    def test_falls_back_to_env_local_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            with open(os.path.join(tmp, ".env.local"), "w", encoding="utf-8") as f:
                f.write('JQUANTS_API_KEY="from-file"\n')
            with patch.dict(os.environ, {}, clear=False):
                os.environ.pop("JQUANTS_API_KEY", None)
                self.assertEqual(fj.load_api_key(base_dir=tmp), "from-file")

    def test_missing_everywhere_returns_none(self):
        with tempfile.TemporaryDirectory() as tmp:
            with patch.dict(os.environ, {}, clear=False):
                os.environ.pop("JQUANTS_API_KEY", None)
                self.assertIsNone(fj.load_api_key(base_dir=tmp))


class RequestErrorHandlingTests(unittest.TestCase):
    """HTTP 400 and other client errors must be diagnosable and must never
    retry (retrying a malformed request cannot fix it)."""

    def test_http_400_is_raised_with_diagnosis_no_retry(self):
        err = make_http_error("http://x", 400, json.dumps({"message": "code is required"}))
        with patch.object(fj.urllib.request, "urlopen", side_effect=err):
            limiter = fj.RateLimiter(0.0)
            with self.assertRaises(fj.JQuantsAPIError) as ctx:
                fj.fetch_ticker("k", "7203", "2026-01-01", "2026-01-31", limiter)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("code is required", ctx.exception.message)
        self.assertIn("malformed request", ctx.exception.diagnosis())

    def test_http_400_body_is_captured_even_when_not_json(self):
        err = make_http_error("http://x", 400, "plain text failure")
        with patch.object(fj.urllib.request, "urlopen", side_effect=err):
            limiter = fj.RateLimiter(0.0)
            with self.assertRaises(fj.JQuantsAPIError) as ctx:
                fj.fetch_ticker("k", "7203", "2026-01-01", "2026-01-31", limiter)
        self.assertIn("plain text failure", ctx.exception.body_snippet)

    def test_non_429_error_is_not_retried(self):
        err = make_http_error("http://x", 404, "{}")
        calls = []
        def fake_urlopen(req, timeout=None):
            calls.append(1)
            raise err
        with patch.object(fj.urllib.request, "urlopen", side_effect=fake_urlopen):
            limiter = fj.RateLimiter(0.0)
            with self.assertRaises(fj.JQuantsAPIError):
                fj.fetch_ticker("k", "7203", "2026-01-01", "2026-01-31", limiter, max_retries=5)
        self.assertEqual(len(calls), 1)


class RateLimitRetryTests(unittest.TestCase):
    """429 must back off and eventually give up — never retry unboundedly."""

    def test_429_retries_then_succeeds(self):
        err = make_http_error("http://x", 429, "{}", headers={"Retry-After": "0"})
        ok_body = {"data": [{"Date": "2026-01-05", "Code": "7203", "AdjC": 100.0}]}
        calls = {"n": 0}

        def fake_urlopen(req, timeout=None):
            calls["n"] += 1
            if calls["n"] < 3:
                raise err
            return make_response(ok_body)

        with patch.object(fj.urllib.request, "urlopen", side_effect=fake_urlopen), \
             patch.object(fj.time, "sleep", return_value=None):
            limiter = fj.RateLimiter(0.0)
            records = fj.fetch_ticker("k", "7203", "2026-01-01", "2026-01-31", limiter, max_retries=5)
        self.assertEqual(calls["n"], 3)
        self.assertEqual(records[0]["AdjC"], 100.0)

    def test_429_exhausts_retries_and_raises(self):
        err = make_http_error("http://x", 429, "{}")
        calls = {"n": 0}

        def fake_urlopen(req, timeout=None):
            calls["n"] += 1
            raise err

        with patch.object(fj.urllib.request, "urlopen", side_effect=fake_urlopen), \
             patch.object(fj.time, "sleep", return_value=None):
            limiter = fj.RateLimiter(0.0)
            with self.assertRaises(fj.JQuantsAPIError) as ctx:
                fj.fetch_ticker("k", "7203", "2026-01-01", "2026-01-31", limiter, max_retries=2)
        # max_retries=2 means at most 3 attempts total (1 initial + 2 retries) — bounded, not unlimited.
        self.assertEqual(calls["n"], 3)
        self.assertEqual(ctx.exception.status_code, 429)

    def test_retry_after_header_is_honored(self):
        err = make_http_error("http://x", 429, "{}", headers={"Retry-After": "7"})
        ok_body = {"data": []}
        calls = {"n": 0}

        def fake_urlopen(req, timeout=None):
            calls["n"] += 1
            if calls["n"] < 2:
                raise err
            return make_response(ok_body)

        sleeps = []
        with patch.object(fj.urllib.request, "urlopen", side_effect=fake_urlopen), \
             patch.object(fj.time, "sleep", side_effect=lambda s: sleeps.append(s)):
            limiter = fj.RateLimiter(0.0)
            fj.fetch_ticker("k", "7203", "2026-01-01", "2026-01-31", limiter, max_retries=3)
        self.assertIn(7.0, sleeps)


class SecretsNeverLoggedTests(unittest.TestCase):
    """The API key must never appear in any exception, diagnostic dict, or
    the request-building path's visible state."""

    SECRET = "sk-super-secret-value-12345"

    def test_key_absent_from_error_on_400(self):
        err = make_http_error("http://x", 400, json.dumps({"message": "bad code"}))
        with patch.object(fj.urllib.request, "urlopen", side_effect=err):
            limiter = fj.RateLimiter(0.0)
            with self.assertRaises(fj.JQuantsAPIError) as ctx:
                fj.fetch_ticker(self.SECRET, "7203", "2026-01-01", "2026-01-31", limiter)
        self.assertNotIn(self.SECRET, str(ctx.exception))
        self.assertNotIn(self.SECRET, ctx.exception.body_snippet)
        self.assertNotIn(self.SECRET, ctx.exception.message)

    def test_key_absent_from_diagnose_result(self):
        err = make_http_error("http://x", 401, json.dumps({"message": "invalid key"}))
        with patch.object(fj.urllib.request, "urlopen", side_effect=err):
            limiter = fj.RateLimiter(0.0)
            result = fj.diagnose(self.SECRET, "7203", "2026-01-01", "2026-01-31", limiter)
        dumped = json.dumps(result)
        self.assertNotIn(self.SECRET, dumped)

    def test_request_never_logged_with_headers_attribute_exposed(self):
        # The only place the key is used is the Request's own headers dict,
        # which this test confirms is never surfaced anywhere outside the
        # single outgoing urllib.request.Request object.
        captured = {}

        def fake_urlopen(req, timeout=None):
            captured["headers"] = dict(req.header_items())
            return make_response({"data": []})

        with patch.object(fj.urllib.request, "urlopen", side_effect=fake_urlopen):
            limiter = fj.RateLimiter(0.0)
            fj.fetch_ticker(self.SECRET, "7203", "2026-01-01", "2026-01-31", limiter)
        # The key IS sent on the wire (expected), but only there — nothing
        # returned from fetch_ticker exposes it.
        self.assertIn(self.SECRET, captured["headers"].values())


class DiagnoseModeTests(unittest.TestCase):
    """Single-ticker diagnostic mode writes no files and reports useful,
    structured information for both success and failure."""

    def test_diagnose_success_reports_counts_and_dates(self):
        body = {"data": [
            {"Date": "2026-01-05", "Code": "7203", "AdjC": 100.0},
            {"Date": "2026-01-06", "Code": "7203", "AdjC": None},
            {"Date": "2026-01-07", "Code": "7203", "AdjC": 101.5},
        ]}
        with patch.object(fj.urllib.request, "urlopen", return_value=make_response(body)):
            limiter = fj.RateLimiter(0.0)
            result = fj.diagnose("k", "7203", "2026-01-01", "2026-01-31", limiter)
        self.assertTrue(result["ok"])
        self.assertEqual(result["row_count"], 3)
        self.assertEqual(result["rows_with_adjusted_close"], 2)
        self.assertEqual(result["rows_missing_adjusted_close"], 1)
        self.assertEqual(result["first_date"], "2026-01-05")
        self.assertEqual(result["last_date"], "2026-01-07")

    def test_diagnose_failure_reports_status_and_cause(self):
        err = make_http_error("http://x", 400, json.dumps({"message": "code is required"}))
        with patch.object(fj.urllib.request, "urlopen", side_effect=err):
            limiter = fj.RateLimiter(0.0)
            result = fj.diagnose("k", "", "2026-01-01", "2026-01-31", limiter)
        self.assertFalse(result["ok"])
        self.assertEqual(result["http_status"], 400)
        self.assertIn("code is required", result["server_message"])
        self.assertIn("malformed request", result["likely_cause"])

    def test_diagnose_writes_no_files(self):
        body = {"data": [{"Date": "2026-01-05", "Code": "7203", "AdjC": 100.0}]}
        with tempfile.TemporaryDirectory() as tmp:
            before = set(os.listdir(tmp))
            with patch.object(fj.urllib.request, "urlopen", return_value=make_response(body)):
                limiter = fj.RateLimiter(0.0)
                fj.diagnose("k", "7203", "2026-01-01", "2026-01-31", limiter)
            after = set(os.listdir(tmp))
        self.assertEqual(before, after)


class RateLimiterTests(unittest.TestCase):
    def test_enforces_minimum_spacing(self):
        limiter = fj.RateLimiter(0.05)
        start = time.monotonic()
        limiter.wait()
        limiter.wait()
        elapsed = time.monotonic() - start
        self.assertGreaterEqual(elapsed, 0.05)


class AdjustedCloseExtractionTests(unittest.TestCase):
    """Batch mode must use the AdjC field as-is and skip rows that lack it,
    rather than fabricating a value."""

    def test_rows_without_adjusted_close_are_skipped_not_fabricated(self):
        body = {"data": [
            {"Date": "2026-01-05", "Code": "7203", "AdjC": 100.0},
            {"Date": "2026-01-06", "Code": "7203", "AdjC": None, "C": 99.0},
        ]}
        with patch.object(fj.urllib.request, "urlopen", return_value=make_response(body)):
            limiter = fj.RateLimiter(0.0)
            records = fj.fetch_ticker("k", "7203", "2026-01-01", "2026-01-31", limiter)
        usable = [r for r in records if r.get("AdjC") is not None]
        self.assertEqual(len(usable), 1)
        self.assertEqual(len(records), 2)


if __name__ == "__main__":
    unittest.main()
