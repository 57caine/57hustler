/**
 * JARVIS tri-AI preflight.
 * No model API is called here. The packet can be reviewed or routed by a
 * separately authorized executor once provider credentials and spend guards exist.
 */
export type Agent = 'gpt' | 'claude' | 'gemini';
export type Review = { agent: Agent; verdict: 'approve' | 'revise' | 'reject'; reasoning: string; evidence: string[]; risks: string[] };
export type Gate = 'read_only' | 'draft_only' | 'owner_approval';
export type Packet = {
  id: string; createdAt: string; request: string; gate: Gate; state: 'awaiting_provider_connections';
  assignments: Record<Agent, string>; acceptance: string[];
  reviews: Review[]; consensus: null; unresolved: string[];
};

const MODEL_ROLES: Record<Agent, string> = {
  gpt: '責任者: 事業上の目標、費用対効果、優先順位、完了条件を検証する',
  claude: '実装査読: 既存コードとの整合、テスト、実行手順、巻き戻しを検証する',
  gemini: '独立検証: 事実と反証、データ欠損、他の選択肢を検証する',
};
// Classify *requested action*, not a mere mention of risky subjects.
const STATUS_QUESTION = /(?:できて(?:る|いる)?|済み|完了|どうな|状況|確認|状態|進捗|何が|いつ|方法|教えて|とは|いくら|可能|できる|対応済|動いてる|統合でき)/;
const REQUEST_VERB = /(?:して|進めて|やって|お願い|実施|実行|反映|してください|しよう|しろ|頼む|GO$)/i;
const APPROVAL_ACTION = /(?:本番.{0,12}(?:反映|公開|投入)|(?:公開|デプロイ|deploy|マージ|merge|削除|送金|決済|支払い|契約|購入|課金|権限変更|送信|投稿|認証情報変更).{0,18}(?:して|進めて|やって|お願い|実施|実行|ください|しよう|しろ|頼む|GO$))/i;
const DRAFT_ACTION = /(?:実装|改修|修正|コード|PR|issue|作成|制作|設計|テスト|ブラッシュアップ|改善).{0,20}(?:して|進めて|やって|お願い|実施|実行|ください|しよう|しろ|頼む|GO$)|(?:資料|記事|レポート|原稿|文章|設計書|下書き)を(?:作成|制作|作って)/i;

export function classifyGate(request: string): Gate {
  const text = request.trim();
  // A status question is read-only even when it mentions production or payment.
  if (STATUS_QUESTION.test(text) && !REQUEST_VERB.test(text)) return 'read_only';
  if (APPROVAL_ACTION.test(text)) return 'owner_approval';
  if (DRAFT_ACTION.test(text)) return 'draft_only';
  // Fail closed for ambiguous imperative requests that may mutate data.
  if (REQUEST_VERB.test(text)) return 'owner_approval';
  return 'read_only';
}
export function preparePacket(request: string, now = new Date()): Packet {
  const normalized = request.trim();
  if (!normalized || normalized.length > 500) throw new Error('1〜500文字の相談を入力してください');
  const gate = classifyGate(normalized);
  const brief = `依頼: ${normalized}\n作業権限: ${gate}。新規課金・外部公開・破壊的操作は承認まで禁止。推測と取得不可を区別し、確認可能な根拠を示すこと。`;
  return {
    id: `preflight-${now.toISOString().replace(/[-:.]/g, '')}`,
    createdAt: now.toISOString(), request: normalized, gate,
    state: 'awaiting_provider_connections',
    assignments: {
      gpt: `${MODEL_ROLES.gpt}\n${brief}`,
      claude: `${MODEL_ROLES.claude}\n${brief}`,
      gemini: `${MODEL_ROLES.gemini}\n${brief}`,
    },
    acceptance: [
      '3AIが同一の目的・対象・制約を受け取る',
      '3AIの実際の回答と根拠を保存し、合意点と対立点を表示する',
      '未取得データは不明とし、売上・クリック・確定報酬を混同しない',
      '承認ゲートを越える実行は行わず、実行済みと表示しない',
    ],
    reviews: [], consensus: null,
    unresolved: ['各プロバイダーへの認可済み接続', '利用上限と追加課金の禁止設定', '実際の3AI回答による相互査読'],
  };
}
export function reconcileReviews(reviews: Review[]) {
  const agents: Agent[] = ['gpt','claude','gemini'];
  const unique = new Set(reviews.map(r => r.agent));
  if (reviews.length !== 3 || unique.size !== 3 || agents.some(a => !unique.has(a)))
    return { status: 'incomplete' as const, summary: '3AIすべての実回答が揃っていません', disagreements: [] as string[] };
  const disagreements = reviews.flatMap(r => r.verdict === 'approve' ? [] : [`${r.agent}: ${r.verdict} — ${r.reasoning}`]);
  return { status: disagreements.length ? 'needs_review' as const : 'agreement' as const,
    summary: disagreements.length ? '異論があるため自動承認しません' : '全AIが賛成（実行承認とは別）',
    disagreements };
}

/**
 * A local, factual reply. This is not the result of a provider review.
 * Avoid returning full prompts as if the three models answered.
 */
export function summarizePreflight(packet: Packet): string {
  const statusQuestion = /(?:3つ|3社|3AI|三つ|三社).{0,25}(?:統合|連携|協議|接続|動い|できて|完成)/i.test(packet.request)
    || /(?:統合|連携|協議|接続).{0,25}(?:3つ|3社|3AI|三つ|三社)/i.test(packet.request);
  const status = statusQuestion
    ? 'いいえ。3AIの依頼票作成は本番で利用できますが、GPT・Claude・Geminiの実接続と相互協議はまだ有効ではありません。'
    : '3AIに共通の依頼を渡すための下書きを作成しました。実際のAIへの送信・協議・実行は行っていません。';
  const gate = packet.gate === 'read_only' ? '情報確認のみ' : packet.gate === 'draft_only' ? '下書きまで' : '本人による個別承認が必要';
  return `${status}\n\n対象：${packet.request}\n作業範囲：${gate}\n状態：3AI未接続／実回答0件／合意判定なし\n次に必要：正式な接続と費用制御、実際の協議結果の検証。\n※表示した依頼票は保存されず、送信もされません。`;
}
