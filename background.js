browser.browserAction.onClicked.addListener((tab) => {
  // eBay商品ページまたは検索結果ページの場合のみ有効化
  if (tab.url.includes('ebay.com/itm/') || tab.url.includes('ebay.com/sch/')) {
    browser.tabs.executeScript(tab.id, {
      file: "content.js"
    });
  } else {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.runtime.getURL("icons/icon-48.svg"),
      "title": "eBay-MD",
      "message": "This extension only works on eBay item pages and search results."
    });
  }
});