// Live-capable adapters, intentionally not wired into any CLI or workflow.
// No credentials are read automatically. Production activation is a separate step.
import { randomUUID } from 'node:crypto';
const clone = value => structuredClone(value);
function numeric(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) throw Error('Invalid Threads ID');
  return value;
}

export function createThreadsPhotoApi({ token, userId, fetchImpl = fetch,
  wait = ms => new Promise(resolve => setTimeout(resolve, ms)) }) {
  if (typeof token !== 'string' || !token) throw Error('Missing Threads token');
  numeric(userId);
  let verified = false;
  async function request(path, params, method = 'GET') {
    const url = new URL('https://graph.threads.net/v1.0/' + path);
    const options = { method, redirect: 'error', signal: AbortSignal.timeout(15000),
      headers: { Authorization: 'Bearer ' + token } };
    if (method === 'GET') url.search = new URLSearchParams(params).toString();
    else options.body = new URLSearchParams(params);
    let response, body;
    try { response = await fetchImpl(url, options); body = await response.json(); }
    catch { throw Error('Threads outcome unknown; inspect saved state before retrying'); }
    if (!response.ok || body?.error) throw Error('Threads request failed: HTTP ' + response.status);
    return body;
  }
  function requireIdentity() { if (!verified) throw Error('Verify Threads identity first'); }
  return {
    async identity() {
      verified = false;
      const me = await request('me', { fields: 'id,username' });
      if (me.id !== userId || me.username !== 'rakutabi_navi') throw Error('Account mismatch');
      verified = true;
      return me;
    },
    async history() {
      requireIdentity();
      const posts = [], seen = new Set();
      let after;
      for (let page = 0; page < 10; page++) {
        const row = await request(userId + '/threads', { fields: 'id,text', limit: '100', ...(after ? { after } : {}) });
        if (!Array.isArray(row.data)) throw Error('Unreadable Threads history');
        posts.push(...row.data);
        if (!row.paging?.next) return { complete: true, posts };
        // Never follow an API-supplied URL with the credential attached.
        after = row.paging?.cursors?.after;
        if (typeof after !== 'string' || !after || seen.has(after)) break;
        seen.add(after);
      }
      return { complete: false, posts };
    },
    async create(params) {
      requireIdentity();
      const allowed = new Set(['media_type', 'image_url', 'alt_text', 'is_carousel_item', 'children', 'text', 'topic_tag', 'reply_to_id']);
      if (!params || Object.keys(params).some(k => !allowed.has(k))) throw Error('Unsupported media parameter');
      if (!['IMAGE', 'CAROUSEL', 'TEXT'].includes(params.media_type)) throw Error('Unsupported media type');
      return request(userId + '/threads', params, 'POST');
    },
    async status(id) {
      requireIdentity(); numeric(id);
      for (let attempt = 0; attempt < 6; attempt++) {
        const row = await request(id, { fields: 'status' });
        if (['FINISHED', 'ERROR', 'EXPIRED', 'PUBLISHED'].includes(row.status)) return row.status;
        if (row.status !== 'IN_PROGRESS') throw Error('Unknown media processing status');
        if (attempt < 5) await wait(60000);
      }
      throw Error('Media processing timed out');
    },
    async publish(id) {
      requireIdentity(); numeric(id);
      // Exactly one call: never retry a write after timeout or API failure.
      return request(userId + '/threads_publish', { creation_id: id }, 'POST');
    },
  };
}

// CAS store contract: read(key) -> {revision,value}|null;
// write(key,value,expectedRevision|null) atomically compares revision and returns
// the new revision. Durable remote writes must finish before resolving.
export function createPhotoJournal(store) {
  const active = new Map();
  function entry(key) {
    if (!active.has(key)) throw Error('Journal access requires exclusive lock');
    return active.get(key);
  }
  return {
    async exclusive(key, body) {
      if (typeof key !== 'string' || !/^[a-z0-9-]{1,80}$/.test(key) || active.has(key)) throw Error('Invalid or locked journal');
      // Reserve in-process before the first await as well as remote CAS.
      active.set(key, null);
      try {
        const row = await store.read(key);
        if (row && (row.value?.version !== 1 || row.value.lock !== null)) throw Error('Journal locked or corrupt; inspect before retrying');
        const record = { version: 1, lock: randomUUID(), state: row?.value.state ?? null };
        const revision = await store.write(key, record, row?.revision ?? null);
        active.set(key, { record, revision });
        const result = await body();
        const current = entry(key);
        await store.write(key, { ...current.record, lock: null }, current.revision);
        return result;
      } finally {
        // On error the durable lock remains. No TTL or automatic stale-lock
        // recovery can cause an ambiguous publish to run a second time.
        active.delete(key);
      }
    },
    async load(key) { return clone(entry(key).record.state); },
    async save(key, state) {
      const current = entry(key);
      const record = { ...current.record, state: clone(state) };
      const revision = await store.write(key, record, current.revision);
      active.set(key, { record, revision });
    },
  };
}

// Separate state branch required; never writes main or requests wider scopes.
// Branch and existing credential access must be verified before activation.
export function createGitHubPhotoStore({ token, branch, fetchImpl = fetch }) {
  if (!token || branch !== 'state/rakutabi-photo-threads') throw Error('Explicit isolated state branch required');
  async function call(key, method, data) {
    if (typeof key !== 'string' || !/^[a-z0-9-]{1,80}$/.test(key)) throw Error('Invalid state key');
    const url = new URL('https://api.github.com/repos/57caine/57hustler/contents/data/rakutabi-photo-state/' + key + '.json');
    if (method === 'GET') url.searchParams.set('ref', branch);
    let response;
    try {
      response = await fetchImpl(url, { method, redirect: 'error', signal: AbortSignal.timeout(15000),
        headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
        ...(data ? { body: JSON.stringify(data) } : {}) });
    } catch { throw Error('Journal write/read outcome unknown; inspect remote state'); }
    if (method === 'GET' && response.status === 404) return null;
    if (!response.ok) throw Error('Journal request failed: HTTP ' + response.status);
    try { return await response.json(); } catch { throw Error('Unreadable journal response'); }
  }
  return {
    async read(key) {
      const row = await call(key, 'GET');
      if (!row) return null;
      if (typeof row.sha !== 'string' || row.encoding !== 'base64' || typeof row.content !== 'string') throw Error('Invalid journal file');
      try { return { revision: row.sha, value: JSON.parse(Buffer.from(row.content, 'base64').toString('utf8')) }; }
      catch { throw Error('Invalid journal contents'); }
    },
    async write(key, value, expectedRevision) {
      const row = await call(key, 'PUT', { branch, message: 'chore: checkpoint Rakutabi photo campaign ' + key,
        content: Buffer.from(JSON.stringify(value) + '\n').toString('base64'),
        ...(expectedRevision ? { sha: expectedRevision } : {}) });
      if (typeof row?.content?.sha !== 'string') throw Error('Journal revision missing; inspect remote state');
      return row.content.sha;
    },
  };
}
