import { createHmac, timingSafeEqual } from 'node:crypto';

/** Prevent fabricated approval JSON from passing a production gate.
 * The owner must independently control the secret and approve the exact scope.
 */
export function verifyApprovalSignature(approval, secret) {
  if (!approval || typeof approval !== 'object' || typeof secret !== 'string' || secret.length < 32) return false;
  if (typeof approval.signature !== 'string' || !/^[0-9a-f]{64}$/.test(approval.signature)) return false;
  const fields=['actionType','target','targetSha','specVersion','approver','approvedAt','evidenceRef','scope'];
  if (!fields.every(k=>typeof approval[k]==='string'&&approval[k].trim())) return false;
  const payload=JSON.stringify(fields.map(k=>approval[k]));
  const expected=createHmac('sha256',secret).update(payload).digest();
  const got=Buffer.from(approval.signature,'hex');
  return got.length===expected.length && timingSafeEqual(got,expected);
}
