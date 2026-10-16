'use client';

import { useState } from 'react';

function Field({ label, value, onChange, min = 0, max = 100000 }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  return <label className="block text-sm text-slate-700"><span className="block mb-1 font-medium">{label}</span><input type="number" inputMode="numeric" min={min} max={max} value={value} onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base" /></label>;
}

export default function AnnualCostCalculator() {
  const [days, setDays] = useState(365);
  const [onePrice, setOnePrice] = useState(0);
  const [oneCount, setOneCount] = useState(30);
  const [twoPrice, setTwoPrice] = useState(0);
  const [twoCount, setTwoCount] = useState(6);
  const [care, setCare] = useState(0);
  const [shippingOne, setShippingOne] = useState(0);
  const [shippingTwo, setShippingTwo] = useState(0);
  // Both eyes. 2week replacement is 26 pairs/year for regular wear, regardless of off days.
  const oneBoxes = Math.ceil(days * 2 / Math.max(1, oneCount));
  const twoBoxes = Math.ceil(26 * 2 / Math.max(1, twoCount));
  const oneTotal = oneBoxes * (onePrice + shippingOne);
  const twoTotal = twoBoxes * (twoPrice + shippingTwo) + care * 12;
  const valid = onePrice > 0 && twoPrice > 0 && oneCount > 0 && twoCount > 0;
  const yen = (n: number) => n.toLocaleString('ja-JP') + '円';
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
    <h2 className="text-xl font-bold mb-2">年間費用シミュレーター</h2>
    <p className="text-sm text-slate-500 mb-6">両眼使用の概算。価格の初期値は空欄相当の0円です。実際の購入条件を入力してください。</p>
    <Field label="ワンデーを使う日数（年間）" value={days} onChange={setDays} max={365} />
    <div className="grid sm:grid-cols-2 gap-6 mt-6">
      <div className="space-y-3"><h3 className="font-bold text-sky-800">ワンデー</h3>
        <Field label="1箱の税込価格（円）" value={onePrice} onChange={setOnePrice} />
        <Field label="1箱のレンズ枚数（片眼用）" value={oneCount} onChange={setOneCount} min={1} max={365} />
        <Field label="1箱あたり送料（円）" value={shippingOne} onChange={setShippingOne} />
      </div>
      <div className="space-y-3"><h3 className="font-bold text-sky-800">2week</h3>
        <Field label="1箱の税込価格（円）" value={twoPrice} onChange={setTwoPrice} />
        <Field label="1箱のレンズ枚数（片眼用）" value={twoCount} onChange={setTwoCount} min={1} max={365} />
        <Field label="1箱あたり送料（円）" value={shippingTwo} onChange={setShippingTwo} />
        <Field label="ケア用品代（月額・円）" value={care} onChange={setCare} />
      </div>
    </div>
    <div aria-live="polite" className="mt-7 rounded-xl bg-slate-50 p-5">
      {valid ? <><h3 className="font-bold mb-3">年間の概算</h3><div className="grid sm:grid-cols-2 gap-4">
        <div><p className="text-sm text-slate-500">ワンデー（{oneBoxes}箱）</p><p className="text-2xl font-bold">{yen(oneTotal)}</p></div>
        <div><p className="text-sm text-slate-500">2week（{twoBoxes}箱＋ケア用品）</p><p className="text-2xl font-bold">{yen(twoTotal)}</p></div>
      </div><p className="text-sm mt-4">差額：{yen(Math.abs(oneTotal - twoTotal))}／年（{oneTotal === twoTotal ? '同額' : oneTotal < twoTotal ? 'ワンデーが低額' : '2weekが低額'}）</p></> :
        <p className="text-slate-600 text-sm">両タイプの1箱価格を入力すると年間費用を表示します。</p>}
    </div>
    <p className="text-xs text-slate-500 mt-4 leading-6">※ 2weekは1年52週÷2週＝26交換サイクル、両眼で52枚として概算。途中破損・紛失、予備、検査費用は含みません。送料は箱ごとに入力した金額で計算します。実際のセット送料条件と異なる場合があります。</p>
  </section>;
}
