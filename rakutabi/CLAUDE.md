@AGENTS.md

# 事業ステータス（2026-09-26時点）

- 事業名は仮称「落旅くん」。ディレクトリ名 `rakutabi`。楽天トラベルへの送客（楽天アフィリエイト）がメインの旅行比較・案内サイト
- **骨格実装の段階**。ドメイン未取得・Vercelプロジェクト未作成・本公開前
  - `app/layout.tsx` で `robots: noindex` にしている。本公開時に外すこと
  - `lib/site-config.ts` の `SITE_URL` は仮の値（`rakutabi.example.com`）。ドメイン取得後に差し替える

# ページ構成

| URL | 内容 |
|---|---|
| `/` | ヒーロー（テーマ別入口）＋季節のおすすめ特集（ビルド時の月で切替）＋地域特集への入口 |
| `/theme/[slug]` | テーマ別一覧（weekend/onsen/family/couple/solo）。条件絞り込み・エリア絞り込み・並び替え付き |
| `/area/[slug]` | 地域×テーマ（tokyo-onsen / tokyo-weekend / osaka-onsen） |
| `/hotel/[hotelNo]` | 個別宿泊施設ページ（写真・最低料金・アクセス・施設紹介文・予約ボタン） |
| `/about` | 運営者情報・アフィリエイト表記・免責事項 |

テーマ・エリア・特集・絞り込み条件はすべて `lib/site-config.ts` で定義している。

# データ取得の仕組み

- 楽天トラベルAPIはビルド時・閲覧時には呼ばない。GitHub Actions（`.github/workflows/rakutabi-hotels.yml`）で
  `scripts/fetch-hotels.ts` を実行し、`data/hotels.json` にコミットする方式（lens-naviの価格更新と同じ設計）
- 空室検索API（VacantHotelSearch）を「次の土曜日1泊」で、エリアごとに条件違い4回呼ぶ（大人2名／温泉／2食付き／大人1名）
- 「温泉あり」「2食付き」はAPIの検索条件（squeezeCondition）で判定。「子連れ向け」「景色」「客室」「駅近」と
  テーマ「子連れ」「カップル」は施設紹介文のキーワード判定（目安であることをページ上にも明記）
- 取得に全面失敗した場合は既存データを保持する

# 楽天API連携の知見（lens-naviの楽天市場API調査、2026-08から流用）

- 2026年の仕様変更でドメインが `openapi.rakuten.co.jp` になり、`applicationId` に加えて `accessKey` が必須
- `Referer`/`Origin` ヘッダー必須。値は楽天ウェブサービス管理画面の「許可されたWebサイト」に登録したドメイン
  （現在登録済みなのは lens-navi.jp / *.lens-navi.jp のみ）
- Node.jsの `fetch()` はRefererを送らないため、`node:https` で直接リクエストする（`lib/rakuten-travel.ts`）
- アプリID・アクセスキーはGitHub Secretsの `RAKUTEN_APP_ID` / `RAKUTEN_ACCESS_KEY`（lens-naviと共用）
- エンドポイントのバージョンはWeb検索結果ベースで設定。開発環境からは楽天の公式ドキュメントに直接アクセスできない

# アフィリエイトID

- 楽得くん（point-calendar）と同じく、**lens-navi用の楽天アフィリエイトIDは流用せず本事業専用を使う想定**（オーナー確認待ち）
- GitHub Secretsに `RAKUTABI_RAKUTEN_AFFILIATE_ID` を登録すると、API取得時に `affiliateId` として渡され、
  施設URL・プラン一覧URLが `hb.afl.rakuten.co.jp` のアフィリエイトURLになる
- 予約ボタンは `isAffiliateUrl()` がtrueのURLのみ表示する（アフィリエイトなしの外部リンクは出さないルール）。
  ID未設定の間は「予約ボタンは準備中」と表示される

# 未対応（次の段階）

- 独自の紹介文（現在は楽天掲載の施設紹介文をそのまま表示）。生成する場合はlens-naviと同じく公開前チェックを通す
- GA4・`affiliate_click` 計測、sitemap/robots、OGP画像
- 定期実行（workflowの `schedule`）の有効化
