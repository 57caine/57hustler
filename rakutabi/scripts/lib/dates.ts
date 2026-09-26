/** 日本時間で「次の土曜日」とその翌日を YYYY-MM-DD で返す（当日が土曜なら翌週の土曜） */
export function nextSaturdayJst(now: Date = new Date()): { checkin: string; checkout: string } {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const day = jst.getUTCDay();
  const add = day === 6 ? 7 : 6 - day;
  const sat = new Date(Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate() + add));
  const sun = new Date(sat.getTime() + 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { checkin: fmt(sat), checkout: fmt(sun) };
}
