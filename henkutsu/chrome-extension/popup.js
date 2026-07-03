const DEFAULT_AMAZON_TAG = 'hustle-digger-22';

function toAffiliateUrl(url, amazonTag) {
  if (!url) return url;
  const tag = amazonTag || DEFAULT_AMAZON_TAG;

  if (/amazon\.co\.jp|amazon\.com|amzn\.to/.test(url)) {
    const u = url.replace(/[?&]tag=[^&]+/, '');
    const sep = u.includes('?') ? '&' : '?';
    return `${u}${sep}tag=${tag}`;
  }

  if (/rakuten\.co\.jp/.test(url)) {
    const encoded = encodeURIComponent(url);
    return `https://hb.afl.rakuten.co.jp/hsc/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encoded}&link_type=text&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJ0ZXh0IiwiY29sIjoxfQ==`;
  }

  return url;
}

function detectUrlType(url) {
  if (!url) return null;
  if (/amazon\.co\.jp|amazon\.com|amzn\.to/.test(url)) return 'amazon';
  if (/rakuten\.co\.jp|item\.rakuten/.test(url)) return 'rakuten';
  return null;
}

function updateLinkBadge(url) {
  const badge = document.getElementById('link-badge');
  const type = detectUrlType(url);
  if (type === 'amazon') {
    badge.textContent = 'Amazon';
    badge.className = 'link-badge amazon';
    badge.style.display = '';
  } else if (type === 'rakuten') {
    badge.textContent = '楽天';
    badge.className = 'link-badge rakuten';
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
}

function setStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = type || '';
}

function buildPinterestUrl(imageUrl, linkUrl, title, description) {
  const desc = [title, description].filter(Boolean).join(' / ');
  const params = new URLSearchParams({
    url: linkUrl || '',
    media: imageUrl,
    description: desc,
  });
  return `https://www.pinterest.com/pin/create/button/?${params.toString()}`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('settings-link').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // storage から pendingPin と設定を読み込む
  chrome.storage.local.get('pendingPin', ({ pendingPin }) => {
    if (!pendingPin) return;

    const { imageUrl, pageUrl } = pendingPin;

    if (imageUrl) {
      document.getElementById('image-url').value = imageUrl;
      const img = document.createElement('img');
      img.src = imageUrl;
      const wrap = document.getElementById('preview-wrap');
      wrap.innerHTML = '';
      wrap.appendChild(img);
    }

    if (pageUrl) {
      chrome.storage.sync.get('amazonTag', ({ amazonTag }) => {
        const affiliateUrl = toAffiliateUrl(pageUrl, amazonTag);
        document.getElementById('link-url').value = affiliateUrl;
        updateLinkBadge(pageUrl);
      });
    }
  });

  document.getElementById('link-url').addEventListener('input', (e) => {
    updateLinkBadge(e.target.value);
  });

  // 投稿ボタン → Pinterest の投稿URLを新しいタブで開く
  document.getElementById('btn-post').addEventListener('click', async () => {
    const imageUrl    = document.getElementById('image-url').value.trim();
    const title       = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const rawLink     = document.getElementById('link-url').value.trim();

    if (!imageUrl) { setStatus('画像URLが取得できていません。', 'error'); return; }

    const { amazonTag } = await chrome.storage.sync.get('amazonTag');
    const linkUrl = toAffiliateUrl(rawLink, amazonTag);

    const pinterestUrl = buildPinterestUrl(imageUrl, linkUrl, title, description);
    chrome.tabs.create({ url: pinterestUrl });

    setStatus('✓ Pinterestを開きました。「保存」を押して完了です。', 'success');
    chrome.storage.local.remove('pendingPin');
  });
});
