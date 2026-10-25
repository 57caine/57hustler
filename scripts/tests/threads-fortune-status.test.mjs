import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';

// 本番投稿は呼ばずに、予約済みなのに生成検証でスキップしたケースが
// 正常終了扱いにならないことをコード上で確認する回帰テスト。
const source = readFileSync(new URL('../post-threads-fortune.ts', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('../../.github/workflows/post-threads-fortune.yml', import.meta.url), 'utf8');

test('3回の生成失敗は正常終了ではなく例外になる', () => {
  const start = source.indexOf('if (oneLiners === null) {');
  assert.notEqual(start, -1);
  const end = source.indexOf('\n  }', start);
  assert.ok(end > start);
  const branch = source.slice(start, end);
  assert.match(branch, /throw new Error\(/);
  assert.doesNotMatch(branch, /\breturn\s*;/);
});

test('投稿完了ログは公開API成功後にのみ出る', () => {
  const publish = source.indexOf('const postId = await publishThread(creationId)');
  const success = source.indexOf('✓ 投稿完了:');
  assert.ok(publish !== -1 && success > publish);
});

test('予約コミット成功後にのみ投稿する条件を保持', () => {
  assert.match(workflow, /id: claim/);
  assert.match(workflow, /if: steps\.claim\.outputs\.should_post == 'true'/);
  assert.match(workflow, /scripts\/post-threads-fortune\.ts --post/);
});
