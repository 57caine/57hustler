import { SITE_URL } from '@/lib/site-config';

/** 読者が実際に役立つ宿比較をシェアできる無料導線。自動投稿はしない。 */
export default function ShareLinks({ path, title }: { path: string; title: string }) {
  const url = new URL(path, SITE_URL);
  const forX = new URL(url);
  forX.searchParams.set('utm_source', 'share_x');
  forX.searchParams.set('utm_medium', 'social');
  forX.searchParams.set('utm_campaign', 'reader_share');
  const forLine = new URL(url);
  forLine.searchParams.set('utm_source', 'share_line');
  forLine.searchParams.set('utm_medium', 'social');
  forLine.searchParams.set('utm_campaign', 'reader_share');

  const xHref = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title)
    + '&url=' + encodeURIComponent(forX.toString());
  const lineHref = 'https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(forLine.toString());

  return (
    <aside className="my-5 rounded-xl border border-black/10 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-ink">この宿比較を友だちに共有する</p>
      <div className="flex flex-wrap gap-2">
        <a href={lineHref} target="_blank" rel="noopener noreferrer"
          className="rounded-full bg-[#06C755] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          LINEで共有
        </a>
        <a href={xHref} target="_blank" rel="noopener noreferrer"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          Xで共有
        </a>
      </div>
    </aside>
  );
}
