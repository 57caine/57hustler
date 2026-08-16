import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShoppingCart, Eye, Scale, Sparkles, Droplet, Stethoscope,
  Headset, Glasses, ShoppingBag, Newspaper, type LucideIcon,
} from 'lucide-react';
import { allColumns } from '@/lib/all-columns';

export const metadata: Metadata = {
  title: 'コラム・ガイド記事一覧【カラコン・コンタクト・眼鏡・アイケア・レーシック】| レンズナビ',
  description: 'カラコンの選び方・韓国ブランドから、コンタクトレンズのBC解説、眼鏡の選び方、VRゴーグル・レーシック費用・ドライアイ対策まで。目に関する全記事一覧。',
};

const categoryColors: Record<string, string> = {
  '度数・処方箋': 'bg-purple-100 text-purple-700',
  '購入ガイド': 'bg-emerald-100 text-emerald-700',
  '商品比較': 'bg-slate-100 text-slate-700',
  'BC選び方': 'bg-sky-100 text-sky-700',
  '眼鏡・サングラス': 'bg-indigo-100 text-indigo-700',
  'VR・スマートグラス': 'bg-violet-100 text-violet-700',
  'レーシック': 'bg-emerald-100 text-emerald-700',
  'アイケア・目薬': 'bg-cyan-100 text-cyan-700',
  '目のグッズ': 'bg-orange-100 text-orange-700',
  'カラコン': 'bg-pink-100 text-pink-700',
};

const categoryThemes: Record<string, { startColor: string; endColor: string; Icon: LucideIcon }> = {
  '購入ガイド': { startColor: '#1565c0', endColor: '#1976d2', Icon: ShoppingCart },
  '度数・処方箋': { startColor: '#00695c', endColor: '#00897b', Icon: Eye },
  '商品比較': { startColor: '#4527a0', endColor: '#512da8', Icon: Scale },
  'カラコン': { startColor: '#ad1457', endColor: '#c2185b', Icon: Sparkles },
  'アイケア・目薬': { startColor: '#2e7d32', endColor: '#388e3c', Icon: Droplet },
  'レーシック': { startColor: '#00695c', endColor: '#00897b', Icon: Stethoscope },
  'VR・スマートグラス': { startColor: '#4527a0', endColor: '#512da8', Icon: Headset },
  '眼鏡・サングラス': { startColor: '#37474f', endColor: '#455a64', Icon: Glasses },
  '目のグッズ': { startColor: '#e65100', endColor: '#f57c00', Icon: ShoppingBag },
  'BC選び方': { startColor: '#1565c0', endColor: '#1976d2', Icon: ShoppingCart },
};

const SECTIONS = [
  {
    key: 'karakon',
    label: 'カラコン',
    Icon: Sparkles,
    href: '/karakon',
    bg: 'bg-gradient-to-r from-pink-500 to-rose-600',
    border: 'border-pink-200',
    badge: 'bg-pink-600 text-white',
    filter: (c: { category?: string; section?: string }) =>
      c.category === 'カラコン' || c.category === 'karakon' || (c as { section?: string }).section === 'karakon',
  },
  {
    key: 'eye',
    label: '眼鏡・VR・レーシック・アイケア',
    Icon: Glasses,
    href: '/megane',
    bg: 'bg-gradient-to-r from-indigo-500 to-violet-600',
    border: 'border-indigo-200',
    badge: 'bg-indigo-600 text-white',
    filter: (c: { category?: string; section?: string }) => {
      const s = (c as { section?: string }).section;
      return s === 'megane' || s === 'vr' || s === 'lasik' || s === 'eye-care' || s === 'eye-goods';
    },
  },
  {
    key: 'contact',
    label: 'コンタクトレンズ',
    Icon: Eye,
    href: '/category/1day',
    bg: 'bg-gradient-to-r from-sky-500 to-blue-600',
    border: 'border-sky-200',
    badge: 'bg-sky-600 text-white',
    filter: (c: { category?: string; section?: string }) => {
      const s = (c as { section?: string }).section;
      const cat = c.category ?? '';
      return !s && cat !== 'カラコン' && cat !== 'karakon';
    },
  },
];

function ArticleCard({ column }: { column: (typeof allColumns)[0] }) {
  const cat = column.category ?? '';
  const theme = categoryThemes[cat] ?? { startColor: '#37474f', endColor: '#455a64', Icon: Newspaper };

  return (
    <Link href={`/column/${column.slug}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:-translate-y-1 transition-transform duration-200 h-full flex flex-col">
        {/* Thumbnail */}
        <div
          className="h-[120px] flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${theme.startColor}, ${theme.endColor})` }}
        >
          <theme.Icon className="w-12 h-12 text-white" />
        </div>
        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-3 group-hover:text-slate-700 transition-colors">
            {column.title}
          </h3>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-gray-500">約{column.readingTime}分</span>
            <span className="text-xs px-2 py-1 rounded-full text-white" style={{ background: theme.startColor }}>
              {cat}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ColumnListPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">コラム</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">コラム・ガイド記事一覧</h1>
      <p className="text-gray-500 text-sm mb-1">全{allColumns.length}記事</p>
      <p className="text-gray-600 mb-8">
        カラコン・コンタクトレンズ・眼鏡・VR・レーシック・アイケアなど、目に関するお役立ち情報を掲載しています。
      </p>

      {SECTIONS.map((section) => {
        const articles = allColumns.filter(section.filter as (c: (typeof allColumns)[0]) => boolean);
        if (articles.length === 0) return null;
        return (
          <section key={section.key} className="mb-12">
            <div className={`flex items-center justify-between ${section.bg} border ${section.border} rounded-2xl px-5 py-4 mb-5`}>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <section.Icon className="w-5 h-5 flex-shrink-0" />
                {section.label}
              </h2>
              <Link href={section.href}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg ${section.badge} hover:opacity-90 transition-opacity`}>
                特集ページ →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {articles.map((column) => (
                <ArticleCard key={column.slug} column={column} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-8 bg-slate-50 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">コンタクトを最安値で購入する</h2>
        <p className="text-gray-600 text-sm mb-4">
          気になった商品の価格を複数ショップで一括比較。毎日価格を自動更新しています。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/ranking" className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sky-500 transition-colors">
            人気ランキングを見る
          </Link>
          <Link href="/category/1day" className="bg-white text-slate-800 border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            ワンデーを比較する
          </Link>
        </div>
      </div>
    </div>
  );
}
