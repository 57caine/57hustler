import { redirect } from 'next/navigation';

// ナビゲーションを「改善レビュー」「アナリティクス」の2つに絞ったため、
// ルート（旧ダッシュボードトップ）は改善レビューへリダイレクトする
export default function RootPage() {
  redirect('/column-review');
}
