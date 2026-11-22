// 熟ドロ: FANZAの月額サービスの種類と、作品・リンクの形を調べて表示するだけ（保存しない）
const API_ID = process.env.DMM_API_ID, AFF = process.env.DMM_AFFILIATE_ID || 'nsplot-990';
const base = { api_id: API_ID, affiliate_id: AFF, output: 'json' };
const get = async (api, p) => (await (await fetch(`https://api.dmm.com/affiliate/v3/${api}?${new URLSearchParams({ ...base, ...p })}`)).json());
const floors = await get('FloorList', {});
const fanza = (floors.result?.site ?? []).find((s) => s.code === 'FANZA');
for (const sv of fanza?.service ?? []) console.log('SERVICE', sv.code, sv.name, '|', (sv.floor ?? []).map((f) => `${f.code}:${f.name}`).join(', '));
const monthly = (fanza?.service ?? []).find((s) => s.code === 'monthly');
for (const f of monthly?.floor ?? []) {
  for (const kw of ['熟女', '人妻']) {
    const r = await get('ItemList', { site: 'FANZA', service: 'monthly', floor: f.code, hits: '3', keyword: kw, sort: 'rank' });
    const items = r.result?.items ?? [];
    console.log(`MONTHLY ${f.code} ${kw} total=${r.result?.total_count ?? r.result?.message ?? '?'}`);
    for (const it of items) console.log('  ', it.content_id, '|', (it.title || '').slice(0, 40), '|', it.URL, '|', JSON.stringify(it.prices ?? {}).slice(0, 120));
    await new Promise((res) => setTimeout(res, 500));
  }
}
