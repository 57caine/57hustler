import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/supabase/auth';
import { issueConsentCsrf } from '@/lib/consensus/oauth-csrf';
import { loadRuntime } from '@/lib/consensus/oauth-http';
import { serverDatabase } from '@/lib/consensus/oauth-server';

export const dynamic = 'force-dynamic';

const SCOPE_TEXT: Record<string, string> = {
  'consensus.read': '読み取り', 'consensus.write': '保存',
};
const fmt = (s: number) => new Date(s * 1000).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
const REASON: Record<string, string> = {
  owner: '本人が解除', client: '接続元が解除', refresh_reuse: '不正な再利用を検知して自動解除',
  code_reuse: '認可コードの再利用を検知して自動解除', admin: '管理操作で解除',
};

/** The owner sees only their OWN connections and can cut any of them off immediately. */
export default async function GrantsPage() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? '';
  const rt = loadRuntime('https://' + host);
  const user = await getCurrentUser();
  const server = serverDatabase();
  if (!rt || !user || !server) {
    return <div className="max-w-md mx-auto mt-16 text-sm"><h1 className="text-lg font-bold mb-2">表示できません</h1><p>この機能は現在無効です。</p></div>;
  }
  const grants = await server.refresh.listGrants(user.id).catch(() => null);
  if (!grants) return <div className="max-w-md mx-auto mt-16 text-sm"><p>接続一覧を取得できませんでした。時間をおいて再度お試しください。</p></div>;
  const now = Math.floor(Date.now() / 1000);
  const rows = await Promise.all(grants.map(async g => ({
    g, active: g.revokedAtSeconds === null && g.expiresAtSeconds > now,
    csrf: await issueConsentCsrf({ secret: rt.secret, subject: user.id, query: new URLSearchParams({ revoke_grant: g.grantId }), nowSeconds: now }),
  })));
  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <div className="text-[10px] uppercase tracking-widest mb-1">57hustler 3AI協議室</div>
      <h1 className="text-lg font-bold mb-3">接続中のAIチャット</h1>
      <p className="text-xs mb-4">解除すると、その接続のアクセスと更新は直ちにできなくなります。再度使うには接続し直してください。</p>
      {rows.length === 0 && <p className="text-sm">接続はありません。</p>}
      <ul className="space-y-3">
        {rows.map(({ g, active, csrf }) => (
          <li key={g.grantId} className="rounded-lg p-3 text-sm" style={{ border: '1px solid var(--border)' }}>
            <div className="font-bold">{g.clientId}</div>
            <div className="text-xs">権限: {g.scopes.map(s => SCOPE_TEXT[s] ?? s).join('・')}　接続: {fmt(g.createdAtSeconds)}　期限: {fmt(g.expiresAtSeconds)}</div>
            {active ? (
              <form method="post" action="/api/consensus/oauth/grants/revoke" className="mt-2">
                <input type="hidden" name="grant_id" value={g.grantId} />
                <input type="hidden" name="csrf" value={csrf} />
                <button type="submit" className="rounded-lg px-3 py-1 text-xs font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>この接続を解除する</button>
              </form>
            ) : (
              <div className="text-xs mt-1">解除済み／期限切れ{g.revokeReason ? '（' + (REASON[g.revokeReason] ?? g.revokeReason) + '）' : ''}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
