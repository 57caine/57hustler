import type { Metadata } from 'next';
import Link from 'next/link';
import StaticPage from '@/components/StaticPage';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = { title: '運営者情報' };

export default function OperatorPage() {
  const rows: [string, React.ReactNode][] = [
    ['サイト名', SITE_NAME],
    ['運営目的', 'エリア・テーマ別の宿泊施設の比較・案内'],
    ['開設', '2026年'],
    ['お問い合わせ', <Link key="c" href="/contact" className="text-season underline">お問い合わせページ</Link>],
  ];
  return (
    <StaticPage title="運営者情報" href="/operator">
      <table className="w-full border-collapse">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-black/5">
              <th className="text-left py-3 pr-6 text-gray-500 font-medium w-32 align-top">{k}</th>
              <td className="py-3">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StaticPage>
  );
}
