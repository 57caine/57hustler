/**
 * Threads長期アクセストークン 自動更新スクリプト
 *
 * 現在のTHREADS_ACCESS_TOKEN（60日間有効な長期トークン）を、
 * 失効前にth_refresh_tokenで更新し、GitHub Secretsに書き戻す。
 *
 * 前提:
 * - THREADS_ACCESS_TOKENが「まだ有効」な状態でのみ動作する
 *   （完全に失効したトークンは、このスクリプトでは復旧できない。
 *   　その場合はThreads OAuth認可フローを手動でやり直す必要がある）
 * - GitHub Secretsを書き換えるには、Actionsのデフォルト GITHUB_TOKEN では
 *   権限が不足するため、repo scope（Secrets書き込み権限）を持つ
 *   個人アクセストークンを GH_SECRETS_PAT として別途Secrets登録しておくこと
 */

import sodium from 'libsodium-wrappers';

const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;
const GH_SECRETS_PAT = process.env.GH_SECRETS_PAT!;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY!; // 例: "57caine/57hustler"

async function refreshToken(currentToken: string): Promise<{ access_token: string; expires_in: number }> {
  const url = new URL('https://graph.threads.net/refresh_access_token');
  url.searchParams.set('grant_type', 'th_refresh_token');
  url.searchParams.set('access_token', currentToken);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`トークン更新失敗: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as { access_token: string; expires_in: number };
}

async function getRepoPublicKey(): Promise<{ key_id: string; key: string }> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/secrets/public-key`, {
    headers: {
      Authorization: `Bearer ${GH_SECRETS_PAT}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) {
    throw new Error(`公開鍵取得失敗: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as { key_id: string; key: string };
}

async function updateSecret(secretName: string, plaintext: string): Promise<void> {
  await sodium.ready;
  const { key_id, key } = await getRepoPublicKey();

  const binKey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
  const binValue = sodium.from_string(plaintext);
  const encryptedBytes = sodium.crypto_box_seal(binValue, binKey);
  const encryptedValue = sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL);

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/secrets/${secretName}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GH_SECRETS_PAT}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encrypted_value: encryptedValue, key_id }),
    }
  );
  if (!res.ok && res.status !== 201 && res.status !== 204) {
    throw new Error(`Secret更新失敗: ${res.status} ${await res.text()}`);
  }
}

async function main() {
  if (!ACCESS_TOKEN) throw new Error('THREADS_ACCESS_TOKEN が設定されていません');
  if (!GH_SECRETS_PAT) throw new Error('GH_SECRETS_PAT が設定されていません（Secrets書き込み権限を持つPATが必要）');
  if (!GITHUB_REPOSITORY) throw new Error('GITHUB_REPOSITORY が設定されていません');

  console.log('=== Threadsアクセストークン更新開始 ===');
  const { access_token, expires_in } = await refreshToken(ACCESS_TOKEN);
  const days = Math.round(expires_in / 86400);
  console.log(`新しいトークンを取得しました（有効期限: 約${days}日後）`);

  await updateSecret('THREADS_ACCESS_TOKEN', access_token);
  console.log('✓ GitHub Secrets の THREADS_ACCESS_TOKEN を更新しました');
}

main().catch(e => {
  console.error('❌ トークン更新に失敗しました:', (e as Error).message);
  console.error('現在のTHREADS_ACCESS_TOKENが既に失効している場合、このスクリプトでは復旧できません。Threads OAuth認可フローを手動でやり直してください。');
  process.exit(1);
});
