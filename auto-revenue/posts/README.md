# 生成投稿の保管場所

## ディレクトリ構成

```
posts/
├── draft/      # 生成済み・未公開
├── published/  # 公開済み
└── archive/    # 削除・非公開にしたもの
```

## ファイル命名規則

```
YYYY-MM-DD_{プラットフォーム}_{タイトルスラッグ}.md
例: 2026-06-03_twitter_contact-lens-sale.md
```

## 投稿ファイルのフォーマット

```
---
date: YYYY-MM-DD
platform: twitter | instagram | blog
affiliate: 案件名
status: draft | published | archived
url: （公開後に記入）
---

（投稿本文）
```
