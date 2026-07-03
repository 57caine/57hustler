chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'henkutsu-pin',
    title: 'henkutsuでピン投稿',
    contexts: ['image'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'henkutsu-pin') return;

  chrome.storage.local.set({
    pendingPin: {
      imageUrl: info.srcUrl,
      // 画像を囲む<a>のhrefを優先（キャンペーンページ上の商品画像でも商品URLを取得できる）
      pageUrl: info.linkUrl || tab.url,
    },
  }, () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('popup.html'),
      type: 'popup',
      width: 480,
      height: 620,
    });
  });
});
