function showBadge () {
  chrome.browserAction.setIcon({
    path: {
      16: 'icon_true16.png',
      19: 'icon_true19.png',
      32: 'icon_true32.png',
      38: 'icon_true38.png'
    }
  });
}

function hideBadge () {
  chrome.browserAction.setIcon({
    path: {
      16: 'icon16.png',
      19: 'icon19.png',
      32: 'icon32.png',
      38: 'icon38.png'
    }
  });
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.from === 'content') {
    switch (msg.subject) {
      case 'showBadge':
        showBadge();
      break;
      case 'hideBadge':
        hideBadge();
      break;
    }
  }
});

chrome.tabs.onUpdated.addListener((tabid, changeinfo, tab) => {
  chrome.tabs.sendMessage(tab.id, {update:true}, (response) => {});
});
chrome.tabs.onActivated.addListener((activeinfo) => {
  chrome.tabs.sendMessage(activeinfo.tabId, {update:true}, (response) => {});
})