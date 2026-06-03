"""
Step 1: ネタ収集スクリプト (fetch_news.py)
=========================================
RSS / Google News / 手動メモから本日のネタを1件ピックアップし
sources/today_topic.json に保存する。

【カスタマイズ箇所】
  - PRIORITY_WORDS : スコアリングで優先するキーワード
  - RSS_URLS       : .env で設定（複数URLをカンマ区切り）
  - NEWS_KEYWORDS  : .env で設定（Google News の検索ワード）
  - 手動ネタ       : sources/manual/*.txt に .txt ファイルを置くだけで読み込まれる
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

# ★ カスタマイズ: スコアが高い順にネタを選ぶ優先キーワード
#    自分の発信テーマに合わせて追加・変更してください
PRIORITY_WORDS = [
    "AI", "ChatGPT", "Claude", "GPT",
    "自動化", "副業", "効率化", "生産性",
    "ノーコード", "フリーランス", "副収入",
]


def fetch_rss(urls: list[str]) -> list[dict]:
    """指定したRSSフィードから最新記事を取得する。"""
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
    """Google News RSS でキーワード検索し記事を取得する。"""
    items = []
    for kw in keywords:
        url = (
            f"https://news.google.com/rss/search"
            f"?q={requests.utils.quote(kw)}&hl=ja&gl=JP&ceid=JP:ja"
        )
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
    """sources/manual/*.txt に置いたテキストファイルをネタとして読み込む。"""
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
    """
    PRIORITY_WORDS に基づいてスコアリングし、最も関連性の高いネタを1件選ぶ。
    ★ カスタマイズ: PRIORITY_WORDS を変更することでネタ選びの基準を調整できる
    """
    def score(item: dict) -> int:
        text = (item.get("title", "") + " " + item.get("summary", "")).lower()
        return sum(1 for w in PRIORITY_WORDS if w.lower() in text)

    return max(items, key=score) if items else {}


def _clean(html: str) -> str:
    """HTMLタグを除去し、最大400文字に切り詰める。"""
    return re.sub(r"<[^>]+>", "", html).strip()[:400]


def main() -> dict:
    # .env の RSS_URLS / NEWS_KEYWORDS を読み込む
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
