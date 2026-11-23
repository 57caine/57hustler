# 3AI協議室 公式チャット接続の互換表

追跡: Issue #252 / Draft PR #251　調査日: 2026-11-23（JST）
**この表は「接続できる入口の公式仕様」であり、実機で接続成功したという証明ではありません。実機E2Eは未実施です。**

| 入口 | 接続の可否（公式情報） | 本実装との適合 | 状態 |
|---|---|---|---|
| ChatGPT（Web） | カスタムMCPサーバー接続は提供されている。ただしプランで範囲が異なり、OpenAIの説明ではBusiness・Enterprise・Eduで書き込みを含む完全なMCP対応（ベータ）。個人プランは読み取り中心との情報もあり、**アカウントの画面で要確認** | OAuth＋Streamable HTTPに対応。書き込みツール（`submit_question`・`submit_review`）は個人プランでは使えない可能性あり | 未接続・要アカウント確認 |
| Claude（Web/Desktop） | リモートMCPのカスタムコネクタは Free・Pro・Max・Team・Enterprise で利用可（Freeは1件まで）。Team/Enterpriseは所有者が追加 | OAuth対応。Claudeの戻り先URLは `https://claude.ai/api/mcp/auth_callback`（将来 `claude.com` に変わる可能性あり。両方登録を推奨）。事前登録のクライアントID入力欄あり | 未接続・準備済み |
| Gemini | 個人向けアプリの「接続アプリ」でカスタムMCP追加が可能との情報あり（公式の開発者モード文書あり）。仕様・地域・言語の制約が大きい | 後回し（依頼どおり）。非対応と分かった時点で共有URL・手動引継ぎを維持 | 未調査（後回し） |

## 本実装がまだ満たしていない接続上の条件（接続前に必須）
1. **リフレッシュトークン未対応**：アクセストークンは10分で失効し、更新手段がない。OpenAIの文書は、更新用の権限がないと元の認可の期限後に接続が切れ再認証が必要になると説明している。**実用には更新トークン（ローテーション付き）の追加が必要**。
2. **動的クライアント登録（DCR）・クライアントID用メタデータ文書は未対応**：クライアントIDと戻り先URLを環境変数 `CONSENSUS_OAUTH_CLIENTS` に事前登録する方式。ChatGPTの戻り先URLは接続設定画面で表示される値を使う（本書では推測しない）。
3. 全会話の自動取得はしない。ツールを呼ぶのはチャット側の明示操作時のみ。
4. 他社AIの自動呼び出し・自動査読は未実装。保存する回答は常に `user_supplied`（未検証）。

## 根拠（公式資料）
- ChatGPT: https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-connectors
- Claude: https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- Claude認証: https://claude.com/docs/connectors/building/authentication
- Gemini開発者モード: https://developers.google.com/connected-apps/mcp/dev-mode/usage
