/* HollowCraft - данные игры. Весь контент описан таблицами, а не кодом. */
var DATA = {

  mine: { chargeMax0: 10, chargeReward0: 12, diffCoff: 1.15, rewardCoff: 1.27 },

  smelt: { rate: 1000, bulkExp: 1000000, bulkCoins: 1200 },

  fistDamage: 5,

  weapons: [
    { id:"knife",      name:"Нож",        img:"knife.png",      dmg:25,    cost:80,     desc:"Ржавый, но острый. Уже не кулаки." },
    { id:"kusarigama", name:"Кусаригама", img:"kusarigama.png", dmg:200,   cost:800,    desc:"Серп на цепи. Боссы напряглись." },
    { id:"scythe",     name:"Коса",       img:"scythe.png",     dmg:1500,  cost:9000,   desc:"Та самая. Урожай собран." },
    { id:"rtx",        name:"RTX-Коса",   img:"rtx.png",        dmg:15000, cost:120000, desc:"С трассировкой лучей. 4K, 60 кадров боли." }
  ],

  generators: [
    { id:"g1",      name:"Грибник",     img:"grass.png",        cost:40,     exp:2,     coins:0, desc:"Собирает опыт по кустам." },
    { id:"g2",      name:"Дятел",       img:"angelcheater.gif", cost:200,    exp:10,    coins:0, desc:"Долбит дупло без устали." },
    { id:"g3",      name:"Крот-шахтёр", img:"golden.png",       cost:1200,   exp:60,    coins:0, desc:"Роет вглубь, видит плохо." },
    { id:"g4",      name:"Бур",         img:"power.gif",        cost:8000,   exp:400,   coins:0, desc:"Гудит. Очень гудит." },
    { id:"g5",      name:"Экскаватор",  img:"archos.png",       cost:60000,  exp:3000,  coins:0, desc:"Промышленные масштабы." },
    { id:"g6",      name:"RTX-ферма",   img:"rtx.png",          cost:500000, exp:30000, coins:0, desc:"Майнит опыт, греет лес." },
    { id:"pension", name:"Пенсия",      img:"casehack.png",     cost:40000,  exp:0,     coins:1, desc:"Капают монеты. Стабильно." }
  ],

  bosses: [
    { id:"bear",     name:"Лесной Медведь",   img:"boss.gif",     bg:"lightground.gif", hp:350,      regen:0,    reward:{coins:100},             win:"bal1win.mp3",
      intro:"Медведь не сбежал с леса. Он тебя ждал.",                death:"Медведь притворился побеждённым и убежал. Засчитано." },
    { id:"overlord", name:"Оверлорд",         img:"overlord.png", bg:"lightground.gif", hp:3000,     regen:0,    reward:{coins:250},             win:"bal2win.mp3",
      intro:"Оверлорд Балансира. Он тут главный. Пока что.",          death:"Оверлорд разбалансирован. Дисбаланс — это победа." },
    { id:"power",    name:"Чистая Сила",      img:"power.gif",    bg:"waterground.gif", hp:9000,     regen:0,    reward:{coins:600},             win:"bal3win.mp3",
      intro:"Чистая Сила. Интеллекта ноль, зато много.",             death:"Сила кончилась. Бывает." },
    { id:"dragon",   name:"Дракон Балансира", img:"dragon.gif",   bg:"waterground.gif", hp:35000,    regen:25,   reward:{coins:1500,putin:1},    win:"bal4win.mp3",
      intro:"Дракон лечится. Бей быстрее, чем он восстанавливается.", death:"Дракон выгорел. Как и твоя мышка." },
    { id:"sphere",   name:"Сфера Хаоса",      img:"sparea.gif",   bg:"fireground.gif",  hp:90000,    regen:160,  reward:{coins:4000,putin:1},    win:"bal1win.mp3",
      intro:"Сфера Хаоса. Это твоя сфера из шахты, но злая.",         death:"Хаос упорядочен. Спасибо за службу." },
    { id:"archos",   name:"Архос Древний",    img:"archos.png",   bg:"bg.jpg",          hp:600000,   regen:0,    reward:{coins:13000},           win:"bal2win.mp3",
      intro:"Архос. Древний, большой, невыспавшийся.",               death:"Архос ушёл досыпать. Навсегда." },
    { id:"ninja",    name:"Ниндзя-Читер",     img:"ninja.png",    bg:"fireground.gif",  hp:1800000,  regen:3200, reward:{coins:45000,putin:3},   win:"bal3win.mp3",
      intro:"Ниндзя-Читер лечится нагло. Без RTX-Косы тут тяжко.",    death:"Ниндзя забанен за читы. Какая ирония." },
    { id:"final",    name:"Дракон-Властелин", img:"dragon.gif",   bg:"fireground.gif",  hp:12000000, regen:0,    reward:{coins:150000,putin:12}, win:"bal4win.mp3",
      intro:"Дракон-Властелин. Финал. Сделано WarGack'ом — а проходить тебе.", death:"Дракон-Властелин повержен. HollowCraft пройден!" }
  ],

  casePacks: [
    { id:"p1", count:1,  cost:30  },
    { id:"p2", count:5,  cost:130 },
    { id:"p3", count:15, cost:350 }
  ],

  /* Награды кейсов. exp-награды умножаются на (1 + побеждено боссов), чтобы
     оставаться полезными в поздней игре. */
  caseRewards: [
    { w:35, type:"exp",   amount:800,   label:"немного опыта" },
    { w:27, type:"exp",   amount:6000,  label:"опыт" },
    { w:16, type:"exp",   amount:60000, label:"гора опыта" },
    { w:12, type:"coins", amount:25,    label:"монеты" },
    { w:7,  type:"coins", amount:200,   label:"горсть монет" },
    { w:3,  type:"putin", amount:1,     label:"Путин-коин" }
  ],

  boosts: [
    { id:"greed",   name:"Жадность",       img:"golden.png", cost:5, once:true,  desc:"Все монеты приходят ×2. Навсегда." },
    { id:"idle2",   name:"Хитрый WarGack", img:"power.gif",  cost:8, once:true,  desc:"Генераторы работают ×2. Навсегда." },
    { id:"expdump", name:"Опытный читер",  img:"sparea.gif", cost:3, once:false, desc:"Мгновенно +5 000 000 опыта." },
    { id:"bomb",    name:"Ядерная бомба",  img:"dragon.gif", cost:2, once:false, desc:"Текущий босс теряет 40% здоровья." }
  ],

  achievements: [
    { id:"firstclick",  name:"Первый клик",    desc:"Кликнуть по сфере." },
    { id:"firstsmelt",  name:"Первая плавка",  desc:"Переплавить опыт в монеты." },
    { id:"firstweapon", name:"Вооружён",       desc:"Купить первое оружие." },
    { id:"arsenal",     name:"Полный арсенал", desc:"Купить всё оружие." },
    { id:"firstboss",   name:"Охотник",        desc:"Победить первого босса." },
    { id:"halfboss",    name:"На полпути",     desc:"Победить 4 боссов." },
    { id:"allboss",     name:"Легенда леса",   desc:"Победить всех боссов." },
    { id:"firstcase",   name:"Азарт",          desc:"Открыть первый кейс." },
    { id:"case25",      name:"Лудоман",        desc:"Открыть 25 кейсов." },
    { id:"factory",     name:"Завод",          desc:"Купить все генераторы." },
    { id:"rich",        name:"Магнат",         desc:"Накопить 100 000 монет." },
    { id:"exp1m",       name:"Гигаопыт",       desc:"Заработать 1 000 000 опыта." },
    { id:"click1k",     name:"Мозоль",         desc:"Сделать 1 000 кликов." },
    { id:"putin10",     name:"Инвестор",       desc:"Накопить 10 Путин-коинов." }
  ],

  cheats: {
    "750190":       { msg:"На текущего босса сброшена ядерная бомба!", fx:"killboss"  },
    "228228":       { msg:"+228 Путин-коинов. Respect.",               fx:"putin228"  },
    "#читы":        { msg:"+1 000 000 опыта. Классика.",               fx:"exp1m"     },
    "#хакеры":      { msg:"+50 000 монет. Никому не говори.",           fx:"coins50k"  },
    "#нагибатор":   { msg:"Всё оружие разблокировано.",                 fx:"allweapons"},
    "WarAAC":       { msg:"Все генераторы разблокированы.",             fx:"allgen"    },
    "#разработчик": { msg:"Ты не разработчик. Но ладно, держи.",         fx:"devpack"   }
  },

  tips: [
    "Медведь ещё не сбежал с леса.",
    "Полный заряд сферы даёт больше опыта, чем десяток кликов.",
    "Опыт сам себя не переплавит — загляни в Шахту.",
    "Боссы Балансира уважают острое железо из Магазина.",
    "В кейсах бывают Путин-коины. Редко, но бывают.",
    "Генераторы качают опыт, даже когда игра закрыта.",
    "Дракон лечится. Бей быстрее, чем он восстанавливается.",
    "Сделано WarGack'ом, ещё в 2017-м."
  ],

  audio: {
    music:"bg.mp3", charge:"exp.mp3", smelt:"money.mp3", error:"erreasyhard.mp3",
    caseOpen:"caseermoney.mp3", casePutin:"putin.mp3", caseExp:"exp.mp3",
    ach:"money.mp3", cheat:"putin.mp3"
  }
};
