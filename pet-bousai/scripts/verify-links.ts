/**
 * 掲載する楽天リンクの検証（GitHub Actions 上で実行。開発環境からは楽天に届かない）。
 *   npx tsx scripts/verify-links.ts
 * - data/products.json の全リンクが楽天アフィリエイトURL（hb.afl.rakuten.co.jp）で、遷移先（pc）が商品ページか
 * - 遷移先の商品ページ（item.rakuten.co.jp）を直接開き、存在するか（HTTP 200）
 * アフィリエイトURL自体は開かない（開くと楽天側でクリックとして数えられ、計測を汚すため）。
 * 1件でも問題があれば終了コード1。
 */

import { loadProducts } from '../lib/products';
import { PRODUCT_GROUPS } from '../lib/product-groups';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const data = loadProducts();
  if (!data) throw new Error('data/products.json がありません（先に npm run fetch:products を実行）');
  const problems: string[] = [];
  let checked = 0;
  for (const g of PRODUCT_GROUPS) {
    for (const p of data.groups[g.id] ?? []) {
      checked++;
      let target = '';
      try {
        const u = new URL(p.url);
        if (u.hostname !== 'hb.afl.rakuten.co.jp' || !u.pathname.startsWith('/hgc/')) problems.push(`${p.itemCode}: アフィリエイトURLの形式ではない ${p.url.slice(0, 60)}`);
        target = u.searchParams.get('pc') ?? '';
      } catch {
        problems.push(`${p.itemCode}: URLとして不正`);
        continue;
      }
      if (!target.startsWith('https://item.rakuten.co.jp/')) {
        problems.push(`${p.itemCode}: 遷移先が商品ページではない ${target.slice(0, 60)}`);
        continue;
      }
      await sleep(800);
      let res: Response;
      try {
        res = await fetch(target, {
          redirect: 'follow',
          signal: AbortSignal.timeout(15000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
            'Accept-Language': 'ja,en;q=0.8',
          },
        });
      } catch (e) {
        console.log(`NG  ${g.id.padEnd(16)} ${(e as Error).name} ${target.replace('https://item.rakuten.co.jp/', '')}`);
        problems.push(`${p.itemCode}: 商品ページの応答なし（${(e as Error).name}）`);
        continue;
      }
      const finalUrl = res.url;
      const ok = res.status === 200 && finalUrl.startsWith('https://item.rakuten.co.jp/');
      console.log(`${ok ? 'OK ' : 'NG '} ${g.id.padEnd(16)} HTTP ${res.status} ${target.replace('https://item.rakuten.co.jp/', '')}${finalUrl !== target ? ` → ${finalUrl.slice(0, 60)}` : ''}`);
      if (!ok) problems.push(`${p.itemCode}: 商品ページが開けない（HTTP ${res.status} ${finalUrl.slice(0, 60)}）`);
      await res.body?.cancel().catch(() => undefined);
    }
  }
  console.log(problems.length ? `\n問題 ${problems.length}件 / ${checked}件:\n- ${problems.join('\n- ')}` : `\nリンク検証: ${checked}件すべて問題なし`);
  process.exit(problems.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
