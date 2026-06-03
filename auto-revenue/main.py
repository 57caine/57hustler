"""
SNS 全自動投稿フロー ― エントリポイント (main.py)
==================================================
ネタ収集 → 投稿文生成 → X 投稿 の3ステップを一発で実行する。

【使い方】
  # 全ステップ実行（本番投稿）
  python main.py

  # 投稿せずにプレビューだけ確認（APIキー不要）
  python main.py --dry

  # ステップ単体で実行
  python main.py --step 1   # ネタ収集のみ
  python main.py --step 2   # 投稿文生成のみ
  python main.py --step 3   # 投稿送信のみ

【カスタマイズ箇所】
  世界観・ターゲット・口調 → posts/generate_post.py の SYSTEM_PROMPT
  収集するRSS・キーワード  → .env の RSS_URLS / NEWS_KEYWORDS
  アフィリエイト案件       → affiliates/affiliates.json
"""

import argparse
import sys
from pathlib import Path

# カレントディレクトリをパスに追加（サブモジュールの import 用）
sys.path.insert(0, str(Path(__file__).parent))


# ------------------------------------------------------------------ #
# Step 1: ネタ収集
# ------------------------------------------------------------------ #
def step1_fetch():
    print("\n" + "=" * 50)
    print("Step 1: ネタ収集 (fetch_news.py)")
    print("=" * 50)
    from sources.fetch_news import main as fetch
    return fetch()


# ------------------------------------------------------------------ #
# Step 2: 投稿文生成 & アフィリエイト紐付け
# ------------------------------------------------------------------ #
def step2_generate():
    print("\n" + "=" * 50)
    print("Step 2: 投稿文生成 (generate_post.py)")
    print("=" * 50)
    from posts.generate_post import main as generate
    return generate()


# ------------------------------------------------------------------ #
# Step 3: スケジュール登録 & X 投稿
# ------------------------------------------------------------------ #
def step3_post(dry: bool = False):
    print("\n" + "=" * 50)
    label = "DRY RUN プレビュー" if dry else "X 投稿 & スケジュール登録"
    print(f"Step 3: {label} (post_scheduler.py)")
    print("=" * 50)
    from post_scheduler import main as schedule
    schedule(dry=dry)


# ------------------------------------------------------------------ #
# 全ステップ連続実行
# ------------------------------------------------------------------ #
def run_all(dry: bool = False):
    step1_fetch()
    step2_generate()
    step3_post(dry=dry)
    print("\n✓ 全ステップ完了。")
    if dry:
        print("  （--dry モードのため実際には投稿されていません）")


# ------------------------------------------------------------------ #
# メイン
# ------------------------------------------------------------------ #
def main():
    parser = argparse.ArgumentParser(
        description="SNS 自動投稿フロー",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
例:
  python main.py            全ステップ実行
  python main.py --dry      プレビューのみ（投稿しない）
  python main.py --step 1   ネタ収集のみ
  python main.py --step 2   投稿文生成のみ
  python main.py --step 3   X 投稿のみ
        """,
    )
    parser.add_argument("--dry", action="store_true", help="X API を使わずプレビューのみ")
    parser.add_argument(
        "--step",
        type=int,
        choices=[1, 2, 3],
        help="単体ステップ実行 (1=収集, 2=生成, 3=投稿)",
    )
    args = parser.parse_args()

    if args.step == 1:
        step1_fetch()
    elif args.step == 2:
        step2_generate()
    elif args.step == 3:
        step3_post(dry=args.dry)
    else:
        run_all(dry=args.dry)


if __name__ == "__main__":
    main()
