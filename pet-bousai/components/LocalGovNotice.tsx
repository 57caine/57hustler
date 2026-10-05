import { SOURCES } from '@/lib/sources';

/** 同行避難の扱いが自治体・避難所で異なることの注意（全記事に表示） */
export default function LocalGovNotice() {
  return (
    <aside className="my-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed" data-localgov-notice>
      <p className="font-bold text-amber-900">お住まいの自治体の情報を確認してください</p>
      <p className="mt-1 text-amber-950">
        避難所でペットを受け入れるかどうか、受け入れる場合の飼養場所やルールは、避難所や自治体によって異なります。
        環境省は、地域で指定されている避難場所がペットとの同行避難に対応しているかをあらかじめ確認し、注意事項を自治体に確認しておくよう呼びかけています。
        当サイトの内容は一般的な備えの整理であり、個別の避難方法を示すものではありません。
      </p>
      <p className="mt-1 text-xs text-amber-900">
        出典：
        <a href={SOURCES['moe-disaster'].url} target="_blank" rel="noopener noreferrer" className="underline">
          環境省「{SOURCES['moe-disaster'].title}」
        </a>
      </p>
    </aside>
  );
}
