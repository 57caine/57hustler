"""
Step 1: ネタ収集スクリプト
RSS / Google News / 手動メモから本日のネタを1件ピックアップし
sources/today_topic.json に保存する。
"""

import json
import os
import re
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

import feedparser
import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

JST = timezone(timedelta(hours=9))
BASE_DIR = Path(__file__).parent
TODAY = datetime.now(JST).strftime("%Y-%m-%d")
OUTPUT_FILE = BASE_DIR / "today_topic.json"
MANUAL_DIR = BASE_DIR / "manual"


def fetch_rss(urls: list[str]) -> list[dict]:
    items = []
    for url in urls:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]:
                items.append({
                    "title": entry.get("title", ""),
                    "url": entry.get("link", ""),
                    "summary": _clean(entry.get("summary", "")),
                    "source": feed.feed.get("title", url),
                    "published": entry.get("published", ""),
                })
        except Exception as e:
            print(f"[WARN] RSS fetch failed ({url}): {e}", file=sys.stderr)
    return items


def fetch_google_news(keywords: list[str]) -> list[dict]:
    items = []
    for kw in keywords:
        url = f"https://news.google.com/rss/search?q={requests.utils.quote(kw)}&hl=ja&gl=JP&ceid=JP:ja"
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:3]:
                items.append({
                    "title": entry.get("title", ""),
                    "url": entry.get("link", ""),
                    "summary": _clean(entry.get("summary", "")),
                    "source": f"Google News: {kw}",
                    "published": entry.get("published", ""),
                })
        except Exception as e:
            print(f"[WARN] Google News fetch failed ({kw}): {e}", file=sys.stderr)
    return items


def fetch_manual_memos() -> list[dict]:
    items = []
    if not MANUAL_DIR.exists():
        return items
    for f in sorted(MANUAL_DIR.glob("*.txt"), reverse=True)[:3]:
        text = f.read_text(encoding="utf-8").strip()
        items.append({
            "title": f.stem,
            "url": "",
            "summary": text[:300],
            "source": "manual",
            "published": f.stat().st_mtime,
        })
    return items


def pick_best(items: list[dict]) -> dict:
    """スコアリング: タイトルに重要キーワードが含まれるものを優先。"""
    priority_words = ["AI", "ChatGPT", "自動化", "副業", "効率", "生産性", "Claude", "GPT"]
    def score(item):
        title = item.get("title", "")
        return sum(1 for w in priority_words if w.lower() in title.lower())
    return max(items, key=score) if items else {}


def _clean(html: str) -> str:
    return re.sub(r"<[^>]+>", "", html).strip()[:400]


def main():
    rss_urls = [u.strip() for u in os.getenv("RSS_URLS", "").split(",") if u.strip()]
    keywords = [k.strip() for k in os.getenv("NEWS_KEYWORDS", "AI自動化,副業").split(",") if k.strip()]

    print("Fetching RSS feeds...")
    items = fetch_rss(rss_urls)
    print(f"Fetching Google News ({keywords})...")
    items += fetch_google_news(keywords)
    print("Loading manual memos...")
    items += fetch_manual_memos()

    if not items:
        print("[ERROR] No items collected.", file=sys.stderr)
        sys.exit(1)

    topic = pick_best(items)
    topic["collected_at"] = TODAY

    OUTPUT_FILE.write_text(json.dumps(topic, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] Topic saved: {topic['title']}")
    return topic


if __name__ == "__main__":
    main()
