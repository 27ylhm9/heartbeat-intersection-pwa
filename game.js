const characters = {
  liuyi:{name:"刘一",group:"成女",place:"深夜便利店",mood:"高冷装甲",affinity:20,hair:"#b4a2a1",dress:"#9db2c9"},
  taolu:{name:"陶璐夕 / 哈基昭",group:"成女",place:"地下漫展",mood:"中二封印中",affinity:15,hair:"#8c769c",dress:"#b49cc9"},
  luoye:{name:"落叶林",group:"少女",place:"大学图书馆",mood:"暴躁挑衅",affinity:18,hair:"#be7c82",dress:"#e39aa0"},
  renyu:{name:"任雨儒",group:"少女",place:"河堤跑道",mood:"直球少女",affinity:16,hair:"#d09b68",dress:"#edc66e"},
  liujia:{name:"刘佳乐",group:"少女",place:"街机厅",mood:"兄弟模式",affinity:17,hair:"#50786e",dress:"#82aea1"},
  nuer:{name:"努尔兰",group:"少女",place:"异国餐厅",mood:"好奇观察",affinity:14,hair:"#805c50",dress:"#d7a17b"},
  masha:{name:"玛莎丽",group:"少女",place:"流浪猫救助站",mood:"炸毛社恐",affinity:13,hair:"#77747d",dress:"#aaa5b3"},
  fang:{name:"方俊明",group:"萝莉",place:"大学城甜品店",mood:"幼态作战",affinity:12,hair:"#d7aaa0",dress:"#efaba7"}
};

const lines={
 liuyi:[["刘一","都这么晚了，你居然还在便利店？我只是出来买点东西，不是来陪你闲聊的。","高冷装甲"],["周子清","（心理活动：漫画和饮料一起买，已经暴露得很彻底了。）","内心吐槽",true]],
 taolu:[["陶璐夕 / 哈基昭","汝、汝所见之漆黑，乃吾之封印终章！今日之漫展，注定会被暗影……咳。","中二封印中"],["周子清","（心理活动：配合演戏倒可以，但人一多，我就叫她的真名。）","坏笑蓄力",true]],
 luoye:[["落叶林","杂鱼学长，又来给我送及格率了吗？","暴躁挑衅"],["周子清","（心理活动：这次错的是第三题。她已经快来不及装凶了。）","观察中",true]],
 renyu:[["任雨儒","今天跑完这一圈，我一定能追上你！","直球少女"],["周子清","（心理活动：追得上当然好，但追到我面前要说什么呢。）","坏笑蓄力",true]],
 liujia:[["刘佳乐","兄弟，街机厅开门了！先拿你的十连胜不解释！","兄弟模式"],["周子清","（心理活动：嘴上是兄弟，换裙子时却害羞得不行。）","坏笑蓄力",true]],
 nuer:[["努尔兰","这个中文词是……『社死』？听起来像是很严重的魔法。","好奇观察"],["周子清","（心理活动：机会来了。下次一定要把社死两个字解释得更离谱。）","语言陷阱",true]],
 masha:[["玛莎丽","别、别靠太近……猫很怕陌生人，我也是……其实不是。","炸毛社恐"],["周子清","（心理活动：手里晃晃猫粮，社恐猫就会自己靠过来。）","观察中",true]],
 fang:[["方俊明","我想吃冰淇淋！这种时候，哥哥应该主动请客才对。","幼态作战"],["周子清","（心理活动：想拿幼态拿捏我？那就用大人的逻辑谈判。）","坏笑蓄力",true]]
};

const defaults=Object.fromEntries(Object.entries(characters).map(([id,c])=>[id,c.affinity]));
let saved=null; try{saved=JSON.parse(localStorage.getItem("heartbeat-pwa-save")||"null")}catch(e){}
let current=saved?.current||"liuyi";
let affinities=saved?.affinities||defaults;
let lineIndex=0, messages=[], deferredPrompt=null;

const characterList=document.getElementById("characterList"),cityPanel=document.getElementById("cityPanel"),speaker=document.getElementById("speaker"),mood=document.getElementById("mood"),dialogueText=document.getElementById("dialogueText"),placeTag=document.getElementById("placeTag"),choices=document.getElementById("choices"),heroineArt=document.getElementById("heroineArt"),phonePanel=document.getElementById("phonePanel"),chatList=document.getElementById("chatList"),unreadBadge=document.getElementById("unreadBadge");

function renderCharacters(){
 characterList.innerHTML="";
 Object.entries(characters).forEach(([id,c])=>{
  const b=document.createElement("button"); b.className="character-btn"+(id===current?" active":"");
  b.innerHTML=`<strong>${c.name}</strong><small>${c.group} · 好感 ${affinities[id]}</small>`;
  b.onclick=()=>{openCharacter(id);cityPanel.classList.remove("open")};characterList.appendChild(b);
 });
}
function openCharacter(id){
 current=id;lineIndex=0;const c=characters[id];placeTag.textContent=c.place;mood.textContent=c.mood;heroineArt.style.setProperty("--hair",c.hair);heroineArt.style.setProperty("--dress",c.dress);renderCharacters();showLine();
}
function showLine(){
 const set=lines[current];choices.innerHTML="";
 if(lineIndex>=set.length){showChoices();return}
 const line=set[lineIndex++];speaker.textContent=line[0];mood.textContent=line[2];dialogueText.textContent=line[1];dialogueText.classList.toggle("inner",!!line[3]);
}
function showChoices(){
 dialogueText.classList.remove("inner");speaker.textContent="周子清";mood.textContent="请选择态度";
 dialogueText.textContent="眼前的人正在等我作出反应。是温和地帮忙，还是顺着话头设一个小陷阱？";
 choices.innerHTML="";
 const normal=document.createElement("button");normal.className="choice normal";normal.textContent="老实人：温柔关心，并主动提供帮助";
 const sly=document.createElement("button");sly.className="choice sly";sly.textContent="腹黑选项：顺着对方的话说，等她跳进陷阱";
 normal.onclick=()=>reply(false);sly.onclick=()=>reply(true);choices.append(normal,sly);
}
function reply(sly){
 const c=characters[current],gain=sly?5+Math.floor(Math.random()*4):2;affinities[current]+=gain;
 speaker.textContent=sly?"周子清（坏笑）":"周子清";mood.textContent=sly?"反差演出":"温和回应";
 dialogueText.textContent=sly?`“既然你都这么说了，那就求我一下吧？不然，我可不知道该怎么‘顺便’帮你。”好感度 +${gain}`:`“没关系，我来帮你。先把事情理清楚，再慢慢解决。”好感度 +${gain}`;
 choices.innerHTML="";messages.push({name:c.name,text:sly?"刚才……你是不是故意逗我的？":"谢谢你，今天真的帮了我大忙。",unread:true});renderCharacters();renderChats();
}
function renderChats(){chatList.innerHTML=messages.length?messages.map(m=>`<div class="chat ${m.unread?"unread":""}"><small>${m.name} · 新消息</small>${m.text}</div>`).join(""):"<div class=\"chat\"><small>暂无消息</small>去城市地图触发互动吧。</div>";unreadBadge.textContent=messages.filter(m=>m.unread).length}

document.getElementById("nextBtn").onclick=showLine;
document.getElementById("menuBtn").onclick=()=>cityPanel.classList.toggle("open");
document.getElementById("phoneBtn").onclick=()=>{phonePanel.classList.add("open");phonePanel.setAttribute("aria-hidden","false");messages.forEach(m=>m.unread=false);unreadBadge.textContent="0"};
document.getElementById("closePhone").onclick=()=>{phonePanel.classList.remove("open");phonePanel.setAttribute("aria-hidden","true")};
document.getElementById("saveBtn").onclick=()=>{localStorage.setItem("heartbeat-pwa-save",JSON.stringify({current,affinities}));const b=document.getElementById("saveBtn");b.textContent="已保存 ✓";setTimeout(()=>b.textContent="保存进度",1000)};
document.getElementById("loadBtn").onclick=()=>{try{const s=JSON.parse(localStorage.getItem("heartbeat-pwa-save")||"null");if(s){current=s.current||current;affinities=s.affinities||affinities;openCharacter(current)}}catch(e){}};

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").hidden=false});
document.getElementById("installBtn").onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById("installBtn").hidden=true};
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));
renderChats();openCharacter(current);
