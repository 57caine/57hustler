import os
import re
from urllib.parse import quote
from dotenv import load_dotenv
import tweepy

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

X_API_KEY             = os.getenv("X_API_KEY")
X_API_SECRET          = os.getenv("X_API_SECRET")
X_ACCESS_TOKEN        = os.getenv("X_ACCESS_TOKEN")
X_ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET")
AMAZON_ASSOCIATE_TAG  = os.getenv("AMAZON_ASSOCIATE_TAG")
RAKUTEN_AFFILIATE_ID  = os.getenv("RAKUTEN_AFFILIATE_ID")


def to_affiliate_link(url: str) -> str:
    if re.search(r"amazon\.co\.jp|amazon\.com|amzn\.", url):
        return _amazon(url)
    if re.search(r"rakuten\.co\.jp|item\.rakuten", url):
        return _rakuten(url)
    return url


def _amazon(url: str) -> str:
    url = re.sub(r"[?&]tag=[^&]+", "", url)
    sep = "&" if "?" in url else "?"
    return f"{url}{sep}tag={AMAZON_ASSOCIATE_TAG}"


def _rakuten(url: str) -> str:
    encoded = quote(url, safe="")
    return f"https://hb.afl.rakuten.co.jp/ichiba/{RAKUTEN_AFFILIATE_ID}/?pc={encoded}&link_type=hybrid_url"


def build_post(product_name: str, comment: str, affiliate_url: str) -> str:
    return f"""{comment}

🛒 {product_name}
👉 {affiliate_url}

#henkutsu #変なやつ #ひとくせ"""


def post_to_x(text: str) -> str:
    client = tweepy.Client(
        consumer_key=X_API_KEY,
        consumer_secret=X_API_SECRET,
        access_token=X_ACCESS_TOKEN,
        access_token_secret=X_ACCESS_TOKEN_SECRET,
    )
    resp = client.create_tweet(text=text)
    return f"https://x.com/i/web/status/{resp.data['id']}"


def main():
    print("=== henkutsu X投稿ツール ===\n")

    product_name = input("商品名: ").strip()
    comment      = input("一言コメント: ").strip()
    url          = input("商品URL（Amazon or 楽天）: ").strip()

    affiliate_url = to_affiliate_link(url)
    text = build_post(product_name, comment, affiliate_url)

    print("\n--- 投稿プレビュー ---")
    print(text)
    print(f"（文字数: {len(text)}）")
    print("---------------------\n")

    if input("投稿しますか？ (y/n): ").strip().lower() != "y":
        print("キャンセルしました。")
        return

    print("投稿中...")
    post_url = post_to_x(text)
    print(f"✓ 投稿完了: {post_url}")


if __name__ == "__main__":
    main()
