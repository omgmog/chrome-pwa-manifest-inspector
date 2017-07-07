(function () {
  'use strict';
  function message(showBadge) {
    chrome.runtime.sendMessage({
      from: 'content',
      subject: showBadge ? 'showBadge' : 'hideBadge'
    });
  }
  function checkForManifest() {
    var hasManifest = document.head.querySelector('link[rel="manifest"]') !== null;
    message(hasManifest);
  }
  checkForManifest();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.update) {
      checkForManifest();
    }
  });

  window.addEventListener('blur', () => {
    message(false);
  });
}());