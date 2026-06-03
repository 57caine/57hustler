"""
全自動SNS投稿フロー
Usage:
    python main.py            # ネタ収集 → 生成 → X投稿
    python main.py --dry      # 投稿せずプレビューのみ
    python main.py --step 1   # ステップ単体実行 (1=収集, 2=生成, 3=投稿)
"""

import argparse
import sys
from pathlib import Path

# パスを通す
sys.path.insert(0, str(Path(__file__).parent))


def step1_fetch():
    print("\n== Step 1: ネタ収集 ==")
    from sources.fetch_news import main as fetch
    return fetch()


def step2_generate():
    print("\n== Step 2: 投稿文生成 ==")
    from posts.generate_post import main as generate
    return generate()


def step3_post(dry: bool = False):
    print("\n== Step 3: スケジュール登録 & 投稿 ==")
    from post_scheduler import main as schedule
    schedule(dry=dry)


def run_all(dry: bool = False):
    step1_fetch()
    step2_generate()
    step3_post(dry=dry)
    print("\n✓ All steps completed.")


def main():
    parser = argparse.ArgumentParser(description="SNS自動投稿フロー")
    parser.add_argument("--dry", action="store_true", help="X APIを使わずプレビューのみ")
    parser.add_argument("--step", type=int, choices=[1, 2, 3], help="単体ステップ実行")
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
