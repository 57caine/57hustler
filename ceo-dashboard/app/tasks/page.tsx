import { redirect } from 'next/navigation';

// 「AIチームの司令塔」化（2026-09-30）に伴い、ALERT画面へ統合・移設
export default function TasksRedirect() {
  redirect('/alert');
}
