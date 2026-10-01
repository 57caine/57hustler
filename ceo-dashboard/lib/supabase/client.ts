import { createBrowserClient } from '@supabase/ssr';

// ブラウザ（Client Component）から使うSupabaseクライアント。
// NEXT_PUBLIC_*はSupabaseの設計上、クライアントバンドルに含まれることを
// 前提にしたanonキー（RLSで保護される前提の公開鍵）。service_role keyとは別物で、
// こちらはクライアントに公開しても問題ない値。STEP1では未使用（ログイン/ログアウトは
// Server Action経由）だが、将来のクライアント側セッション参照用に用意しておく。
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
