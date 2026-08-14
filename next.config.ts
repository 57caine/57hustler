import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
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
      // 重複記事の統合（2026-07-30）
      {
        source: '/column/vr-movie-video-service-2026',
        destination: '/column/vr-movie-streaming-service-recommend-2026',
        permanent: true,
      },
      {
        source: '/column/vr-movie-video-service-recommend-2026',
        destination: '/column/vr-movie-streaming-service-recommend-2026',
        permanent: true,
      },
      {
        source: '/column/vr-movie-video-service-osusume-2026',
        destination: '/column/vr-movie-streaming-service-recommend-2026',
        permanent: true,
      },
      {
        source: '/column/megane-online-shopping',
        destination: '/column/megane-online-shopping-compare-2025',
        permanent: true,
      },
      {
        source: '/column/contact-2week-osusume',
        destination: '/column/2week-contact-osusume',
        permanent: true,
      },
      {
        source: '/column/ranshi-contact-erabikata',
        destination: '/column/ranshi-contact-ranking-2025',
        permanent: true,
      },
      {
        source: '/column/ranshi-contact-ranking-erabikata',
        destination: '/column/ranshi-contact-ranking-2025',
        permanent: true,
      },
      {
        source: '/column/astigmatism-contact-guide-2026',
        destination: '/column/ranshi-contact-ranking-2025',
        permanent: true,
      },
      {
        source: '/column/lasik-dry-eye-prevention-2026',
        destination: '/column/lasik-dry-eye-management-postoperative-care-2026',
        permanent: true,
      },
      {
        source: '/column/shohosen-nashi-tsuuhan',
        destination: '/column/contact-tsuuhan-shohosen-nashi-kanzen-guide',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
