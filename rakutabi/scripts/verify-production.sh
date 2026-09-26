#!/usr/bin/env bash
# 公開中の落旅くんの全ページを機械的に確認する（GitHub Actions から実行。rakutabi/ ディレクトリで実行）
#
# 確認内容（1件でも不合格があれば exit 1）:
#   - 全ページが HTTP 200 を返し、h1 と noindex が入っていること
#   - 楽天への送客リンク（hb.afl.rakuten.co.jp）がすべて rel="...sponsored" と計測用の data-placement を持つこと
#   - アフィリエイトなしで楽天（*.rakuten.co.jp）へ飛ぶ <a> が無いこと（規約上のクレジット表記 webservice.rakuten.co.jp は除く）
# 使い方: bash scripts/verify-production.sh https://rakutabi-nine.vercel.app
set -uo pipefail
BASE="$1"

paths=$(node -e '
const d = require("./data/hotels.json");
const cfg = require("fs").readFileSync("lib/site-config.ts", "utf8");
const pick = (re) => [...cfg.matchAll(re)].map((m) => m[1]);
const themes = pick(/slug: \x27(weekend|onsen|family|couple|solo)\x27/g);
const regions = pick(/\{ slug: \x27([a-z]+)\x27, name: \x27[^\x27]+\x27, lead:/g);
const areas = pick(/\{ key: \x27([a-z]+)\x27, name:/g);
const features = pick(/slug: \x27([a-z]+-[a-z]+)\x27,\n    title:/g);
const out = ["/", "/about", "/terms", "/privacy", "/contact", "/operator", "/search", "/search?q=%E7%AE%B1%E6%A0%B9"];
themes.forEach((t) => out.push(`/theme/${t}`));
regions.forEach((r) => out.push(`/region/${r}`));
features.forEach((f) => out.push(`/feature/${f}`));
areas.forEach((a) => { out.push(`/area/${a}`); themes.forEach((t) => out.push(`/area/${a}/${t}`)); });
d.hotels.forEach((h) => out.push(`/hotel/${h.hotelNo}`));
console.log(out.join("\n"));
')

total=0; ok=0; fail=0; skipped_combo=0; afl_links=0
tmp=$(mktemp)
for p in ${paths}; do
  total=$((total + 1))
  code=$(curl -sS -o "${tmp}" -w '%{http_code}' "${BASE}${p}")
  # 掛け合わせページは宿が3件未満だと生成しない仕様のため、404は不合格にしない
  if [ "${code}" = "404" ] && [[ "${p}" =~ ^/area/[a-z]+/[a-z]+$ ]]; then skipped_combo=$((skipped_combo + 1)); continue; fi
  problems=""
  [ "${code}" = "200" ] || problems+=" HTTP${code}"
  grep -q '<h1' "${tmp}" || problems+=" h1なし"
  grep -q '<meta name="robots" content="noindex, nofollow"' "${tmp}" || problems+=" noindexなし"
  n=$(grep -o '<a [^>]*href="https://hb.afl.rakuten.co.jp[^"]*"[^>]*>' "${tmp}" | wc -l)
  afl_links=$((afl_links + n))
  bad_afl=$(grep -o '<a [^>]*href="https://hb.afl.rakuten.co.jp[^"]*"[^>]*>' "${tmp}" | grep -vc 'rel="[^"]*sponsored[^"]*".*data-placement="[a-z-]*"')
  [ "${bad_afl}" = "0" ] || problems+=" sponsored/計測属性なしの送客リンク${bad_afl}件"
  bare=$(grep -o '<a [^>]*href="https\?://[^"]*rakuten\.co\.jp[^"]*"' "${tmp}" | grep -v 'hb.afl.rakuten.co.jp' | grep -vc 'webservice.rakuten.co.jp')
  [ "${bare}" = "0" ] || problems+=" アフィリエイトなし楽天リンク${bare}件"
  if [ -z "${problems}" ]; then ok=$((ok + 1)); else fail=$((fail + 1)); echo "NG ${p}:${problems}"; fi
done
rm -f "${tmp}"
echo "確認ページ数: ${total} / 合格: ${ok} / 不合格: ${fail} / 生成対象外の掛け合わせページ(404): ${skipped_combo} / 送客リンク合計: ${afl_links}"
[ "${fail}" = "0" ]
