browser.browserAction.onClicked.addListener((tab) => {
  // Only activate for eBay item pages
  if (tab.url.includes('ebay.com/itm/')) {
    browser.tabs.executeScript(tab.id, {
      file: "content.js"
    });
  } else {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.runtime.getURL("icons/icon-48.png"),
      "title": "eBay-MD",
      "message": "This extension only works on eBay item pages."
    });
  }
});