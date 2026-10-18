# Threads 流入獲得テスト（2026-10-18開始）

目的：11月末の収益改善。フォロワー数だけでなく、Threads→サイト→楽天送客の実数を増やす。**この文書は企画・検証用で、自動投稿や本番変更を行わない。**

## 計測ルール
- レンズナビ：Threadsリンクは `utm_source=threads&utm_medium=social&utm_campaign=lens_compare_oct26`。GA4のセッションと `affiliate_click` を確認。受信が未確認なら「未検証」。
- 楽旅くん：`utm_source=threads&utm_medium=social&utm_campaign=travel_oct26`。既存 ClickTracker は `utm_source=threads` を `trafficSource=threads` として記録する仕様。ただし `/api/click` が保存失敗する場合があり、実数の照合が必要。
- 楽天成果はアフィリエイト管理画面で別途確認。サイト別帰属が取れなければ推測しない。
- 毎週、投稿本数・閲覧・プロフィール訪問・フォロワー増減・サイト訪問・楽天送客・発生報酬を同じ期間で比較。閲覧数だけの改善は成功扱いしない。

## 投稿実験（7日、各ブランド最大1日1投稿から開始）
### レンズナビ：比較を必要とする人へ
- 「コンタクト、箱の価格だけで選ぶと送料で逆転することがある。比較するときは**1箱価格＋送料＋必要箱数**まで見る。」
  導線： https://www.lens-navi.jp/ranking?utm_source=threads&utm_medium=social&utm_campaign=lens_compare_oct26
- 「BCが同じでも、製品ごとに装用感は違う。自己判断で規格を変更せず、処方された製品・規格を確認したうえで価格を比べる。」
  導線： https://www.lens-navi.jp/bc/8.4?utm_source=threads&utm_medium=social&utm_campaign=lens_compare_oct26

### 楽旅くん：予約前の比較行動へ
- 「週末の温泉旅行、写真だけで決める前に確認したいのは『食事条件・キャンセル条件・移動時間』。候補を並べてから予約サイトで最終確認。」
  導線： https://rakutabi-nine.vercel.app/theme/onsen?utm_source=threads&utm_medium=social&utm_campaign=travel_oct26
- 「宿の掲載料金は日付・人数・プランで変わる。比較ページで候補を絞り、予約前に楽天トラベルで最終金額と空室を確認。」
  導線： https://rakutabi-nine.vercel.app/?utm_source=threads&utm_medium=social&utm_campaign=travel_oct26

### 夜中のおじさん：会話の入口
- 「運が悪い日というより、決めることを増やしすぎた日かもしれない。今日は何を一つ減らす？」
  導線：反応を見てプロフィール→note。売り込みは毎回入れない。

## 検証・停止条件
1. 投稿前に対象リンクが正常表示され、期待する商品・宿比較ページへ到達することを確認。
2. 実投稿はアカウントと権限を照合してから。重複投稿や大量返信を行わない。
3. 7日後、サイト流入が増えない案は文面・投稿時間・導線を変更。数値が取得できない場合は計測整備を優先。
4. 既存の楽旅くん noindex は解除しない。新規課金・認証変更・本番公開はオーナー承認まで行わない。
