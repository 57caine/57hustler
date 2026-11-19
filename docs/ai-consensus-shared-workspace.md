# 3AI 共通協議室 — Phase 1
Issue: https://github.com/57caine/57hustler/issues/242

## 実装済み
- /consensus: Supabase Authでログインした本人のみ利用
- /api/consensus: 同一Originでの質問作成・回答追加、本人所有の相談の取得
- ai_consensus_requests: 本人所有、質問、受付元、重複防止キー
- ai_consensus_contributions: 手動持込のAI回答。provenance=user_supplied固定
- どちらもRLS・所有者照合、匿名アクセス不可
- 質問・回答データは本人に限定。他のAIに自動送信しない

## **未実装**
- ChatGPT/Claude/Geminiの公式チャットから同じサーバーを直接呼ぶMCP/OAuth接続
- 自動的な3AIモデル呼出しと二段階相互査読
- verified_apiの回答記録、合議の結論、実使用量・費用制御
- サーバー側のrate limitと完全な多端末・自動実行オーケストレーション

## 安全・費用
- AI APIを呼ばないため、モデル従量課金は発生しない
- DB利用枠は既存Supabaseを使用。無料枠・プラン制約は別途確認
- サードパーティの回答を手動登録しても「実際にそのAIが回答した」とは検証されない
- idempotencyKeyによる質問重複防止。回答の重複防止は未実装
- ChatGPT/Claude/Geminiのプラグイン/MCP接続に必要な認証は追加前に個別に確認する

## 受け入れ検証
1. 未ログイン GET/POST は401
2. 別オリジン POST は403
3. RLSが本人以外の行への読み書きを拒むこと
4. TypeScript型チェックとNext.js本番ビルド
5. 実ログインから新規相談→履歴→回答追加の動作確認は別途（本人の認証済みブラウザが必要）
