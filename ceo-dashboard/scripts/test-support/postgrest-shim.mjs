// TEST TOOL ONLY (never deployed). A minimal PostgREST-compatible HTTP surface over a REAL PostgreSQL,
// so the unmodified supabase-js client inside the real Next.js server can talk to the REAL migrations'
// SQL functions without a hosted Supabase project. Runs queries as the production role `service_role`.
//   usage: node postgrest-shim.mjs <port> <postgres-url>
import http from 'node:http';
import pg from 'pg';
const [port, url] = [Number(process.argv[2]), process.argv[3]];
const pool = new pg.Pool({ connectionString: url, max: 20, options: '-c role=service_role' });
const TABLES = {
  ai_consensus_oauth_revocations: ['jti', 'subject', 'expires_at', 'revoked_at'],
  ai_consensus_requests: ['id', 'owner_id', 'origin', 'question', 'status', 'idempotency_key', 'created_at'],
  ai_consensus_contributions: ['id', 'request_id', 'agent', 'content', 'provenance', 'created_at'],
};
const procSet = new Map();
const send = (res, status, body, extra = {}) => { res.writeHead(status, { 'content-type': 'application/json', ...extra }); res.end(body === undefined ? '' : JSON.stringify(body)); };
const readBody = req => new Promise(r => { const c = []; req.on('data', d => c.push(d)); req.on('end', () => r(Buffer.concat(c).toString('utf8'))); });
const ident = s => { if (!/^[a-z_][a-z0-9_]*$/.test(s)) throw new Error('bad identifier'); return s; };

async function rpc(name, args, res) {
  ident(name);
  if (!procSet.has(name)) {
    const r = await pool.query("select bool_or(proretset) s from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname=$1", [name]);
    if (r.rows[0].s === null) return send(res, 404, { message: 'function not found' });
    procSet.set(name, r.rows[0].s);
  }
  const keys = Object.keys(args).map(ident);
  const r = await pool.query(`select * from public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(',')})`, keys.map(k => args[k]));
  send(res, 200, procSet.get(name) ? r.rows : r.rows[0]?.[name] ?? null);
}
function filters(params, cols, values) {
  const where = [];
  for (const [k, v] of params) {
    if (['select', 'order', 'limit', 'on_conflict'].includes(k)) continue;
    if (!cols.includes(k) || !v.startsWith('eq.')) throw new Error('unsupported filter');
    values.push(v.slice(3)); where.push(`${ident(k)} = $${values.length}`);
  }
  return where.length ? ' where ' + where.join(' and ') : '';
}
async function table(name, req, res, u) {
  const cols = TABLES[name]; if (!cols) return send(res, 404, { message: 'unknown table' });
  const sel = (u.searchParams.get('select') || '*').split(',').map(c => c.trim());
  const outCols = sel[0] === '*' ? cols : sel.filter(c => cols.includes(c));
  const wantOne = (req.headers.accept || '').includes('vnd.pgrst.object');
  const finish = rows => {
    if (!wantOne) return send(res, 200, rows);
    if (rows.length !== 1) return send(res, 406, { code: 'PGRST116', details: `The result contains ${rows.length} rows`, hint: null, message: 'JSON object requested, multiple (or no) rows returned' });
    return send(res, 200, rows[0]);
  };
  if (req.method === 'GET') {
    const values = []; let sql = `select ${outCols.map(ident).join(',')} from public.${name}` + filters(u.searchParams, cols, values);
    const order = u.searchParams.get('order'); if (order) { const [c, d] = order.split('.'); sql += ` order by ${ident(c)} ${d === 'desc' ? 'desc' : 'asc'}`; }
    return finish((await pool.query(sql, values)).rows);
  }
  if (req.method === 'POST') {
    const rows = [].concat(JSON.parse(await readBody(req)));
    const prefer = req.headers.prefer || '';
    const out = [];
    for (const row of rows) {
      const ks = Object.keys(row).filter(k => cols.includes(k)); if (ks.length !== Object.keys(row).length) throw new Error('unknown column');
      let sql = `insert into public.${name} (${ks.map(ident).join(',')}) values (${ks.map((_, i) => '$' + (i + 1)).join(',')})`;
      const conflict = u.searchParams.get('on_conflict');
      if (conflict && prefer.includes('ignore-duplicates')) sql += ` on conflict (${conflict.split(',').map(ident).join(',')}) do nothing`;
      sql += ` returning ${outCols.map(ident).join(',')}`;
      out.push(...(await pool.query(sql, ks.map(k => row[k]))).rows);
    }
    if (!prefer.includes('return=representation')) return send(res, 201, undefined);
    return finish(out);
  }
  send(res, 405, { message: 'unsupported' });
}
http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    const rpcMatch = u.pathname.match(/^\/rest\/v1\/rpc\/([a-z_]+)$/);
    if (rpcMatch && req.method === 'POST') return await rpc(rpcMatch[1], JSON.parse((await readBody(req)) || '{}'), res);
    const t = u.pathname.match(/^\/rest\/v1\/([a-z_]+)$/);
    if (t) return await table(t[1], req, res, u);
    send(res, 404, { message: 'not found' });
  } catch (e) { send(res, 400, { message: String(e.message || e), code: 'SHIM' }); }
}).listen(port, '127.0.0.1', () => console.log('postgrest-shim listening on ' + port));
