let SHU = {
  SYSTEM: {
    PluginManagementGUI: class {
      constructor() {
        this.window = open("", "", ".")
        this.window.document.head.title = "Shu plugin management";
        //FROM ./html/PluginManagementGUI.html
        this.window.document.body.innerHTML = "<!DOCTYPE html> <html lang=\"en\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>Shu Plugin Management</title> <link href=\"https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap\" rel=\"stylesheet\"> </head> <body> <h1>Shu Plugin Management</h1> <h2>BuiltIn Plugins</h2> <div id=\"builtin\" class=\"plugins-container\"> </div> <h2>Verified Plugins</h2> <div id=\"verified\" class=\"plugins-container\"> </div> <h2>Unverified</h2> <div id=\"unverified\" class=\"plugins-container\"> </div> <style> * { font-family: 'Poppins', sans-serif; } </style> </body> </html>";
      }
      remove() {
        this.window.close();
      }
    }
  },
  API: {
    Alert: class {
      constructor(text) {
        //FROM ./html/Alert.html
        document.body.innerHTML += `<div style="display:grid;opacity:0.75;place-items:center;position:absolute;width:300px;height:200px;top:calc(25% - 100px);left:calc(50% - 150px);background-color:#2db526;z-index:69420;"><h3 style="color:black">${text}</h3></div>`;
      }
      remove(milis = 0) {
        setTimeout(_ => this.div.remove(), milis);
        return this;
      }
    }
  }
};
chrome.runtime.onMessage.addListener((mesg, auth, resp) => {
  //new SHU.SYSTEM.PluginManagementGUI();
  new SHU.API.Alert("mamama");
});
chrome.storage.local.get(["plugins"], storageDOTlocal => {
  const { plugins } = storageDOTlocal;
  plugins.all().forEach(plugin => {
    if (plugin.active) { eval(plugin.code); }
    console.log(`SHU: Loaded ${plugin.type} plugin "${plugin.title}"${plugin.active ? " and executed it" : ", but didn't execute it because it isn't active"}`);
  });
});