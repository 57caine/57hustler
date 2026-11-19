# 3AI共通協議室 — MCP本番直前の接続準備

追跡: https://github.com/57caine/57hustler/issues/242

## 今回の準備範囲
- 遠隔MCP入口（Next.js `POST /api/consensus/mcp`）
- ツール：`submit_question`、`get_status`、`get_result`、`submit_review`
- stateless HTTP JSON-RPC (version 2025-11-25)、`initialize`、`ping`、`tools/list`、`tools/call`
- 既存Supabaseの本人所有RLSを使い、質問や利用者が持ち込んだ回答を保存・取得する
- ツール応答は `automatedConsensus:false`。他社AIを呼ばず `user_supplied` として記録

## 本番公開しない理由
- `MCP_BRIDGE_ENABLED` は既定でfalse。true以外は必ず503を返す
- 外部MCPクライアントの正式OAuth2.1接続未実装。現状はSupabase user access JWT bearerを認証に使うコードで、**ChatGPT/Claude/Geminiの一般ユーザー向けOAuth連携はまだ行えない**
- OAuthのclient authorization、audience、scope、token lifecycle、CSRF保護、同意画面、同時実行のレート制限は未実装
- Supabase JWTを第三者チャットに貼る運用は**禁止**。秘密鍵・サービスロールキーをチャットに渡さない
- 公式の3AIモデル自動呼出し、相互査読、自動合議、費用計測は未実装

## 自動テスト
- MCPツール名と閉じたJSON schema、JSON-RPCの受理/拒否、UUID、重複防止キー、第三者のowner_id指定拒否
- GitHub Actions: TypeScript型検証、MCP契約テスト、従来のJARVISテスト、Next.jsビルド
- 認可済みブラウザの E2E と3つの公式クライアント実接続は未実施

## 本番直前の必要作業
1. OAuth2.1の実装と、公式クライアントが使えるアクセストークン/対象 audience / scope の検証
2. ツール利用回数のサーバー側レート制限、監査、データ共有同意と削除フロー
3. 開発/preview環境で各公式チャットの接続と質問・回答の実機検証
4. 各AIのアカウントでMCP利用可否を確認。ChatGPTの一般プランではカスタム接続可否がプラン依存
5. 最終セキュリティレビュー後にPRをマージし、設定を段階的に有効化

## 公式資料
- MCP Streamable HTTP: https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
- MCP Authorization: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
- ChatGPT: https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt
- Claude: https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- Gemini: https://support.google.com/gemini/answer/17209137

**運用上の禁止**: MCP接続のために本人のSupabaseトークンやGitHubトークンをチャットで共有しない。追加のモデルAPI従量課金を開始しない。
