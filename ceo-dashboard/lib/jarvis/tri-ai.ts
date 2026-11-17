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
const APPROVAL_TERMS = /公開|deploy|本番|削除|送信|投稿|支払い|決済|契約|購入|課金|権限|merge|マージ|送金|口座|secret|認証/i;
const DRAFT_TERMS = /実装|改修|修正|コード|PR|issue|調査して作|作成|つくって/i;

export function classifyGate(request: string): Gate {
  if (APPROVAL_TERMS.test(request)) return 'owner_approval';
  if (DRAFT_TERMS.test(request)) return 'draft_only';
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
