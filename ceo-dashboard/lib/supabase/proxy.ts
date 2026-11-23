import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// CEOダッシュボード全体の認証ゲート。全リクエストでセッションを検証・更新し、
// 未ログインならログイン画面へリダイレクトする。
const PUBLIC_OAUTH_PATHS = new Set([
  '/.well-known/oauth-protected-resource',
  '/.well-known/oauth-authorization-server',
  '/api/consensus/oauth/token',
  '/api/consensus/mcp',
]);
// Authorization requests must survive the login round-trip with their query intact.
const PRESERVE_QUERY_PREFIXES = ['/api/consensus/oauth/authorize', '/consensus/oauth/consent'];

export async function updateSession(request: NextRequest) {
  // Exact-match allowlist (no prefix matching). Each endpoint is default-disabled by env
  // gates and authenticates itself (bearer verification / PKCE code exchange).
  if (PUBLIC_OAUTH_PATHS.has(request.nextUrl.pathname)) return NextResponse.next({ request });
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getSession()ではなく必ずgetUser()を使う。getUser()はSupabase Auth
  // サーバー側へ問い合わせて検証するため、cookie改ざんに対して安全。
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname.startsWith('/login');

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    const keepQuery = PRESERVE_QUERY_PREFIXES.includes(pathname);
    const target = keepQuery ? pathname + request.nextUrl.search : pathname;
    url.pathname = '/login';
    url.search = '';
    url.searchParams.set('redirectedFrom', target);
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
