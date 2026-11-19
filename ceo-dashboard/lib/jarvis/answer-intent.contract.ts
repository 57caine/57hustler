import { detectIntent } from './answer-intent';
const cases: Array<[string,ReturnType<typeof detectIntent>]> = [
  ['AI統合稼働できてる？','ai_integration'],
  ['3つのAI統合できてる？','ai_integration'],
  ['GPTとClaudeとGeminiの連携は？','ai_integration'],
  ['ジャービスは何ができる？','jarvis_capability'],
  ['今月の確定報酬は？','earnings'],
  ['レンズナビのクリック数は？','metrics'],
  ['本人タスクは？','owner_tasks'],
  ['今何を優先する？','priorities'],
  ['GO','execution'],
  ['猫の名前を考えて','unknown'],
  ['この質問に答えて','unknown'],
];
export function testAnswerIntent(){
 for(const [input,expected] of cases){
  const result=detectIntent(input);
  if(result!==expected)throw new Error(`intent mismatch: ${input}: expected ${expected}, got ${result}`);
 }
 return `intent cases passed: ${cases.length}`;
}
