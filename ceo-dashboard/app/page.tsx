import { redirect } from 'next/navigation';

// 暮らし・資産・事業の全体を確認するHOMEを起動画面にする。
export default function RootPage() {
  redirect('/home');
}
