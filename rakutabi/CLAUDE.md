@AGENTS.md

# 事業ステータス（2026-09-26時点）

- 事業名は仮称「落旅くん」。ディレクトリ名 `rakutabi`。楽天トラベルへの送客（楽天アフィリエイト）がメインの旅行比較・案内サイト
- **骨格実装の段階**。ドメイン未取得・Vercelプロジェクト未作成・本公開前
  - `app/layout.tsx` で `robots: noindex` にしている。本公開時に外すこと
  - `lib/site-config.ts` の `SITE_URL` は仮の値（`rakutabi.example.com`）。ドメイン取得後に差し替える

# ページ構成（2026-09-26 デザイン案反映）

| URL | 内容 |
|---|---|
| `/` | ヒーロー（「知らない景色に、会いに行こう。」＋検索窓）＋人気テーマ5つ＋季節特集（春夏秋冬、今の季節を先頭）＋出発地別特集＋エリア（北海道・関東・東海・関西・九州） |
| `/theme/[slug]` | テーマ別一覧（weekend/onsen/family/couple/solo） |
| `/region/[region]` | 地方別一覧 |
| `/area/[area]` | エリア別一覧＋そのエリアの掛け合わせページへの入口 |
| `/area/[area]/[theme]` | **エリア×テーマの掛け合わせページ（コンテンツ設計の軸）**。宿が3件未満の組み合わせは生成しない（`COMBO_MIN_HOTELS`） |
| `/feature/[slug]` | 出発地起点の特集（東京から行ける温泉宿 等） |
| `/hotel/[hotelNo]` | 写真ギャラリー・評価・価格・特徴タグ・おすすめポイント・タブ（施設の特徴／プラン料金／写真／口コミ） |
| `/search` | 検索窓の結果（宿名・エリア名・住所・最寄り駅で部分一致＋テーマ） |
| `/about` `/terms` `/privacy` `/contact` `/operator` | フッターのサイト情報ページ。`/contact` は問い合わせ先がオーナー確認待ちのため「準備中」表示 |
| `/design-preview` | 季節4パターンの配色確認用（サイト内からはリンクしていない） |

一覧ページはすべて `components/HotelFilterList.tsx`（エリア・価格帯・食事・温泉・客室・親子・立地/景色の絞り込み＋並び替え4種）。

# コンテンツ設計の方針（オーナー指示）

- 「楽天トラベル おすすめ」等の大きなキーワードは狙わない。「地域名＋悩み＋旅行」「子連れ＋旅行＋ホテル＋地域名」のような
  具体的な組み合わせを軸にする → `/area/[area]/[theme]`
- 各テーマに `worry`（悩み・目的の一文）・`comboTitle`（検索語を自然に含むタイトル）・`criteria`（掲載基準）を定義（`lib/site-config.ts`）
- おすすめポイントは取得データから言える事実のみ（`getHighlights()`）。独自評価・誇張・根拠のない数値は書かない

# デザイン

- 配色は季節4パターン。`app/globals.css` の `[data-season]` ブロックでCSS変数として定義し、`<html data-season>` で切替（ビルド時点の日本時間の月）
- **色コードは仮の値**。オーナーの「添付デザイン案」の色コードが会話・リポジトリのどちらにも見当たらなかったため。共有され次第、この4ブロックの値だけ差し替える
- 見出し：Noto Serif JP（h1〜h3に自動適用）、本文：Noto Sans JP
- 予約ボタン：`bg-cta`（#bf0000、楽天の赤に寄せた色）。季節に関係なく固定

# データ取得の仕組み

- 楽天トラベルAPIはビルド時・閲覧時には呼ばない。GitHub Actions（`.github/workflows/rakutabi-hotels.yml`）で
  `scripts/fetch-hotels.ts` を実行し、`data/hotels.json` にコミットする方式（lens-naviの価格更新と同じ設計）
- 空室検索API（VacantHotelSearch）を「次の土曜日1泊」で、エリアごとに条件違い5回呼ぶ（大人2名／温泉／2食付き／朝食付き／大人1名）。空室プランも保存
- 続けて施設検索API（responseType=large）を15施設ずつ呼び、項目別評価・最新口コミ・施設詳細を補う
- 口コミ抜粋には楽天側の「つづきはこちら」リンク（HTML）が含まれるため、`lib/hotel-text.ts` の `stripHtml()` で除去する
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

## 接続確認結果（2026-09-26、GitHub Actions上で実施）

| API | エンドポイント | 結果 |
|---|---|---|
| 施設検索 | `engine/api/Travel/SimpleHotelSearch/20260731` | OK |
| 空室検索 | `engine/api/Travel/VacantHotelSearch/20170426` | OK |
| 施設情報 | `engine/api/Travel/HotelDetailSearch/20260731` | OK |
| 地区コード | `engine/api/Travel/GetAreaClass/20140210` | OK（20131024・20260731は `API Configuration not found`） |

- Refererは `https://lens-navi.jp/`（既存の許可済みドメイン）で通った
- アフィリエイトID未指定時の施設URL・プラン一覧URLは `img.travel.rakuten.co.jp/image/tr/api/...` という
  楽天側の中継URLになる（hb.afl形式ではないため、現状の判定では予約ボタンは非表示）
- 楽天の地区区分は温泉地単位とは限らない。有馬は `hyogo/kobe`（神戸・有馬温泉・六甲山）、城崎は
  `hyogo/kita`（城崎温泉・豊岡・出石・神鍋）。エリア追加時は必ず接続確認の地区コード照合で実在を確認すること
- 都道府県コードも一般的なローマ字と違うものがある（岐阜=`gihu`、大分=`ooita`、福島=`hukushima`、千葉=`tiba`、福岡=`hukuoka`、島根=`simane` 等）
- 空室検索は1エリア1条件あたり最大30件（hits=30）
- 項目別評価のキーは serviceAverage / locationAverage / roomAverage / equipmentAverage / bathAverage /
  breakfastAverage / dinnerAverage / cleanlinessAverage（mealAverage は存在しない）
- 空室プランの roomBasicInfo は roomClass, roomName, planId, planName, pointRate, withDinnerFlag, withBreakfastFlag, reserveUrl 等

# アフィリエイトID

- 楽得くん（point-calendar）と同じく、**lens-navi用の楽天アフィリエイトIDは流用せず本事業専用を使う想定**（オーナー確認待ち）
- GitHub Secretsに `RAKUTABI_RAKUTEN_AFFILIATE_ID` を登録すると、API取得時に `affiliateId` として渡され、
  施設URL・プラン一覧URLが `hb.afl.rakuten.co.jp` のアフィリエイトURLになる
- 予約ボタンは `isAffiliateUrl()` がtrueのURLのみ表示する（アフィリエイトなしの外部リンクは出さないルール）。
  ID未設定の間は「予約ボタンは準備中」と表示される

# 未対応（次の段階）

- 問い合わせ先（メールアドレス等）の決定と `/contact` への記載

- 独自の紹介文（現在は楽天掲載の施設紹介文をそのまま表示）。生成する場合はlens-naviと同じく公開前チェックを通す
- GA4・`affiliate_click` 計測、sitemap/robots、OGP画像
- 定期実行（workflowの `schedule`）の有効化
