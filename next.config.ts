import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/column/%E3%82%AB%E3%83%A9%E3%82%B3%E3%83%B3-%E9%81%B8%E3%81%B3%E6%96%B9',
        destination: '/column/karakon-shoshinsha-guide',
        permanent: true,
      },
      {
        source: '/column/%E9%9F%93%E5%9B%BD-%E3%82%AB%E3%83%A9%E3%82%B3%E3%83%B3-%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0',
        destination: '/column/korea-karakon-ranking-2026',
        permanent: true,
      },
      {
        source: '/column/%E3%82%AB%E3%83%A9%E3%82%B3%E3%83%B3-%E5%BA%A6%E3%81%82%E3%82%8A',
        destination: '/column/karakon-do-ari-erabikata',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
