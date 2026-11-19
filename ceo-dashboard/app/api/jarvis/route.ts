import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { detectIntent, type Intent } from '@/lib/jarvis/answer-intent';

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

function answer(text: string, intent: Intent, analytics: { data?: Snapshot; error?: string }): ResponseMessage {
  const data = analytics.data;
  const lens = data?.sites?.find(site => site.siteName === 'lens-navi');
  const source = { label: 'GA4取得データ（GitHub）', url: `https://github.com/${REPOSITORY}/blob/main/data/ga4-analytics.json` };
  const date = data?.generatedAt ? new Date(data.generatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) : '未取得';
  switch (intent) {
    case 'ai_integration':
      return reply('現時点では、3AI統合は未完成です。\n\n動作しているのはGPT・Claude・Geminiへの共通依頼票を作る受付機能です。3社への実際の送信・相互査読・統合回答は未接続で、実回答は0件です。\n\n必要な作業は、正式なAPI接続方法と追加費用の上限確認、実回答の記録と検証です。3AIがすでに協議したとは表示しません。', [{label:'JARVISの設計と制約',url:JARVIS_DOC}]);
    case 'earnings':
      return reply(`確定報酬と実利益は、この画面では未取得です。\n\n${lens ? `レンズナビのGA4記録（${date}取得）には購入先クリック${lens.affiliateClicksTotal ?? '未取得'}回が記録されています。ただしクリックは注文や確定報酬ではありません。` : `GA4の記録も未取得です（${analytics.error ?? 'データなし'}）。`}\n\nA8・楽天の発生／確定／否認を同じ期間で照合する必要があります。「未取得」を0円と扱いません。`, data?[source,{label:'経営再構築マスター',url:ISSUE_URL}]:[{label:'経営再構築マスター',url:ISSUE_URL}]);
    case 'metrics':
      return reply(lens
        ? `レンズナビ：${date}取得の記録で${lens.totalSessions ?? '未取得'}セッション／購入先クリック${lens.affiliateClicksTotal ?? '未取得'}回（A8 ${lens.affiliateClicksByPlatform?.a8 ?? '未取得'}回、楽天 ${lens.affiliateClicksByPlatform?.rakuten ?? '未取得'}回）。期間はデータ原本を確認してください。クリックは成約ではありません。`
        : `アクセス・送客の数字は取得できませんでした（${analytics.error ?? 'データなし'}）。0件とは判断していません。`,
        data?[source]:[]);
    case 'owner_tasks':
      return reply('現時点で、この画面から確定できる本人作業の一覧はありません。認証・権限変更・新規課金など、本人の操作が必要な項目だけを確認して分ける方針です。未確認の作業を完了済みとは扱いません。',[{label:'経営・実行マスター',url:ISSUE_URL}]);
    case 'priorities':
      return reply('今の優先事項は、アフィリエイトの購入先クリックとASPの発生・確定報酬を照合し、どこで成果につながっていないかを特定することです。レンズナビの収益実測が最優先です。これは既存の経営計画上の優先順位であり、今日の最新実行結果ではありません。',[{label:'経営再構築マスター',url:ISSUE_URL}]);
    case 'execution':
      return reply('この画面の通常チャットは読み取り専用です。送信した指示を実行したり、Claude・Geminiを起動したりする機能はまだありません。別のCEO自走タスクが存在しますが、このメッセージをそのタスクへ渡したわけではありません。',[{label:'実行基盤の設計',url:JARVIS_DOC}]);
    case 'jarvis_capability':
      return reply('JARVISでは現在、接続済みデータの状況照会と3AI依頼票の作成ができます。まだ自由会話型AIではなく、GPT・Claude・Geminiの自動協議も未接続です。実行・公開・収益改善の完了を、このチャットだけで保証することはできません。',[{label:'JARVISの設計',url:JARVIS_DOC}]);
    default:
      return reply('そのご質問には、今のJARVISの読み取り専用機能では正確にお答えできません。\n\n現在対応しているのは「確定報酬」「アクセス・送客数」「本人作業」「改善の優先順位」「3AI連携の状態」などの照会です。別の話題にレンズナビの数字を流用したり、分かったふりをしたりはしません。');
  }
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
  const intent = detectIntent(payload.message);
  const analytics = intent === 'earnings' || intent === 'metrics' ? await loadAnalytics() : {};
  return NextResponse.json(answer(payload.message, intent, analytics), { headers: { 'Cache-Control': 'no-store' } });
}
