import { classifyGate, preparePacket, reconcileReviews } from './tri-ai';
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
  const packet=preparePacket('レンズナビの改善を検証',new Date('2026-11-18T00:00:00Z'));
  equal(packet.state,'awaiting_provider_connections','provider disabled');
  equal(Object.keys(packet.assignments).length,3,'all roles');
  equal(packet.consensus,null,'no fake consensus');
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
