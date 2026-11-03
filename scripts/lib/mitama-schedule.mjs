import { pathToFileURL } from 'node:url';

export function mitamaDayForDate(date) {
  if (typeof date !== 'string' || !/^2026-11-(0[1-9]|1[0-4])$/.test(date)) {
    throw new Error('Not an approved MITAMA publishing date');
  }
  return Number(date.slice(-2)) + 17;
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
