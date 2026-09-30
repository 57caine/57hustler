import { redirect } from 'next/navigation';

// 「AIチームの司令塔」化（2026-09-30）に伴い、PDCA画面へ統合・移設
// （旧URLブックマーク対策としてリダイレクトのみ残す）
export default function ColumnReviewRedirect() {
  redirect('/pdca');
}
