import type { Metadata } from 'next';
import Link from 'next/link';
import AnnualCostCalculator from '@/components/AnnualCostCalculator';

export const metadata: Metadata = {
  title: 'コンタクトの年間費用を比較｜ワンデーと2weekの費用シミュレーター',
  description: '両眼の使用日数、箱の値段、1箱の枚数、ケア用品代を入力して、ワンデーと2weekの年間費用を比較。購入前に送料や交換周期も確認。',
};

export default function AnnualCostPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 text-slate-800">
      <nav className="text-sm text-slate-500 mb-6"><Link href="/" className="hover:underline">ホーム</Link> / 年間費用比較</nav>
      <h1 className="text-3xl font-bold mb-3">コンタクト、1年でいくらかかる？</h1>
      <p className="text-slate-600 mb-7">ワンデーと2week。箱の価格だけでは、年間の支払いは分かりません。普段の使い方と実際の購入価格を入れて比較できます。</p>
      <AnnualCostCalculator />
      <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-semibold mb-3">購入前に確認したいこと</h2>
        <p className="text-sm leading-7">2weekは開封後、装用しなかった日も含めて原則2週間で交換するため、週末だけの使用でも日数に比例して節約できるわけではありません。費用の計算結果だけでレンズを変更せず、眼科で目に合う製品や使用方法を確認してください。送料・定期便割引・検査費用などは別途かかる場合があります。</p>
      </section>
      <div className="mt-8 grid sm:grid-cols-2 gap-3">
        <Link href="/category/1day" className="rounded-lg bg-slate-800 text-white text-center px-5 py-4 font-semibold">ワンデーの商品を比較 →</Link>
        <Link href="/category/2week" className="rounded-lg border border-slate-300 text-center px-5 py-4 font-semibold">2weekの商品を比較 →</Link>
      </div>
    </main>
  );
}
