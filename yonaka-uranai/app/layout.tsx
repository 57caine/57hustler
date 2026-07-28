import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '夜中のおじさんの九星気学AI占い',
  description: '生年月日から本命星を算出し、AIが独自の視点で運勢を解説します。夜中のおじさん(@westin_lab)による九星気学占い。',
  openGraph: {
    title: '夜中のおじさんの九星気学AI占い',
    description: '生年月日を入力するだけ。あなたの本命星とAI診断が届きます。',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
