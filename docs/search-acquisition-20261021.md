# 集客拡大・承認前レビュー（2026-10-21 JST）

## 引き継ぎ
- PR #126 は2026-10-20に承認後マージ・公開済み。媒体判定、仮送客排除、購入ガイド2記事の入口を維持。
- PR #43/#45 はopenだが、記事canonical/OG/X/LINE共有、www統一、関連記事改善は現在mainに存在。古い枝を再マージしない。
- この枝の基点: 599fb0e248d6ebe9416c0cde8e5170c98c91e96b。本番公開・マージはオーナー承認後のみ。

## 実測と確度
GA4 520238223、2026-09-22〜10-19。hostName=www.lens-navi.jp。
本番490セッション、affiliate_click 78件。プロパティ全体はプレビュー・別ホストを含むため比較に使わない。
|流入元|セッション|購入先クリック（回数）|
|---|---:|---:|
|Bing organic|312|18|
|Google organic|43|16|
|direct|39|14|
|chatgpt.com ai-assistant|27|19|
|Threads social|1|1|
クリックは人数・購入件数・報酬ではない。1人の複数クリックを含む。
Googleは本番セッションの8.8%、Bingは63.7%。Google露出の弱さ、Threads以外の継続集客不足が観測上の課題。
Googleで「未登録・低順位・低CTR」のどれが主因かはGSC取得前に断定しない。
記事→比較→送客の連結は購入ガイド2記事以外で弱く、商品・カテゴリの自己canonical欠落と商品JSON-LDの非www参照が確認された。
これらの実装修正が流入減の直接原因だったという因果までは未証明。

## 無料Search Console
- 既存HTML確認ファイルpublic/google1095ddcd2dae4bc9.htmlとroot metadata.verificationが存在。所有権・API権限を保証する証拠ではない。
- PR #45には過去にwww/bc/8.4の登録確認記録あり。現時点の全ページ登録を示すものではない。
- GSC Wizardはsubscription_requiredで停止。再試行・課金しない。Windsor接続はGA4のみ。
- Google公式APIは無料: https://developers.google.com/webmaster-tools/pricing
- scripts/fetch-search-acquisition.mjsは既存GA4_SERVICE_ACCOUNT_KEYだけを使い、sites.listで実際のGSC権限を発見する。対象プロパティ以外は出力しない。
- 権限があれば同一28日間の総計・ページ・検索語・サイトマップ・3URL登録状態を読む。GA4も本番ホスト限定で同期間取得。取得失敗を0件と扱わない。
- 不足時は、既存Search Consoleでそのサービスアカウントへの閲覧権限追加か、管理画面CSVエクスポートで無料取得できる。秘密鍵をチャットに貼らない。
- 診断結果はActions artifactに7日保存。自動コミット・main更新・URL登録申請・サイトマップ送信なし。
- 匿名化検索語の欠落、最大25000行、直近データ遅延に留意。クエリ合算を総計と扱わない。

## 無料APIの実行結果
- Actions 39461443919: 既存認証でGA4の直接取得成功。GSCはHTTP403、reason=accessNotConfigured。権限追加以前に、既存認証のGoogle CloudプロジェクトでSearch Console APIの有効化が必要。
- 無料の有効化画面: https://console.cloud.google.com/apis/library/searchconsole.googleapis.com 。新規課金・新規プロジェクト・鍵の再発行は不要。有効化後にsites.listで対象サイトへの閲覧権限を確認する。
- 自動診断はUTC日付の3日前まで28日（今回9/20〜10/17）。上のWindsor実測9/22〜10/19とは別期間であり、数値差を改善効果としない。
- 診断成功はGA4取得・欠測の記録処理が動いたことを示す。GSCデータ取得の成功ではない。

## 実装
1. 商品とカテゴリにwww自己canonicalとOG URL。商品構造化データもwww。1dayの検索説明を1箱比較の実機能に合わせ、「全商品対応」の断定を除去。価格計算・購入URLを変更しない。
2. robotsの/_next/ブロックを除去し、表示に必要な静的リソースをクロール可能にする。/api/は維持。
3. 既存2記事の入口を保ち、乾燥・アキュビュー・1day対2week・ネット購入・年間費用の5記事に1箱比較と2week比較への入口を追加。読者に処方された製品条件との照合を案内。
4. comparison_navigationを独立計測。affiliate_clickと二重計上しない。
5. X/LINE共有にUTMを付与。Pinterestは比較・費用の3記事のみ、既存hero画像（未取得時は既存のサイト共通写真）を使う任意保存ボタン。share_intentは共有画面を開く意図であり、投稿完了・新規流入ではない。外部SDK・アカウント作成・自動投稿なし。
6. 楽旅の既存共有リンクにもreader_shareキャンペーン名を付与。既存UTM・送客計測・noindexを維持。

## 無料集客の判断
- 優先: 実検索語に合う既存ページ改善、商品比較への内部リンク、既存AI/Bing流入の維持。
- LINE/Xの読者共有: 継続投稿の手間なし。母数が少ないため大幅な流入増は保証しない。
- Pinterest: 画像中心の媒体との適性・読者が保存する頻度は未検証。今回は3記事の小規模な入口だけ。ネイティブRSS投稿はbusinessアカウントとサイト認証が必要なため保留。3枚を手動公開する実験はアカウント認証・素材承認後の別判断。
  公式: https://help.pinterest.com/ja/business/article/auto-publish-pins-from-your-rss-feed
- 楽旅は旅行画像との親和性が見込まれるが、既存アカウント・成果未確認。noindex解除は別判断。Threads新規開発は行わない。

## 指標・判定
- 毎週: GSCページ別表示回数/クリック/CTR/順位/登録状態。取得不能は欠測のまま示す。
- 公開前28日と公開後7日/28日を同じ本番ホストで比較。まず表示回数と比較遷移を週次で確認し、28日待つだけにはしない。
- 追加5記事のcomparison_navigation、既存single_box_comparison_click、流入元別affiliate_click。
- Pinterest/share_x/share_lineの流入セッションと購入先クリック。share_intentは先行指標として分離。
- 保存ボタン3記事で28日経って流入0なら拡大しない。少数データで優劣を断定しない。
- 成果報酬は楽天/A8等の承認済み成果で照合が必要。GA4 purchaseやtotalRevenueをASPの確定利益の代わりにしない。
- 楽旅はGA4独立接続なし・送客ログ中心。訪問セッションと確定報酬の連結は未実装。既存クリックログを訪問数に読み替えない。

## 検証
ローカル実行環境が利用不能のためGitHub Actionsで本番相当ビルドとブラウザ回帰を実施する。
レンズ: 既存の1箱導線・媒体判定・実URL一致テストと全既存nodeテスト、新規growthブラウザ検証（390/1440px）。
楽旅: webpack本番ビルド。外部広告/GA4/Pinterestはブラウザ検証で通信遮断。
合否はPR/Actionsの実結果で確認し、成功前に「検証済み」としない。

## オーナー判断
- テスト完了後、このPRのマージ・本番公開の承認。
- 既存GA4認証のGoogle CloudプロジェクトでSearch Console APIを有効化（無料）。有効化後、対象サイトへの権限がなければ閲覧権限追加またはCSV提供。
- Pinterest事業アカウント運用、楽旅のnoindex解除、成果報酬データ連携は別判断。今回の公開条件に混ぜない。
