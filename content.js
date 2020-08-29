let SHU = {
  API: {
    DivAlert: class {
      constructor(text){
        this.div = document.createElement("div");
        this.div.innerHTML = `<h3 style="color:black;">${text}</h3>`;
        this.div.style.display = "grid";
        this.div.style.opacity = "0.75";
        this.div.style.placeItems = "center";
        this.div.style.position = "absolute";
        this.div.style.width = "300px";
        this.div.style.height = "200px";
        this.div.style.top = "calc(25% - 100px)";
        this.div.style.left = "calc(50% - 150px)";
        this.div.style.backgroundColor = "#2db526";
        this.div.style.zIndex = "69420";
        document.body.appendChild(div);
      }
      remove(milis=0){
        setTimeout(_=>this.div.remove(),milis);
        return this;
      }
    }
  }
};
chrome.runtime.onMessage.addListener((mesg, auth, resp) => {
  console.log(chrome.storage.local);
});
chrome.storage.local.get(["plugins"], storageDOTlocal => {
  const {plugins} = storageDOTlocal;
  plugins.builtin.forEach(biP => {
    if(biP.active){eval(biP.code);}
    console.log(`SHU: Loaded builtin plugin "${biP.title}"${biP.active?" and executed it":", but didn't execute it because it isn't active"}`);
  });
});