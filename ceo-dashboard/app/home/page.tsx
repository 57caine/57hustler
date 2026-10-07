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
      <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
        {icon} {title}
      </div>
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
          STEP3: Supabase読み取り確認用の最小表示（まだ編集機能はありません）
        </p>
      </div>

      {/* 1. FREEDOM DISTANCE */}
      <Section icon="🕊️" title="FREEDOM DISTANCE">
        {data.incomeStreams.error || data.ownerSettings.error ? (
          <ErrorNote />
        ) : !freedom.available ? (
          <Empty text="生活費・収入データがまだ登録されていません" />
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
      </Section>

      {/* 2. TOTAL WEALTH */}
      <Section icon="💰" title="TOTAL WEALTH">
        {data.netWorthItems.error || data.realEstateProperties.error ? (
          <ErrorNote />
        ) : !netWorth.available ? (
          <Empty text="資産・不動産データがまだ登録されていません" />
        ) : (
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
              {formatJpy(netWorth.netWorthJpy!)}
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>
              総資産 {formatJpy(netWorth.totalAssetsJpy!)} － 総負債 {formatJpy(netWorth.totalLiabilitiesJpy!)}
            </p>
          </div>
        )}
      </Section>

      {/* 3. OWNER DECISIONS（既存のGitHub JSONベースのALERT画面をそのまま使う。今回は新規実装しない） */}
      <Section icon="👑" title="OWNER DECISIONS">
        <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
          判断待ちの項目は既存のALERT画面でご確認ください
        </p>
        <LinkOut href="/alert" label="ALERTを見る" />
      </Section>

      {/* 4. FAMILY */}
      <Section icon="👨‍👩‍👧" title="FAMILY">
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
              教育費の見積もりがまだ登録されていません
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
      </Section>

      {/* 5. AUTOMATION */}
      <Section icon="⚙️" title="AUTOMATION">
        {data.incomeStreams.error ? (
          <ErrorNote />
        ) : !automation.available ? (
          <Empty text="収入源データがまだ登録されていません" />
        ) : (
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
            {formatPercent(automation.percent!)}
          </div>
        )}
      </Section>

      {/* 6. BUSINESS（既存のGitHub JSONベースのPROJECTS画面をそのまま使う。今回は新規実装しない） */}
      <Section icon="💼" title="BUSINESS">
        <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
          事業の状況は既存のPROJECTS画面でご確認ください
        </p>
        <LinkOut href="/projects" label="PROJECTSを見る" />
      </Section>

      {/* 7. REAL ESTATE */}
      <Section icon="🏢" title="REAL ESTATE">
        {data.realEstateProperties.error ? (
          <ErrorNote />
        ) : data.realEstateProperties.rows.length === 0 ? (
          <Empty text="投資不動産のデータがまだ登録されていません" />
        ) : (
          <div className="space-y-2">
            {data.realEstateProperties.rows.map((p) => (
              <div key={p.id} className="text-[12px]" style={{ color: 'var(--text)' }}>
                {p.name}：評価額 {formatJpy(p.property_value_jpy)} ／ ローン残高 {formatJpy(p.loan_balance_jpy)}
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
