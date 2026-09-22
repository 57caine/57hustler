/**
 * コラム公開前チェック（校正）モジュール
 *
 * 生成された記事本文に対し、生成本体とは独立したAPI呼び出しで
 * 景品表示法リスクのある表現を機械的にチェックする。
 * 生成モデル（Haiku）より軽量にする必要はないため、コストを抑えつつ
 * 判定精度を確保できる同モデルを使用する。
 *
 * lens-navi専用ではなく、school-navi等への横展開を見据えて
 * タイトル・本文テキストのみを受け取る汎用インターフェースにしてある。
 */

import Anthropic from '@anthropic-ai/sdk';

export interface ComplianceFinding {
  issue_type: 'unfounded_number' | 'exaggerated_claim' | 'uncited_statistic';
  quote: string;
  reason: string;
  suggested_fix: string;
}

export interface ComplianceCheckResult {
  passed: boolean;
  findings: ComplianceFinding[];
}

const CHECK_MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `あなたはアフィリエイトサイトの記事に対する公開前コンプライアンスチェック担当です。
景品表示法（優良誤認・有利誤認）に触れる可能性のある表現がないか、渡された記事本文を機械的にチェックしてください。

チェック観点は以下の3点のみです。これ以外の文体・構成上の指摘は行わないでください。

1. 裏付けのない具体的な数値（例:「ブランド数500以上」「満足度98%」など、出典が示されていない統計・実績値）
2. 「必ず」「絶対」などの断定的な誇張表現
3. 出典が明示されていない統計・実績の記載（「業界No.1」「利用者急増中」など）

各問題箇所について、該当テキストを一字一句そのまま引用し、理由と具体的な修正案（該当箇所を置き換えられる文章）を示してください。
問題が1つも見つからない場合のみ passed: true とし、findings は空配列にしてください。
判定に自信が持てない場合は、安全側に倒して問題として報告してください（見逃しより誤検知の方が望ましい）。`;

export async function checkColumnCompliance(
  title: string,
  content: string,
  apiKey: string,
): Promise<ComplianceCheckResult> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: CHECK_MODEL,
    max_tokens: 2048,
    tools: [{
      name: 'report_compliance_check',
      description: '記事本文のコンプライアンスチェック結果を報告する',
      input_schema: {
        type: 'object' as const,
        properties: {
          passed: { type: 'boolean', description: '問題が1つも見つからなければtrue' },
          findings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                issue_type: {
                  type: 'string',
                  enum: ['unfounded_number', 'exaggerated_claim', 'uncited_statistic'],
                },
                quote: { type: 'string', description: '問題箇所の原文そのままの引用' },
                reason: { type: 'string', description: '問題である理由' },
                suggested_fix: { type: 'string', description: '該当箇所の修正案（置き換え文章）' },
              },
              required: ['issue_type', 'quote', 'reason', 'suggested_fix'],
            },
          },
        },
        required: ['passed', 'findings'],
      },
    }],
    tool_choice: { type: 'tool', name: 'report_compliance_check' },
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `タイトル: ${title}\n\n本文:\n${content}`,
    }],
  });

  const toolBlock = response.content.find((b) => b.type === 'tool_use');
  if (!toolBlock || toolBlock.type !== 'tool_use') {
    // チェック自体が失敗した場合は、安全側に倒して要確認扱いにする
    return {
      passed: false,
      findings: [{
        issue_type: 'uncited_statistic',
        quote: '(チェック処理自体が失敗)',
        reason: 'コンプライアンスチェックAPIから有効な応答が得られませんでした。',
        suggested_fix: '手動で内容を確認してください。',
      }],
    };
  }

  return toolBlock.input as ComplianceCheckResult;
}
