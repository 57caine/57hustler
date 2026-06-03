"""
Step 3: スケジュール登録＆X API 投稿スクリプト
posts/draft/ の最新ファイルを読み込み、X API で投稿し
schedule.md に記録、ファイルを published/ に移動する。
"""

import os
import re
import sys
import shutil
from datetime import datetime, timezone, timedelta
from pathlib import Path

import tweepy
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

JST = timezone(timedelta(hours=9))
BASE_DIR = Path(__file__).parent
DRAFT_DIR = BASE_DIR / "posts" / "draft"
PUBLISHED_DIR = BASE_DIR / "posts" / "published"
SCHEDULE_MD = BASE_DIR / "schedule.md"
PUBLISHED_DIR.mkdir(parents=True, exist_ok=True)


def get_latest_draft() -> Path | None:
    drafts = sorted(DRAFT_DIR.glob("*.md"), reverse=True)
    return drafts[0] if drafts else None


def parse_draft(path: Path) -> dict:
    """frontmatter と本文を分離して返す。"""
    text = path.read_text(encoding="utf-8")
    meta = {}
    body_lines = []
    tree_lines = []

    in_front = False
    in_tree = False
    after_front = False

    for line in text.splitlines():
        if line.strip() == "---" and not after_front:
            in_front = not in_front
            if not in_front:
                after_front = True
            continue
        if in_front:
            if ":" in line:
                k, _, v = line.partition(":")
                meta[k.strip()] = v.strip()
            continue
        if line.strip() == "---":
            in_tree = True
            continue
        if in_tree:
            tree_lines.append(line)
        else:
            body_lines.append(line)

    return {
        "meta": meta,
        "body": "\n".join(body_lines).strip(),
        "tree": "\n".join(tree_lines).strip(),
    }


def post_to_x(body: str, tree: str) -> str:
    """X API v2 でツイート（ツリーがあれば返信として投稿）。投稿URLを返す。"""
    client = tweepy.Client(
        consumer_key=os.environ["X_API_KEY"],
        consumer_secret=os.environ["X_API_SECRET"],
        access_token=os.environ["X_ACCESS_TOKEN"],
        access_token_secret=os.environ["X_ACCESS_TOKEN_SECRET"],
    )

    resp = client.create_tweet(text=body)
    tweet_id = resp.data["id"]
    tweet_url = f"https://x.com/i/web/status/{tweet_id}"
    print(f"[OK] Posted: {tweet_url}")

    if tree:
        # アフィリエイトツリーを返信として投稿
        tree_body = re.sub(r"<!--.*?-->", "", tree).strip()
        if tree_body:
            client.create_tweet(text=tree_body, in_reply_to_tweet_id=tweet_id)
            print("[OK] Tree posted.")

    return tweet_url


def update_schedule(draft_path: Path, tweet_url: str, meta: dict):
    now = datetime.now(JST).strftime("%Y-%m-%d %H:%M")
    row = f"| {now} | X (Twitter) | {draft_path.stem[:40]} | - | - | {tweet_url} |\n"

    content = SCHEDULE_MD.read_text(encoding="utf-8")
    if "| 日付 |" not in content:
        content += "\n| 日付 | プラットフォーム | 投稿タイトル | クリック数 | 収益 | URL |\n"
        content += "|-----|---------------|------------|---------|-----|-----|\n"
    content += row
    SCHEDULE_MD.write_text(content, encoding="utf-8")


def move_to_published(draft_path: Path, tweet_url: str):
    text = draft_path.read_text(encoding="utf-8")
    text = re.sub(r"(status: )draft", r"\1published", text)
    text = re.sub(r"(url: ).*", f"\\1{tweet_url}", text)
    dest = PUBLISHED_DIR / draft_path.name
    dest.write_text(text, encoding="utf-8")
    draft_path.unlink()
    print(f"[OK] Moved to published: {dest.name}")


def dry_run(draft: dict, draft_path: Path):
    """X API を使わずに投稿内容をプレビューする。"""
    print("\n=== DRY RUN ===")
    print(f"File: {draft_path.name}")
    print(f"\n[TWEET]\n{draft['body']}")
    if draft["tree"]:
        print(f"\n[TREE]\n{draft['tree']}")
    print("===============\n")


def main(dry: bool = False):
    draft_path = get_latest_draft()
    if not draft_path:
        print("[INFO] No draft found. Run generate_post.py first.")
        sys.exit(0)

    draft = parse_draft(draft_path)
    print(f"Target: {draft_path.name}")

    if dry:
        dry_run(draft, draft_path)
        return

    required = ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_TOKEN_SECRET"]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        print(f"[ERROR] Missing env vars: {', '.join(missing)}", file=sys.stderr)
        print("Set them in .env or run with --dry to preview.")
        sys.exit(1)

    tweet_url = post_to_x(draft["body"], draft["tree"])
    update_schedule(draft_path, tweet_url, draft["meta"])
    move_to_published(draft_path, tweet_url)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry", action="store_true", help="投稿せずにプレビューのみ")
    args = parser.parse_args()
    main(dry=args.dry)
