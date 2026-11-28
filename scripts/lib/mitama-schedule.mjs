import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';

export function mitamaDayForDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date || date<'2026-11-01') {
    throw new Error('Not an approved MITAMA publishing date');
  }
  const day=18+(Date.parse(date)-Date.parse('2026-11-01'))/86400000;
  const posts=JSON.parse(readFileSync(new URL('../../data/mitama-threads-posts.json',import.meta.url),'utf8')).posts;
  if(!posts.some(p=>p.day===day&&(day<=45||p.status?.startsWith('reviewed_scheduled_'))))throw Error('Not an approved MITAMA publishing date');
  return day;
}

export function mitamaDayAt(now = new Date()) {
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
  return mitamaDayForDate(date);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`day=${mitamaDayAt()}`);
}
