/** Reconcile immutable ASP snapshots. Validated normalized records only.
 * No guessed campaign allocation, no sample data, no missing-as-zero.
 * This does not authenticate the ASP source; caller must verify source/export schema.
 */
export function reconcileAspSnapshots(records, options = {}) {
  const fail = (message) => { throw new Error("ASP_RECONCILIATION_BLOCKED: " + message); };
  if (!Array.isArray(records) || !records.length) fail("No real ASP records supplied");
  const requiredText = (v, field) => {
    if (typeof v !== "string" || !v.trim()) fail(field + " missing");
    return v.trim();
  };
  const iso = (v, field) => {
    const s = requiredText(v, field);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(s) || !Number.isFinite(Date.parse(s))) fail(field + " requires UTC timestamp");
    return Date.parse(s);
  };
  const date = (v, field) => {
    const s = requiredText(v, field);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || !Number.isFinite(Date.parse(s + "T00:00:00Z"))) fail(field + " invalid");
    return s;
  };
  const snapshots = new Map();
  let signature = null;
  for (const [index, r] of records.entries()) {
    if (!r || typeof r !== "object" || r.isSample === true) fail("sample or invalid row " + index);
    const asp = requiredText(r.asp, "asp");
    const sourceRecordId = requiredText(r.sourceRecordId, "sourceRecordId");
    const status = requiredText(r.status, "status");
    if (!["pending","confirmed","rejected","cancelled"].includes(status)) fail("unknown status " + status);
    const sourceUpdatedAt = iso(r.sourceUpdatedAt, "sourceUpdatedAt");
    const periodStart = date(r.periodStart, "periodStart");
    const periodEnd = date(r.periodEnd, "periodEnd");
    if (periodStart > periodEnd) fail("period inverted");
    const timezone = requiredText(r.timezone,"timezone");
    const cohortBasis = requiredText(r.cohortBasis,"cohortBasis");
    if (!["occurrence_date","confirmation_date"].includes(cohortBasis)) fail("unknown cohortBasis");
    const currency = requiredText(r.currency,"currency");
    const sourceRef = requiredText(r.sourceRef,"sourceRef");
    if (currency !== "JPY") fail("unhandled currency conversion");
    if (timezone !== "Asia/Tokyo") fail("timezone mismatch");
    const thisSignature = JSON.stringify([periodStart,periodEnd,timezone,cohortBasis,currency]);
    if (signature === null) signature = thisSignature;
    else if (signature !== thisSignature) fail("incomparable reporting windows/cohorts");
    if (r.amount === null || typeof r.amount !== "number" || !Number.isFinite(r.amount) || r.amount < 0) fail("amount missing or invalid");
    if (typeof r.programId !== "string" || !r.programId.trim()) fail("programId missing");
    const key = asp + "\u0000" + (r.accountId || "default") + "\u0000" + sourceRecordId;
    const normalized = {asp, sourceRecordId, sourceUpdatedAt, status, amount:r.amount, programId:r.programId, campaignId:r.campaignId ?? null, sourceRef};
    const prior = snapshots.get(key);
    if (!prior || sourceUpdatedAt > prior.sourceUpdatedAt) snapshots.set(key, normalized);
    else if (sourceUpdatedAt === prior.sourceUpdatedAt && JSON.stringify(normalized) !== JSON.stringify(prior)) fail("conflicting snapshots for " + sourceRecordId);
  }
  let totalConfirmed = 0, confirmedCount = 0, pendingCount = 0, rejectedCount = 0, cancelledCount = 0, unattributedConfirmed = 0;
  const campaigns = {};
  for (const r of snapshots.values()) {
    if (r.status === "pending") pendingCount++;
    if (r.status === "rejected") rejectedCount++;
    if (r.status === "cancelled") cancelledCount++;
    if (r.status !== "confirmed") continue;
    confirmedCount++;
    totalConfirmed += r.amount;
    const campaign = r.campaignId;
    if (typeof campaign !== "string" || !campaign.trim()) { unattributedConfirmed += r.amount; continue; }
    campaigns[campaign] = (campaigns[campaign] || 0) + r.amount;
  }
  return {totalConfirmed,confirmedCount,pendingCount,rejectedCount,cancelledCount,unattributedConfirmed,campaigns,recordCount:snapshots.size,period:JSON.parse(signature)};
}
