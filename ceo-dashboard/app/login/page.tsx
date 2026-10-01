import { login } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectedFrom?: string }>;
}) {
  const { error, redirectedFrom } = await searchParams;

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <form
        action={login}
        className="w-full max-w-sm rounded-xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
          57hustler CEO
        </div>
        <h1 className="text-lg font-bold mb-5">ログイン</h1>

        {error && (
          <div
            className="mb-4 text-xs rounded-lg px-3 py-2"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            {error}
          </div>
        )}

        <input type="hidden" name="redirectedFrom" value={redirectedFrom ?? '/today'} />

        <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
          メールアドレス
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full mb-4 rounded-lg px-3 py-2 text-sm"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />

        <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
          パスワード
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full mb-5 rounded-lg px-3 py-2 text-sm"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />

        <button
          type="submit"
          className="w-full rounded-lg py-2.5 text-sm font-bold"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
