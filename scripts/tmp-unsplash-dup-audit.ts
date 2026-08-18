/**
 * 一時調査スクリプト（実装ではなく調査目的）
 * 全コラム記事のヒーロー画像URLを実際に取得し、重複を特定する。
 * 結果はログ出力のみ。ファイルへの永続化は行わない。
 */
import { columns } from '../lib/columns';
import { eyeColumns } from '../lib/eye-columns';
import { karakonColumns } from '../lib/karakon-columns';
import { getHeroImage, stableIndex } from '../lib/unsplash';

const SECTION_HERO_QUERY: Record<string, string> = {
  megane: 'eyeglasses frame fashion',
  vr: 'vr headset virtual reality',
  lasik: 'eye surgery clinic medical',
  'eye-care': 'eye care contact lens drops',
  'eye-goods': 'eye mask relaxation care',
  karakon: 'colored contact lens eye makeup',
};
const DEFAULT_HERO_QUERY = 'contact lens eye close up macro';

function getHeroQuery(column: { category?: string; section?: string }): string {
  if (column.section) return SECTION_HERO_QUERY[column.section] ?? DEFAULT_HERO_QUERY;
  if (column.category === 'カラコン') return SECTION_HERO_QUERY.karakon;
  return DEFAULT_HERO_QUERY;
}

async function main() {
  const allColumns = [...karakonColumns, ...eyeColumns, ...columns];
  console.log(`総記事数: ${allColumns.length}`);

  // (query, page) の組み合わせごとに実際の画像URLを1回だけ取得（API呼び出し節約）
  const cache = new Map<string, string | null>();
  const slugToImage = new Map<string, string | null>();

  let apiCalls = 0;
  for (const c of allColumns) {
    const query = getHeroQuery(c);
    const page = stableIndex(c.slug, 8);
    const key = `${query}::${page}`;
    if (!cache.has(key)) {
      apiCalls++;
      const url = await getHeroImage(query, page);
      cache.set(key, url);
      console.log(`[API ${apiCalls}] query="${query}" page=${page} -> ${url ?? '(null)'}`);
    }
    slugToImage.set(c.slug, cache.get(key) ?? null);
  }

  console.log(`\n総API呼び出し数: ${apiCalls}`);

  // 画像URL -> slugs[] で重複を特定
  const imageToSlugs = new Map<string, string[]>();
  for (const [slug, url] of slugToImage) {
    if (!url) continue;
    const list = imageToSlugs.get(url) ?? [];
    list.push(slug);
    imageToSlugs.set(url, list);
  }

  console.log('\n\n=== 重複している画像URLと記事一覧 ===');
  let dupGroups = 0;
  let dupArticles = 0;
  for (const [url, slugs] of imageToSlugs) {
    if (slugs.length > 1) {
      dupGroups++;
      dupArticles += slugs.length;
      console.log(`\n画像URL: ${url}`);
      console.log(`  該当記事(${slugs.length}件): ${JSON.stringify(slugs)}`);
    }
  }
  console.log(`\n\n重複グループ数: ${dupGroups}`);
  console.log(`重複に巻き込まれている記事数: ${dupArticles}`);
  console.log(`重複なしで済んでいる記事数: ${allColumns.length - dupArticles}`);

  const nullCount = [...slugToImage.values()].filter(v => v === null).length;
  console.log(`画像取得失敗(null)件数: ${nullCount}`);

  console.log('\n調査完了');
}

main().catch(e => { console.error(e); process.exit(1); });
