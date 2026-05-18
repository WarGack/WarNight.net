/* HollowCraft Web - игровая логика. Состояние живёт в объекте S, UI рендерится из него. */
(function(){
"use strict";

/* ===================== утилиты ===================== */
function $(id){ return document.getElementById(id); }
function el(tag,cls,html){ var e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }

function fmt(n){
  n=Math.floor(n);
  if(n<1000) return ""+n;
  var u=["","K","M","B","T","Qa","Qi","Sx","Sp"], i=0;
  while(n>=1000 && i<u.length-1){ n/=1000; i++; }
  var s = n>=100 ? Math.floor(n).toString() : (n>=10 ? n.toFixed(1) : n.toFixed(2));
  return s+u[i];
}
function fmtTime(sec){
  sec=Math.floor(sec);
  var h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60, p=[];
  if(h) p.push(h+" ч"); if(m) p.push(m+" мин"); p.push(s+" с");
  return p.join(" ");
}

/* ===================== состояние ===================== */
var SAVE_KEY="hollowcraft_save_v1";
var OFFLINE_CAP=8*3600;

function defaultState(){
  return {
    exp:0, coins:0, putin:0,
    charge:0, chargeMax:DATA.mine.chargeMax0, chargeReward:DATA.mine.chargeReward0,
    weapons:{}, generators:{}, boosts:{},
    bossIndex:0, bossHp:DATA.bosses[0].hp,
    bossesDefeated:0, won:false,
    cases:0, casesOpened:0,
    achievements:{},
    settings:{ music:40, sfx:70 },
    seenIntro:false,
    lastSave:Date.now(),
    stats:{ clicks:0, expEarned:0, coinsEarned:0 }
  };
}
var S=defaultState();
var activeTab="mine";
var dialogueText="";
var curBossImg="";

/* ===================== сохранение ===================== */
var noSave=false;
function save(){
  if(noSave) return;
  S.lastSave=Date.now();
  try{ localStorage.setItem(SAVE_KEY,JSON.stringify(S)); }catch(e){}
}
function load(){
  var raw;
  try{ raw=localStorage.getItem(SAVE_KEY); }catch(e){ raw=null; }
  if(!raw) return false;
  try{
    var p=JSON.parse(raw), d=defaultState();
    for(var k in d){ if(p[k]!==undefined && typeof d[k]!=="object") d[k]=p[k]; }
    d.settings=Object.assign(d.settings,p.settings||{});
    d.stats=Object.assign(d.stats,p.stats||{});
    d.weapons=p.weapons||{}; d.generators=p.generators||{};
    d.boosts=p.boosts||{}; d.achievements=p.achievements||{};
    if(p.bossIndex!==undefined) d.bossIndex=p.bossIndex;
    if(p.bossHp!==undefined) d.bossHp=p.bossHp;
    d.exp=p.exp||0; d.coins=p.coins||0; d.putin=p.putin||0;
    d.charge=p.charge||0;
    d.chargeMax=p.chargeMax||DATA.mine.chargeMax0;
    d.chargeReward=p.chargeReward||DATA.mine.chargeReward0;
    S=d;
    if(S.bossIndex>=DATA.bosses.length){ S.bossIndex=DATA.bosses.length; }
    return true;
  }catch(e){ return false; }
}
function computeOffline(){
  var dt=(Date.now()-S.lastSave)/1000;
  if(dt<60) return null;
  dt=Math.min(dt,OFFLINE_CAP);
  var r=idleRates();
  if(r.exp<=0 && r.coins<=0) return null;
  var expGain=r.exp*dt, coinGain=gainCoins(r.coins*dt);
  gainExp(expGain);
  if(expGain<1 && coinGain<1) return null;
  return { dt:dt, exp:expGain, coins:coinGain };
}

/* ===================== экономика ===================== */
function gainExp(n){ S.exp+=n; S.stats.expEarned+=n; }
function gainCoins(n){ if(S.boosts.greed) n*=2; S.coins+=n; S.stats.coinsEarned+=n; return n; }

function idleRates(){
  var mult=S.boosts.idle2?2:1, e=0, c=0;
  DATA.generators.forEach(function(g){
    if(S.generators[g.id]){ e+=g.exp*mult; c+=g.coins*mult; }
  });
  return { exp:e, coins:c };
}
function currentBoss(){ return S.bossIndex<DATA.bosses.length ? DATA.bosses[S.bossIndex] : null; }
function getDamage(){
  var dmg=DATA.fistDamage;
  DATA.weapons.forEach(function(w){ if(S.weapons[w.id] && w.dmg>dmg) dmg=w.dmg; });
  return dmg;
}

function tick(dt){
  var r=idleRates();
  if(r.exp) gainExp(r.exp*dt);
  if(r.coins) gainCoins(r.coins*dt);
  var b=currentBoss();
  if(b && b.regen && S.bossHp>0 && S.bossHp<b.hp){
    S.bossHp=Math.min(b.hp,S.bossHp+b.regen*dt);
  }
}

/* ===================== Шахта ===================== */
function clickSphere(ev){
  S.charge+=1;
  S.stats.clicks++;
  unlockAch("firstclick");
  if(S.stats.clicks>=1000) unlockAch("click1k");
  if(S.charge>=S.chargeMax){
    S.charge=0;
    var reward=S.chargeReward;
    gainExp(reward);
    S.chargeMax=Math.ceil(S.chargeMax*DATA.mine.diffCoff);
    S.chargeReward=Math.ceil(S.chargeReward*DATA.mine.rewardCoff);
    sfx("charge");
    floatText(ev,"+"+fmt(reward)+" опыта","big");
    pulse($("sphere"),"pop");
  }else{
    floatText(ev,"+1","small");
    pulse($("sphere"),"tap");
  }
  spawnParticles(ev);
}
function smelt(bulk){
  if(bulk){
    if(S.exp<DATA.smelt.bulkExp){ sfx("error"); toast("Нужно "+fmt(DATA.smelt.bulkExp)+" опыта"); return; }
    S.exp-=DATA.smelt.bulkExp;
    var g1=gainCoins(DATA.smelt.bulkCoins);
    toast("Ультра-плавка: +"+fmt(g1)+" монет");
  }else{
    if(S.exp<DATA.smelt.rate){ sfx("error"); toast("Нужно хотя бы "+fmt(DATA.smelt.rate)+" опыта"); return; }
    var n=Math.floor(S.exp/DATA.smelt.rate);
    S.exp-=n*DATA.smelt.rate;
    var g2=gainCoins(n);
    toast("Переплавлено: +"+fmt(g2)+" монет");
  }
  sfx("smelt");
  unlockAch("firstsmelt");
  save();
}

/* ===================== Арена ===================== */
function hitBoss(ev){
  var b=currentBoss();
  if(!b) return;
  var dmg=getDamage();
  S.bossHp-=dmg;
  floatText(ev,"-"+fmt(dmg),"dmg");
  pulse($("boss-img"),"hit");
  if(S.bossHp<=0) defeatBoss();
}
function defeatBoss(){
  var b=currentBoss();
  if(!b) return;
  S.bossHp=0;
  S.bossesDefeated++;
  var rw=b.reward||{};
  if(rw.coins) gainCoins(rw.coins);
  if(rw.putin) S.putin+=rw.putin;
  sfx2(b.win);
  shake();
  toast("Повержен: "+b.name);
  setDialogue(b.death);
  unlockAch("firstboss");
  if(S.bossesDefeated>=4) unlockAch("halfboss");
  S.bossIndex++;
  var nb=currentBoss();
  if(!nb){
    S.won=true;
    unlockAch("allboss");
    showVictory();
  }else{
    S.bossHp=nb.hp;
    setTimeout(function(){ if(currentBoss()===nb) setDialogue(nb.intro); },1500);
  }
  buildBossList();
  applyArenaBg();
  checkAch();
  save();
}
function setDialogue(t){ dialogueText=t; var d=$("boss-dialogue"); if(d) d.textContent=t; }
function applyArenaBg(){
  var b=currentBoss();
  $("panel-arena").style.backgroundImage="url(assets/img/"+(b?b.bg:"fireground.gif")+")";
}

/* ===================== Магазин ===================== */
function buyWeapon(w){
  if(S.weapons[w.id]) return;
  if(S.coins<w.cost){ sfx("error"); toast("Не хватает монет"); return; }
  S.coins-=w.cost; S.weapons[w.id]=true;
  sfx("smelt"); toast("Куплено: "+w.name);
  unlockAch("firstweapon");
  if(DATA.weapons.every(function(x){ return S.weapons[x.id]; })) unlockAch("arsenal");
  buildShop(); save();
}
function buyGenerator(g){
  if(S.generators[g.id]) return;
  if(S.coins<g.cost){ sfx("error"); toast("Не хватает монет"); return; }
  S.coins-=g.cost; S.generators[g.id]=true;
  sfx("smelt"); toast("Куплено: "+g.name);
  if(DATA.generators.every(function(x){ return S.generators[x.id]; })) unlockAch("factory");
  buildShop(); save();
}
function buyCasePack(p){
  if(S.coins<p.cost){ sfx("error"); toast("Не хватает монет"); return; }
  S.coins-=p.cost; S.cases+=p.count;
  sfx("smelt"); toast("Куплено кейсов: +"+p.count);
  buildShop(); save();
}
function buyBoost(bs){
  if(bs.once && S.boosts[bs.id]) return;
  if(S.putin<bs.cost){ sfx("error"); toast("Не хватает Путин-коинов"); return; }
  S.putin-=bs.cost;
  sfx("cheat");
  if(bs.id==="greed"){ S.boosts.greed=true; toast("Жадность активна: монеты ×2"); }
  else if(bs.id==="idle2"){ S.boosts.idle2=true; toast("Генераторы работают ×2"); }
  else if(bs.id==="expdump"){ gainExp(5000000); toast("+5 000 000 опыта"); }
  else if(bs.id==="bomb"){ bombBoss(); }
  buildShop(); save();
}
function bombBoss(){
  var b=currentBoss();
  if(!b){ toast("Боссов больше нет"); return; }
  S.bossHp=Math.max(0,S.bossHp-b.hp*0.4);
  toast("Бомба: −40% здоровья босса");
  if(S.bossHp<=0) defeatBoss();
}

/* ===================== Кейсы ===================== */
function pickCaseReward(){
  var total=0; DATA.caseRewards.forEach(function(r){ total+=r.w; });
  var roll=Math.random()*total;
  for(var i=0;i<DATA.caseRewards.length;i++){
    roll-=DATA.caseRewards[i].w;
    if(roll<=0) return DATA.caseRewards[i];
  }
  return DATA.caseRewards[0];
}
function openCase(){
  if(S.cases<=0){ sfx("error"); toast("Нет кейсов. Купи в Магазине."); return; }
  S.cases--; S.casesOpened++;
  var r=pickCaseReward(), scale=1+S.bossesDefeated, txt;
  if(r.type==="exp"){ var a=r.amount*scale; gainExp(a); txt="+"+fmt(a)+" опыта"; sfx2(DATA.audio.caseExp); }
  else if(r.type==="coins"){ var c=gainCoins(r.amount); txt="+"+fmt(c)+" монет"; sfx2(DATA.audio.caseOpen); }
  else { S.putin+=r.amount; txt="+"+r.amount+" Путин-коин"; sfx2(DATA.audio.casePutin); }
  var res=$("case-result");
  res.textContent=txt;
  res.classList.remove("win"); void res.offsetWidth; res.classList.add("win");
  pulse($("case-img"),"pop");
  unlockAch("firstcase");
  if(S.casesOpened>=25) unlockAch("case25");
  checkAch(); save();
}

/* ===================== достижения ===================== */
function unlockAch(id){
  if(S.achievements[id]) return;
  S.achievements[id]=true;
  for(var i=0;i<DATA.achievements.length;i++){
    if(DATA.achievements[i].id===id){
      toast("Достижение: "+DATA.achievements[i].name);
      sfx("ach"); break;
    }
  }
  if($("overlay-ach").classList.contains("open")) buildAchList();
  save();
}
function checkAch(){
  if(S.stats.expEarned>=1000000) unlockAch("exp1m");
  if(S.coins>=100000) unlockAch("rich");
  if(S.putin>=10) unlockAch("putin10");
  if(S.stats.clicks>=1000) unlockAch("click1k");
}

/* ===================== звук ===================== */
var music=null;
function sfx(key){ sfx2(DATA.audio[key]); }
function sfx2(file){
  if(!file || S.settings.sfx<=0) return;
  try{
    var a=new Audio("assets/audio/"+file);
    a.volume=clamp(S.settings.sfx/100,0,1);
    a.play().catch(function(){});
  }catch(e){}
}
function initMusic(){
  try{
    music=new Audio("assets/audio/"+DATA.audio.music);
    music.loop=true;
    applyMusicVol();
  }catch(e){}
}
function applyMusicVol(){ if(music) music.volume=clamp(S.settings.music/100,0,1); }
function tryPlayMusic(){
  if(music && music.paused && S.settings.music>0) music.play().catch(function(){});
}

/* ===================== эффекты ===================== */
function evXY(ev){
  if(ev && ev.clientX!=null) return { x:ev.clientX, y:ev.clientY };
  if(ev && ev.changedTouches && ev.changedTouches[0])
    return { x:ev.changedTouches[0].clientX, y:ev.changedTouches[0].clientY };
  if(ev && ev.target){ var r=ev.target.getBoundingClientRect(); return { x:r.left+r.width/2, y:r.top+r.height/2 }; }
  return null;
}
function floatText(ev,text,cls){
  var p=evXY(ev); if(!p) return;
  var f=el("div","float "+(cls||""),text);
  f.style.left=p.x+"px"; f.style.top=p.y+"px";
  $("fx").appendChild(f);
  setTimeout(function(){ f.remove(); },1000);
}
function spawnParticles(ev){
  var p=evXY(ev); if(!p) return;
  for(var i=0;i<6;i++){
    var d=el("div","particle");
    var ang=Math.random()*Math.PI*2, dist=28+Math.random()*42;
    d.style.left=p.x+"px"; d.style.top=p.y+"px";
    d.style.setProperty("--dx",(Math.cos(ang)*dist)+"px");
    d.style.setProperty("--dy",(Math.sin(ang)*dist)+"px");
    $("fx").appendChild(d);
    (function(node){ setTimeout(function(){ node.remove(); },620); })(d);
  }
}
function pulse(node,cls){
  if(!node) return;
  node.classList.remove(cls,"tap","pop","hit");
  void node.offsetWidth;
  node.classList.add(cls);
}
function shake(){
  var g=$("game");
  g.classList.remove("shake"); void g.offsetWidth; g.classList.add("shake");
}
function toast(msg){
  var box=$("toasts");
  while(box.children.length>4) box.removeChild(box.firstChild);
  var t=el("div","toast",msg);
  box.appendChild(t);
  setTimeout(function(){ t.classList.add("hide"); },2600);
  setTimeout(function(){ t.remove(); },3050);
}

/* ===================== построение UI ===================== */
var shopItems=[];
function shopItem(kind,obj){
  var root=el("div","shop-item"), sub="";
  if(kind==="generator"){
    sub = obj.exp ? "+"+fmt(obj.exp)+" опыта/с" : "+"+fmt(obj.coins)+" монет/с";
  }else if(kind==="weapon"){
    sub = "Урон "+fmt(obj.dmg);
  }
  root.innerHTML=
    '<img class="shop-ic" src="assets/img/'+obj.img+'" alt="">'+
    '<div class="shop-info"><div class="shop-name">'+obj.name+'</div>'+
    '<div class="shop-desc">'+obj.desc+'</div>'+
    (sub?'<div class="shop-sub">'+sub+'</div>':'')+'</div>'+
    '<button class="buy-btn"></button>';
  var btn=root.querySelector(".buy-btn");
  btn.addEventListener("click",function(){
    if(kind==="weapon") buyWeapon(obj);
    else if(kind==="generator") buyGenerator(obj);
    else if(kind==="boost") buyBoost(obj);
  });
  shopItems.push({ kind:kind, obj:obj, root:root, btn:btn });
  return root;
}
function casePackItem(p){
  var root=el("div","shop-item");
  root.innerHTML=
    '<img class="shop-ic" src="assets/img/casehack.png" alt="">'+
    '<div class="shop-info"><div class="shop-name">'+p.count+' кейс'+(p.count===1?'':'ов')+'</div>'+
    '<div class="shop-desc">Открываются во вкладке Кейсы.</div></div>'+
    '<button class="buy-btn"></button>';
  var btn=root.querySelector(".buy-btn");
  btn.addEventListener("click",function(){ buyCasePack(p); });
  shopItems.push({ kind:"casepack", obj:p, root:root, btn:btn });
  return root;
}
function buildShop(){
  shopItems=[];
  var gw=$("shop-weapons"), gg=$("shop-generators"), gc=$("shop-cases"), gb=$("shop-boosts");
  gw.innerHTML=""; gg.innerHTML=""; gc.innerHTML=""; gb.innerHTML="";
  DATA.weapons.forEach(function(w){ gw.appendChild(shopItem("weapon",w)); });
  DATA.generators.forEach(function(g){ gg.appendChild(shopItem("generator",g)); });
  DATA.casePacks.forEach(function(p){ gc.appendChild(casePackItem(p)); });
  DATA.boosts.forEach(function(b){ gb.appendChild(shopItem("boost",b)); });
  refreshShop();
}
function refreshShop(){
  shopItems.forEach(function(it){
    var btn=it.btn, o=it.obj, owned=false, cost=o.cost, cur="монет", can;
    if(it.kind==="weapon"){ owned=!!S.weapons[o.id]; }
    else if(it.kind==="generator"){ owned=!!S.generators[o.id]; }
    else if(it.kind==="boost"){ owned=o.once && !!S.boosts[o.id]; cur="Путин"; }
    if(owned){
      btn.textContent = it.kind==="boost" ? "Активно" : "Куплено";
      btn.disabled=true; btn.classList.add("done");
      it.root.classList.add("owned");
      return;
    }
    btn.classList.remove("done"); it.root.classList.remove("owned");
    var have = (it.kind==="boost") ? S.putin : S.coins;
    can = have>=cost;
    btn.textContent="Купить · "+fmt(cost)+" "+cur;
    btn.disabled=!can;
  });
}
function buildBossList(){
  var c=$("boss-list"); c.innerHTML="";
  DATA.bosses.forEach(function(b,i){
    var st=i<S.bossIndex?"done":(i===S.bossIndex?"current":"locked");
    var label=st==="done"?"повержен":(st==="current"?"идёт бой":"закрыт");
    var row=el("div","boss-row "+st);
    row.innerHTML='<span class="bn">'+(i+1)+". "+b.name+'</span><span class="bs">'+label+'</span>';
    c.appendChild(row);
  });
}
function buildAchList(){
  var c=$("ach-list"); c.innerHTML="";
  DATA.achievements.forEach(function(a){
    var done=!!S.achievements[a.id];
    var item=el("div","ach-item "+(done?"done":"locked"));
    item.innerHTML='<span class="ach-name">'+(done?"":"")+a.name+'</span>'+
                   '<span class="ach-desc">'+a.desc+'</span>';
    c.appendChild(item);
  });
}

/* ===================== рендер ===================== */
function renderHUD(){
  $("val-exp").textContent=fmt(S.exp);
  $("val-coins").textContent=fmt(S.coins);
  $("val-putin").textContent=fmt(S.putin);
}
function renderMine(){
  $("charge-fill").style.width=clamp(S.charge/S.chargeMax*100,0,100)+"%";
  $("charge-text").textContent=fmt(S.charge)+" / "+fmt(S.chargeMax);
  $("mine-reward").textContent=fmt(S.chargeReward);
  $("btn-smelt").disabled=S.exp<DATA.smelt.rate;
  $("btn-ultrasmelt").disabled=S.exp<DATA.smelt.bulkExp;
}
function setBossImg(file){
  if(curBossImg===file) return;
  curBossImg=file;
  $("boss-img").src="assets/img/"+file;
}
function renderArena(){
  var b=currentBoss();
  if(!b){
    $("boss-name").textContent="Лес очищен";
    setBossImg("golden.png");
    $("hp-fill").style.width="100%";
    $("hp-text").textContent="Боссов больше нет";
    $("boss-dmg").parentNode.style.visibility="hidden";
    return;
  }
  $("boss-dmg").parentNode.style.visibility="visible";
  $("boss-name").textContent=b.name;
  setBossImg(b.img);
  $("hp-fill").style.width=clamp(S.bossHp/b.hp*100,0,100)+"%";
  $("hp-text").textContent=fmt(Math.ceil(S.bossHp))+" / "+fmt(b.hp);
  $("boss-dmg").textContent=fmt(getDamage());
  $("boss-regen").textContent=b.regen?(" · лечится "+fmt(b.regen)+"/с"):"";
}
function renderCases(){
  $("case-count").textContent=fmt(S.cases);
  $("btn-open-case").disabled=S.cases<=0;
}
function render(){
  renderHUD();
  if(activeTab==="mine") renderMine();
  else if(activeTab==="arena") renderArena();
  else if(activeTab==="cases") renderCases();
  else if(activeTab==="shop") refreshShop();
}

/* ===================== вкладки и оверлеи ===================== */
function switchTab(name){
  activeTab=name;
  var i,t=document.querySelectorAll(".tab"),p=document.querySelectorAll(".panel");
  for(i=0;i<t.length;i++) t[i].classList.toggle("active",t[i].dataset.tab===name);
  for(i=0;i<p.length;i++) p[i].classList.toggle("active",p[i].id==="panel-"+name);
  if(name==="shop") buildShop();
  if(name==="arena"){ applyArenaBg(); buildBossList(); render(); }
}
function openOverlay(id){ $(id).classList.add("open"); }
function closeOverlay(id){ $(id).classList.remove("open"); }

function showVictory(){
  $("victory-stats").textContent=
    "Кликов: "+fmt(S.stats.clicks)+" · Опыта добыто: "+fmt(S.stats.expEarned)+
    " · Кейсов вскрыто: "+fmt(S.casesOpened);
  openOverlay("overlay-victory");
}

/* ===================== читы ===================== */
var brandClicks=0, brandTimer=null;
function brandClick(){
  brandClicks++;
  clearTimeout(brandTimer);
  brandTimer=setTimeout(function(){ brandClicks=0; },3000);
  if(brandClicks>=5){ brandClicks=0; openOverlay("overlay-console"); $("console-input").focus(); }
}
function runCheat(){
  var code=$("console-input").value.trim();
  var c=DATA.cheats[code];
  $("console-input").value="";
  if(!c){ sfx("error"); toast("Неизвестный код"); return; }
  sfx("cheat");
  if(c.fx==="killboss"){ var b=currentBoss(); if(b){ S.bossHp=0; defeatBoss(); } }
  else if(c.fx==="putin228"){ S.putin+=228; }
  else if(c.fx==="exp1m"){ gainExp(1000000); }
  else if(c.fx==="coins50k"){ S.coins+=50000; }
  else if(c.fx==="allweapons"){ DATA.weapons.forEach(function(w){ S.weapons[w.id]=true; }); }
  else if(c.fx==="allgen"){ DATA.generators.forEach(function(g){ S.generators[g.id]=true; }); }
  else if(c.fx==="devpack"){ gainExp(1000000); S.coins+=100000; S.putin+=50; }
  toast(c.msg);
  buildShop(); checkAch(); save();
}

/* ===================== настройки / сохранение ===================== */
function openSettings(){
  $("set-music").value=S.settings.music;
  $("set-sfx").value=S.settings.sfx;
  $("save-box").value="";
  openOverlay("overlay-settings");
}
function exportSave(){
  save();
  try{
    $("save-box").value=btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    $("save-box").select();
    toast("Сохранение в поле. Скопируй его.");
  }catch(e){ toast("Не удалось"); }
}
function importSave(){
  var v=$("save-box").value.trim();
  if(!v){ toast("Вставь строку сохранения"); return; }
  try{
    var obj=JSON.parse(decodeURIComponent(escape(atob(v))));
    if(!obj || typeof obj!=="object") throw 0;
    localStorage.setItem(SAVE_KEY,JSON.stringify(obj));
    noSave=true;
    toast("Загружено. Перезапуск...");
    setTimeout(function(){ location.reload(); },700);
  }catch(e){ sfx("error"); toast("Строка повреждена"); }
}
function resetGame(){
  if(!confirm("Сбросить весь прогресс? Это необратимо.")) return;
  noSave=true;
  try{ localStorage.removeItem(SAVE_KEY); }catch(e){}
  location.reload();
}

/* ===================== игровой цикл ===================== */
var lastFrame=performance.now(), achAcc=0, hiddenSince=0;
function loop(now){
  var dt=Math.min((now-lastFrame)/1000,0.25);
  lastFrame=now;
  tick(dt);
  achAcc+=dt;
  if(achAcc>=1){ achAcc=0; checkAch(); }
  render();
  requestAnimationFrame(loop);
}

/* ===================== тикер подсказок ===================== */
var tipIndex=0;
function rotateTip(){
  tipIndex=(tipIndex+1)%DATA.tips.length;
  $("mine-tip").textContent=DATA.tips[tipIndex];
}

/* ===================== инициализация ===================== */
function bind(){
  $("sphere").addEventListener("click",clickSphere);
  $("sphere").addEventListener("contextmenu",function(e){ e.preventDefault(); });
  $("boss-img").addEventListener("click",hitBoss);
  $("boss-img").addEventListener("contextmenu",function(e){ e.preventDefault(); });
  $("btn-smelt").addEventListener("click",function(){ smelt(false); });
  $("btn-ultrasmelt").addEventListener("click",function(){ smelt(true); });
  $("btn-open-case").addEventListener("click",openCase);
  $("case-img").addEventListener("click",openCase);

  var tabs=document.querySelectorAll(".tab");
  for(var i=0;i<tabs.length;i++){
    (function(t){ t.addEventListener("click",function(){ switchTab(t.dataset.tab); }); })(tabs[i]);
  }

  $("btn-ach").addEventListener("click",function(){ buildAchList(); openOverlay("overlay-ach"); });
  $("btn-ach-close").addEventListener("click",function(){ closeOverlay("overlay-ach"); });
  $("btn-settings").addEventListener("click",openSettings);
  $("btn-set-close").addEventListener("click",function(){ closeOverlay("overlay-settings"); save(); });
  $("btn-export").addEventListener("click",exportSave);
  $("btn-import").addEventListener("click",importSave);
  $("btn-reset").addEventListener("click",resetGame);
  $("btn-intro-start").addEventListener("click",function(){
    S.seenIntro=true; save();
    closeOverlay("overlay-intro");
    tryPlayMusic();
  });
  $("btn-offline-close").addEventListener("click",function(){ closeOverlay("overlay-offline"); });
  $("btn-victory-close").addEventListener("click",function(){ closeOverlay("overlay-victory"); });
  $("btn-console-run").addEventListener("click",runCheat);
  $("btn-console-close").addEventListener("click",function(){ closeOverlay("overlay-console"); });
  $("console-input").addEventListener("keydown",function(e){ if(e.key==="Enter") runCheat(); });

  $("set-music").addEventListener("input",function(){
    S.settings.music=parseInt(this.value,10)||0;
    applyMusicVol(); tryPlayMusic();
  });
  $("set-sfx").addEventListener("input",function(){ S.settings.sfx=parseInt(this.value,10)||0; });

  $("brand").addEventListener("click",brandClick);

  // закрытие оверлеев кликом по фону (кроме интро)
  ["overlay-ach","overlay-settings","overlay-offline","overlay-victory","overlay-console"].forEach(function(id){
    $(id).addEventListener("click",function(e){
      if(e.target===this){ closeOverlay(id); if(id==="overlay-settings") save(); }
    });
  });

  // музыка стартует после первого действия игрока (политика автоплея)
  document.addEventListener("pointerdown",function once(){
    tryPlayMusic();
    document.removeEventListener("pointerdown",once);
  });

  window.addEventListener("beforeunload",save);
  // вкладку скрыли -> запоминаем время; показали -> докручиваем idle-доход за это время
  document.addEventListener("visibilitychange",function(){
    if(document.hidden){ hiddenSince=Date.now(); save(); }
    else{
      if(hiddenSince){
        var away=Math.min((Date.now()-hiddenSince)/1000,OFFLINE_CAP);
        hiddenSince=0;
        if(away>1){
          var r=idleRates();
          if(r.exp) gainExp(r.exp*away);
          if(r.coins) gainCoins(r.coins*away);
        }
      }
      lastFrame=performance.now();
    }
  });
}

function init(){
  var existed=load();
  var offline=existed?computeOffline():null;

  initMusic();
  setDialogue("");
  buildShop();
  buildBossList();
  buildAchList();
  applyArenaBg();
  var cb=currentBoss();
  if(cb && S.bossHp>=cb.hp) setDialogue(cb.intro);
  else if(cb) setDialogue("");
  render();
  bind();

  if(!S.seenIntro){
    openOverlay("overlay-intro");
  }else if(offline){
    $("offline-text").textContent=
      "Тебя не было "+fmtTime(offline.dt)+". Генераторы намайнили: +"+
      fmt(offline.exp)+" опыта"+(offline.coins>=1?" и +"+fmt(offline.coins)+" монет":"")+".";
    openOverlay("overlay-offline");
  }

  rotateTip();
  setInterval(rotateTip,9000);
  setInterval(save,15000);
  requestAnimationFrame(loop);
}

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
else init();

})();
