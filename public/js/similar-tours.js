// Similar Tours Widget — inserts cards after FAQ on tour detail pages
(function(){
  var tours = {
    "13d-silk-road-group": { cat:"silkroad" },
    "19d-china-uzbekistan": { cat:"silkroad" },
    "11d-kashgar-kanas": { cat:"silkroad" },
    "10d-xinjiang-gansu-qinghai": { cat:"silkroad" },
    "16d-uzbekistan-china": { cat:"silkroad" },
    "7d-gansu-qinghai": { cat:"silkroad" },
    "11d-silk-road-xinjiang": { cat:"silkroad" },
    "12d-silk-road-train": { cat:"silkroad" },
    "15d-kashgar-tashkent": { cat:"silkroad" },
    "8d-lanzhou-urumqi": { cat:"silkroad" },
    "9d-luxury-xian-urumqi": { cat:"silkroad" },
    "7d-kashgar-bishkek": { cat:"silkroad" },
    "11d-urumqi-bishkek": { cat:"silkroad" },
    "11d-kashgar-xian": { cat:"silkroad" },
    "9d-dunhuang-kashgar": { cat:"silkroad" },
    "beijing-chengdu-zhangjiajie-shanghai": { cat:"silkroad" },
    "silk-road-northern-xinjiang": { cat:"silkroad" },
    "silk-road-tibet-adventure": { cat:"silkroad" },
    "silk-road-yunnan": { cat:"silkroad" },
    "uzbekistan-pakistan-karakoram": { cat:"silkroad" },
    "uzbekistan-kyrgyzstan-china": { cat:"silkroad" }
  };

  var all = [
    {t:"Xinjiang China & Uzbekistan Tour",s:"19d-china-uzbekistan",d:"19 Days",r:"Kashgar → Samarkand",i:"/assets/images/central-asia-architecture.jpg",p:"$4,390"},
    {t:"Xinjiang Group Tour: Kashgar & Kanas",s:"11d-kashgar-kanas",d:"11 Days",r:"Kashgar → Kanas",i:"/assets/images/central-asia-architecture.jpg",p:"$1,780"},
    {t:"Silk Road Group: Xinjiang, Gansu & Qinghai",s:"10d-xinjiang-gansu-qinghai",d:"10 Days",r:"Urumqi → Chaka",i:"/assets/images/hero-silkroad.jpg",p:"$1,450"},
    {t:"Silk Road Group Tour: Gansu & Qinghai",s:"7d-gansu-qinghai",d:"7 Days",r:"Dunhuang → Chaka",i:"/assets/images/hero-mountains.jpg",p:"$980"},
    {t:"Silk Road Xinjiang Tour",s:"11d-silk-road-xinjiang",d:"11 Days",r:"Kashgar → Xi'an",i:"/assets/images/xinjiang-landscape.jpg",p:"$2,599"},
    {t:"China Silk Road Train Tour",s:"12d-silk-road-train",d:"12 Days",r:"Urumqi → Xi'an",i:"/assets/images/desert-dunes.jpg",p:"$2,967"},
    {t:"Great Silk Road: Kashgar to Tashkent",s:"15d-kashgar-tashkent",d:"15 Days",r:"Kashgar → Uzbekistan",i:"/assets/images/hero-silkroad.jpg",p:"$3,738"},
    {t:"Silk Road: Lanzhou to Urumqi",s:"8d-lanzhou-urumqi",d:"8 Days",r:"Lanzhou → Urumqi",i:"/assets/images/desert-dunes.jpg",p:"$1,633"},
    {t:"Luxury Silk Road: Xi'an to Urumqi",s:"9d-luxury-xian-urumqi",d:"9 Days",r:"Xi'an → Urumqi",i:"/assets/images/hero-silkroad.jpg",p:"$1,750"},
    {t:"Kashgar to Bishkek",s:"7d-kashgar-bishkek",d:"7 Days",r:"Kashgar → Bishkek",i:"/assets/images/xinjiang-landscape.jpg",p:"$1,680"},
    {t:"China to Kyrgyzstan Overland",s:"11d-urumqi-bishkek",d:"11 Days",r:"Urumqi → Bishkek",i:"/assets/images/xinjiang-landscape.jpg",p:"$1,909"},
    {t:"Silk Road: Kashgar to Xi'an",s:"11d-kashgar-xian",d:"11 Days",r:"Kashgar → Xi'an",i:"/assets/images/hero-silkroad.jpg",p:"$2,050"},
    {t:"Dunhuang to Kashgar",s:"9d-dunhuang-kashgar",d:"9 Days",r:"Dunhuang → Kashgar",i:"/assets/images/desert-dunes.jpg",p:"$1,450"},
    {t:"Silk Road Travel: Uzbekistan & China",s:"16d-uzbekistan-china",d:"16 Days",r:"Beijing → Tashkent",i:"/assets/images/central-asia-architecture.jpg",p:"$4,780"},
    {t:"Beijing, Chengdu, Zhangjiajie & Shanghai",s:"beijing-chengdu-zhangjiajie-shanghai",d:"12 Days",r:"Beijing → Shanghai",i:"/assets/images/hero-silkroad.jpg",p:"$2,380"},
    {t:"Silk Road & Northern Xinjiang",s:"silk-road-northern-xinjiang",d:"18 Days",r:"Kanas & Altay",i:"/assets/images/central-asia-architecture.jpg",p:"$3,980"},
    {t:"Silk Road & Tibet Adventure",s:"silk-road-tibet-adventure",d:"15 Days",r:"Trade routes meet Tibet",i:"/assets/images/hero-silkroad.jpg",p:"$3,600"},
    {t:"Silk Road & Yunnan Tour",s:"silk-road-yunnan",d:"16 Days",r:"Desert meets tropics",i:"/assets/images/hero-mountains.jpg",p:"$3,450"},
    {t:"Uzbekistan to Pakistan via KKH",s:"uzbekistan-pakistan-karakoram",d:"23 Days",r:"Karakoram Highway",i:"/assets/images/central-asia-architecture.jpg",p:"$5,600"},
    {t:"Uzbekistan, Kyrgyzstan & China",s:"uzbekistan-kyrgyzstan-china",d:"20 Days",r:"Three countries",i:"/assets/images/central-asia-architecture.jpg",p:"$4,800"}
  ];

  var page = window.location.pathname.split('/').pop().replace('.html','');
  if (!tours[page]) return;

  var items = all.filter(function(t){return t.s !== page}).sort(function(){return 0.5-Math.random()}).slice(0,3);

  var h = '<h2 style="margin-top:48px;">Similar Tours You Might Like</h2>';
  h += '<div class="similar-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px;">';
  items.forEach(function(t){
    h += '<a href="/tour/'+t.s+'.html" style="background:var(--white);border-radius:12px;overflow:hidden;box-shadow:var(--shadow-sm);text-decoration:none;transition:var(--transition);display:block;">';
    h += '<img src="'+t.i+'" alt="'+t.t+'" loading="lazy" style="width:100%;height:130px;object-fit:cover;display:block;">';
    h += '<div style="padding:12px 14px;">';
    h += '<span style="display:inline-block;background:var(--navy);color:#fff;padding:2px 8px;border-radius:50px;font-size:0.68rem;font-weight:600;margin-bottom:6px;">'+t.d+'</span>';
    h += '<h3 style="font-size:0.9rem;color:var(--navy);margin:0 0 6px;line-height:1.3;">'+t.t+'</h3>';
    h += '<div style="color:var(--text-muted);font-size:0.75rem;margin-bottom:8px;">&#128205; '+t.r+'</div>';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:8px;">';
    h += '<div><span style="font-size:0.65rem;color:var(--text-muted);">from </span><span style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--clay);">'+t.p+'</span></div>';
    h += '<span style="color:var(--gold);font-size:0.8rem;font-weight:600;">View &rarr;</span></div></div></a>';
  });
  h += '</div><div style="text-align:center;margin-top:24px;"><a href="/tours.html" class="btn btn-gold">Browse All Tours &rarr;</a></div>';

  // Insert before the FAQ section (after Included/Excluded)
  var h2s = document.querySelectorAll('.tour-detail-main h2');
  for (var i = 0; i < h2s.length; i++) {
    if (h2s[i].textContent.includes('Frequently')) {
      h2s[i].insertAdjacentHTML('beforebegin', h);
      break;
    }
  }
})();
