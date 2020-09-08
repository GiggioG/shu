let SHU = {
  SYSTEM: {
    PLUGINS: {
      all: async _ => {
        let ret = [];
        await new Promise((resolve, reject) => {
          chrome.storage.local.get(["plugins"], storageDOTlocal => {
            const plugins = storageDOTlocal.plugins;
            plugins.builtin.forEach(plugin => { plugin.type = "builtin"; ret.push(plugin); });
            plugins.verified.forEach(plugin => { plugin.type = "verified"; ret.push(plugin); });
            plugins.unverified.forEach(plugin => { plugin.type = "unverified"; ret.push(plugin); });
            resolve(ret);
          });
        });
        return ret;
      },
      plugin: (title, code, pagehtml, pagejs) => {
        let ret = {};
        if (code.startsWith("http")) {
          fetch(code)
            .then(b => b.text)
            .then(js => ret.code = js);
        } else {
          ret.code = code;
        }
        ret.title = title;
        ret.id = title.replace(" ", "_");
        ret.page = {
          "html": pagehtml,
          "js": pagejs
        };
        ret.active = true; //     .M.A.K.E. .I.T. .F.A.L.S.E.
        ret.storage = {};
        return ret;
      },
      loadVerifiedPluginsFromUrl: async url => {
        let json = JSON.parse(await (await fetch(url)).text());
        let plugins = [];
        let currentPlugin;
        json.forEach(pUrl => {
          currentPlugin = await fetch(pUrl);
          currentPlugin = await currentPlugin.text();
          currentPlugin = JSON.parse(currentPlugin);
          plugins.push(SHU.SYSTEM.PLUGINS.plugin(
            currentPlugin.name,
            currentPlugin.code,
            currentPlugin.page.html,
            currentPlugin.page.js
          ));
        });
        let old = await new Promise((resolve, reject) => {
          chrome.storage.local.get(["plugins"], storageDOTlocal => {
            resolve(storageDOTlocal.plugins);
          });
        });
        let oldNames = [];
        old.verified.forEach(p => {
          oldNames.push(p.name);
        });
        plugin.forEach(p => {
          if (!oldNames.includes(p.name)) {
            old.verified.push(p);
          }
        });
        await new Promise((resolve, reject) => {
          chrome.storage.local.set({"plugins":old}, _ => {
            resolve();
          });
        });
      },
      setActive: async (id, active) => {
        let old = await new Promise((resolve, reject) => {
          chrome.storage.local.get(["plugins"], storageDOTlocal => {
            resolve(storageDOTlocal.plugins);
          });
        });
        Object.keys(old).forEach(k => {
          old[k].forEach(p => {
            if (p.id == id) {
              p.active = active;
            }
          });
        });
        await new Promise((resolve, reject) => {
          chrome.storage.local.set({ "plugins": old }, _ => {
            resolve();
          })
        });
      },
      PluginGUI: class {
        constructor(plugin) {
          let html = plugin.page.html;
          let js = plugin.page.js;
          this.window = open("", "", ".");
          this.window.document.body.innerHTML = html;
          eval(js);
        }
        remove(milis = 0) {
          setTimeout(_ => this.window.close(), milis);
          return this;
        }
      },
    },
    PluginManagementGUI: class {
      constructor() {
        this.window = open("", "", ".")
        this.window.document.head.title = "Shu plugin management";
        //FROM ./html/PluginManagementGUI.html
        this.window.document.body.innerHTML = "<!DOCTYPE html> <html lang=\"en\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>Shu Plugin Management</title> <link href=\"https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap\" rel=\"stylesheet\"> </head> <body> <h1>Shu Plugin Management</h1> <h2>BuiltIn Plugins</h2> <div id=\"builtin\" class=\"body-plugins\"> </div> <h2>Verified Plugins</h2> <div id=\"verified\" class=\"body-plugins\"> </div> <h2>Unverified</h2> <div id=\"unverified\" class=\"body-plugins\"> </div> <script> alert(1); </script> <style> :root { --color-black: black; --color-green: #2db526; } body { font-family: 'Poppins', sans-serif; place-items: center; color: var(--color-black); background-color: var(--color-green); } div.body-plugins { border: 2px solid var(--color-black); } div.plugin { display: flex; height: 25px; } div.switch { border-radius: 10%; background-color: var(--color-green); border: 1px solid var(--color-black); width: 50px; height: 22px; } div.switch-dot { position: fixed; border-radius: 50%; width: 20px; height: 20px; } div.switch-dot-off { left: 10px; background-color: var(--color-green); border: 1px solid var(--color-black); } div.switch-dot-on { left: 40px; background-color: var(--color-black); border: 1px solid var(--color-green); } span.plugin-title { margin-left: 5px; } div.plugin-openpage, div.plugin-openpage *{ position: fixed; right: 15px; height: inherit; } </style> </body> </html>";
        new Promise(async _ => {
          let allPlugins = await SHU.SYSTEM.PLUGINS.all()
          allPlugins.forEach(plugin => {
            let pluginDiv = this.window.document.createElement("div");
            this.window.document.querySelector(`#${plugin.type}`).appendChild(pluginDiv);
            //FROM ./html/PluginManagementGUI.html lines 16-26
            pluginDiv.outerHTML = `<div class=\"plugin\" id=\"${plugin.id}\"> <div class=\"switch\"> <div class=\"switch-dot switch-dot-${plugin.active ? "on" : "off"}\"></div> </div> <span class=\"plugin-title\">${plugin.title}</span> <div class=\"plugin-openpage\"> <img src=\"https://i.imgur.com/Ary7PUA.png\" alt=\"Link icon\"> </div> </div>`;
            this.window.document.querySelector(`#${plugin.id} div.switch`).addEventListener("click", async _ => {
              this.window.document.querySelector(`#${plugin.id} div.switch div.switch-dot`).classList.toggle("switch-dot-on");
              this.window.document.querySelector(`#${plugin.id} div.switch div.switch-dot`).classList.toggle("switch-dot-off");
              await SHU.SYSTEM.PLUGINS.setActive(plugin.id, !plugin.active);
            });
            this.window.document.querySelector(`#${plugin.title.replace(" ", "_")} div.plugin-openpage`).addEventListener("click", _ => {
              new SHU.SYSTEM.PLUGINS.PluginGUI(plugin);
            });
          });
        });
      }
      remove(milis = 0) {
        setTimeout(_ => this.window.close(), milis);
        return this;
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
  new SHU.SYSTEM.PluginManagementGUI();
});
(async _ => {//async
  await SHU.SYSTEM.PLUGINS.loadVerifiedPluginsFromUrl("https://giggiog.github.io/misc/shu-verified-list.json");
  (await SHU.SYSTEM.PLUGINS.all()).forEach(plugin => {
    if (plugin.active) {
      eval(plugin.code);
    }
  });
})();//async