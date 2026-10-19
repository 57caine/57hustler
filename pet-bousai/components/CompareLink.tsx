/** ページ上部から比較表（#compare）へ移動するリンク。クリックは GA4 の product_compare_click として計測する */
export default function CompareLink({ label }: { label: string }) {
  return (
    <a
      href="#compare"
      data-compare-link="page-top"
      className="mt-4 flex min-h-[44px] items-center justify-between rounded-lg border border-brand-600 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-800"
    >
      <span>{label}</span>
      <span aria-hidden="true">↓</span>
    </a>
  );
}
