function plugin(title, code, html) {
  let ret = {};
  if (code.startsWith("http")) {
    fetch(code)
      .then(b => b.text)
      .then(js => ret.code = js);
  } else {
    ret.code = code;
  }
  ret.title = title;
  ret.html = html;
  ret.active = false;
  ret.storage = {};
  return ret;
}
chrome.runtime.onInstalled.addListener(_ => {
  chrome.storage.local.set({
    plugins: {
      builtin: [
        plugin("test", "alert(\"test plugin\")", "<h1>0123456789</h1>")
      ],
      verified: /*loadPluginsFromUrl("")*/[],
      unverified: [],
      all: _=>{
        chrome.storage.local.get(["plugins"],storageDOTlocal=>{
          const {plugins} = storageDOTlocal;
        })
        let ret = [];
        plugins.builtin.forEach(plugin=>{plugin.type = "builtin"; ret.push(plugin);});
        plugins.verified.forEach(plugin=>{plugin.type = "verified"; ret.push(plugin);});
        plugins.unverified.forEach(plugin=>{plugin.type = "unverified"; ret.push(plugin);});
        return ret;
      }
    }
  });
});
chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, "togglePopup");
});