import { redirect } from 'next/navigation';

// 「AIチームの司令塔」化（2026-09-30）に伴い、起動画面をTODAYに変更
export default function RootPage() {
  redirect('/today');
}
