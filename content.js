function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
let allDomElements = document.getElementsByTagName("*");
chrome.runtime.onMessage.addListener((mess,auth,resp)=>{
  if(mess=="iconClicked"){
    for(e of allDomElements){
      if(e.hasAttribute("data-prevBgr")){
        e.style.backgroundColor = document.body.getAttribute("data-prevBgr");
        e.removeAttribute("data-prevBgr");
      }else{
        e.setAttribute("data-prevBgr",document.body.style.backgroundColor);
        e.style.backgroundColor = getRandomColor();
      }
      if(e.hasAttribute("data-prevFgr")){
        e.style.color = document.body.getAttribute("data-prevFgr");
        e.removeAttribute("data-prevFgr");
      }else{
        e.setAttribute("data-prevFgr",document.body.style.color);
        e.style.color = getRandomColor();
      }
    }
  }
});