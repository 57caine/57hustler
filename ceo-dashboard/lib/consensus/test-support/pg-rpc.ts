import type { Pool } from 'pg';

/**
 * TEST SUPPORT ONLY. Substitutes the PostgREST transport with direct SQL so the REAL production
 * adapters (createOAuthCodeStore / createRefreshStore / createConsentCodeWriter) run unmodified
 * against a REAL PostgreSQL that has the REAL migrations applied. Mirrors PostgREST's result shape:
 * set-returning functions give an array of rows, scalar functions give the bare value.
 */
export type PgRpc = { rpc(name: string, args: Record<string, unknown>): PromiseLike<{ data: unknown; error: { message?: string } | null }> };
export function pgRpc(pool: Pool): PgRpc {
  const setReturning = new Map<string, boolean>();
  return {
    async rpc(name, args) {
      if (!/^[a-z_]{1,80}$/.test(name)) return { data: null, error: { message: 'bad function name' } };
      try {
        if (!setReturning.has(name)) {
          const r = await pool.query('select bool_or(proretset) as s from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname=$1 and p.proname=$2', ['public', name]);
          if (r.rows[0]?.s === null || r.rows[0]?.s === undefined) return { data: null, error: { message: 'function not found: ' + name } };
          setReturning.set(name, r.rows[0].s === true);
        }
        const keys = Object.keys(args);
        if (keys.some(k => !/^p_[a-z_]{1,60}$/.test(k))) return { data: null, error: { message: 'bad argument name' } };
        const sql = `select * from public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')})`;
        const res = await pool.query(sql, keys.map(k => args[k]));
        // PostgREST answers JSON: timestamps arrive as ISO strings, not Date objects.
        const wire = JSON.parse(JSON.stringify(res.rows)) as Array<Record<string, unknown>>;
        if (setReturning.get(name)) return { data: wire, error: null };
        return { data: wire[0]?.[name] ?? null, error: null };
      } catch (e) { return { data: null, error: { message: e instanceof Error ? e.message : 'error' } }; }
    },
  };
}
