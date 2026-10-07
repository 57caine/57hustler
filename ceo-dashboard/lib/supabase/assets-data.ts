import { createClient } from './server';
import { getCurrentUser } from './auth';
import type { NetWorthItem } from './home-data';

// /assets(資産管理UI)向けの読み取り専用データアクセス層。
// home-data.tsのHomeData取得は7テーブル全部を並列取得するため、
// net_worth_items単体しか使わない/assetsではその方式を使わず、
// 必要なテーブルだけを取得する。
//
// 既存の安全原則を維持:
//   - owner_idはURL/フォーム/クライアント入力から一切受け取らず、
//     常にサーバー側で取得したセッションのuser.idのみを使う
//   - RLSに加え、取得クエリ自体にも.eq('owner_id', user.id)を明示する
//   - Supabaseの生エラーはここで握り止め、呼び出し元には
//     rows:[] / error:true (または row:null)のみを渡す

export async function getNetWorthItems(): Promise<{ rows: NetWorthItem[]; error: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { rows: [], error: false };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('net_worth_items')
    .select('*')
    .eq('owner_id', user.id)
    .order('as_of_date', { ascending: false });

  return { rows: data ?? [], error: !!error };
}

// 編集・削除確認ページ用: 単一レコードを所有者チェック付きで取得する。
// 他人のid・存在しないidはどちらもrow:nullになり、区別できる情報を返さない。
export async function getNetWorthItem(id: string): Promise<{ row: NetWorthItem | null; error: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { row: null, error: false };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('net_worth_items')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();

  return { row: data ?? null, error: !!error };
}
