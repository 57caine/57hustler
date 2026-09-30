import { redirect } from 'next/navigation';

// 「AIチームの司令塔」化（2026-09-30）に伴い、MONEY画面へ統合・移設
export default function AnalyticsRedirect() {
  redirect('/money');
}
