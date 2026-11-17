/**
 * Three provider transport adapters. They are deliberately NOT exposed by an
 * API route or connected to the chat UI. External calls remain disabled until
 * verified spend limits, owner consent, durable accounting and audit exist.
 *
 * Official interfaces: OpenAI Responses API, Anthropic Messages API,
 * Google Gemini generateContent.
 */
import type { Agent, Review } from './tri-ai';

export type ProviderConfig = { apiKey: string; model: string };
type ProviderAnswer = { agent: Agent; text: string; model: string; inputTokens: number | null; outputTokens: number | null };
type RequestArgs = { agent: Agent; prompt: string; config: ProviderConfig; signal: AbortSignal };
const MAX_PROMPT = 6000;
const MAX_OUTPUT_TOKENS = 600;
function checked(prompt: string, config: ProviderConfig) {
  if (!prompt || prompt.length > MAX_PROMPT) throw new Error('Prompt outside bounds');
  if (!config.apiKey || !config.model || !/^[a-zA-Z0-9._:-]{2,100}$/.test(config.model)) throw new Error('Provider not configured');
}
async function jsonPost(url: string, headers: Record<string,string>, body: object, signal: AbortSignal): Promise<Record<string,unknown>> {
  const res = await fetch(url, {
    method: 'POST', headers: { 'Content-Type':'application/json', ...headers },
    body: JSON.stringify(body), signal, cache:'no-store', redirect:'error'
  });
  if (!res.ok) throw new Error(`Provider returned HTTP ${res.status}`); // Never log response body or secrets
  return await res.json() as Record<string,unknown>;
}
const finiteTokens = (value: unknown): number | null => typeof value === 'number' && Number.isFinite(value) ? value : null;
const object = (value: unknown): Record<string,unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string,unknown> : {};
const array = (value: unknown): unknown[] => Array.isArray(value) ? value : [];

export async function requestProvider({agent,prompt,config,signal}: RequestArgs): Promise<ProviderAnswer> {
  checked(prompt,config);
  if(agent==='gpt') {
    const data=await jsonPost('https://api.openai.com/v1/responses',
      {Authorization:`Bearer ${config.apiKey}`},
      {model:config.model,input:prompt,max_output_tokens:MAX_OUTPUT_TOKENS,store:false},signal);
    const texts=array(data.output).flatMap(part=>array(object(part).content).map(c=>object(c).text).filter((v):v is string=>typeof v==='string'));
    const usage=object(data.usage);
    const text=texts.join('\n').trim();
    if(!text) throw new Error('Empty OpenAI response');
    return {agent,text,model:config.model,inputTokens:finiteTokens(usage.input_tokens),outputTokens:finiteTokens(usage.output_tokens)};
  }
  if(agent==='claude') {
    const data=await jsonPost('https://api.anthropic.com/v1/messages',
      {'x-api-key':config.apiKey,'anthropic-version':'2023-06-01'},
      {model:config.model,max_tokens:MAX_OUTPUT_TOKENS,messages:[{role:'user',content:prompt}]},signal);
    const text=array(data.content).map(c=>object(c).text).filter((v):v is string=>typeof v==='string').join('\n').trim();
    const usage=object(data.usage);
    if(!text)throw new Error('Empty Anthropic response');
    return {agent,text,model:config.model,inputTokens:finiteTokens(usage.input_tokens),outputTokens:finiteTokens(usage.output_tokens)};
  }
  if(agent==='gemini') {
    const data=await jsonPost(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent`,
      {'x-goog-api-key':config.apiKey},
      {contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:MAX_OUTPUT_TOKENS}},signal);
    const text=array(data.candidates).flatMap(c=>array(object(object(c).content).parts).map(p=>object(p).text).filter((v):v is string=>typeof v==='string')).join('\n').trim();
    const usage=object(data.usageMetadata);
    if(!text) throw new Error('Empty Gemini response');
    return {agent,text,model:config.model,inputTokens:finiteTokens(usage.promptTokenCount),outputTokens:finiteTokens(usage.candidatesTokenCount)};
  }
  throw new Error('Unsupported provider');
}

/** Strictly parses model-produced JSON. Never count unverified text as a vote. */
export function parseReview(agent: Agent, raw: string): Review {
  let value: unknown;
  try { value=JSON.parse(raw); } catch { throw new Error(`Invalid ${agent} review JSON`); }
  const data=object(value);
  if (!['approve','revise','reject'].includes(String(data.verdict))) throw new Error(`Invalid ${agent} verdict`);
  if (typeof data.reasoning!=='string' || !data.reasoning.trim() || data.reasoning.length>4000) throw new Error('Invalid reasoning');
  if (!Array.isArray(data.evidence) || !Array.isArray(data.risks) || data.evidence.length>10 || data.risks.length>10 ||
    ![...data.evidence,...data.risks].every(v=>typeof v==='string' && v.length<=500)) throw new Error('Invalid evidence');
  return {agent,verdict:data.verdict as Review['verdict'],reasoning:data.reasoning,evidence:data.evidence as string[],risks:data.risks as string[]};
}
export function reviewPrompt(assignment: string): string {
  return `${assignment}\n\n回答はJSONのみ。{ "verdict": "approve|revise|reject", "reasoning": "根拠ある短い説明", "evidence": ["確認済みの証拠"], "risks": ["残るリスク"] }。証拠のない内容は断定しない。Webや社内データを検索したふりをしない。別のAIが賛成したと仮定しない。`;
}
