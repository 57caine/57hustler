@AGENTS.md

# ペット防災（仮称・pet-bousai）

楽天市場アフィリエイトで、犬・猫・うさぎ・モルモットの防災用品を「対象別」に紹介する小さな検証サイト。
独自ドメイン公開後6週間で、Search Console表示 → 検索クリック → 楽天クリック → 成果 が発生するかを見る（2026-10-05 MVP実装）。
総合防災サイトには広げない。サイト名・ドメインはオーナー判断待ち（`lib/site.ts` の SITE_NAME は仮）。

## 現在の状態（2026-10-05）

- 作業ブランチ `claude/pet-bousai-mvp` のみ。main には未マージ
- Vercelプロジェクト `pet-bousai`（GitHub連携なし）。`.github/workflows/pet-bousai-preview.yml` が
  Actions上でビルドし、**プレビュー公開のみ**を行う（本番公開・独自ドメインの手順はまだ無い）
- 全ページ noindex。独自ドメイン取得・GA4・Search Console・楽天サイト登録・index解禁は未実施（オーナー確認後）
- **Vercel公開済み（2026-10-06、noindex）**: 固定URL `https://pet-bousai-pi.vercel.app`。オーナーが `VERCEL_TOKEN` を再発行して公開できた
  （それ以前は旧トークンがチーム `57caines-projects` への権限を失っており403だった。楽旅くんも同じ原因で10/4から公開失敗）。
  プロジェクト初回の公開だったため、Vercel の仕様で `--prod` なしでも本番扱いになり上記の固定URLが割り当てられた。
  2026-10-07 以降、公開スクリプトは `--prod` で固定URLへ反映する（オーナー指示）。noindex のまま（index 用の環境変数がプロジェクトに無いことを確認してから公開）
- **GA4導入済み（2026-10-07）**: 測定ID `G-KPE1LBHFW7`（`lib/site.ts` の GA_MEASUREMENT_ID、`components/Analytics.tsx` で全ページ1回だけ読み込み）。
  page_view は `gtag('config')` の自動送信のみ（手動送信なし＝二重計測なし。サイト内移動はGA4の拡張計測「ブラウザの履歴イベント」に依存）。
  affiliate_click は `components/AffiliateClickTracker.tsx`（rel=sponsored のリンクのみ、page_path/product_name/product_category/destination）。
  `scripts/check-mobile.mjs` は GA4 への実送信（/g/collect）をブラウザ内で捕まえて検証し、Google には届けない（実データを汚さない）
- 公開できない間も、ワークフローは Actions 上でビルド・起動し、実際の商品データで全ページ機械チェックと
  スマホ実ブラウザ確認（商品画像の読み込み・affiliate_click）まで行う（2026-10-06 run 37410826072 で全項目合格）

## index（検索エンジン公開）の安全装置

- index になるのは `PET_BOUSAI_SITE_URL`（https・vercel.app以外）と `PET_BOUSAI_INDEXABLE=true` が**両方**そろったときだけ（`lib/site.ts`）
- `PET_BOUSAI_INDEXABLE=true` なのにドメインが無い／vercel.app の場合は**ビルドを失敗させる**
- それ以外は全ページ `<meta name="robots" content="noindex, nofollow">` ＋ `X-Robots-Tag: noindex, nofollow`、canonical なし、sitemap 空、robots.txt に Sitemap 行なし
- index 解禁後も、vercel.app ホストへのアクセスには `X-Robots-Tag: noindex` を返す（`next.config.ts`）
- robots.txt は常に `Allow: /`（ブロックすると noindex が読まれない）
- プレビュー公開スクリプトは、Vercelプロジェクトに上記2つの環境変数が入っていたら停止する

## コンテンツの根拠（一次資料）

- 環境省「人とペットの災害対策ガイドライン＜一般飼い主編＞」（平成30年3月）。本文中の記載ページは冊子に印字されたページ番号
- 原文PDFは開発環境から取得できない（env.go.jp は通信制限で遮断）ため、2026-10-05 に GitHub Actions 上で
  pdftotext 化して照合した（a-1a.pdf の p.4〜22）
- ガイドラインは改訂の検討会が開かれている（令和7年10月〜令和8年3月、計4回）。2026-10-05 時点で環境省の掲載は平成30年版のまま。
  **改訂版が公表されたら本文の記載（特に p.19 の持ち物・日数）を照合し直すこと**
- 公的情報は `components/OfficialInfo.tsx`（出典・ページ付き）に入れ、用品の選び方（当サイトの整理）・商品（広告）と見た目で分ける
- うさぎ・モルモットの具体的な飼養管理（フード・温度）はガイドラインに記載がないため書かない

## 楽天市場API（楽旅くんの旅行APIとの違い）

- エンドポイント `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701`、ジャンル `101213`（ペット・ペットグッズ）
- formatVersion=2 で `Items` が商品の配列。`affiliateUrl` は `hb.afl.rakuten.co.jp/hgc/{ショップごとに変換されたID}/?pc=...` 形式で、
  **渡したアフィリエイトID（lens-naviと共通）がそのままの文字列では URL に現れない**。取得のたびに
  「IDあり／なしで affiliateUrl が変わる」ことを確認し、変わらなければ停止する（`scripts/fetch-products.ts`）
- 画像は `mediumImageUrls`（128x128）をそのまま使う。価格は表示しない（毎日更新しないため古い価格を出さない）
- 商品名で除外: 医薬品誤認（効く・防ぐ・予防・改善…）、順位・推奨・監修・人気・おすすめ、安心・安全、価格・割引・期間限定（`lib/product-filter.ts`）
- 表示名は【】等の括弧書き（ショップの宣伝文）を除く。全文は楽天の商品ページで確認できる
- レビュー本文・レビュー点数・商品説明文は使わない
- Referer は lens-navi.jp（楽天ウェブサービスの「許可されたWebサイト」に登録済み）を流用

## 確認コマンド

- `npx tsx scripts/verify-site.ts <URL> [--expect-index] [--expect-products]` 全ページの機械チェック（HTTPのみ）
- `node scripts/check-mobile.mjs <URL>` スマホ幅の実ブラウザ確認・商品画像・affiliate_click（playwright は一時インストール）
- 開発環境からは vercel.app・楽天の画像サーバーにも届かないため、公開後の確認はワークフロー内で行う
