import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getHomeData } from '@/lib/supabase/home-data';
import {
  computeFreedomDistance,
  computeNetWorth,
  computeAutomationRate,
  computeEducationPreparation,
  formatJpy,
  formatPercent,
} from '@/lib/home-metrics';

// ログインユーザー本人のデータのみを表示するため、ページ単位のキャッシュを無効化する
export const dynamic = 'force-dynamic';

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl px-4 py-3.5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <h2 className="text-sm font-bold mb-2" style={{ color: 'var(--accent)' }}>
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function Empty({ text = 'まだデータがありません' }: { text?: string }) {
  return <p className="text-sm" style={{ color: 'var(--muted)' }}>{text}</p>;
}

function ErrorNote() {
  return (
    <p className="text-sm" style={{ color: '#ef4444' }}>
      読み込みに失敗しました。しばらくしてから再度お試しください。
    </p>
  );
}

function LinkOut({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="text-sm" style={{ color: 'var(--accent)' }}>
      {label} →
    </a>
  );
}

export default async function HomePage() {
  // proxy.ts(ミドルウェア)が既に未認証を/loginへリダイレクトしているが、
  // Server Component側でも認証を再検証する（Proxy単体に依存しない）
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const data = await getHomeData();

  const freedom = computeFreedomDistance(data.incomeStreams.rows, data.ownerSettings.row);
  const netWorth = computeNetWorth(data.netWorthItems.rows, data.realEstateProperties.rows);
  const automation = computeAutomationRate(data.incomeStreams.rows);
  const education = computeEducationPreparation(data.netWorthItems.rows, data.educationCosts.rows);

  return (
    <div className="space-y-4 pb-10">
      <div>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
          57hustler CEO
        </div>
        <h1 className="text-xl font-bold">CEO HOME</h1>
        <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>
          暮らし・資産・事業を見渡し、必要な情報を登録できます
        </p>
        <div className="mt-2">
          <LinkOut href="/today" label="今日やることを見る" />
        </div>
      </div>

      {/* 1. FREEDOM DISTANCE */}
      <Section icon="🕊️" title="自由への距離">
        <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>安定した給与以外の収入が、毎月の生活費をどれだけ賄えるか</p>
        {data.incomeStreams.error || data.ownerSettings.error ? (
          <ErrorNote />
        ) : !freedom.available ? (
          <Empty text={!data.ownerSettings.row || data.incomeStreams.rows.length === 0 ? "生活費または収入が未入力です" : "生活費が0円のため、達成率は表示していません"} />
        ) : (
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
              {formatPercent(freedom.percent!)}
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>
              {freedom.diffJpy! >= 0
                ? `あと ${formatJpy(freedom.diffJpy!)} / 月`
                : `生活費を ${formatJpy(-freedom.diffJpy!)} / 月 上回る安定収入があります`}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-3">
          <LinkOut href="/home/manage/settings" label="生活費を登録・編集" />
          <LinkOut href="/home/manage/income" label="収入を登録・編集" />
        </div>
      </Section>

      {/* 2. TOTAL WEALTH */}
      <Section icon="💰" title="純資産">
        {data.netWorthItems.error || data.realEstateProperties.error ? (
          <ErrorNote />
        ) : !netWorth.available ? (
          <div>
            <Empty text="現在の資産・負債がまだ登録されていません" />
            <div className="mt-2">
              <LinkOut href="/assets" label="資産を登録する" />
            </div>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
              {formatJpy(netWorth.netWorthJpy!)}
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>
              総資産 {formatJpy(netWorth.totalAssetsJpy!)} － 総負債 {formatJpy(netWorth.totalLiabilitiesJpy!)}
            </p>
            <div className="mt-2">
              <LinkOut href="/assets" label="資産を管理する" />
            </div>
          </div>
        )}
      </Section>

      {/* 3. OWNER DECISIONS（既存のGitHub JSONベースのALERT画面をそのまま使う。今回は新規実装しない） */}
      <Section icon="👑" title="判断が必要なこと">
        <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
          判断待ちや気を付けたいことを確認できます
        </p>
        <LinkOut href="/alert" label="判断・お知らせを見る" />
      </Section>

      {/* 4. FAMILY */}
      <Section icon="👨‍👩‍👧" title="家族・教育費">
        {data.familyMembers.error || data.educationCosts.error ? (
          <ErrorNote />
        ) : data.familyMembers.rows.length === 0 ? (
          <Empty text="家族の情報がまだ登録されていません" />
        ) : !education.available ? (
          <div>
            <p className="text-sm" style={{ color: 'var(--text)' }}>
              登録済みの家族: {data.familyMembers.rows.length}名
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>
              {data.educationCosts.rows.length === 0 ? '教育費の見積もりが未入力です' : '教育費の必要額が0円のため、準備率は表示していません'}
            </p>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
              {formatPercent(education.percent!)}
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>
              準備済み {formatJpy(education.preparedJpy!)} ／ 必要額 {formatJpy(education.estimatedJpy!)}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-3">
          <LinkOut href="/home/manage/family" label="家族を登録・編集" />
          <LinkOut href="/home/manage/education" label="教育費を登録・編集" />
        </div>
      </Section>

      <Section icon="🏡" title="将来の大きな支出">
        {data.futureExpenses.error ? <ErrorNote /> : data.futureExpenses.rows.length === 0 ? (
          <Empty text="将来の支出がまだ登録されていません" />
        ) : (
          <div>
            <p className="text-2xl font-bold font-mono">{formatJpy(data.futureExpenses.rows.reduce((sum, expense) => sum + expense.estimated_jpy, 0))}</p>
            <div className="space-y-1 mt-2">
              {data.futureExpenses.rows.map((expense) => <p key={expense.id} className="text-sm break-words">
                {expense.label}：{formatJpy(expense.estimated_jpy)}{expense.target_year ? `（${expense.target_year}年）` : ''}
              </p>)}
            </div>
          </div>
        )}
        <div className="mt-3"><LinkOut href="/home/manage/expenses" label="将来の支出を登録・編集" /></div>
      </Section>

      {/* 5. AUTOMATION */}
      <Section icon="⚙️" title="収入の自動化率">
        <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>給与以外の収入で、手をかけずに入る割合。一部に手をかける収入は半分として計算します。</p>
        {data.incomeStreams.error ? (
          <ErrorNote />
        ) : !automation.available ? (
          <Empty text={data.incomeStreams.rows.some((income) => income.type !== 'employment') ? "給与以外の収入が0円のため、割合は表示していません" : "給与以外の収入が未入力です"} />
        ) : (
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
            {formatPercent(automation.percent!)}
          </div>
        )}
      </Section>

      {/* 6. BUSINESS（既存のGitHub JSONベースのPROJECTS画面をそのまま使う。今回は新規実装しない） */}
      <Section icon="💼" title="事業の状況">
        <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
          それぞれの事業の進み具合と、次にすることを確認できます
        </p>
        <LinkOut href="/projects" label="事業の状況を見る" />
      </Section>

      {/* 7. REAL ESTATE */}
      <Section icon="🏢" title="投資不動産">
        {data.realEstateProperties.error ? (
          <ErrorNote />
        ) : data.realEstateProperties.rows.length === 0 ? (
          <Empty text="投資不動産のデータがまだ登録されていません" />
        ) : (
          <div className="space-y-2">
            {data.realEstateProperties.rows.map((p) => (
              <div key={p.id} className="text-[12px]" style={{ color: 'var(--text)' }}>
                {p.name}（{p.data_type === 'plan' ? '将来の計画' : '現在の情報'}）：評価額 {formatJpy(p.property_value_jpy)} ／ ローン残高 {formatJpy(p.loan_balance_jpy)}
              </div>
            ))}
          </div>
        )}
        <div className="mt-3"><LinkOut href="/home/manage/properties" label="投資不動産を登録・編集" /></div>
      </Section>
    </div>
  );
}
