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
      pageUrl: tab.url,
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
