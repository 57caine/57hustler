/** Editorial rule: prefer 3+ photos, allow 1–6, skip only zero. */
export function selectPhotoMedia(photos) {
  if (!Array.isArray(photos)) throw new Error('Photos must be an array');
  if (photos.length === 0) return 'SKIP';
  if (photos.length > 6) throw new Error('Maximum 6 hotel photos per post');
  return photos.length === 1 ? 'IMAGE' : 'CAROUSEL';
}
