function plugin(title,code){
  let ret = {};
  if (code.startsWith("http")) {
    fetch(code)
      .then(b => b.text)
      .then(js => ret.code = js);
  } else {
    ret.code = code;
  }
  ret.title = title;
  ret.active = false;
  return ret;
}
chrome.runtime.onInstalled.addListener(details => {
  chrome.storage.local.set({
    plugins: {
      builtin: [
        plugin("test","alert(\"test plugin\")")
      ],
      verified: [
        
      ]
    }
  });
});
chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, "togglePopup");
});