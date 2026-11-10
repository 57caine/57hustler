// Evidence gate only: never executes commands, publishes, or grants permissions.
import { createHash } from 'node:crypto';
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const evidence = value => Array.isArray(value) && value.length > 0 && value.every(e => text(e.url) && text(e.result) && Number.isFinite(Date.parse(e.checked_at)));
export function createTask(spec) {
  requireValue(text(spec.task) && text(spec.owner) && text(spec.rollback), 'Task, owner and rollback required');
  requireValue(Array.isArray(spec.acceptance) && spec.acceptance.length > 0 && spec.acceptance.every(text) && new Set(spec.acceptance).size === spec.acceptance.length, 'Unique acceptance criteria required');
  requireValue(evidence(spec.evidence), 'Dated source evidence required');
  requireValue(['existing', 'final'].includes(spec.approval), 'Explicit approval route required');
  return { version: 1, revision: 0, spec: structuredClone(spec), contract: hash(spec), status: 'queued', attempts: 0, history: [] };
}
export function transition(state, event) {
  requireValue(state.version === 1 && state.contract === hash(state.spec), 'Contract changed');
  requireValue(event.revision === state.revision, 'Stale revision');
  requireValue(event.actor === state.spec.owner, 'Wrong task owner');
  const next = structuredClone(state);
  const at = new Date().toISOString();
  const from = state.status;
  if (event.type === 'implement') {
    requireValue(['queued', 'implementing'].includes(from), 'Cannot implement in this state');
    requireValue(sha(event.commit_sha), 'Full commit SHA required');
    next.commit_sha = event.commit_sha;
    next.status = 'verifying';
  } else if (event.type === 'verify') {
    requireValue(from === 'verifying' && event.commit_sha === state.commit_sha, 'Verification SHA mismatch');
    requireValue(Array.isArray(event.checks), 'Checks required');
    const checks = event.checks;
    requireValue(checks.length === state.spec.acceptance.length && new Set(checks.map(c => c.name)).size === checks.length && state.spec.acceptance.every(name => checks.some(c => c.name === name)), 'All fixed criteria must be checked exactly once');
    requireValue(checks.every(c => ['pass', 'fail', 'not_run'].includes(c.result) && evidence(c.evidence)), 'Every check needs evidence');
    next.checks = checks;
    next.attempts++;
    if (checks.every(c => c.result === 'pass')) next.status = state.spec.approval === 'existing' ? 'ready' : 'awaiting_approval';
    else next.status = next.attempts >= 3 ? 'blocked' : 'implementing';
  } else if (event.type === 'approve') {
    // Approval is deliberately NOT accepted from an AI event. An external verified
    // owner-approval adapter is required before this route can be implemented.
    throw new Error('Owner approval requires a verified external adapter; AI cannot approve');
  } else if (event.type === 'published') {
    requireValue(from === 'ready' && event.commit_sha === state.commit_sha, 'Publication SHA mismatch or gate not ready');
    requireValue(evidence(event.evidence), 'Publication evidence required');
    next.publication = event.evidence;
    next.status = 'observing';
  } else if (event.type === 'observe') {
    requireValue(from === 'observing' && evidence(event.evidence), 'Observation evidence required');
    requireValue(text(event.conclusion), 'State outcome including unknown explicitly');
    next.observation = { evidence: event.evidence, conclusion: event.conclusion };
    next.status = 'done';
  } else throw new Error('Unknown event');
  next.revision++;
  next.history.push({ revision: next.revision, from, to: next.status, type: event.type, at, event: structuredClone(event) });
  return next;
}
