import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import JarvisChat from '@/components/JarvisChat';
import JarvisExecutionStatus from '@/components/JarvisExecutionStatus';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'JARVIS｜会話型司令塔' };

export default async function JarvisPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return (
    <section className="space-y-5 pb-12">
      <div>
        <p className="text-[10px] tracking-widest" style={{ color: 'var(--muted)' }}>57HUSTLER · AI COMMAND CENTER</p>
        <h1 className="text-2xl font-bold mt-1">JARVIS</h1>
        <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>まずは実データを会話で確認する司令塔。実装状況を正確にお伝えします。</p>
      </div>
      <JarvisExecutionStatus />
      <JarvisChat />
    </section>
  );
}
