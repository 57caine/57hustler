/** Deterministic intent routing for the read-only JARVIS MVP.
 * Unrecognized input must NOT silently return lens metrics. */
export type Intent = 'ai_integration'|'jarvis_capability'|'earnings'|'metrics'|'owner_tasks'|'priorities'|'execution'|'unknown';
export function detectIntent(input:string):Intent {
  const t=input.trim().toLowerCase();
  if (!t) return 'unknown';
  // Status of the tri-AI integration must take precedence over generic "JARVIS".
  if (/(?:3ai|3つのai|三つのai|三社のai|gpt.{0,20}claude|gemini|クロード|ジェミニ|ai統合|ai連携|ai協議|相互査読|相互検証)/i.test(t)
      && /(?:統合|連携|稼働|接続|協議|動い|でき|状況|状態|進捗|完成|使え|確認|どう|3ai|三社)/i.test(t)) return 'ai_integration';
  if (/(?:売上|収益|利益|確定報酬|報酬|何が売れ|成約|発生金額)/.test(t)) return 'earnings';
  if (/(?:アクセス|セッション|クリック|ga4|流入|送客|数字|pv|閲覧数)/i.test(t)) return 'metrics';
  if (/(?:本人|自分が|私が|オーナー).{0,12}(?:タスク|作業|やる|必要|承認)|(?:タスク|作業).{0,8}(?:本人|オーナー)/.test(t)) return 'owner_tasks';
  if (/(?:優先|次の一手|何から|最初に|順番|何をすべき)/.test(t)) return 'priorities';
  if (/(?:実行して|進めて|go$|任せて|作業して|改修して|公開して|反映して)/i.test(t)) return 'execution';
  if (/(?:jarvis|ジャービス|ジャービス|ジャービス|ジャーヴィス|何ができ|機能|使い方|できること)/i.test(t)) return 'jarvis_capability';
  return 'unknown';
}
