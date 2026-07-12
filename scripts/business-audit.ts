/**
 * 全業務棚卸し・自動化優先順位
 * 57hustlerの全業務を「完全自動化・半自動・人がやるべき」に分類して
 * data/business-audit.json に出力する。
 */

import * as fs from 'fs';
import * as path from 'path';

type AutoLevel = 'full-auto' | 'semi-auto' | 'manual';

interface Task {
  name: string;
  category: string;
  autoLevel: AutoLevel;
  frequency: string;
  currentTool: string;
  manualMinutes: number;
  notes: string;
  nextAction?: string;
}

const TASKS: Task[] = [
  {
    name: 'Threads投稿（夜中のおじさん）',
    category: 'content',
    autoLevel: 'full-auto',
    frequency: '1日6回',
    currentTool: 'GitHub Actions + Claude API',
    manualMinutes: 0,
    notes: '完全自動稼働中。同日重複防止・枠別書き出しも実装済み。',
  },
  {
    name: 'Threads運勢投稿（九星気学）',
    category: 'content',
    autoLevel: 'full-auto',
    frequency: '1日1回',
    currentTool: 'GitHub Actions + Claude API',
    manualMinutes: 0,
    notes: '完全自動稼働中。',
  },
  {
    name: 'Threadsコラム・一文考察',
    category: 'content',
    autoLevel: 'full-auto',
    frequency: '1日3回',
    currentTool: 'GitHub Actions + Claude API',
    manualMinutes: 0,
    notes: '完全自動稼働中。',
  },
  {
    name: 'note記事執筆',
    category: 'content',
    autoLevel: 'semi-auto',
    frequency: '月4本',
    currentTool: 'scripts/generate-note-draft.ts（下書き生成）',
    manualMinutes: 60,
    notes: '下書きはAI生成。編集・公開は手作業。',
    nextAction: 'note APIで公開まで自動化を検討',
  },
  {
    name: 'Instagram投稿',
    category: 'sns',
    autoLevel: 'semi-auto',
    frequency: '週2〜3回（準備中）',
    currentTool: 'GitHub Actions（画像は手動）',
    manualMinutes: 30,
    notes: '画像生成・投稿文はAI。画像アップロードは手動。',
    nextAction: 'Threads API同様にGraph API自動投稿へ',
  },
  {
    name: 'lens-navi価格スクレイピング',
    category: 'data',
    autoLevel: 'full-auto',
    frequency: '1日3回',
    currentTool: 'GitHub Actions + Playwright',
    manualMinutes: 0,
    notes: '完全自動稼働中。',
  },
  {
    name: 'henkutsu商品投稿',
    category: 'ec',
    autoLevel: 'semi-auto',
    frequency: '随時',
    currentTool: 'GitHub Actions + Claude API',
    manualMinutes: 15,
    notes: 'テキスト生成は自動。商品画像・価格入力は手動。',
  },
  {
    name: 'bon記帳',
    category: 'finance',
    autoLevel: 'manual',
    frequency: '随時',
    currentTool: 'なし',
    manualMinutes: 30,
    notes: '現状手動。freee/MoneyForward連携で自動化可能。',
    nextAction: 'freee API連携スクリプト作成',
  },
  {
    name: 'GitHub Actions監視',
    category: 'ops',
    autoLevel: 'full-auto',
    frequency: '常時',
    currentTool: '朝の司令書システム（morning-brief.ts）',
    manualMinutes: 0,
    notes: 'morning-brief.jsonに実行状況を自動集計。',
  },
  {
    name: 'Vercelデプロイ確認',
    category: 'ops',
    autoLevel: 'full-auto',
    frequency: 'push時',
    currentTool: 'GitHub Actions + Vercel CLI',
    manualMinutes: 0,
    notes: '完全自動。失敗時はGitHub通知。',
  },
  {
    name: 'NISA積立確認',
    category: 'finance',
    autoLevel: 'manual',
    frequency: '月1回',
    currentTool: 'なし（証券会社アプリ）',
    manualMinutes: 5,
    notes: '月1回5分程度。自動化不要。',
  },
  {
    name: '株式ポートフォリオ確認',
    category: 'finance',
    autoLevel: 'semi-auto',
    frequency: '週1回',
    currentTool: 'なし（今後: 証券API）',
    manualMinutes: 10,
    notes: '証券会社APIで取得→CEOダッシュボードに表示を検討。',
    nextAction: '証券APIまたはスクレイピングで自動取得',
  },
  {
    name: 'RC物件CF管理',
    category: 'realestate',
    autoLevel: 'manual',
    frequency: '月1回',
    currentTool: 'なし',
    manualMinutes: 20,
    notes: '7年後引継ぎ予定。現在は月1回手作業。',
  },
  {
    name: '税理士連携',
    category: 'finance',
    autoLevel: 'manual',
    frequency: '月1回',
    currentTool: 'なし',
    manualMinutes: 30,
    notes: 'データ渡しのみ。記帳自動化で削減可能。',
  },
  {
    name: 'CEOダッシュボード確認',
    category: 'ops',
    autoLevel: 'semi-auto',
    frequency: '毎朝',
    currentTool: 'ceo-dashboard.vercel.app',
    manualMinutes: 3,
    notes: '閲覧のみ3分。朝の司令書システムで情報集約済み。',
  },
];

function main() {
  const fullAuto = TASKS.filter(t => t.autoLevel === 'full-auto');
  const semiAuto = TASKS.filter(t => t.autoLevel === 'semi-auto');
  const manual   = TASKS.filter(t => t.autoLevel === 'manual');

  const totalManualMin = TASKS.reduce((s, t) => s + t.manualMinutes, 0);
  const savedMin       = TASKS.filter(t => t.autoLevel === 'full-auto').length * 30; // 仮想的な節約時間

  const audit = {
    generatedAt: new Date().toISOString(),
    summary: {
      fullAuto: fullAuto.length,
      semiAuto: semiAuto.length,
      manual:   manual.length,
      totalTasks: TASKS.length,
      dailyManualMinutes: totalManualMin,
      estimatedSavedMinutes: savedMin,
    },
    tasks: {
      fullAuto,
      semiAuto,
      manual,
    },
    nextAutomations: TASKS
      .filter(t => t.nextAction)
      .map(t => ({ name: t.name, action: t.nextAction })),
  };

  const outPath = path.join(process.cwd(), 'data', 'business-audit.json');
  fs.writeFileSync(outPath, JSON.stringify(audit, null, 2), 'utf-8');
  console.log(`✓ 業務棚卸し完了: ${outPath}`);
  console.log(`  完全自動: ${fullAuto.length}件 / 半自動: ${semiAuto.length}件 / 手作業: ${manual.length}件`);
  console.log(`  手作業合計: ${totalManualMin}分/日`);
}

main();
