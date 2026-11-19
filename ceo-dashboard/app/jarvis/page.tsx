import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import JarvisChat from '@/components/JarvisChat';
import JarvisExecutionStatus from '@/components/JarvisExecutionStatus';
import JarvisActionsEvidence from '@/components/JarvisActionsEvidence';
import JarvisCEOReceipts from '@/components/JarvisCEOReceipts';
import './mission.css';

export const dynamic='force-dynamic';
export const metadata={title:'JARVIS｜AI司令塔'};

export default async function JarvisPage(){
  const user=await getCurrentUser();
  if(!user)redirect('/login');
  return <section className="jarvis-shell">
    <header className="jv-brandline">
      <div><div className="jv-eyebrow" style={{marginBottom:6}}>57HUSTLER · COMMAND CENTER</div><div className="jv-name">J<span>A</span>RVIS<span>.</span></div></div>
      <span className="jv-status"><span className="jv-dot" aria-hidden="true"/>閲覧モード</span>
    </header>
    <section className="jv-hero">
      <div>
        <div className="jv-eyebrow">OWNER DASHBOARD · PHASE 01</div>
        <h1>仕事の全体像を、<br/>ひとつの画面に。</h1>
        <p>数字を読み取り、AIの仕事の進み具合を確認するための司令塔です。余計な報告を減らし、必要な判断を見つけやすくします。</p>
      </div>
      <div className="jv-orb" aria-hidden="true"><div className="jv-orb-center">JARVIS</div></div>
    </section>
    <JarvisChat/>
    <JarvisExecutionStatus/>
    <JarvisCEOReceipts/>
    <JarvisActionsEvidence/>
    <footer className="jv-footer">
      現在は読み取り専用の初期版です。GitHubの状態記録とGA4の取得値を表示します。実際のコード修正や自動運用は別の既存実行器が担当します。未取得の確定報酬を0円と表示しません。
    </footer>
  </section>;
}
