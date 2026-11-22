/**
 * Server-only persistent token revocation lookup. Supply a service-role client
 * from a trusted server handler; never pass its credential to MCP callers.
 * Database errors MUST reject authorization rather than imply "not revoked".
 */
export type RevocationDatabase = {
  from(table: 'ai_consensus_oauth_revocations'): {
    select(columns: 'jti'): {
      eq(column: 'jti', value: string): {
        maybeSingle(): PromiseLike<{ data: { jti: string } | null; error: unknown }>;
      };
    };
  };
};
export function createRevocationLookup(db: RevocationDatabase): (jti: string) => Promise<boolean> {
  return async (jti: string) => {
    if (!/^[0-9a-f]{32}$/.test(jti)) throw new Error('Invalid token identifier');
    const {data,error} = await db.from('ai_consensus_oauth_revocations')
      .select('jti').eq('jti',jti).maybeSingle();
    if (error) throw new Error('Revocation store unavailable');
    return data !== null;
  };
}
