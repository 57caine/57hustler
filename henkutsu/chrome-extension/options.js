const KEYS = ['pinterestToken', 'pinterestBoardId', 'amazonTag'];

function setStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = type || '';
}

document.addEventListener('DOMContentLoaded', () => {
  // 保存済みの値を読み込む
  chrome.storage.sync.get(KEYS, (data) => {
    if (data.pinterestToken)  document.getElementById('token').value    = data.pinterestToken;
    if (data.pinterestBoardId) document.getElementById('board-id').value = data.pinterestBoardId;
    if (data.amazonTag)       document.getElementById('amazon-tag').value = data.amazonTag;
  });

  document.getElementById('btn-save').addEventListener('click', () => {
    const token   = document.getElementById('token').value.trim();
    const boardId = document.getElementById('board-id').value.trim();
    const tag     = document.getElementById('amazon-tag').value.trim();

    if (!token)   { setStatus('アクセストークンを入力してください。', 'error'); return; }
    if (!boardId) { setStatus('ボードIDを入力してください。', 'error'); return; }

    chrome.storage.sync.set({
      pinterestToken:   token,
      pinterestBoardId: boardId,
      amazonTag:        tag || 'hustle-digger-22',
    }, () => {
      setStatus('✓ 保存しました', 'success');
      setTimeout(() => setStatus(''), 2500);
    });
  });
});
