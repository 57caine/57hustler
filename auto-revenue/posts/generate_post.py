"""
Step 2: 投稿文生成＆アフィリエイト紐付けスクリプト (generate_post.py)
=======================================================================
sources/today_topic.json を読み込み、Claude API で SNS 投稿文を生成し
posts/draft/ に Markdown ファイルとして保存する。

【カスタマイズ箇所】
  - SYSTEM_PROMPT        : 世界観・ターゲット・口調の定義 ★最重要
  - affiliates.json      : アフィリエイト案件の追加・編集
  - attach_affiliate()   : ツリー投稿（2枚目）のフォーマット
"""

import json
import os
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
DRAFT_DIR = BASE_DIR / "posts" / "draft"
DRAFT_DIR.mkdir(parents=True, exist_ok=True)

# ============================================================
# ★ カスタマイズ: SYSTEM_PROMPT
#    ここにあなたのアカウントの「世界観・ターゲット・口調」を記述する。
#    Claude API に毎回渡される指示文なので、ここを変えると投稿のトーンが変わる。
# ============================================================
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
※ハッシュタグは末尾に2〜3個のみ
""".strip()
# ============================================================


def load_topic() -> dict:
    if not TOPIC_FILE.exists():
        print("[ERROR] today_topic.json not found. Run fetch_news.py first.", file=sys.stderr)
        sys.exit(1)
    return json.loads(TOPIC_FILE.read_text(encoding="utf-8"))


def load_affiliates() -> list[dict]:
    """
    affiliates/affiliates.json からアフィリエイト案件を読み込む。
    ★ カスタマイズ: affiliates.json に案件を追加してください（後述のフォーマット参照）
    """
    if not AFFILIATES_FILE.exists():
        return []
    return json.loads(AFFILIATES_FILE.read_text(encoding="utf-8"))


def pick_affiliate(topic: dict, affiliates: list[dict]) -> dict | None:
    """
    トピックのタイトル・要約と affiliates.json の tags をマッチングして
    最も関連性の高いアフィリエイト案件を自動選択する。

    ★ カスタマイズ: affiliates.json の tags を充実させると精度が上がる
    """
    if not affiliates:
        return None

    text = (topic.get("title", "") + " " + topic.get("summary", "")).lower()
    scored = []
    for aff in affiliates:
        # affiliate_url が "#" の案件はスキップ（未登録）
        if aff.get("affiliate_url", "#") == "#":
            continue
        score = sum(1 for tag in aff.get("tags", []) if tag.lower() in text)
        scored.append((score, aff))

    scored.sort(key=lambda x: x[0], reverse=True)
    # スコアが1以上ならマッチした案件を、なければ先頭案件をフォールバック
    if scored and scored[0][0] > 0:
        return scored[0][1]
    return affiliates[0] if affiliates else None


def generate_post(topic: dict) -> str:
    """Claude API を使って投稿文を生成する。"""
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    user_msg = f"""
以下のニュース・トピックを元に、SNS投稿文を1件生成してください。

【トピックタイトル】
{topic.get('title', '')}

【要約】
{topic.get('summary', '')}

【出典】
{topic.get('source', '')}

投稿文のみを出力してください（説明・前置き・コメント不要）。
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
    メイン投稿文と、ツリー2枚目（アフィリエイト訴求）テキストを返す。

    ★ カスタマイズ: ツリー投稿のフォーマットを変更したい場合はここを編集
       aff の構造（affiliates.json のフィールド）:
         id           : 識別子
         name         : 案件名
         category     : カテゴリ
         affiliate_url: アフィリエイトURL（ここが収益の要）
         description  : 案件の説明文（1〜2行）
         cta          : CTA テキスト（例: "👉 無料で試してみる"）
         tags         : マッチング用キーワード配列
    """
    if not aff:
        return post_body, ""

    # ツリー2枚目のテキスト
    tree = (
        f"{aff['description']}\n\n"
        f"{aff['cta']}\n"
        f"{aff['affiliate_url']}"   # ★ アフィリエイトURLがここに入る
    )
    return post_body, tree


def save_draft(topic: dict, post_body: str, tree: str, aff: dict | None) -> Path:
    """生成した投稿を posts/draft/ に Markdown ファイルとして保存する。"""
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
