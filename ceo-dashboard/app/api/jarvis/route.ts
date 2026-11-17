import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';
const REPOSITORY = '57caine/57hustler';
const ISSUE_URL = 'https://github.com/57caine/57hustler/issues/207';
const JARVIS_DOC = 'https://github.com/57caine/57hustler/blob/main/docs/jarvis-conversational-command-center.md';

type Snapshot = {
  generatedAt: string;
  sites?: {
    siteName: string;
    totalSessions?: number;
    affiliateClicksTotal?: number;
    affiliateClicksByPlatform?: Record<string, number>;
    singleBoxComparisonClicks?: { status?: string; total?: number };
    dateRange?: { start?: string; end?: string };
  }[];
};

type ResponseMessage = { message: string; sources: { label: string; url: string }[]; fetchedAt: string; mode: 'read-only' };

async function loadAnalytics(): Promise<{ data?: Snapshot; error?: string }> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { error: 'GitHub接続設定（GITHUB_TOKEN）がありません' };
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPOSITORY}/contents/data/ga4-analytics.json?ref=main`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.raw+json', 'User-Agent': 'jarvis-ceo-dashboard' }, cache: 'no-store', signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) return { error: `GitHubデータの取得に失敗しました（HTTP ${response.status}）` };
    const data = await response.json() as Snapshot;
    if (!data || !Array.isArray(data.sites) || typeof data.generatedAt !== 'string') return { error: '取得データの形式を確認できません' };
    return { data };
  } catch {
    return { error: 'GitHubに接続できませんでした' };
  }
}

function reply(message: string, sources: ResponseMessage['sources'] = []): ResponseMessage {
  return { message, sources, fetchedAt: new Date().toISOString(), mode: 'read-only' };
}

function answer(text: string, analytics: { data?: Snapshot; error?: string }): ResponseMessage {
  const prompt = text.trim().toLowerCase();
  const data = analytics.data;
  const lens = data?.sites?.find(site => site.siteName === 'lens-navi');
  const source = { label: 'GA4取得データ（GitHub）', url: `https://github.com/${REPOSITORY}/blob/main/data/ga4-analytics.json` };
  const date = data?.generatedAt ? new Date(data.generatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) : '未取得';
  if (/売上|利益|確定|報酬|何が売/.test(prompt)) {
    return reply(`確定報酬・実利益は現在この画面からは未取得です。\n\n${lens ? `レンズナビのGA4記録（${date}取得・過去28日間）には購入先クリック${lens.affiliateClicksTotal ?? '未取得'}回が記録されています。ただしクリックは注文や売上ではありません。` : `GA4も未取得です（${analytics.error ?? 'データなし'}）。`}\n\n次の優先作業は、A8・楽天の成果発生／確定／否認を同一期間で照合することです。売上がないと決めつけず、未取得のまま管理します。`, data ? [source, { label: '収益監査マスター', url: ISSUE_URL }] : [{ label: '収益監査マスター', url: ISSUE_URL }]);
  }
  if (/go|進め|実行|自動|任せ/.test(prompt)) {
    return reply('GOは不要です。既存のJARVIS CEO定期実行は別の自走タスクとして設定済みです。\n\nこの画面は現在、数値と作業状況を読み取るMVPです。ここから未確認のPRをマージしたり、Claudeを直接起動したりはしません。実行が完了したという表示もしません。\n\nいまの収益上の優先事項は、レンズナビの購入先クリックをASPの成果・確定報酬と照合することです。', [{ label: '経営・実行マスター', url: ISSUE_URL }, { label: 'JARVISの実装計画', url: JARVIS_DOC }]);
  }
  if (/本人|やること|タスク|承認/.test(prompt)) {
    return reply('現時点でこの画面から確定できる本人作業はありません。ASPの原本や管理画面の権限確認が必要になった場合に限り、具体的な操作をまとめて依頼します。\n\n通常の調査、コード点検、下書き、既存の許可済み改善はAI側の担当です。', [{ label: '経営・実行マスター', url: ISSUE_URL }]);
  }
  if (/ジャービス|jarvis|機能|何ができ/.test(prompt)) {
    return reply('JARVISは、自然な会話を入口にして事業を横断管理するAI司令塔を目指しています。\n\n現在この画面で動作するのは、ログイン済みの利用者だけが利用できる状況照会です。既存の自走タスクは別経路で動きます。自由な会話生成・Claudeへの即時指示・音声・24時間常駐を完成済みとは扱いません。', [{ label: '会話型JARVIS設計', url: JARVIS_DOC }]);
  }
  return reply(`${lens ? `レンズナビ：${date}取得の過去28日間で、${lens.totalSessions ?? '未取得'}セッション／購入先クリック${lens.affiliateClicksTotal ?? '未取得'}回（A8 ${lens.affiliateClicksByPlatform?.a8 ?? '未取得'}回、楽天 ${lens.affiliateClicksByPlatform?.rakuten ?? '未取得'}回）。` : `GA4は未取得です（${analytics.error ?? 'データなし'}）。`}\n\n確定報酬は未取得です。いまは成果との照合が最優先です。\n\n「売上は？」「本人タスクは？」「GO」「ジャービスは何ができる？」などで状況を確認できます。これは安全な照会用MVPで、まだ自由会話型GPTではありません。`, data ? [source, { label: '経営・実行マスター', url: ISSUE_URL }] : [{ label: '経営・実行マスター', url: ISSUE_URL }]);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  // No mutations are performed. Still reject requests from an unrelated origin.
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: '不正な送信元です' }, { status: 403 });
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return NextResponse.json({ error: 'JSONで送信してください' }, { status: 415 });
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: 'JSONを読み取れません' }, { status: 400 }); }
  if (!payload || typeof payload !== 'object' || !('message' in payload) || typeof payload.message !== 'string' || payload.message.trim().length === 0 || payload.message.length > 500) {
    return NextResponse.json({ error: '1〜500文字のメッセージを入力してください' }, { status: 400 });
  }
  return NextResponse.json(answer(payload.message, await loadAnalytics()), { headers: { 'Cache-Control': 'no-store' } });
}
