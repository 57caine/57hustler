import Link from 'next/link';
import { AD_NOTICE } from '@/lib/site';

/** ページ冒頭の広告表記（ステルスマーケティング規制・楽天アフィリエイトの規約に対応） */
export default function AdNotice() {
  return (
    <p className="text-xs leading-relaxed text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-3 py-2" data-ad-notice>
      <span className="font-bold text-gray-700 mr-1">広告</span>
      {AD_NOTICE}
      <Link href="/about#ads" className="underline ml-1">
        詳しく
      </Link>
    </p>
  );
}
