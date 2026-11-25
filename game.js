const characters={
 liuyi:{name:"刘一",group:"成女",place:"深夜便利店",mood:"高冷装甲",affinity:20,color:"#a5b8d1"},
 taolu:{name:"陶璐夕 / 哈基昭",group:"成女",place:"地下漫展",mood:"中二封印中",affinity:15,color:"#ac96bc"},
 luoye:{name:"落叶林",group:"少女",place:"大学图书馆",mood:"暴躁挑衅",affinity:18,color:"#d38e92"},
 renyu:{name:"任雨儒",group:"少女",place:"河堤跑道",mood:"直球少女",affinity:16,color:"#dfba65"},
 liujia:{name:"刘佳乐",group:"少女",place:"街机厅",mood:"兄弟模式",affinity:17,color:"#7cae9f"},
 nuer:{name:"努尔兰",group:"少女",place:"异国餐厅",mood:"好奇观察",affinity:14,color:"#ce9971"},
 masha:{name:"玛莎丽",group:"少女",place:"流浪猫救助站",mood:"炸毛社恐",affinity:13,color:"#9b97a4"},
 fang:{name:"方俊明",group:"萝莉",place:"大学城甜品店",mood:"幼态作战",affinity:12,color:"#dfaaa2"}
};

const scenes={
 liuyi:[["刘一","都这么晚了，你居然还在便利店？我只是出来买点东西，不是来陪你闲聊的。","高冷装甲","base"],["周子清","（心理活动：漫画和饮料一起买，已经暴露得很彻底了。）","内心吐槽","base",true]],
 taolu:[["陶璐夕 / 哈基昭","汝、汝所见之漆黑，乃吾之封印终章！今日之漫展，注定会被暗影……咳。","中二封印中","base"],["周子清","（心理活动：配合演戏倒可以，但人一多，我就叫她的真名。）","坏笑蓄力","base",true]],
 luoye:[["落叶林","杂鱼学长，又来给我送及格率了吗？","暴躁挑衅","base"],["周子清","（心理活动：这次错的是第三题。她已经快来不及装凶了。）","观察中","base",true]],
 renyu:[["任雨儒","今天跑完这一圈，我一定能追上你！","直球少女","base"],["周子清","（心理活动：追得上当然好，但追到我面前要说什么呢。）","坏笑蓄力","base",true]],
 liujia:[["刘佳乐","兄弟，街机厅开门了！先拿你的十连胜不解释！","兄弟模式","base"],["周子清","（心理活动：嘴上是兄弟，换裙子时却害羞得不行。）","坏笑蓄力","base",true]],
 nuer:[["努尔兰","这个中文词是……『社死』？听起来像是很严重的魔法。","好奇观察","base"],["周子清","（心理活动：机会来了。下次一定要把社死解释得更离谱。）","语言陷阱","base",true]],
 masha:[["玛莎丽","别、别靠太近……猫很怕陌生人，我也是……其实不是。","炸毛社恐","base"],["周子清","（心理活动：晃晃猫粮，社恐猫就会自己靠过来。）","观察中","base",true]],
 fang:[["方俊明","我想吃冰淇淋！这种时候，哥哥应该主动请客才对。","幼态作战","base"],["周子清","（心理活动：想拿幼态拿捏我？那就用大人的逻辑谈判。）","坏笑蓄力","base",true]]
};

let saved=null;try{saved=JSON.parse(localStorage.getItem("heartbeat-pwa-save")||"null")}catch(e){}
let current=saved?.current||"liuyi",affinities=saved?.affinities||Object.fromEntries(Object.entries(characters).map(([id,c])=>[id,c.affinity])),lineIndex=0,messages=[],muted=false,deferredPrompt=null,audioCtx=null,bgmGain=null;
const els={};["characterList","cityPanel","speaker","mood","dialogueText","placeTag","choices","heroineArt","phonePanel","chatList","unreadBadge","cgOverlay","cgTitle","cgCard","stage","nextBtn"].forEach(id=>els[id]=document.getElementById(id));

function artUrl(id,expression="base"){return `assets/characters/${id}/${expression}.webp`}
function renderCharacters(){els.characterList.innerHTML="";Object.entries(characters).forEach(([id,c])=>{const b=document.createElement("button");b.className="character-btn"+(id===current?" active":"");b.innerHTML=`<strong>${c.name}</strong><small>${c.group} · 好感 ${affinities[id]}</small>`;b.onclick=()=>{openCharacter(id);els.cityPanel.classList.remove("open")};els.characterList.appendChild(b)})}
function openCharacter(id){current=id;lineIndex=0;const c=characters[id];els.placeTag.textContent=c.place;els.mood.textContent=c.mood;els.heroineArt.src=artUrl(id,"base");els.heroineArt.alt=c.name+"立绘";renderCharacters();showLine();playSfx("open")}
function showLine(){const set=scenes[current];els.choices.innerHTML="";if(lineIndex>=set.length){showChoices();return}const line=set[lineIndex++];els.speaker.textContent=line[0];els.mood.textContent=line[2];els.dialogueText.textContent=line[1];els.dialogueText.classList.toggle("inner",!!line[4]);const expression=line[3]||"base";els.heroineArt.src=artUrl(current,expression);speech(line[1],line[0])}
function showChoices(){els.dialogueText.classList.remove("inner");els.speaker.textContent="周子清";els.mood.textContent="请选择态度";els.dialogueText.textContent="眼前的人正在等我作出反应。是温和地帮忙，还是顺着话头设一个小陷阱？";els.choices.innerHTML="";const normal=document.createElement("button"),sly=document.createElement("button");normal.className="choice normal";normal.textContent="老实人：温柔关心，并主动提供帮助";sly.className="choice sly";sly.textContent="腹黑选项：顺着对方的话说，等她跳进陷阱";normal.onclick=()=>reply(false);sly.onclick=()=>reply(true);els.choices.append(normal,sly)}
function reply(sly){const c=characters[current],gain=sly?5+Math.floor(Math.random()*4):2;affinities[current]+=gain;els.speaker.textContent=sly?"周子清（坏笑）":"周子清";els.mood.textContent=sly?"反差演出":"温和回应";els.dialogueText.textContent=sly?`“既然你都这么说了，那就求我一下吧？不然，我可不知道该怎么‘顺便’帮你。”好感度 +${gain}`:`“没关系，我来帮你。先把事情理清楚，再慢慢解决。”好感度 +${gain}`;els.choices.innerHTML="";els.heroineArt.src=artUrl(current,sly?"shy":"happy");if(sly)showCg(c.name);messages.push({name:c.name,text:sly?"刚才……你是不是故意逗我的？":"谢谢你，今天真的帮了我大忙。",unread:true});renderCharacters();renderChats();playSfx(sly?"sly":"soft")}
function showCg(name){els.cgTitle.textContent=`${name} · 心跳特写`;els.cgOverlay.hidden=false;els.cgCard.style.setProperty("--accent",characters[current].color);setTimeout(()=>els.cgOverlay.hidden=true,1800)}
function renderChats(){els.chatList.innerHTML=messages.length?messages.map(m=>`<div class="chat ${m.unread?"unread":""}"><small>${m.name} · 新消息</small>${m.text}</div>`).join(""):"<div class=\"chat\"><small>暂无消息</small>去城市地图触发互动吧。</div>";els.unreadBadge.textContent=messages.filter(m=>m.unread).length}

function initAudio(){if(audioCtx)return;if(!window.AudioContext)return;audioCtx=new AudioContext();bgmGain=audioCtx.createGain();bgmGain.gain.value=.025;bgmGain.connect(audioCtx.destination);const notes=[261.63,329.63,392,329.63,293.66,349.23,440,349.23];let step=0;setInterval(()=>{if(muted||audioCtx.state!=="running")return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="sine";o.frequency.value=notes[step++%notes.length];g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.12,audioCtx.currentTime+.04);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.65);o.connect(g);g.connect(bgmGain);o.start();o.stop(audioCtx.currentTime+.7)},900)}
function playSfx(type){if(muted)return;initAudio();if(!audioCtx)return;if(audioCtx.state==="suspended")audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type==="sly"?"triangle":"sine";o.frequency.value=type==="sly"?660:type==="open"?320:440;g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(type==="sly"?.12:.07,audioCtx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.28);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.3)}
function speech(text,speakerName){if(muted||speakerName=== "周子清"||!("speechSynthesis"in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text.replace(/（[^）]*）/g,""));u.lang="zh-CN";u.rate=.92;u.pitch=speakerName.includes("刘")?1.12:1;window.speechSynthesis.speak(u)}

els.nextBtn.onclick=()=>{initAudio();showLine()};
document.getElementById("menuBtn").onclick=()=>els.cityPanel.classList.toggle("open");
document.getElementById("phoneBtn").onclick=()=>{els.phonePanel.classList.add("open");els.phonePanel.setAttribute("aria-hidden","false");messages.forEach(m=>m.unread=false);els.unreadBadge.textContent="0"};
document.getElementById("closePhone").onclick=()=>{els.phonePanel.classList.remove("open");els.phonePanel.setAttribute("aria-hidden","true")};
document.getElementById("saveBtn").onclick=()=>{localStorage.setItem("heartbeat-pwa-save",JSON.stringify({current,affinities}));document.getElementById("saveBtn").textContent="已保存"};
document.getElementById("loadBtn").onclick=()=>{try{const s=JSON.parse(localStorage.getItem("heartbeat-pwa-save")||"null");if(s){current=s.current||current;affinities=s.affinities||affinities;openCharacter(current)}}catch(e){}};
document.getElementById("audioBtn").onclick=()=>{muted=!muted;document.getElementById("audioBtn").textContent=muted?"播放":"静音";if(!muted)initAudio()};
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").hidden=false});document.getElementById("installBtn").onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById("installBtn").hidden=true};
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));
renderChats();openCharacter(current);
