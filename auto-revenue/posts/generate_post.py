"""
Step 2: 投稿文生成＆アフィリエイト紐付けスクリプト
sources/today_topic.json を読み込み、CLAUDE.md の世界観・口調に従って
Claude API で SNS 投稿文を生成し posts/draft/ に保存する。
"""

import json
import os
import random
import re
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

import anthropic
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

JST = timezone(timedelta(hours=9))
BASE_DIR = Path(__file__).parent.parent
TOPIC_FILE = BASE_DIR / "sources" / "today_topic.json"
AFFILIATES_FILE = BASE_DIR / "affiliates" / "affiliates.json"
CLAUDE_MD = BASE_DIR / "CLAUDE.md"
DRAFT_DIR = BASE_DIR / "posts" / "draft"
DRAFT_DIR.mkdir(parents=True, exist_ok=True)

SYSTEM_PROMPT = """
あなたはSNS運用の専門家です。以下の運用方針を厳格に守って投稿文を生成してください。

【世界観】
AIツール活用・ビジネス自動化・副業ノウハウ・生産性向上に特化したアカウント。

【ターゲット】
20〜40代のビジネスパーソン・個人事業主・副業で効率的に稼ぎたい人。

【口調・方針】
- 丁寧で信頼性の高いトーン（馴れ馴れしくせず、でも堅すぎない）
- 抽象論ではなく、今日から使える実用的な内容
- ステップ（番号付き手順）・ツール名・数値を必ず入れる
- 1投稿＝1テーマ。詰め込みすぎない

【文字数】140〜280文字（URLは含まない）

【フォーマット】
1行目: キャッチーな書き出し（疑問形 or 数字入り）
本文: ステップ or ポイントを列挙
末尾: 行動を促す一言
※ハッシュタグは末尾に2〜3個
""".strip()


def load_topic() -> dict:
    if not TOPIC_FILE.exists():
        print("[ERROR] today_topic.json not found. Run fetch_news.py first.", file=sys.stderr)
        sys.exit(1)
    return json.loads(TOPIC_FILE.read_text(encoding="utf-8"))


def load_affiliates() -> list[dict]:
    if not AFFILIATES_FILE.exists():
        return []
    return json.loads(AFFILIATES_FILE.read_text(encoding="utf-8"))


def pick_affiliate(topic: dict, affiliates: list[dict]) -> dict | None:
    """トピックのキーワードに最もマッチするアフィリエイト案件を選ぶ。"""
    if not affiliates:
        return None
    title = (topic.get("title", "") + " " + topic.get("summary", "")).lower()
    scored = []
    for aff in affiliates:
        if aff.get("affiliate_url", "#") == "#":
            continue
        score = sum(1 for tag in aff.get("tags", []) if tag.lower() in title)
        scored.append((score, aff))
    scored.sort(key=lambda x: x[0], reverse=True)
    return scored[0][1] if scored and scored[0][0] > 0 else (affiliates[0] if affiliates else None)


def generate_post(topic: dict) -> str:
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    user_msg = f"""
以下のニュース・トピックを元に、SNS投稿文を1件生成してください。

【トピックタイトル】
{topic.get('title', '')}

【要約】
{topic.get('summary', '')}

【出典】
{topic.get('source', '')}

投稿文のみを出力してください（説明・コメント不要）。
""".strip()

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
    )
    return message.content[0].text.strip()


def attach_affiliate(post_body: str, aff: dict | None) -> tuple[str, str]:
    """
    メイン投稿文とアフィリエイトツリー（2枚目想定）を返す。
    aff が None の場合はツリーなし。
    """
    if not aff:
        return post_body, ""

    tree = (
        f"{aff['description']}\n\n"
        f"{aff['cta']}\n"
        f"{aff['affiliate_url']}"
    )
    return post_body, tree


def save_draft(topic: dict, post_body: str, tree: str, aff: dict | None) -> Path:
    now = datetime.now(JST)
    slug = re.sub(r"[^\w\-]", "-", topic.get("title", "post"))[:40]
    filename = DRAFT_DIR / f"{now.strftime('%Y-%m-%d_%H%M')}_{slug}.md"

    content = f"""---
date: {now.strftime('%Y-%m-%d')}
platform: twitter
affiliate: {aff['id'] if aff else 'none'}
status: draft
source_url: {topic.get('url', '')}
---

{post_body}
"""
    if tree:
        content += f"\n---\n<!-- ツリー2枚目 -->\n{tree}\n"

    filename.write_text(content, encoding="utf-8")
    return filename


def main() -> Path:
    topic = load_topic()
    affiliates = load_affiliates()
    aff = pick_affiliate(topic, affiliates)

    print(f"Generating post for: {topic.get('title', '')}")
    post_body = generate_post(topic)
    post_body, tree = attach_affiliate(post_body, aff)

    path = save_draft(topic, post_body, tree, aff)
    print(f"[OK] Draft saved: {path.name}")
    print(f"\n--- PREVIEW ---\n{post_body}")
    if tree:
        print(f"\n--- TREE (2nd post) ---\n{tree}")
    return path


if __name__ == "__main__":
    main()
