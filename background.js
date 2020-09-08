function plugin(title, code, pagehtml, pagejs) {
  let ret = {};
  if (code.startsWith("http")) {
    fetch(code)
      .then(b => b.text)
      .then(js => ret.code = js);
  } else {
    ret.code = code;
  }
  ret.title = title;
  ret.id = title.replace(" ","_");
  ret.page = {
    "html": pagehtml,
    "js": pagejs
  };
  ret.active = true; //     .M.A.K.E. .I.T. .F.A.L.S.E.
  ret.storage = {};
  return ret;
}
chrome.runtime.onInstalled.addListener(_ => {
  chrome.storage.local.set({
    plugins: {
      builtin: [
        plugin("bi test", "console.error(\"bi test\")", "<h1>bi test</h1>", `console.log("bi test")`),
      ],
      verified: /*loadPluginsFromUrl("")*/[],
      unverified: [
        plugin("uv test", "console.error(\"uv test\")", "<h1>uv test</h1>", `console.log("uv test")`)
      ],
    }
  });
});
chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, "togglePopup");
});