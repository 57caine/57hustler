import { cache } from 'react';
import { createClient } from './server';

// 現在ログインしているユーザーをサーバー側で取得する共通ヘルパー。
// Next.js公式のData Access Layerパターンに準拠（cache()でリクエスト内の
// 重複呼び出しを1回にまとめる）。getUser()はSupabase Auth側へ問い合わせて
// 検証するため、cookie改ざんに対して安全（getSession()は使わない）。
//
// proxy.ts(ミドルウェア)が既に未認証を/loginへリダイレクトしているが、
// Next.js公式ドキュメントが明記する通り「Proxy単体に依存せず各Server
// Function/Server Componentでも認証を検証する」ことを徹底するために、
// データ取得層の起点としてこれを必ず経由させる。
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
});
