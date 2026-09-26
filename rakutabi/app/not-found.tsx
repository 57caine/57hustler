import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-gray-900 mb-3">ページが見つかりませんでした</h1>
      <Link href="/" className="text-sky-700 hover:underline">トップページへ戻る</Link>
    </div>
  );
}
