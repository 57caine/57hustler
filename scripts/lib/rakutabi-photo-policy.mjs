/** Editorial rule: prefer 3+ photos, allow 1–6, skip only zero. */
export function selectPhotoMedia(photos) {
  if (!Array.isArray(photos)) throw new Error('Photos must be an array');
  if (photos.length === 0) return 'SKIP';
  if (photos.length > 6) throw new Error('Maximum 6 hotel photos per post');
  return photos.length === 1 ? 'IMAGE' : 'CAROUSEL';
}

/** Build separate attribution replies under Threads' 500-character limit. */
export function photoCreditMessages(photos, maxLength = 500) {
 if (!Array.isArray(photos) || photos.length === 0) return [];
 const prefix = '📷写真出典・ライセンス（画像は無加工）\n';
 const blocks = photos.map((photo, index) =>
  (index + 1) + '. ' + photo.rights.owner + ' / ' + photo.rights.license + '\n' +
  photo.rights.proofUrl + '\n' + (photo.rights.licenseUrl || '')
 );
 const chunks = [];
 let current = prefix;
 for (const block of blocks) {
  if ((prefix + block).length > maxLength) throw new Error('Photo attribution exceeds Threads length limit');
  const next = current === prefix ? current + block : current + '\n\n' + block;
  if (next.length > maxLength) {
   chunks.push(current);
   current = prefix + block;
  } else current = next;
 }
 chunks.push(current);
 return chunks;
}
