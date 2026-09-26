import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DataNotice from '@/components/DataNotice';
import HotelFilterList from '@/components/HotelFilterList';
import PageHeader from '@/components/PageHeader';
import { getArea, getRegion, getTheme, THEMES } from '@/lib/site-config';
import { formatYen, getComboPages, getHotelsByTheme, hasComboPage } from '@/lib/hotels';

/**
 * エリア×テーマの掛け合わせページ（コンテンツ設計の軸）。
 * 「箱根 子連れ 旅行 ホテル」「別府 一人旅 宿」のような具体的な組み合わせの検索を想定する。
 * 宿が COMBO_MIN_HOTELS 件未満の組み合わせは、薄いページになるため生成しない。
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getComboPages().map(({ area, theme }) => ({ area: area.key, theme: theme.slug }));
}

async function resolve(params: Promise<{ area: string; theme: string }>) {
  const p = await params;
  const area = getArea(p.area);
  const theme = getTheme(p.theme);
  if (!area || !theme) return null;
  return { area, theme };
}

export async function generateMetadata({ params }: { params: Promise<{ area: string; theme: string }> }): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  const count = getHotelsByTheme(r.theme.slug, [r.area.key]).length;
  return {
    title: r.theme.comboTitle(r.area.name),
    description: `「${r.theme.worry}」という方向けに、${r.area.name}（${r.area.prefecture}）の宿${count}件を楽天トラベルの情報から比較。口コミ評価・料金・特徴で絞り込めます。`,
  };
}

export default async function ComboPage({ params }: { params: Promise<{ area: string; theme: string }> }) {
  const r = await resolve(params);
  if (!r) notFound();
  const { area, theme } = r;
  const region = getRegion(area.region);
  const hotels = getHotelsByTheme(theme.slug, [area.key]);
  const prices = hotels.map((h) => h.minCharge).filter((n): n is number => n != null);
  const otherThemes = THEMES.filter((t) => t.slug !== theme.slug && hasComboPage(area.key, t.slug));

  return (
    <div>
      <PageHeader
        crumbs={[
          ...(region ? [{ name: region.name, href: `/region/${region.slug}` }] : []),
          { name: area.name, href: `/area/${area.key}` },
          { name: theme.name, href: `/area/${area.key}/${theme.slug}` },
        ]}
        eyebrow={`${area.prefecture}・${area.name} × ${theme.name}`}
        title={theme.comboTitle(area.name)}
      >
        <div className="mt-4 bg-white/80 rounded-xl p-4 max-w-3xl text-sm text-gray-700 leading-relaxed">
          <p>
            「{theme.worry}」という方に向けて、{area.name}（{area.prefecture}）の宿を楽天トラベルの情報から集めました。
          </p>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li>・掲載件数：{hotels.length}件</li>
            {prices.length > 0 && (
              <li>・1名あたり最低料金の範囲：{formatYen(Math.min(...prices))}〜{formatYen(Math.max(...prices))}</li>
            )}
            <li>・掲載基準：{theme.criteria}</li>
          </ul>
        </div>
      </PageHeader>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <DataNotice />
        <HotelFilterList hotels={hotels} showArea={false} />

        {otherThemes.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold mb-4">{area.name}の宿をほかの目的で探す</h2>
            <div className="flex flex-wrap gap-2">
              {otherThemes.map((t) => (
                <Link key={t.slug} href={`/area/${area.key}/${t.slug}`} className="text-sm bg-white rounded-full px-3 py-1.5 ring-1 ring-black/10 hover:ring-season hover:text-season">
                  {t.icon} {area.name}の{t.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
