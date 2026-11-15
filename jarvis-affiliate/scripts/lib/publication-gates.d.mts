export interface PublicationGateResult { pass: boolean; errors: string[]; forecastProfit: number | null }
export function evaluatePublicationGate(
  entry: Record<string, any> | null | undefined,
  approval: Record<string, any> | null | undefined,
  ctx: {action: 'experiment_publish' | 'scale'; campaignSlug: string; commitSha: string}
): PublicationGateResult;
