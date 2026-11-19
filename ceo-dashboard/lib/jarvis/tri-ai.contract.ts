import { classifyGate, preparePacket, reconcileReviews, summarizePreflight } from './tri-ai';
import { parseReview, reviewPrompt } from './providers';
import { crossCheckPrompts, finalizeTriad } from './deliberation';

function equal(actual: unknown, expected: unknown, name: string) {
  if (actual !== expected) throw new Error(`${name}: expected ${String(expected)}, got ${String(actual)}`);
}
function throws(fn:()=>unknown,name:string) {
  try { fn(); } catch { return; }
  throw new Error(`${name}: expected failure`);
}
export function testTriAiContract() {
  equal(classifyGate('今日の数字は？'),'read_only','safe query');
  equal(classifyGate('資料を作成'),'draft_only','draft');
  equal(classifyGate('本番公開まで進めて'),'owner_approval','production gate');
  equal(classifyGate('本番公開できてる？'),'read_only','status only');
  equal(classifyGate('3つのAI統合できてる？'),'read_only','integration status');
  equal(classifyGate('レンズナビを改善して'),'draft_only','improvement draft');
  equal(classifyGate('送金して'),'owner_approval','financial gate');
  equal(classifyGate('進めて'),'owner_approval','ambiguous imperative fail closed');
  const packet=preparePacket('レンズナビの改善を検証',new Date('2026-11-18T00:00:00Z'));
  equal(packet.state,'awaiting_provider_connections','provider disabled');
  equal(Object.keys(packet.assignments).length,3,'all roles');
  equal(packet.consensus,null,'no fake consensus');
  equal(summarizePreflight(preparePacket('3つのAI統合できてる？')).includes('いいえ。'),true,'truthful summary');
  equal(summarizePreflight(packet).includes('実際のAIへの送信・協議・実行は行っていません'),true,'draft-only message');
  equal(reconcileReviews([]).status,'incomplete','incomplete votes');
  const reviews=(['gpt','claude','gemini'] as const).map(agent=>parseReview(agent,JSON.stringify({
    verdict:'approve',reasoning:'テストのみ',evidence:[],risks:[]
  })));
  equal(reconcileReviews(reviews).status,'agreement','three approvals');
  const prompts=crossCheckPrompts('比較',reviews);
  equal(Object.keys(prompts).length,3,'three cross checks');
  const completed=reviews.map(r=>({agent:r.agent,decision:r,peersSeen:reviews.filter(p=>p.agent!==r.agent).map(p=>p.agent)}));
  equal(finalizeTriad(reviews,completed).stage,'blocked','no evidence fail closed');
  reviews[1].verdict='reject';
  equal(reconcileReviews(reviews).status,'needs_review','dissent');
  throws(()=>parseReview('gpt','not json'),'malformed');
  throws(()=>parseReview('gpt',JSON.stringify({verdict:'approve',reasoning:'',evidence:[],risks:[]})),'empty reasoning');
  throws(()=>preparePacket(' '),'empty request');
  equal(reviewPrompt('依頼').includes('JSONのみ'),true,'review format');
  return 'tri-ai contract passed';
}
