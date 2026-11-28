/**
 * Owner-scoped storage port. EVERY method takes the owner id taken from a verified
 * OAuth bearer subject; implementations must filter by it (the OAuth path uses a
 * server-only service-role client, which bypasses RLS, so owner filtering is mandatory).
 */
export type RequestRow = { id: string; origin: string; question: string; status: string; created_at: string };
export type ContributionRow = { id: string; agent: string; content?: string; provenance: string; created_at: string };
export type ConsensusStore = {
  saveQuestion(owner: string, v: { origin: string; question: string; idempotencyKey: string }): Promise<RequestRow | null | 'error'>;
  findByKey(owner: string, idempotencyKey: string): Promise<RequestRow | null | 'error'>;
  getRequest(owner: string, requestId: string): Promise<RequestRow | null | 'error'>;
  listContributions(owner: string, requestId: string): Promise<ContributionRow[] | 'error'>;
  addContribution(owner: string, requestId: string, v: { agent: string; content: string }): Promise<Omit<ContributionRow, 'content'> | 'error'>;
};

type Q = { [k: string]: any };
/** Supabase adapter. `db` must be a server-only client; never pass it to callers. */
export function createSupabaseConsensusStore(db: Q): ConsensusStore {
  const cols = 'id,origin,question,status,created_at';
  return {
    async saveQuestion(owner, v) {
      const { data, error } = await db.from('ai_consensus_requests')
        .upsert({ owner_id: owner, origin: v.origin, question: v.question, idempotency_key: v.idempotencyKey },
          { onConflict: 'owner_id,idempotency_key', ignoreDuplicates: true }).select(cols).maybeSingle();
      return error ? 'error' : (data ?? null);
    },
    async findByKey(owner, key) {
      const { data, error } = await db.from('ai_consensus_requests').select(cols)
        .eq('owner_id', owner).eq('idempotency_key', key).maybeSingle();
      return error ? 'error' : (data ?? null);
    },
    async getRequest(owner, id) {
      const { data, error } = await db.from('ai_consensus_requests').select(cols)
        .eq('id', id).eq('owner_id', owner).maybeSingle();
      return error ? 'error' : (data ?? null);
    },
    async listContributions(owner, id) {
      // Ownership of the parent request is re-checked here, not assumed from the caller.
      const parent = await db.from('ai_consensus_requests').select('id').eq('id', id).eq('owner_id', owner).maybeSingle();
      if (parent.error || !parent.data) return parent.error ? 'error' : [];
      const { data, error } = await db.from('ai_consensus_contributions')
        .select('id,agent,content,provenance,created_at').eq('request_id', id).order('created_at', { ascending: true });
      return error ? 'error' : (data ?? []);
    },
    async addContribution(owner, id, v) {
      const parent = await db.from('ai_consensus_requests').select('id').eq('id', id).eq('owner_id', owner).maybeSingle();
      if (parent.error || !parent.data) return 'error';
      const { data, error } = await db.from('ai_consensus_contributions')
        .insert({ request_id: id, agent: v.agent, content: v.content, provenance: 'user_supplied' })
        .select('id,agent,provenance,created_at').single();
      return error || !data ? 'error' : data;
    },
  };
}
