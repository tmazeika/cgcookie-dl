browser.browserAction.onClicked.addListener(() => {
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    const tab = tabs[0];
    if (!tab) {
      return;
    }
    console.log('Executing...');
    browser.tabs.executeScript(tab.id, {
        file: '/cgcookie_dl.js',
      })
      .then(() => browser.tabs.sendMessage(tab.id, null))
      .catch(console.error);
  });
});
