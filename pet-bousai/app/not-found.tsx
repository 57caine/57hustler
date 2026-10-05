import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-xl font-bold">ページが見つかりません</h1>
      <p className="mt-4">
        <Link href="/" className="underline text-brand-700">トップページへ戻る</Link>
      </p>
    </div>
  );
}
