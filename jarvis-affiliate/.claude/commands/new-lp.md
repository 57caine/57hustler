---
description: メモやヒアリングから新しいLP（キャンペーンMD＋案件登録）を作り、ビルド検証まで行う
argument-hint: [案件メモ or ASPリンク or 作りたいLPの説明]
---

# /new-lp — 新しいLPを作る

入力：$ARGUMENTS

`CLAUDE.md`・`config/design-system.md`・`config/compliance-rules.md` を読んでから始めること。

## 手順

1. **情報を集める**（不足分だけオーナーに質問。質問は1回にまとめ、最大5問）
   - ターゲット（誰が・どんな状況で）
   - 悩み3つ／得られること3つ
   - 紹介する案件と、ASPで発行したリンク（A8・もしも・楽天など）
   - ランキング1位にしたい案件（理由）
   - 薬機法・金融などの規制カテゴリに当たるか
   - 入力に足りない情報は推測で埋めず、`TODO:` と書いて質問リストに入れる

2. **既存の登録を確認する**（二度手間防止）
   - `config/affiliates.json` に同じ案件がないか `id`・`name`・`url` で検索
   - `content/campaigns/` に似たテーマのLPがないか確認。あれば新規ではなく改修を提案する

3. **案件を登録する**：`config/affiliates.json` の `programs` に追記
   - `id` は半角英小文字＋ハイフン、`status: "active"`、`dummy` は付けない（実リンクの場合）
   - `asp` に応じたリンク形式か確認（`src/lib/affiliates.ts` の `ASP_RULES`）
   - `specs` は公式サイトで確認できた値のみ。確認日を `verifiedAt` に入れる
   - **リンクがまだ無い場合**は `dummy: true` で仮登録し、報告の「判断してほしいこと」に「ASPでの提携申請・リンク発行」を書く

4. **キャンペーンMDを作る**：`content/campaigns/_template.md` をコピーして `content/campaigns/{slug}.md` を作成
   - 最初は `status: draft`
   - 構成・コピーは `design-system.md` の3章・4章に従う
   - `comparison.columns[].key` は全案件の `specs` に存在するキーにする

5. **検証する**
   ```bash
   npm run validate
   ```
   - ERROR は全件直す。WARN は内容を確認し、直せないもの（ダミーリンク等）は報告に残す
   - 一時的に `status: published` にして `npm run build` を実行し、postbuild のHTMLチェックまで通す
   - `dist/lp/{slug}/index.html` に各案件名がテキストで出ていること、`rel="noopener noreferrer nofollow sponsored"` が全ボタンに付いていることを grep で確認

6. **公開状態を決める**
   - ダミー案件を含む → `status: draft` に戻す
   - 実リンクのみ・検証OK → `status: published` のまま

7. **報告する**（この形式で）
   - 作成・変更したファイル
   - 検証結果（validate / build のエラー件数・警告件数と内容）
   - LPのURL（ローカル：`/lp/{slug}/`）
   - 判断してほしいこと（ランキング順・ダミーリンクの差し替え・規制カテゴリなど）
