import Link from 'next/link';

export default function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <nav className="pt-3 text-xs text-gray-500" aria-label="パンくずリスト">
        <Link href="/" className="underline">トップ</Link>
        <span className="mx-1">›</span>
        <span>{title}</span>
      </nav>
      <h1 className="mt-5 text-2xl font-bold">{title}</h1>
      <div className="prose-body mt-4 text-[15px]">{children}</div>
    </div>
  );
}
