# JARVIS-Affiliate

設定ファイル（Markdown / JSON）を書き換えるだけで、アフィリエイトLPの公開・SNS集客・改善提案が回る基盤です。

## はじめて動かす

```bash
cd jarvis-affiliate
npm install
cp .env.example .env
npm run dev        # → http://localhost:4321/lp/sample-campaign/
```

## 毎日の使い方（Claude Code で）

| やりたいこと | 打つコマンド |
|---|---|
| 新しいLPを作る | `/new-lp 〇〇向けに△△を比較したい。A8のリンクは…` |
| 法規制・リンクの監査 | `/check-compliance` |
| 数値確認＋SNS投稿案 | `/daily-growth` |

## 仕組み（1枚で）

```
content/campaigns/xxx.md ──┐
config/affiliates.json ────┼─→ astro build ─→ dist/lp/xxx/index.html（静的HTML）
config/compliance-rules.md ┘        ↑ 前後で validate-links.ts が自動チェック

公開LP ─→ generate-social-posts.ts ─→ output/social/（X・Threads投稿案）
GA4・ASPのCSV ─→ analyze-metrics.ts ─→ output/reports/（改善提案）
```

詳しいルールは `CLAUDE.md` を参照。
