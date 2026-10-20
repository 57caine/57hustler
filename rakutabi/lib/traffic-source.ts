const SOURCES = ['share_x', 'share_line', 'threads', 'instagram', 'rakuten_room'] as const;
type TrafficSource = (typeof SOURCES)[number];

// Recognized referrer is a fallback for profile links without UTM. Store only
// the source label, never the referrer URL. This does not measure site visits.
export function incomingTrafficSource(search: string, referrer: string): TrafficSource | null {
  const source = new URLSearchParams(search).get('utm_source');
  if (SOURCES.includes(source as TrafficSource)) return source as TrafficSource;
  try {
    const host = new URL(referrer).hostname;
    if (['threads.com', 'www.threads.com', 'l.threads.com', 'threads.net', 'www.threads.net', 'l.threads.net'].includes(host)) return 'threads';
  } catch { /* missing or invalid referrer */ }
  return null;
}
