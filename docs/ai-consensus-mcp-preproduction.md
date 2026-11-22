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

## 2026-11-22 OAuth事前検証（未接続）
- `lib/consensus/oauth-contract.ts` にPKCE S256 challenge形式、state形式、redirect URIの登録文字列完全一致、read/write scope最小権限の検証関数を追加。
- `mcp-contract.test.ts` に16項目を追加（コード上61項目）。既存CIの契約テスト経路から読み込むが、CI実行成功は未確認。
- **これらは認可サーバーではない。** PKCE verifier照合、stateのセッション紐付け、ユーザー同意画面、authorization codeの単回利用、token発行/失効、audience/issuer検証、保護されたMCP入口へのscope適用は未実装。
- 本番MCPは引き続き無効。既存Supabase JWTを外部チャットに渡して代用しない。

## 2026-11-22 前倒し：OAuth token HTTP入口（Draft・無効）
- `POST /api/consensus/oauth/token` に `authorization_code` + `code_verifier` を受けるサーバー側ルートを追加。原子的なコード消費と署名付きBearer発行の既存ロジックを接続。
- 二重ゲート：`MCP_BRIDGE_ENABLED=true` **かつ** `CONSENSUS_OAUTH_TOKEN_EXCHANGE_ENABLED=true` が揃わなければ 503。いずれも有効化していない。
- `CONSENSUS_OAUTH_CLIENTS` は登録済み `clientId` と正確な `redirectUris` のJSON配列。`CONSENSUS_OAUTH_ISSUER` は呼出originと完全一致。署名鍵 `CONSENSUS_OAUTH_SIGNING_SECRET`・Supabaseサーバー専用 `SUPABASE_SERVICE_ROLE_KEY` を前提。秘密をクライアントに送らない。
- フォーム形式のみ、登録済みクライアント・厳格リダイレクト・4096バイト上限・重複パラメータ拒否を適用。署名付きトークンに含まれる実際の権限を応答に返す。
- **未完成・有効化禁止**：本人ログイン/同意UI、認可コード発行HTTP入口、トークン失効の永続化/照会、MCP側のOAuth bearer検証とユーザーRLS接続、OAuth discovery metadata、実DBのSQL migration、外部クライアント実機E2E。これらが完了するまで接続可能と表示しない。
- ChatGPT/Claude優先。Geminiは公式機能の地域制限を尊重し手動回答取り込みを維持。

## 2026-11-22 OAuth Protected Resource Metadata（本番無効）
- `GET /.well-known/oauth-protected-resource` を追加（RFC 9728 の保護リソース発見）。`resource` は `https://<host>/api/consensus/mcp`、`authorization_servers` は同一originのissuer、read/write scopeを広告する。
- **本番の両ゲートが無効なら503**。`CONSENSUS_OAUTH_ISSUER` が実際のHTTPS originと一致しない場合も503。
- これは発見用メタデータだけであり、**OAuth authorization server metadata /authorize / 本人同意 / MCP bearer強制は未完成**。ChatGPT・Claudeへの接続を有効と見なさない。
- 次回は最新CIを確認し、RFC 8414 authorization server metadata・authorize/consent・署名Bearer検証とRLSを優先する。

## 2026-11-22 21:31 JST 検証と接続準備
- 最新head `b24c775` のGitHub Actions [Run #56](https://github.com/57caine/57hustler/actions/runs/45020133372) は **success**。前回のJWT署名表記の改ざんテスト失敗は解消した。ただし実機接続の証明ではない。
- `/.well-known/oauth-authorization-server` にRFC 8414形式のOAuth認可サーバーメタデータを追加。既存MCP/tokenの2つのゲートに加えて `CONSENSUS_OAUTH_AUTHORIZATION_ENABLED=true` が必要。既定503。
- **このメタデータは未実装の `/api/consensus/oauth/authorize` を案内するため、本番有効化厳禁。** 同意画面・ログインと同意記録・トークン失効・MCPのBearer署名/issuer/audience/scope適用・SQL migration・実機E2E完了後にのみ公開検討。
- 今回はGitHub Draft PR #251のみ。PR #250 / Issue #242/#252との役割重複を避ける。Geminiの公式接続はブロッカーにせず手動共有を維持。

## 2026-11-23 前倒し・同意監査のDB設計（本番未適用）
- Token endpointをOAuth metadataと同じ**三重ゲート**へ統一。認可画面未完成の状態でtoken発行入口だけを有効化できないようにした。
- `20261123020000_consensus_oauth_consents.sql`：本人UUID、client ID、正確なredirect URI、承認scope、認可コードdigest、承認時刻を記録する監査テーブルを追加。利用者の直接SQLアクセス禁止、service_roleのみinsert/select、既存レコードのupdate/delete権限は付与しない。
- **未完了**：このDB migrationは適用していない。本人同意UI/CSRF、同意記録とコード発行の**同一DBトランザクション化**、認可HTTP入口、MCP resource認証の実配線、失効・RLS・レート制限の統合が必要。現時点では同意記録が実際に保存されると主張しない。
