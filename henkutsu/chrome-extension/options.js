function setStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = type || '';
}

document.addEventListener('DOMContentLoaded', () => {
  // 既存設定を読み込み
  chrome.storage.sync.get('amazonTag', ({ amazonTag }) => {
    if (amazonTag) document.getElementById('amazon-tag').value = amazonTag;
  });

  chrome.storage.local.get('anthropicKey', ({ anthropicKey }) => {
    if (anthropicKey) document.getElementById('anthropic-key').value = anthropicKey;
  });

  document.getElementById('btn-save').addEventListener('click', () => {
    const tag = document.getElementById('amazon-tag').value.trim() || 'hustle-digger-22';
    const apiKey = document.getElementById('anthropic-key').value.trim();

    chrome.storage.sync.set({ amazonTag: tag }, () => {
      chrome.storage.local.set({ anthropicKey: apiKey }, () => {
        setStatus('✓ 保存しました', 'success');
        setTimeout(() => setStatus(''), 2500);
      });
    });
  });
});
