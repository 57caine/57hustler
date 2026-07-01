function setStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = type || '';
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('amazonTag', ({ amazonTag }) => {
    if (amazonTag) document.getElementById('amazon-tag').value = amazonTag;
  });

  document.getElementById('btn-save').addEventListener('click', () => {
    const tag = document.getElementById('amazon-tag').value.trim() || 'hustle-digger-22';
    chrome.storage.sync.set({ amazonTag: tag }, () => {
      setStatus('✓ 保存しました', 'success');
      setTimeout(() => setStatus(''), 2500);
    });
  });
});
