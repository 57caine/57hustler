# 3AI協議室 公式チャット接続の互換表

追跡: Issue #252 / Draft PR #251　調査日: 2026-11-23（JST）
**この表は「接続できる入口の公式仕様」であり、実機で接続成功したという証明ではありません。実機E2Eは未実施です。**

| 入口 | 接続の可否（公式情報） | 本実装との適合 | 状態 |
|---|---|---|---|
| ChatGPT（Web） | カスタムMCPサーバー接続は提供されている。ただしプランで範囲が異なり、OpenAIの説明ではBusiness・Enterprise・Eduで書き込みを含む完全なMCP対応（ベータ）。個人プランは読み取り中心との情報もあり、**アカウントの画面で要確認** | OAuth＋Streamable HTTPに対応。書き込みツール（`submit_question`・`submit_review`）は個人プランでは使えない可能性あり | 未接続・要アカウント確認 |
| Claude（Web/Desktop） | リモートMCPのカスタムコネクタは Free・Pro・Max・Team・Enterprise で利用可（Freeは1件まで）。Team/Enterpriseは所有者が追加 | OAuth対応。Claudeの戻り先URLは `https://claude.ai/api/mcp/auth_callback`（将来 `claude.com` に変わる可能性あり。両方登録を推奨）。事前登録のクライアントID入力欄あり | 未接続・準備済み |
| Gemini | 個人向けアプリの「接続アプリ」でカスタムMCP追加が可能との情報あり（公式の開発者モード文書あり）。仕様・地域・言語の制約が大きい | 後回し（依頼どおり）。非対応と分かった時点で共有URL・手動引継ぎを維持 | 未調査（後回し） |

## 本実装がまだ満たしていない接続上の条件（接続前に必須）
1. **リフレッシュトークン（2026-11-24 実装済み）**：アクセストークンは10分、更新トークンは1回限りのローテーション（30日スライド、接続の絶対期限60日）。再利用検知・本人/クライアントによる失効あり。実DB・HTTPSでは検証済みだが、**公式チャットでの更新動作は実機未確認**。
2. **動的クライアント登録（DCR）・クライアントID用メタデータ文書は未対応**：クライアントIDと戻り先URLを環境変数 `CONSENSUS_OAUTH_CLIENTS` に事前登録する方式。ChatGPTの戻り先URLは接続設定画面で表示される値を使う（本書では推測しない）。
3. 全会話の自動取得はしない。ツールを呼ぶのはチャット側の明示操作時のみ。
4. 他社AIの自動呼び出し・自動査読は未実装。保存する回答は常に `user_supplied`（未検証）。

## 根拠（公式資料）
- ChatGPT: https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-connectors
- Claude: https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- Claude認証: https://claude.com/docs/connectors/building/authentication
- Gemini開発者モード: https://developers.google.com/connected-apps/mcp/dev-mode/usage

## 接続準備（2026-11-24）— 本人操作の直前まで

調査日: 2026-11-24。ChatGPTの戻り先URLは OpenAI 開発者向け文書の検索結果を根拠にしている（全文は未確認）。Claudeの戻り先は上表のとおり。**どちらも実際の接続画面に表示される値を優先すること。**

| 項目 | ChatGPT | Claude |
|---|---|---|
| 戻り先URL（`CONSENSUS_OAUTH_CLIENTS` に完全一致で登録） | `https://chatgpt.com/connector_platform_oauth_redirect`（本サーバーが `iss` を返すため固定URL）。接続設定画面に `https://chatgpt.com/connector/oauth/{callback_id}` が表示された場合はその値も登録 | `https://claude.ai/api/mcp/auth_callback`（将来 `https://claude.com/api/mcp/auth_callback` の可能性があるため両方を登録） |
| `resource` 送信 | 認可・トークン要求に付与（本実装は自MCP URLと一致時のみ許可） | MCP仕様どおり付与（同上） |
| クライアント | 事前登録のクライアントIDを入力（機密なし・PKCEのみの公開クライアント）。入力欄の有無・必須項目は**実機で確認** | 事前登録のクライアントID入力欄あり（上表）。クライアントシークレットは不要 |
| 書き込みツール | プランによっては使えない可能性（上表のとおり、**アカウントで要確認**） | 利用可 |

### 本人が行う手順（私は実行していない／してはいけない範囲）
1. Supabase にマイグレーション5本を日付順に適用（SQL Editor か CLI。**本番DBへの適用はバックアップ確認の後、本人判断**）。適用後、`ai_consensus_oauth_grants` / `..._refresh_tokens` / `..._codes` / `..._consents` / `..._revocations` に anon・authenticated が触れないことを確認。
2. **まずPreview環境だけ**に環境変数を設定（Productionには設定しない）：`CONSENSUS_OAUTH_ISSUER`（`https://<Previewのホスト>`、末尾スラッシュなし）、`CONSENSUS_OAUTH_SIGNING_SECRET`（`openssl rand -hex 32`）、`CONSENSUS_OAUTH_CLIENTS`（例: `[{"clientId":"<ランダム文字列>","name":"Claude","redirectUris":["https://claude.ai/api/mcp/auth_callback","https://claude.com/api/mcp/auth_callback"]}]`）、`SUPABASE_SERVICE_ROLE_KEY`（サーバー専用。**チャットに貼らない**）。
3. 最後に3ゲート `MCP_BRIDGE_ENABLED` `CONSENSUS_OAUTH_TOKEN_EXCHANGE_ENABLED` `CONSENSUS_OAUTH_AUTHORIZATION_ENABLED` を Preview だけ `true`。
4. Claude の「設定 > コネクタ > カスタムコネクタを追加」に `https://<Previewのホスト>/api/consensus/mcp` とクライアントIDを入力 → 本人ログイン → 同意画面で許可 → `get_status` などを試す。
5. `/consensus/oauth/grants` に接続が出ること、「この接続を解除する」で次の呼出しが失敗することを確認。
6. 問題がなければ ChatGPT で同様に確認し、その後に本番有効化を判断（本PRは有効化しない）。

注意: 本番デプロイ済みのドメインでは Vercel の保護機能（Deployment Protection）が外部クライアントの到達を妨げることがある。Previewで試す場合は保護の設定を確認すること。
