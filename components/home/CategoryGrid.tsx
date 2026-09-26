import { CircleDot, Palette, Glasses, Headset, Stethoscope, Eye, Package, Grid2x2 } from 'lucide-react';

const CATEGORIES = [
  { icon: CircleDot, label: 'コンタクト', description: '処方箋・度数・通販', href: '/category/1day' },
  { icon: Palette, label: 'カラコン', description: '人気のデザインをチェック', href: '/karakon' },
  { icon: Glasses, label: '眼鏡・サングラス', description: 'フレーム・レンズ選び', href: '/megane' },
  { icon: Headset, label: 'VR・スマートグラス', description: '没入体験をもっと快適に', href: '/vr' },
  { icon: Stethoscope, label: 'レーシック', description: '視力矯正の基礎知識', href: '/lasik' },
  { icon: Eye, label: 'アイケア・目薬', description: '目の疲れ・乾燥を守る', href: '/eye-care' },
  { icon: Package, label: '目のグッズ', description: '症状別に選ぶ', href: '/eye-goods' },
  { icon: Grid2x2, label: 'すべて見る', description: '全カテゴリをまとめてチェック', href: '/ranking' },
] as const;

export default function CategoryGrid() {
  return (
    <section className="bg-slate-50 px-4 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-1 text-center text-xl font-bold text-slate-900 md:text-2xl">カテゴリから探す</h2>
        <p className="mb-8 text-center text-sm text-slate-500">あなたの目に関するあらゆるニーズにお応えします</p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map(({ icon: Icon, label, description, href }) => (
            <a
              key={label}
              href={href}
              className="group block rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-md transition-shadow hover:shadow-lg no-underline"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors group-hover:bg-sky-200">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div className="font-bold text-slate-900">{label}</div>
              <div className="mt-0.5 text-xs text-slate-500">{description}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
