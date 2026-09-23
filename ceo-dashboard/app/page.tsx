import { redirect } from 'next/navigation';

// ナビゲーションを「改善レビュー」「アナリティクス」の2つに絞ったため、
// ルート（旧ダッシュボードトップ）は改善レビューへリダイレクトする（2026-09-23）
export default function RootPage() {
  redirect('/column-review');
}
