# コンプライアンスルール（景表法・薬機法・ステマ規制・ASP規約）

このファイルは **人が読むチェックリスト** と **機械が読むNGワード定義**（末尾の `json ng-words` ブロック）を兼ねています。
NGワードを増やしたいときは、末尾のJSONに1行足すだけで `npm run validate` とSNS投稿生成の両方に反映されます。

---

## 1. ステマ規制（2023年10月施行・景品表示法の告示）

- [ ] 全LPのファーストビュー上部に「本ページはプロモーション（広告）を含みます」を表示している（`LpLayout.astro` が自動出力。消さない）
- [ ] 記事の途中から読まれても分かるよう、CTAボタン付近にも「PR」表記がある（`AffiliateButton.astro` が自動出力）
- [ ] SNS投稿には `#PR` または「広告」を入れている（`generate-social-posts.ts` が自動付与）
- [ ] 「広告であることが分かりにくい表示」（小さすぎる文字・背景と同化した色・ページ最下部のみ）にしていない

## 2. 景品表示法（優良誤認・有利誤認）

- [ ] 「No.1」「最安」「業界初」等は、出典（調査機関・調査日・対象）を同じ画面内に明記できる場合のみ使う
- [ ] 価格・特典は `affiliates.json` の `verifiedAt`（確認日）とセットで表示し、古い情報を放置しない（30日超で警告）
- [ ] 「今だけ」「残りわずか」は、実際に期限・数量がある場合のみ使う
- [ ] 比較表の数値は公式サイトの記載に基づき、推測値・ランダム値を入れない
- [ ] 体験談・口コミを創作しない（実在しないレビューは掲載禁止）

## 3. 薬機法（化粧品・健康食品・医療機器を扱う場合）

- [ ] 「治る」「改善」「効く」「若返る」など、医薬品的な効能効果を表現しない
- [ ] 健康食品で病名・症状の改善をうたわない
- [ ] 化粧品は承認された効能（56項目）の範囲内で表現する
- [ ] キャンペーンMDの `compliance.regulatedCategory` に該当カテゴリを設定し、追加NGワードを有効にする

## 4. ASP規約

- [ ] 各ASP・広告主の「禁止キーワード」「リスティング出稿禁止」「SNS掲載可否」を案件ごとに確認し、`affiliates.json` の `notes` に残す
- [ ] リンクは必ず `affiliates.json` 経由で出力する（直書き禁止。`validate-links.ts` が検出）
- [ ] 全アフィリエイトリンクに `rel="noopener noreferrer nofollow sponsored"` を付ける（`AffiliateButton.astro` が自動付与）
- [ ] 提携が切れた案件は `status: "paused"` にする（参照しているLPはビルドが止まって気づける）
- [ ] 自己アフィリエイト・クリック誘導（「クリックだけでOK」等）をしない

## 5. 構造化データ

- [ ] `schema.org/Product` は出力しない（直販ではなく価格・レビューを正確に保守できないため）
- [ ] 使ってよいのは `Article` / `BreadcrumbList` / `FAQPage` / `Organization`

---

## NGワード定義（機械判定用）

- `level: "error"` … ビルドを止める
- `level: "warn"` … 警告のみ（出典を書けば使ってよい表現など）
- `categories` … 空なら全LP共通。値があると、キャンペーンの `compliance.regulatedCategory` が一致したときだけ有効

```json ng-words
[
  { "word": "絶対", "level": "error", "reason": "断定表現（優良誤認）", "categories": [] },
  { "word": "必ず儲かる", "level": "error", "reason": "断定的利益表示", "categories": [] },
  { "word": "100%", "level": "warn", "reason": "根拠の明示が必要", "categories": [] },
  { "word": "No.1", "level": "warn", "reason": "出典（調査機関・調査日）の明記が必要", "categories": [] },
  { "word": "最安", "level": "warn", "reason": "比較対象と確認日の明記が必要", "categories": [] },
  { "word": "業界初", "level": "warn", "reason": "根拠の明示が必要", "categories": [] },
  { "word": "今だけ", "level": "warn", "reason": "実際の期限がある場合のみ", "categories": [] },
  { "word": "クリックするだけ", "level": "error", "reason": "ASP規約違反（クリック誘導）", "categories": [] },
  { "word": "治る", "level": "error", "reason": "薬機法：医薬品的効能", "categories": ["cosmetics", "health_food", "medical"] },
  { "word": "完治", "level": "error", "reason": "薬機法：医薬品的効能", "categories": ["cosmetics", "health_food", "medical"] },
  { "word": "若返る", "level": "error", "reason": "薬機法：医薬品的効能", "categories": ["cosmetics", "health_food"] },
  { "word": "シミが消える", "level": "error", "reason": "薬機法：化粧品の効能範囲外", "categories": ["cosmetics"] },
  { "word": "痩せる", "level": "error", "reason": "薬機法：健康食品の効能表示", "categories": ["health_food"] },
  { "word": "元本保証", "level": "error", "reason": "金融商品取引法（誤認表示）", "categories": ["finance"] }
]
```
