import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server Component / Server Action / Route Handler から使うSupabaseクライアント。
// anonキーのみ使用（RLS前提の安全な鍵）。service_role keyはSTEP1では未使用・未設定。
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Componentから呼ばれた場合、cookie書き込みはNext.js側で無視される。
            // セッションの実際の更新はmiddleware側で行われるため実害はない。
          }
        },
      },
    }
  );
}
