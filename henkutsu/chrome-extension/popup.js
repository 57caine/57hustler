const DEFAULT_AMAZON_TAG = 'hustle-digger-22';

function toAffiliateUrl(url, amazonTag) {
  if (!url) return url;
  const tag = amazonTag || DEFAULT_AMAZON_TAG;

  if (/amazon\.co\.jp|amazon\.com|amzn\.to/.test(url)) {
    const u = url.replace(/[?&]tag=[^&]+/, '');
    const sep = u.includes('?') ? '&' : '?';
    return `${u}${sep}tag=${tag}`;
  }

  // 楽天はそのまま（アフィリIDは後で追加）
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

async function postToPinterest(token, boardId, { title, description, imageUrl, linkUrl }) {
  const body = {
    board_id: boardId,
    title: title || '',
    description: description || '',
    media_source: {
      source_type: 'image_url',
      url: imageUrl,
    },
    link: linkUrl || '',
  };

  const res = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinterest API エラー ${res.status}: ${err}`);
  }
  return res.json();
}

document.addEventListener('DOMContentLoaded', () => {
  // 設定リンク
  document.getElementById('settings-link').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // storage から pendingPin と設定を読み込む
  chrome.storage.local.get('pendingPin', ({ pendingPin }) => {
    if (!pendingPin) return;

    const { imageUrl, pageUrl } = pendingPin;

    // 画像プレビュー
    if (imageUrl) {
      document.getElementById('image-url').value = imageUrl;
      const img = document.createElement('img');
      img.src = imageUrl;
      const wrap = document.getElementById('preview-wrap');
      wrap.innerHTML = '';
      wrap.appendChild(img);
    }

    // リンクURL（アフィリ変換済み）
    if (pageUrl) {
      chrome.storage.sync.get('amazonTag', ({ amazonTag }) => {
        const affiliateUrl = toAffiliateUrl(pageUrl, amazonTag);
        document.getElementById('link-url').value = affiliateUrl;
        updateLinkBadge(pageUrl);
      });
    }
  });

  // リンクURL 手動編集時もバッジ更新
  document.getElementById('link-url').addEventListener('input', (e) => {
    updateLinkBadge(e.target.value);
  });

  // 投稿ボタン
  document.getElementById('btn-post').addEventListener('click', async () => {
    const imageUrl   = document.getElementById('image-url').value.trim();
    const title      = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const rawLink    = document.getElementById('link-url').value.trim();
    const linkUrl    = toAffiliateUrl(rawLink, amazonTag);

    if (!imageUrl) { setStatus('画像URLが取得できていません。', 'error'); return; }
    if (!title)    { setStatus('タイトルを入力してください。', 'error'); return; }

    const { pinterestToken, pinterestBoardId, amazonTag } = await chrome.storage.sync.get([
      'pinterestToken', 'pinterestBoardId', 'amazonTag',
    ]);

    if (!pinterestToken) {
      setStatus('アクセストークンが未設定です。設定画面で入力してください。', 'error');
      return;
    }
    if (!pinterestBoardId) {
      setStatus('ボードIDが未設定です。設定画面で入力してください。', 'error');
      return;
    }

    const btn = document.getElementById('btn-post');
    btn.disabled = true;
    setStatus('投稿中...');

    try {
      const result = await postToPinterest(pinterestToken, pinterestBoardId, {
        title, description, imageUrl, linkUrl,
      });
      const pinId = result.id;
      setStatus(`✓ 投稿完了！ Pin ID: ${pinId}`, 'success');
      // 送信済みの pendingPin を消す
      chrome.storage.local.remove('pendingPin');
    } catch (e) {
      setStatus(e.message, 'error');
      btn.disabled = false;
    }
  });
});
