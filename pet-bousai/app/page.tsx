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
      <section className="relative mt-5 overflow-hidden rounded-3xl bg-brand-50 px-6 py-8 ring-1 ring-brand-100 sm:px-8">
        <p className="text-xs font-bold tracking-widest text-brand-700">いつもの暮らしから、もしもの備えを。</p>
        <div className="mt-5 grid items-center gap-5 sm:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="text-3xl font-bold leading-snug text-brand-800 sm:text-4xl">この子と一緒に、<br />備える毎日。</h1>
            <p className="mt-4 text-sm leading-7 text-gray-700">何から用意したらいい？<br />持ち物を確かめて、足りない用品を選ぶ。<br />普段のお散歩や通院から、少しずつ始めましょう。</p>
          </div>
          <svg viewBox="0 0 320 230" className="mx-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
            <ellipse cx="160" cy="208" rx="137" ry="13" fill="#dcece9" />
            <circle cx="172" cy="105" r="91" fill="#e4eee1" />
            <path d="M119 75v-16c0-33 62-33 62 0v16" fill="none" stroke="#255a54" strokeWidth="9" />
            <rect x="91" y="68" width="117" height="131" rx="28" fill="#2f6f68" />
            <rect x="109" y="125" width="81" height="57" rx="14" fill="#f0f7f6" />
            <path d="M135 151h29m-14-14v28" stroke="#2f6f68" strokeWidth="9" strokeLinecap="round" />
            <path d="M111 87h77" stroke="#aecdc5" strokeWidth="5" strokeLinecap="round" />
            <path d="M44 130l-13-22-5 38m65-16 13-22 5 38" fill="#c7a47e" />
            <rect x="31" y="124" width="68" height="72" rx="30" fill="#e5c6a3" />
            <ellipse cx="64" cy="168" rx="22" ry="17" fill="#fff9ed" />
            <circle cx="48" cy="149" r="3" fill="#1f2a2e" /><circle cx="81" cy="149" r="3" fill="#1f2a2e" />
            <path d="m59 161 6 6 6-6" fill="#1f2a2e" />
            <path d="M227 146v-39l23 18 26-18v39" fill="#8b9e9a" />
            <rect x="222" y="126" width="59" height="70" rx="25" fill="#a8b9b3" />
            <circle cx="238" cy="152" r="3" fill="#1f2a2e" /><circle cx="264" cy="152" r="3" fill="#1f2a2e" />
            <path d="m246 163 6 5 5-5" fill="#255a54" />
            <path d="m226 164-17-4m17 10-17 2m68-8 16-4m-16 10 16 2" stroke="#255a54" strokeWidth="2" />
            <path d="m253 63 6 7 14-16" fill="none" stroke="#c7a47e" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/checklist" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-800 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">まずは持ち物をチェック →</Link>
          <a href="#choose-supplies" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-600 bg-white px-5 py-3 text-sm font-bold text-brand-800">足りない用品を探す ↓</a>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="animal-heading">
        <h2 id="animal-heading" className="text-lg font-bold">一緒に暮らす動物から探す</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { href: '/dog', label: '犬', note: 'キャリー・水・トイレの備え' },
            { href: '/cat', label: '猫', note: 'キャリー・トイレの備え' },
            { href: '/rabbit-guinea-pig', label: 'うさぎ・モルモット', note: '持ち出しとキャリーの備え' },
          ].map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border border-brand-100 bg-white p-4 hover:border-brand-600"><span className="flex justify-between font-bold text-brand-800">{item.label}<span aria-hidden="true">→</span></span><span className="mt-2 block text-xs text-gray-600">{item.note}</span></Link>)}
        </div>
      </section>

      <section id="choose-supplies" className="mt-9 scroll-mt-5" aria-labelledby="supplies-heading">
        <p className="text-xs font-bold tracking-widest text-brand-700">犬の備え：選び方と商品を比べる</p>
        <h2 id="supplies-heading" className="mt-1 text-xl font-bold">足りないものから、一つずつ。</h2>
        <p className="mt-2 text-sm text-gray-600">いま使っている物も確認して、必要な物を選びましょう。</p>
        <div className="mt-4 grid gap-3">
          {[
            { no: '01', href: '/dog/evacuation-carrier', title: '一緒に移動する', text: '避難用キャリー・ケージのサイズや形を比較' },
            { no: '02', href: '/dog/water-food', title: '水とごはんを用意する', text: '携帯給水器・折りたたみ食器を比較' },
            { no: '03', href: '/dog/toilet', title: 'トイレまわりを整える', text: 'ペットシーツ・処理袋・マナーポーチを比較' },
          ].map((item) => <Link key={item.href} href={item.href} className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 hover:border-brand-600"><span className="text-2xl font-bold text-brand-600">{item.no}</span><span className="flex-1"><span className="block font-bold">{item.title}</span><span className="mt-1 block text-xs text-gray-600">{item.text}</span></span><span aria-hidden="true" className="text-brand-700">→</span></Link>)}
        </div>
      </section>

      <aside className="mt-8 rounded-2xl bg-gray-50 p-5 text-sm leading-7 text-gray-600">
        <p className="font-bold text-brand-800">公的な情報と、用品の選び方を分けて掲載</p>
        <p className="mt-2">備えの内容は環境省の「<a href={SOURCES['owner-guide'].url} target="_blank" rel="noopener noreferrer" className="underline text-brand-700">{SOURCES['owner-guide'].title}</a>」をもとに、出典を示しています。商品紹介は広告と明記しています。</p>
      </aside>

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
