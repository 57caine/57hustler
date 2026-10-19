// Comparison intent is separate from outbound affiliate clicks and merchant sales.
/** @returns {Promise<{status: 'ok' | 'error', total: number | null}>} */
export async function fetchSingleBoxComparisons(client, { property, startDate, endDate }) {
  try {
    const [response] = await client.runReport({
      property,
      dimensions: [],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: { andGroup: { expressions: [
        { filter: { fieldName: 'eventName', stringFilter: { matchType: 'EXACT', value: 'single_box_comparison_click' } } },
        { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'EXACT', value: '/category/1day' } } },
      ] } },
      dateRanges: [{ startDate, endDate }],
    });
    if (!response || !Number.isSafeInteger(response.rowCount) || response.rowCount < 0 ||
        response.metadata?.subjectToThresholding || response.metadata?.dataLossFromOtherRow) {
      throw new Error('Incomplete comparison report');
    }
    const rows = response.rows ?? [];
    if (response.rowCount === 0 && rows.length === 0) return { status: 'ok', total: 0 };
    if (response.rowCount !== 1 || rows.length !== 1) throw new Error('Unexpected comparison rows');
    const value = rows[0].metricValues?.[0]?.value;
    if (typeof value !== 'string' || !/^\d+$/.test(value)) throw new Error('Invalid comparison count');
    const total = Number(value);
    if (!Number.isSafeInteger(total)) throw new Error('Unsafe comparison count');
    return { status: 'ok', total };
  } catch {
    return { status: 'error', total: null };
  }
}
