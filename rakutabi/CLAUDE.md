@AGENTS.md

# 事業ステータス（2026-09-26時点）

- 事業名は「楽旅くん」（2026-09-26 オーナー確認。以前「落旅くん」と誤記していたのを全面修正）。ディレクトリ名 `rakutabi`。楽天トラベルへの送客（楽天アフィリエイト）がメインの旅行比較・案内サイト
- **vercel.app サブドメインで需要検証中（2026-09-26〜、2〜4週間の予定）**。独自ドメインは取得保留
  - 目的：SNSからの直接誘導でのアクセス数・楽天送客クリックの発生有無を見る（SEO流入は狙わない）
  - `app/layout.tsx` で `robots: noindex` を維持（オーナー指示）。本公開時に外すこと
  - `lib/site-config.ts` の `SITE_URL` は Vercel の `VERCEL_PROJECT_PRODUCTION_URL` から自動設定

# Vercel公開の仕組み（2026-09-26）

- **公開URL: https://rakutabi-nine.vercel.app**（2026-09-26 初回公開。`rakutabi.vercel.app` は他者が使用済みのため自動で `-nine` が付いた）
- Vercelプロジェクト名 `rakutabi`（ID `prj_Qd9d5vrHyLJuWUG0HAg1J2gcQlKr`、team_3ZA38DTbe02rLyjHXAaNuCs5）。**GitHub連携はしていない**
  - 連携するとモノレポへの全pushでビルド判定が走り、同時ビルド枠1の環境で他事業のデプロイ待ち行列を圧迫するため
    （ルートCLAUDE.md「Vercel Ignored Build Step」の障害履歴参照）
- 公開は `.github/workflows/rakutabi-hotels.yml` → `rakutabi/scripts/vercel-deploy.sh` で行う。
  GitHub Actions上で `vercel build` し、`vercel deploy --prebuilt --prod` で成果物だけをアップロードする（Vercel側のビルド枠を使わない）
  - `rakutabi/` ディレクトリから直接デプロイするため、Vercelプロジェクト設定上の Root Directory は空（＝rakutabi直下がルート）。
    実質的に「ルートディレクトリ: rakutabi」と同じ
- 公開後、同ワークフロー内で `scripts/verify-production.sh` が全ページ（約750）を機械チェックする
  （HTTP 200・h1・noindex・送客リンクのsponsored/計測属性・アフィリエイトなし楽天リンクが無いこと）
- 起動条件：`rakutabi/**` の変更をpushしたとき（main・`claude/rakutabi-skeleton-impl-gzyecr`）、手動実行、毎日05:00 JST（mainにマージ後のみ有効）
  - **scheduleはmainにあるワークフローでしか動かない**。mainマージ前は、データ（次の土曜日の空室）は自動更新されない
- 楽天APIはGitHub Actionsからのみ呼ぶ（閲覧者のブラウザ・Vercelからは呼ばない）ため、楽天ウェブサービスの
  「許可されたWebサイト」に vercel.app を追加する必要はない（Refererは既存の lens-navi.jp で送っている）

# 送客クリック計測（2026-09-26、GA4未導入のため簡易カウント）

- `rel="sponsored"` かつ `data-hotel-no`/`data-placement` 付きのリンクのクリックを `components/ClickTracker.tsx` が
  `navigator.sendBeacon` で `/api/click` に送る（遷移は妨げない）
- 記録先は Vercel Blob ストア `rakutabi-clicks`（`vercel-deploy.sh` が自動作成・接続）。1クリック=1ファイル、
  ファイル名 `clicks/{日付JST}/{施設番号}/{位置}-xxxx.json` だけで集計
- 集計ページ `/stats`（noindex・サイト内リンクなし）：累計・日別・ボタン位置別・宿別
- `placement: 'healthcheck'` は公開後の動作確認用で `healthcheck/` に保存され、集計に含まれない
- 楽天側で予約が成立したか（成果）は楽天アフィリエイト管理画面で確認する。IDをlens-naviと共用しているため、
  楽天側の数字は lens-navi 分と合算される点に注意

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

# デザイン（2026-09-26 オーナーのデザイン案を反映）

- デザイン案（ChatGPTで作成した画像。トップ・テーマ別一覧・個別宿・地域別・カラーパレット/フォント/カードの5枚組）に沿って実装
- 配色：季節4パターン。`app/globals.css` の `[data-season]` にデザイン案の main/accent/base の色コードをそのまま設定
  （春 #E968A5/#7FBF7F/#F8F5F8、夏 #2E9FD9/#00C6D7/#F1FAFF、秋 #D97706/#B5521B/#FAF6F0、冬 #4A6B8A/#9DB4C7/#F7F9FC）
- 見出し・フッターは紺（`--ink` #1d2b45 / `--navy` #16223a）、特徴タグは薄い青灰、価格と予約ボタンは赤（`--cta` #e0263a）
- 見出し：Noto Serif JP、本文：Noto Sans JP
- 写真：`lib/photos.ts` の `getPhoto()`。Unsplash（`scripts/fetch-photos.ts`、GitHub Secrets `UNSPLASH_ACCESS_KEY`）の写真を優先し、
  無ければ関連エリアの楽天掲載宿（クチコミ件数が最多の宿）の写真で代用する
  - `UNSPLASH_ACCESS_KEY` は2026-09-26にオーナーが登録済み。一度取得した写真は `data/photos.json` に残し再取得しない
    （写真を入れ替えたい場合は、そのキーを photos.json から消せば次回実行で取り直す）
  - 雰囲気を外したくない写真は `lib/photo-keys.ts` の `PHOTO_RULES` で、複数の検索語＋説明文の採用/除外キーワードを指定できる
    （温泉旅行は2026-09-26に「高層ビル横のプール」が選ばれたため、露天風呂・和風旅館などで取り直し）。候補と判定はActionsログに出る
  - **Unsplash写真は1枚ごとに撮影者クレジットを表示する（Unsplashの規約上必須）**。`Photo` の `credit`:
    `'link'`＝撮影者ページへのリンク付き（ヒーロー・バナー・一覧の見出し帯）、`'text'`＝文字のみ（カード全体がリンクの場所。
    <a>の入れ子を避けるため）。リンクはページ下部の `components/PhotoCredits.tsx` にまとめて出す
  - `scripts/verify-production.sh` が全ページで「Unsplash写真の枚数 ≦ クレジット数」と撮影者ページへのリンクの有無をチェックする
- デザイン案との意図的な違い:
  - ボタン・フッターの楽天ロゴ（R マーク・Rakuten Travel ロゴ）は使っていない（楽天の商標のため、許諾が確認できるまで文字のみ）
  - フッターのSNSアイコンは出していない（アカウントが無く、飛び先の無いアイコンは置かないため）
  - 宿カードのハートマーク（お気に入り）は未実装（保存した宿を見る画面が無いため）
  - 下部バナーの「最高の思い出を」は「思い出に残る旅を」に変更（最上級表現を避けるため）
  - 宿の写真は楽天APIで取れる2枚（外観・客室）のみ。デザイン案の「+12」のような多数の写真は出せない

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

- **需要検証中はlens-navi用の既存ID（`5567171b.a80702dc.5567171c.a1d1b6fc`）を流用する（2026-09-26 オーナー決定）**。
  `lib/rakuten-travel.ts` の `LENS_NAVI_AFFILIATE_ID`。楽天側の成果レポートはlens-naviと合算される
- 専用IDに切り替える場合は GitHub Secrets に `RAKUTABI_RAKUTEN_AFFILIATE_ID` を登録すればそちらが優先される
- API取得時に `affiliateId` を渡すと、施設URL・プラン一覧URLが `hb.afl.rakuten.co.jp` のアフィリエイトURLになる
- 予約ボタンは `isAffiliateUrl()` がtrueのURLのみ表示する（アフィリエイトなしの外部リンクは出さないルール）。
  ID未設定の間は「予約ボタンは準備中」と表示される

# 未対応（次の段階）

- 問い合わせ先（メールアドレス等）の決定と `/contact` への記載

- 独自の紹介文（現在は楽天掲載の施設紹介文をそのまま表示）。生成する場合はlens-naviと同じく公開前チェックを通す
- GA4（現在は `/stats` の簡易カウントのみ）、sitemap、OGP画像
