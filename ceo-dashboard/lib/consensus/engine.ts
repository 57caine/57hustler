/**
 * JARVIS multi-model consensus core (Issue #242).
 * Pure orchestration. No provider credentials, network calls or billing here.
 * A caller must supply explicit adapters and permission to share sanitized data.
 */
export type ProviderName = 'openai' | 'google' | 'anthropic';
export type Claim = { statement: string; evidenceUrls: string[]; confidence: 'high' | 'medium' | 'low' };
export type Opinion = {
  provider: ProviderName;
  conclusion: string;
  claims: Claim[];
  caveats: string[];
  actions: string[];
};
export type Review = {
  provider: ProviderName;
  challengedProvider: ProviderName;
  objections: { statement: string; reason: string; evidenceUrls: string[] }[];
};
export type ModelAdapter = {
  provider: ProviderName;
  analyze: (question: string) => Promise<Opinion>;
  review: (question: string, other: Opinion) => Promise<Review>;
};
export type ParticipantStatus = 'succeeded' | 'failed' | 'unavailable';
export type ConsensusResult = {
  status: 'reviewed' | 'partial' | 'unavailable';
  participants: Record<ProviderName, ParticipantStatus>;
  opinions: Opinion[];
  reviews: Review[];
  unresolved: string[];
  // Intentionally no automatically asserted final answer: adjudication requires verified evidence.
};
const PROVIDERS: ProviderName[] = ['openai', 'google', 'anthropic'];
function validOpinion(p: ProviderName, v: Opinion): boolean {
  return v?.provider === p && typeof v.conclusion === 'string'
    && Array.isArray(v.claims) && Array.isArray(v.caveats) && Array.isArray(v.actions);
}
/**
 * The host MUST confirm permission to share the question across providers.
 * When no adapters are connected, no model activity is implied.
 */
export async function collectConsensus(
  question: string,
  adapters: ModelAdapter[],
  permissionToShare: boolean,
): Promise<ConsensusResult> {
  if (!permissionToShare) throw new Error('Cross-provider sharing consent required');
  if (!question.trim() || question.length > 10000) throw new Error('Invalid question');
  const participants = Object.fromEntries(PROVIDERS.map(p => [p, 'unavailable'])) as Record<ProviderName, ParticipantStatus>;
  const supported = PROVIDERS.map(p => adapters.find(a => a.provider === p)).filter((a): a is ModelAdapter => !!a);
  const first = await Promise.allSettled(supported.map(a => a.analyze(question)));
  const opinions: Opinion[] = [];
  first.forEach((r, i) => {
    const p = supported[i].provider;
    if (r.status === 'fulfilled' && validOpinion(p, r.value)) {
      opinions.push(r.value); participants[p] = 'succeeded';
    } else participants[p] = 'failed';
  });
  const tasks = supported.flatMap(adapter =>
    opinions.filter(op => op.provider !== adapter.provider && participants[adapter.provider] === 'succeeded')
      .map(op => ({ adapter, op }))
  );
  const second = await Promise.allSettled(tasks.map(t => t.adapter.review(question, t.op)));
  const reviews = second.flatMap((r, i) =>
    r.status === 'fulfilled' && r.value?.provider === tasks[i].adapter.provider
      && r.value.challengedProvider === tasks[i].op.provider && Array.isArray(r.value.objections)
      ? [r.value] : []);
  const unresolved = reviews.flatMap(r => r.objections.map(o => o.statement + ': ' + o.reason));
  return {
    status: opinions.length === 3 && reviews.length === 6 ? 'reviewed' : opinions.length ? 'partial' : 'unavailable',
    participants, opinions, reviews, unresolved,
  };
}
