import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import ConsensusWorkspace from '@/components/ConsensusWorkspace';
export const dynamic='force-dynamic';
export const metadata={title:'3AI 共通協議室'};
export default async function ConsensusPage(){
  const user=await getCurrentUser();
  if(!user)redirect('/login');
  return <main><ConsensusWorkspace/></main>;
}
