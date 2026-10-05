import Link from 'next/link';
import type { Metadata } from 'next';
import AdNotice from '@/components/AdNotice';
import { ARTICLES } from '@/lib/pages';
import { INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import { SOURCES } from '@/lib/sources';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME}｜犬・猫・うさぎ・モルモットの災害への備え` },
  description: SITE_DESCRIPTION,
  alternates: SITE_URL ? { canonical: `${SITE_URL}/` } : undefined,
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};

const SECTIONS: { title: string; animal: 'dog' | 'cat' | 'small' | 'all' }[] = [
  { title: '犬', animal: 'dog' },
  { title: '猫', animal: 'cat' },
  { title: 'うさぎ・モルモット', animal: 'small' },
  { title: 'すべての飼い主に', animal: 'all' },
];

export default function Home() {
  return (
    <div>
      <div className="mt-3">
        <AdNotice />
      </div>
      <h1 className="mt-6 text-2xl font-bold leading-snug">ペットと一緒に、災害に備える</h1>
      <p className="mt-3 text-[15px] leading-relaxed">
        犬・猫・うさぎ・モルモットの飼い主向けに、災害への備えを動物ごとにまとめています。
        備えの内容は、環境省の「
        <a href={SOURCES['owner-guide'].url} target="_blank" rel="noopener noreferrer" className="underline text-brand-700">
          {SOURCES['owner-guide'].title}
        </a>
        」をもとに、出典のページを示して記載しています。
      </p>
      <p className="mt-2 text-[15px] leading-relaxed">
        用品は、防災専用の物よりも、通院や散歩など普段から使える物を中心に紹介しています。
      </p>

      <Link
        href="/checklist"
        className="mt-6 block rounded-lg border border-brand-600 bg-brand-50 px-4 py-4 text-brand-800"
      >
        <span className="block font-bold">同行避難の持ち物チェックリスト</span>
        <span className="mt-1 block text-sm">ガイドラインの優先順位にそって、持ち物と準備を確認できます</span>
      </Link>

      {SECTIONS.map((s) => {
        const pages = ARTICLES.filter((a) => a.animal === s.animal && a.path !== '/checklist');
        if (pages.length === 0) return null;
        return (
          <section key={s.animal} className="mt-8">
            <h2 className="text-lg font-bold border-b-2 border-brand-100 pb-1">{s.title}</h2>
            <ul className="mt-3 space-y-3">
              {pages.map((p) => (
                <li key={p.path}>
                  <Link href={p.path} className="block rounded-lg border border-gray-200 px-4 py-3 hover:border-brand-600">
                    <span className="block font-bold text-[15px]">{p.title}</span>
                    <span className="mt-1 block text-sm text-gray-600 leading-relaxed">{p.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="mt-10 text-xs text-gray-500 leading-relaxed">
        避難所でのペットの受け入れ方は、避難所や自治体によって異なります。お住まいの自治体の情報もあわせて確認してください。
      </p>
    </div>
  );
}
