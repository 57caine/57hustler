import { getCurrentUser } from '../auth';
import { ActionError } from '../validation';
import { revalidatePath } from 'next/cache';

// STEP4書き込み共通基盤。
//
// 重要な原則:
// - owner_idはここで取得する認証済みuser.idのみを使う。client/formData/URLからは一切受け取らない
// - service_role keyは使用しない（呼び出し元はlib/supabase/server.tsのpublishable keyクライアントのみ）
// - エラーは常にActionError(安全な日本語メッセージ)か、GENERIC_ERRORに正規化する。
//   Supabaseの生エラー・SQL・内部構造・入力データをconsole.log等に出力しない

export const GENERIC_ERROR = '保存に失敗しました。しばらくしてから再度お試しください。';

export type ActionResult = { ok: true } | { ok: false; error: string };

// 各Server Actionの先頭で呼ぶ。未認証ならActionErrorを投げ、呼び出し元のtry/catchで
// 安全なエラーメッセージに変換される
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new ActionError('認証が必要です。再度ログインしてください');
  return user;
}

// 書き込み本体(fn)を実行し、ActionResultに正規化する。
// fn内で投げたActionErrorのmessageだけが利用者に見える。それ以外の例外(Supabaseの
// 生エラー等を含む)は全てGENERIC_ERRORに握り止める。
export async function runWrite(fn: () => Promise<void>, revalidate?: string): Promise<ActionResult> {
  try {
    await fn();
  } catch (e) {
    if (e instanceof ActionError) return { ok: false, error: e.message };
    return { ok: false, error: GENERIC_ERROR };
  }
  if (revalidate) revalidatePath(revalidate);
  return { ok: true };
}
