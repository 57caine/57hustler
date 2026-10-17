'use client';

import { useEffect } from 'react';

/**
 * 楽天への送客クリックの簡易計測。
 * rel="sponsored" かつ data-hotel-no / data-placement を持つリンクのクリックを /api/click に送る。
 * sendBeacon はページ遷移中でも送信が完了するため、リンクの遷移（別タブ）は一切妨げない。
 */
export default function ClickTracker() {
  useEffect(() => {
    // キャンペーン識別子だけをタブ内に保存（個人情報・外部リファラーは収集しない）。
    const source = new URLSearchParams(window.location.search).get('utm_source');
    const allowed = ['share_x', 'share_line', 'threads', 'instagram', 'rakuten_room'];
    if (source && allowed.includes(source)) {
      try { sessionStorage.setItem('rakutabi_source', source); } catch { /* storage unavailable */ }
    }
    function handleClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest('a');
      if (!a || !(a.getAttribute('rel') ?? '').includes('sponsored')) return;
      const hotelNo = a.dataset.hotelNo;
      const placement = a.dataset.placement;
      if (!hotelNo || !placement) return;
      let trafficSource = 'unattributed';
      try { trafficSource = sessionStorage.getItem('rakutabi_source') ?? 'unattributed'; } catch { /* storage unavailable */ }
      const body = JSON.stringify({ hotelNo, placement, page: window.location.pathname, trafficSource });
      try {
        if (!navigator.sendBeacon?.('/api/click', new Blob([body], { type: 'application/json' }))) {
          // sendBeacon が送信キューに入らなかった場合だけ代替送信する。
          // fetch の拒否を捕捉し、ページ遷移中の unhandled rejection を防ぐ。
          // 応答失敗時に自動再送すると二重計上の可能性があるため再送しない。
          void fetch('/api/click', {
            method: 'POST',
            body,
            keepalive: true,
            headers: { 'Content-Type': 'application/json' },
          }).catch(() => {
            // 計測の失敗で利用者の操作を妨げない
          });
        }
      } catch {
        // 計測の失敗で利用者の操作を妨げない
      }
    }
    // 中クリック（新しいタブで開く）も計測する
    document.addEventListener('click', handleClick);
    document.addEventListener('auxclick', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('auxclick', handleClick);
    };
  }, []);
  return null;
}
