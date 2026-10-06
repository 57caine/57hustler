import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/site';

/**
 * GA4（gtag.js）。layout.tsx から全ページで1回だけ読み込む。
 * - page_view は gtag('config') が自動で送る（初回表示）。サイト内のページ移動は、GA4 のデータストリーム設定
 *   「拡張計測機能 > ブラウザの履歴イベントに基づくページの変更」で計測される。二重計測を避けるため、
 *   page_view を手動では送らない
 * - affiliate_click は components/AffiliateClickTracker.tsx が送る
 */
export default function Analytics() {
  const id = GA_MEASUREMENT_ID;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
