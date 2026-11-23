import { parseArgs, rpcError, rpcOk, resultText, sameIdempotentRequest, validKey, validUuid } from './mcp-contract';
import type { ConsensusStore } from './mcp-store';

/** Tool dispatch after authentication + scope checks. `owner` is the verified subject only. */
export async function runTool(store: ConsensusStore, owner: string, id: string | number, name: string, input: unknown) {
  if (name === 'submit_question') {
    const a = parseArgs(input, ['question', 'origin', 'idempotencyKey']);
    if (!a || !a.question.trim() || a.question.length > 5000 ||
        !['chatgpt', 'claude', 'gemini', 'other'].includes(a.origin) || !validKey(a.idempotencyKey)) {
      return rpcError(id, -32602, 'Invalid question parameters');
    }
    const saved = await store.saveQuestion(owner, { origin: a.origin, question: a.question.trim(), idempotencyKey: a.idempotencyKey });
    if (saved === 'error') return rpcError(id, -32000, 'Storage unavailable');
    let row = saved;
    if (!row) {
      const existing = await store.findByKey(owner, a.idempotencyKey);
      if (existing === 'error' || !existing) return rpcError(id, -32000, 'Cannot retrieve saved request');
      row = existing;
    }
    if (!sameIdempotentRequest(row, { question: a.question, origin: a.origin })) {
      return rpcError(id, -32602, 'Idempotency key reused for different request');
    }
    return rpcOk(id, resultText({ request: row, automatedConsensus: false }));
  }
  if (name === 'get_status' || name === 'get_result') {
    const a = parseArgs(input, ['requestId']);
    if (!a || !validUuid(a.requestId)) return rpcError(id, -32602, 'Invalid request id');
    const q = await store.getRequest(owner, a.requestId);
    if (q === 'error') return rpcError(id, -32000, 'Storage unavailable');
    if (!q) return rpcError(id, -32004, 'Request not found');
    const items = await store.listContributions(owner, a.requestId);
    if (items === 'error') return rpcError(id, -32000, 'Storage unavailable');
    const summary = {
      request: q, contributionCount: items.length,
      verifiedProviderCount: items.filter(x => x.provenance === 'verified_api').length, automatedConsensus: false,
    };
    return rpcOk(id, resultText(name === 'get_status' ? summary : { ...summary, contributions: items }));
  }
  if (name === 'submit_review') {
    const a = parseArgs(input, ['requestId', 'agent', 'content']);
    if (!a || !validUuid(a.requestId) || !['gpt', 'claude', 'gemini'].includes(a.agent) ||
        !a.content.trim() || a.content.length > 16000) return rpcError(id, -32602, 'Invalid response parameters');
    const q = await store.getRequest(owner, a.requestId);
    if (q === 'error' || !q) return rpcError(id, -32004, 'Request not found');
    const saved = await store.addContribution(owner, a.requestId, { agent: a.agent, content: a.content.trim() });
    if (saved === 'error') return rpcError(id, -32000, 'Storage unavailable');
    return rpcOk(id, resultText({ contribution: saved, automatedConsensus: false }));
  }
  return rpcError(id, -32601, 'Tool not found');
}
