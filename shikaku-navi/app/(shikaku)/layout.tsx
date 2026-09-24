import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BASE = 'https://shikaku.lens-navi.jp';

// 資格ナビ本体専用のレイアウト。/hoiku 配下には適用されない（ルートグループで分離）
export default function ShikakuLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: '資格ナビ',
        description: '資格取得・通信講座比較サイト',
        inLanguage: 'ja',
      },
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: '資格ナビ',
        url: BASE,
        description: '資格通信講座の費用・合格率・学習スタイルを比較するサイト。',
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
