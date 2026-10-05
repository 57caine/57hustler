import path from 'node:path';
import type { NextConfig } from 'next';

const indexable =
  process.env.PET_BOUSAI_INDEXABLE === 'true' &&
  /^https:\/\//.test(process.env.PET_BOUSAI_SITE_URL ?? '') &&
  !/\.vercel\.app/.test(process.env.PET_BOUSAI_SITE_URL ?? '');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // モノレポ内のため、親フォルダ（lens-navi）の package-lock.json を起点と誤認しないよう明示する
  turbopack: { root: path.join(__dirname) },
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    const noindex = { key: 'X-Robots-Tag', value: 'noindex, nofollow' };
    return [
      // 独自ドメイン公開の承認前は、どのホストでも noindex（HTMLのmetaに加えてHTTPヘッダーでも指定）
      { source: '/:path*', headers: indexable ? security : [...security, noindex] },
      // 承認後も、vercel.app のURLは常に noindex（独自ドメインと内容が重複するため）
      ...(indexable
        ? [{ source: '/:path*', has: [{ type: 'host' as const, value: '(?<host>.*)\\.vercel\\.app' }], headers: [noindex] }]
        : []),
    ];
  },
};

export default nextConfig;
