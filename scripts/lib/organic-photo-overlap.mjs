// The candidate slot is an overlap guard, not a schedule or publication flag.
// Keep the existing text post until a separately approved photo release exists.
export function photoAlternateMessages(post, review) {
  if (post.brand !== 'rakutabi' || post.day !== review.overlapGuard?.day) return [];
  if (review.brand !== 'rakutabi' || review.overlapGuard.brand !== 'rakutabi') throw Error('Photo overlap brand mismatch');
  const messages = [review.parent, review.reply];
  if (messages.some(t => typeof t !== 'string' || !t.trim() || t.length > 500)) throw Error('Invalid photo overlap messages');
  // The final release may require an explicit advertising label. Either form
  // must count as the same parent/reply for the legacy text fallback.
  return [...messages, ...messages.map(t => '【広告】\n' + t)];
}
