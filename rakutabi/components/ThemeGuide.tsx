import { CONDITIONS, THEME_GUIDES, type ThemeSlug } from '@/lib/site-config';

/**
 * テーマページ・掛け合わせページの「宿を選ぶときのポイント」。
 * 各ポイントに対応する絞り込み条件の名前を添え、上の一覧の絞り込みで探せることを示す
 */
export default function ThemeGuide({ theme }: { theme: ThemeSlug }) {
  const guide = THEME_GUIDES[theme];
  if (!guide) return null;
  const label = (key: string) => CONDITIONS.find((c) => c.key === key)?.label ?? key;

  return (
    <section className="mt-14" aria-labelledby={`guide-${theme}`}>
      <h2 id={`guide-${theme}`} className="text-xl md:text-2xl font-bold text-ink mb-3">{guide.title}</h2>
      <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">{guide.intro}</p>
      <ol className="mt-6 grid md:grid-cols-2 gap-4">
        {guide.points.map((p, i) => (
          <li key={p.heading} className="bg-white rounded-2xl p-5 ring-1 ring-black/5 shadow-sm">
            <p className="font-bold text-ink">
              <span className="text-season mr-2">{i + 1}.</span>
              {p.heading}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">{p.body}</p>
            {p.conditions.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">
                上の一覧の絞り込み：
                {p.conditions.map((c) => (
                  <span key={c} className="inline-block bg-season-soft/60 text-ink rounded-full px-2 py-0.5 ml-1">{label(c)}</span>
                ))}
              </p>
            )}
          </li>
        ))}
      </ol>
      <p className="text-xs text-gray-500 mt-4">
        ※絞り込みの条件は、楽天トラベルの施設情報・紹介文の記載から判定した目安です。最新の内容は、楽天トラベルの宿のページでご確認ください。
      </p>
    </section>
  );
}
