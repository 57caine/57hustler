'use client';

import { useEffect, useState } from 'react';

type TOCItem = { id: string; text: string; level: number };

export default function ArticleTOC({ bodyId }: { bodyId: string }) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const body = document.getElementById(bodyId);
    if (!body) return;

    const headings = Array.from(body.querySelectorAll('h2, h3'));
    const built: TOCItem[] = headings.map((el, i) => {
      const id = `toc-${i}`;
      el.id = id;
      return { id, text: el.textContent?.trim() ?? '', level: el.tagName === 'H2' ? 2 : 3 };
    });
    setItems(built);

    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-72px 0px -60% 0px', threshold: 0 }
    );
    headings.forEach(h => obs.observe(h));
    return () => obs.disconnect();
  }, [bodyId]);

  if (items.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav aria-label="この記事の目次"
      className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
      <p className="text-xs font-bold text-slate-500 tracking-widest mb-3 uppercase">
        この記事の目次
      </p>
      <ol className="space-y-1">
        {items.map((item, i) => (
          <li key={item.id} className={item.level === 3 ? 'pl-5' : ''}>
            <a
              href={`#${item.id}`}
              onClick={e => handleClick(e, item.id)}
              className={[
                'flex items-start gap-2 text-sm transition-colors leading-snug py-0.5',
                activeId === item.id
                  ? 'text-sky-600 font-semibold'
                  : 'text-slate-600 hover:text-sky-600',
              ].join(' ')}
            >
              <span className="shrink-0 text-slate-400 font-mono text-xs mt-0.5 w-5 text-right">
                {i + 1}.
              </span>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
