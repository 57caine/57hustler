#!/usr/bin/env python3
"""X（Twitter）自動投稿スクリプト - 商品アフィリエイト投稿用"""

import os
import re
import sys
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse

import tweepy

AMAZON_ASSOCIATE_TAG = os.getenv("AMAZON_ASSOCIATE_TAG", "")
RAKUTEN_AFFILIATE_ID = os.getenv("RAKUTEN_AFFILIATE_ID", "")

X_API_KEY = os.getenv("X_API_KEY", "")
X_API_SECRET = os.getenv("X_API_SECRET", "")
X_ACCESS_TOKEN = os.getenv("X_ACCESS_TOKEN", "")
X_ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET", "")

POST_TEMPLATE = """{comment}

🛒 {name}
👉 {url}

#henkutsu #変なやつ #ひとくせ"""


def is_amazon_url(url: str) -> bool:
    return bool(re.search(r"amazon\.co\.jp|amzn\.to|amzn\.asia", url))


def is_rakuten_url(url: str) -> bool:
    return bool(re.search(r"rakuten\.co\.jp|r10\.to", url))


def convert_amazon(url: str) -> str:
    if not AMAZON_ASSOCIATE_TAG:
        print("⚠️  AMAZON_ASSOCIATE_TAG が未設定です。URLをそのまま使用します。")
        return url

    parsed = urlparse(url)
    qs = parse_qs(parsed.query, keep_blank_values=True)
    qs["tag"] = [AMAZON_ASSOCIATE_TAG]

    new_query = urlencode({k: v[0] for k, v in qs.items()})
    affiliate_url = urlunparse(parsed._replace(query=new_query))
    return affiliate_url


def convert_rakuten(url: str) -> str:
    if not RAKUTEN_AFFILIATE_ID:
        print("⚠️  RAKUTEN_AFFILIATE_ID が未設定です。URLをそのまま使用します。")
        return url

    encoded = urlencode({"url": url})
    affiliate_url = f"https://hb.afl.rakuten.co.jp/hgc/{RAKUTEN_AFFILIATE_ID}/?pc={url}&m={url}"
    return affiliate_url


def to_affiliate_link(url: str) -> str:
    if is_amazon_url(url):
        return convert_amazon(url)
    elif is_rakuten_url(url):
        return convert_rakuten(url)
    else:
        print("⚠️  AmazonでもRakutenでもないURLです。そのまま使用します。")
        return url


def post_to_x(text: str) -> None:
    missing = [
        k for k, v in {
            "X_API_KEY": X_API_KEY,
            "X_API_SECRET": X_API_SECRET,
            "X_ACCESS_TOKEN": X_ACCESS_TOKEN,
            "X_ACCESS_TOKEN_SECRET": X_ACCESS_TOKEN_SECRET,
        }.items() if not v
    ]
    if missing:
        print(f"❌ 環境変数に以下のキーが未設定です: {', '.join(missing)}")
        sys.exit(1)

    client = tweepy.Client(
        consumer_key=X_API_KEY,
        consumer_secret=X_API_SECRET,
        access_token=X_ACCESS_TOKEN,
        access_token_secret=X_ACCESS_TOKEN_SECRET,
    )
    response = client.create_tweet(text=text)
    tweet_id = response.data["id"]
    print(f"✅ 投稿完了！ https://x.com/i/web/status/{tweet_id}")


def main() -> None:
    if len(sys.argv) != 4:
        print("使い方: python henkutsu/post.py <商品名> <一言コメント> <商品URL>")
        sys.exit(1)

    product_name = sys.argv[1].strip()
    comment = sys.argv[2].strip()
    raw_url = sys.argv[3].strip()

    if not product_name:
        print("❌ 商品名を入力してください")
        sys.exit(1)
    if not comment:
        print("❌ コメントを入力してください")
        sys.exit(1)
    if not raw_url:
        print("❌ URLを入力してください")
        sys.exit(1)

    affiliate_url = to_affiliate_link(raw_url)

    post_text = POST_TEMPLATE.format(
        comment=comment,
        name=product_name,
        url=affiliate_url,
    )

    print("\n--- 投稿プレビュー ---")
    print(post_text)
    print("--------------------")
    print(f"文字数: {len(post_text)}")

    if len(post_text) > 280:
        print("⚠️  280文字を超えています。商品名またはコメントを短くしてください。")
        sys.exit(1)

    post_to_x(post_text)


if __name__ == "__main__":
    main()
