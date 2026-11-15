/** Fail-closed JARVIS publication/scale decision gates. No network or side effects. */
export function evaluatePublicationGate(entry, approval, ctx) {
  const errors = [];
  const hasText = (v) => typeof v === "string" && v.trim().length > 0;
  const number = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;
  const rate = (v) => number(v) && v <= 1;
  const requireText = (v, k) => { if (!hasText(v)) errors.push(k + " is missing"); };
  const requireNumber = (v, k) => { if (!number(v)) errors.push(k + " is missing or invalid"); };
  if (!entry || typeof entry !== "object" || entry.isSample === true) errors.push("real, non-sample gate evidence required");
  const d = entry?.demand ?? {};
  for (const k of ["target","intent","evidenceUrl","checkedAt","competitiveDiff","organicChannel"]) requireText(d[k], "demand."+k);
  if (hasText(d.evidenceUrl) && !/^https:\/\/[^/\s]+\//.test(d.evidenceUrl)) errors.push("demand evidence must be HTTPS");
  if (hasText(d.checkedAt) && !/^\d{4}-\d{2}-\d{2}$/.test(d.checkedAt)) errors.push("demand date invalid");
  const a = entry?.asp ?? {};
  if (a.status !== "approved") errors.push("ASP partnership not approved");
  requireText(a.conditionsSource, "asp.conditionsSource");
  const q = entry?.quality ?? {};
  if (q.complianceChecked !== true || q.linksChecked !== true) errors.push("quality checks incomplete");
  const f = entry?.forecast ?? {};
  for (const k of ["sessions","rewardPerConversion","directCost","operationCost","minProfit"]) requireNumber(f[k], "forecast."+k);
  for (const k of ["sendRate","occurrenceRate","confirmationRate"]) if (!rate(f[k])) errors.push("forecast."+k+" missing or outside [0,1]");
  for (const k of ["sessionsSource","rateSource","rewardSource","costSource"]) requireText(f[k], "forecast."+k);
  let forecastProfit = null;
  if (["sessions","rewardPerConversion","directCost","operationCost","minProfit"].every(k => number(f[k])) &&
      ["sendRate","occurrenceRate","confirmationRate"].every(k => rate(f[k]))) {
    forecastProfit = f.sessions*f.sendRate*f.occurrenceRate*f.confirmationRate*f.rewardPerConversion-f.directCost-f.operationCost;
    if (!Number.isFinite(forecastProfit) || forecastProfit < f.minProfit) errors.push("forecast below prespecified profit threshold");
  }
  if (ctx?.action === "scale") {
    const actual = entry?.actual ?? {};
    for (const k of ["confirmedReward","cost","sessions","minProfit"]) requireNumber(actual[k], "actual."+k);
    if (number(actual.sessions) && actual.sessions === 0) errors.push("observed sessions are zero");
    if (actual.reconciliation !== "matched") errors.push("confirmed reward reconciliation missing");
    if (!Array.isArray(actual.repeatabilityEvidence) || actual.repeatabilityEvidence.length < 2 ||
        !actual.repeatabilityEvidence.every(hasText)) errors.push("repeatability evidence insufficient");
    if (["confirmedReward","cost","minProfit"].every(k => number(actual[k])) &&
        actual.confirmedReward - actual.cost < actual.minProfit) errors.push("actual profit below threshold");
  }
  if (!ctx || !["experiment_publish","scale"].includes(ctx.action)) errors.push("action not allowed");
  if (!hasText(ctx?.commitSha)) errors.push("target git commit is missing");
  if (!approval || typeof approval !== "object") errors.push("explicit owner approval missing");
  else {
    if (approval.actionType !== ctx.action) errors.push("approval action mismatch");
    if (approval.target !== ctx.campaignSlug) errors.push("approval target mismatch");
    if (approval.targetSha !== ctx.commitSha) errors.push("approval commit SHA mismatch");
    if (approval.specVersion !== "2.0") errors.push("approval spec mismatch");
    for (const k of ["approver","approvedAt","evidenceRef","scope"]) requireText(approval[k], "approval."+k);
    if (hasText(approval.approvedAt) && Number.isNaN(Date.parse(approval.approvedAt))) errors.push("approval date invalid");
  }
  return {pass:errors.length===0, errors, forecastProfit};
}
