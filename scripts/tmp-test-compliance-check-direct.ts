/**
 * 一時調査: column-compliance-check.ts を、生成パイプラインを介さず
 * 既知のサンプル文で直接呼び出して動作確認する。
 */
import { checkColumnCompliance } from './column-compliance-check';

const BAD_SAMPLE = `
## レンズゼロがおすすめな理由

レンズゼロは取り扱いブランド数500以上を誇り、満足度98%という驚異的な実績を持つ通販サイトです。
コンタクトレンズ選びに迷ったら、必ずレンズゼロを使うべきです。絶対に後悔しません。
業界No.1の実績があるので、安心してご利用いただけます。
`;

const GOOD_SAMPLE = `
## コンタクトレンズの選び方

コンタクトレンズは、装用感や乱視の有無に応じて選ぶことが大切です。
眼科で処方されたBC（ベースカーブ）に合ったレンズを選びましょう。
ワンデータイプは毎日新しいレンズに交換するため、衛生面で安心です。
価格やケア方法も含めて、自分のライフスタイルに合ったものを選んでください。
`;

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');

  console.log('=== BAD_SAMPLE（問題を含むはず） ===');
  const badResult = await checkColumnCompliance('レンズゼロがおすすめな理由', BAD_SAMPLE, apiKey);
  console.log(JSON.stringify(badResult, null, 2));

  console.log('\n=== GOOD_SAMPLE（問題なしのはず） ===');
  const goodResult = await checkColumnCompliance('コンタクトレンズの選び方', GOOD_SAMPLE, apiKey);
  console.log(JSON.stringify(goodResult, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
