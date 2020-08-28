let rec = true;
let sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let conTo = txt => {
  txt.replace("!","?.");
  let alphabet = "абвгдежзийклмнопрстуфхцчшщъьюяАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ,?.";
  let out = [];
  txt.split("").forEach(c => {
    if(alphabet.indexOf(c)+1 != 0){
      out.push(alphabet.indexOf(c)+1);
    }
  });
  let bin = [];
  out.forEach(n => {
    bin.push((n).toString(2).padStart(6,"0"));
  });
  return bin;
}
let conFrom = bin => {
  let dec = [];
  bin.forEach(b => {
    dec.push(parseInt(b,2));
  });
  let alphabet = "абвгдежзийклмнопрстуфхцчшщъьюяАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ,?.";
  let str = "";
  dec.forEach(d=>{
    str+=(alphabet[d-1]);
  });
  str.replace("?.","!");
  return str;
}
let win;
let parseRecievedBits = bits => {
  let bins = [];
  for(let i = 0;i < bits.length;i+=6){
    let str = "";
    str+=bits[i];
    str+=bits[i+1];
    str+=bits[i+2];
    str+=bits[i+3];
    str+=bits[i+4];
    str+=bits[i+5];
    bins.push(str);
  }
  console.log(bins);
  console.log(conFrom(bins));
  win.document.body.innerHTML+=`<p>${conFrom(bins)}</p>`;
  rec = true;
}
let recieveBits = async iconcontainer => {
  let bits = [];
  await sleep(500);
  let interval = window.setInterval(_=>{
    bits.push(Math.abs(1-(iconcontainer.getElementsByClassName("audioMuted").length)));
    console.log(`${Math.abs(1-(iconcontainer.getElementsByClassName("audioMuted").length))} - l: ${bits.length}`);
    if((bits[bits.length-1]==0)&&(bits[bits.length-2]==0)&&(bits[bits.length-3]==0)&&(bits[bits.length-4]==0)&&(bits[bits.length-5]==0)&&(bits[bits.length-6]==0)){
      for(let i = 0;i < 6;i++){
        bits.pop();
      }
      parseRecievedBits(bits);
      console.log(bits);
      window.clearInterval(interval);
    }
  },500);
}
let send = (butSel,str) => {
  let but = document.querySelector(butSel);
  let bins = conTo(str);
  let bits = [];
  bins.forEach(b=>{
    b.split("").forEach(d=>bits.push(Number(d)));
  });
  for(let i = 0;i < 6;i++){
    bits.push(0);
  }
  let state = 0;
  let timeout = 250;
  console.log(bits);
  /*bits.forEach(async b => {
    await sleep(timeout);
    timeout=500;
    if(b==0){
      if(state==1){
        but.click();
        state = 0;
      }
    }
    else{
      if(state==0){
        but.click();
        state = 1;
      }
    }
    console.log(`${b}: currently ${state}`)
  })*/
  (async _=>{
    for(b of bits){
      await sleep(timeout);
      timeout=500;
      if(b==0){
        if(state==1){
          but.click();
          state = 0;
        }
      }
      else{
        if(state==0){
          but.click();
          state = 1;
        }
      }
      console.log(`${b}: currently ${state}`)
    }
  })();
}
let startListeningInterval = (html,elSel) => {
  let el = document.querySelector(elSel);
  window.setInterval(_=>{
    if(el.innerHTML != html){
      if(rec){
        recieveBits(el);
        rec = false
      }
      html = el.innerHTML;
    }
  },5);
}
let handle = _=>{
  let qs = prompt("Selector to icon container:");
  let html = document.querySelector(qs).innerHTML;
  win = window.open("", "", "width=400,height=700");
  startListeningInterval(html,qs);
  handle = _ => {
    let msgInput = document.querySelector("#usermsg");
    let muteButtonSelector = '.audio-preview > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child';
    send(muteButtonSelector,msgInput.value);
    msgInput.value = "";
  }
}
chrome.runtime.onMessage.addListener((mess,auth,resp)=>{
  if(mess=="send"){
    handle();
  }
});