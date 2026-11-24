import { clientsFor } from '@/lib/consensus/oauth-dcr';
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/supabase/auth';
import { prepareConsent } from '@/lib/consensus/oauth-authorize-flow';
import { loadRuntime } from '@/lib/consensus/oauth-http';

export const dynamic = 'force-dynamic';

const SCOPE_TEXT: Record<string, string> = {
  'consensus.read': '協議室の質問と回答を読み取る',
  'consensus.write': '協議室に質問と回答を保存する',
};

export default async function ConsentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? '';
  const rt = loadRuntime('https://' + host);
  const params = await searchParams;
  const query = new URLSearchParams();
  let ambiguous = false;
  for (const [k, v] of Object.entries(params)) {
    if (typeof v !== 'string') { ambiguous = true; break; }
    query.set(k, v);
  }
  const user = await getCurrentUser();
  const view = rt && user && !ambiguous
    ? await prepareConsent({ query, clients: await clientsFor(rt.clients, query.get('client_id'), rt.secret, rt.dcr), subject: user.id, secret: rt.secret, nowSeconds: Math.floor(Date.now() / 1000), expectedResource: rt.issuer + '/api/consensus/mcp' })
    : null;
  if (!view) {
    return (
      <div className="max-w-md mx-auto mt-16 text-sm">
        <h1 className="text-lg font-bold mb-2">接続を開始できません</h1>
        <p>リクエストが無効か、この機能は現在無効です。接続元のチャットに戻ってやり直してください。</p>
      </div>
    );
  }
  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="text-[10px] uppercase tracking-widest mb-1">57hustler 3AI協議室</div>
      <h1 className="text-lg font-bold mb-3">「{view.clientName}」の接続を許可しますか</h1>
      <p className="text-sm mb-3">ログイン中のあなた本人のデータにだけ、次の操作を許可します。</p>
      <ul className="text-sm list-disc pl-5 mb-3">
        {view.request.scopes.map(s => <li key={s}>{SCOPE_TEXT[s]}</li>)}
      </ul>
      <p className="text-xs mb-4">許可しても、他のAIモデルの自動呼び出しや追加課金は発生しません。トークンは10分で失効します。</p>
      <form method="post" action="/api/consensus/oauth/consent" className="flex gap-3">
        <input type="hidden" name="authorization_query" value={query.toString()} />
        <input type="hidden" name="csrf" value={view.csrf} />
        <button name="decision" value="approve" type="submit" className="rounded-lg px-4 py-2 text-sm font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>許可する</button>
        <button name="decision" value="deny" type="submit" className="rounded-lg px-4 py-2 text-sm" style={{ border: '1px solid var(--border)' }}>拒否する</button>
      </form>
    </div>
  );
}
