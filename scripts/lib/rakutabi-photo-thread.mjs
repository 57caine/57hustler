// Not connected to a scheduler. Transport and durable storage are deliberately
// supplied by the release adapter, never by draft JSON.
import { createHash } from 'node:crypto';

function requireValue(ok, reason) { if (!ok) throw new Error(reason); }
function https(value) {
  const u = new URL(value);
  requireValue(u.protocol === 'https:' && !u.username && !u.password && !u.hash, 'Invalid HTTPS URL');
  return u;
}
function text(value) {
  requireValue(typeof value === 'string' && value.trim() && value.length <= 500, 'Invalid text length');
}
function date(value) {
  requireValue(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, 'Invalid date');
}
export function preparePhotoThread(draft, { today, allowedDestinations, allowedImageHosts }) {
  date(today); date(draft.date);
  requireValue(draft.brand === 'rakutabi' && typeof draft.id === 'string' && /^[a-z0-9-]{1,80}$/.test(draft.id), 'Invalid campaign identity');
  requireValue(draft.date === today, 'Outside approved posting date');
  text(draft.parent); text(draft.reply);
  requireValue(!/https?:\/\//i.test(draft.parent + draft.reply), 'Use the separately approved destination');
  const destination = https(draft.destination).href;
  requireValue(allowedDestinations.includes(destination), 'Unapproved destination');
  const a = draft.advertising;
  requireValue(a && typeof a.evidence === 'string' && a.evidence.trim(), 'Missing advertising assessment');
  requireValue(['required', 'optional'].includes(a.status), 'Advertising assessment unresolved');
  requireValue(typeof a.hasProvisionOrDirection === 'boolean', 'Missing provision/direction assessment');
  requireValue(a.status !== 'optional' || a.hasProvisionOrDirection === false, 'Disclosure required');
  const prefix = a.status === 'required' ? '【広告】\n' : '';
  const parent = prefix + draft.parent;
  const reply = prefix + draft.reply + '\n\n' + destination;
  text(parent); text(reply);
  requireValue(Array.isArray(draft.photos) && draft.photos.length >= 2 && draft.photos.length <= 4, 'Use 2–4 photos');
  requireValue(new Set(draft.photos.map(p => p.url)).size === draft.photos.length, 'Duplicate photo');
  for (const p of draft.photos) {
    const u = https(p.url);
    requireValue(allowedImageHosts.includes(u.hostname), 'Unapproved image host');
    text(p.alt);
    const r = p.rights;
    requireValue(r && r.commercialSocial === true && r.platformRedistribution === true, 'Photo rights unconfirmed');
    requireValue(['own-photo', 'explicit-license'].includes(r.basis), 'Unsupported photo rights basis');
    requireValue(typeof r.holder === 'string' && r.holder.trim() && typeof r.credit === 'string', 'Missing rights holder/credit');
    https(r.evidenceUrl);
    date(r.checkedOn); date(r.validThrough);
    requireValue(r.checkedOn <= today && r.validThrough >= today, 'Photo license date invalid');
    // Credit must be visible in the actual parent caption, not just metadata.
    requireValue(!r.credit || parent.includes(r.credit), 'Photo credit missing from caption');
  }
  const plan = {
    id: draft.id, date: draft.date, brand: 'rakutabi',
    expectedHandle: 'rakutabi_navi', parent, reply,
    photos: draft.photos, destination, advertising: a,
  };
  return { ...plan, fingerprint: createHash('sha256').update(JSON.stringify(plan)).digest('hex') };
}

// The adapter must hold a cross-process exclusive lock for this entire call,
// and atomically persist save() before it resolves. Never automatically clear
// an uncertain stage. No scheduler or live release entrypoint is provided.
export async function runPhotoThread(plan, { api, journal, approval, today }) {
  plan = structuredClone(plan);
  const { fingerprint, ...content } = plan;
  requireValue(fingerprint === createHash('sha256').update(JSON.stringify(content)).digest('hex'), 'Campaign mutated after preparation');
  requireValue(approval?.fingerprint === plan.fingerprint && approval?.date === today && today === plan.date, 'Exact publication approval required');
  const me = await api.identity();
  requireValue(me.username === plan.expectedHandle && /^\d+$/.test(me.id), 'Account mismatch');
  return journal.exclusive(plan.id, async () => {
    let state = await journal.load(plan.id);
    if (state) {
      requireValue(state.fingerprint === plan.fingerprint && state.accountId === me.id, 'Campaign or account changed');
      requireValue(state.stage === 'complete', 'Inspect partial or uncertain publication before continuing');
      return state;
    }
    const history = await api.history();
    requireValue(history.complete === true && Array.isArray(history.posts), 'Incomplete history');
    requireValue(!history.posts.some(p => p.text === plan.parent || p.text === plan.reply ||
      (typeof p.text === 'string' && p.text.includes(plan.destination))), 'Already published');
    state = { fingerprint: plan.fingerprint, accountId: me.id, stage: 'preparing' };
    await journal.save(plan.id, state);
    const children = [];
    for (const photo of plan.photos) {
      const child = await api.create({ media_type: 'IMAGE', image_url: photo.url, alt_text: photo.alt, is_carousel_item: true });
      requireValue(/^\d+$/.test(child.id), 'Missing image container');
      requireValue(await api.status(child.id) === 'FINISHED', 'Image not ready');
      children.push(child.id);
    }
    const parent = await api.create({ media_type: 'CAROUSEL', children: children.join(','), text: plan.parent, topic_tag: '国内旅行' });
    requireValue(/^\d+$/.test(parent.id), 'Missing carousel container');
    requireValue(await api.status(parent.id) === 'FINISHED', 'Carousel not ready');
    // Write intent BEFORE publish. Timeout or failed save after publish must
    // leave the campaign blocked across process restarts.
    state = { ...state, stage: 'parent-publish-intent', parentContainerId: parent.id };
    await journal.save(plan.id, state);
    const parentPost = await api.publish(parent.id);
    requireValue(/^\d+$/.test(parentPost.id), 'Missing parent post ID');
    state = { ...state, stage: 'parent-published', parentPostId: parentPost.id };
    await journal.save(plan.id, state);
    const reply = await api.create({ media_type: 'TEXT', text: plan.reply, reply_to_id: parentPost.id });
    requireValue(/^\d+$/.test(reply.id), 'Missing reply container');
    requireValue(await api.status(reply.id) === 'FINISHED', 'Reply not ready');
    state = { ...state, stage: 'reply-publish-intent', replyContainerId: reply.id };
    await journal.save(plan.id, state);
    const replyPost = await api.publish(reply.id);
    requireValue(/^\d+$/.test(replyPost.id), 'Missing reply post ID');
    state = { ...state, stage: 'complete', replyPostId: replyPost.id };
    await journal.save(plan.id, state);
    return state;
  });
}
