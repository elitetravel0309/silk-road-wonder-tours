// SEO-optimized FAQ injection for tour detail pages
(function(){
  var page = window.location.pathname.split('/').pop().replace('.html','');

  // FAQ pools by category — question format targets "People Also Ask" snippets
  var pools = {
    xinjiang: [
      {q:"Is Xinjiang safe for foreign travelers in 2026?",a:"Yes. Xinjiang is one of the safest regions in China for foreign tourists. Over 20,000 travelers have joined our Xinjiang tours since 2005 with zero safety incidents. All our tours have English-speaking local guides who know the region intimately. We recommend standard travel precautions — keep copies of your passport, use hotel safes for valuables, and follow your guide's advice in border areas like Taxkorgan."},
      {q:"When is the best time to visit Xinjiang? What are the seasons like?",a:"The best seasons for Xinjiang travel are spring (April–May) when the Ili Valley's lavender fields bloom, and autumn (September–October) when Kanas Lake turns golden. Summer (June–August) is hot in Turpan (up to 40°C) but pleasant in the Tianshan Mountains. Winter (November–March) is very cold — but ideal for Hemu Village snowscapes and ice festivals. For Silk Road tours, April through October is our recommended window."},
      {q:"Do I need a special permit to visit Xinjiang's border areas like Taxkorgan or the Karakoram Highway?",a:"Yes, foreign travelers need a border permit for Taxkorgan (Karakoram Highway) and areas near the Pakistan/Tajikistan/Afghanistan borders. We handle all permit applications for you — just send us your passport copy 10 days before departure. There is no additional cost. The permit process is straightforward and we have a 100% success rate."},
      {q:"What languages are spoken in Xinjiang? Will I need a translator?",a:"Xinjiang is multilingual — Mandarin Chinese is the official language, Uyghur (a Turkic language) is widely spoken in Kashgar and southern Xinjiang, and Kazakh is common in the north. All our tours include English-speaking guides who also speak Mandarin and the local minority language. You won't need a translator — your guide handles all communication."},
      {q:"How much does a Xinjiang Silk Road tour cost? What's included?",a:"Our Xinjiang tours range from $720 (4-day Urumqi grasslands) to $5,600 (23-day Karakoram Highway epic). Mid-range group tours like the 13-day Silk Road Group cost $2,070 per person. All tours include 4-star accommodation, English-speaking guide, all entrance fees, domestic flights/trains within the itinerary, and most meals. International flights to China, visa fees, and personal expenses are not included."},
      {q:"What is the altitude in Xinjiang? Will I get altitude sickness?",a:"Most Xinjiang destinations are at moderate altitudes: Urumqi is at 800m, Kashgar at 1,300m, and Turpan is actually below sea level (-154m). The highest point on our standard routes is Taxkorgan at 3,100m or the Torugart Pass at 3,752m (Kyrgyzstan border crossing). Mild altitude effects are possible above 3,000m. We recommend consulting your doctor and drinking plenty of water at higher elevations."},
    ],
    gansu: [
      {q:"How many Mogao Caves can I visit? Are photos allowed inside?",a:"A standard Mogao Caves ticket includes 8 caves with an official guide. Special tickets include up to 12 caves. Photography and video are strictly prohibited inside all caves to protect the 1,000-year-old murals from flash damage. We recommend visiting in the morning when the light is best and crowds are smaller. The Digital Exhibition Center offers excellent virtual experiences and photo opportunities."},
      {q:"When is the best time to photograph the Zhangye Danxia rainbow mountains?",a:"The Zhangye Danxia landforms look best at sunrise and sunset when low-angle light intensifies the red, orange, and yellow mineral stripes. The best months are April–October. Summer (July–August) can be very hot at midday. Winter snow on the formations creates stunning contrast but access may be limited. Our Zhangye Photography Tour (3 days, $520) is specifically timed for golden-hour shoots."},
      {q:"Is Dunhuang worth visiting if I'm not interested in Buddhist art?",a:"Absolutely. Dunhuang is far more than the Mogao Caves. You can ride camels across the Singing Sand Dunes at sunset, visit Crescent Moon Spring — a natural oasis in the desert — explore the Shazhou Night Market for authentic Silk Road street food, and see live performances of Silk Road music and dance. The city itself is a living museum of Silk Road history."},
      {q:"How do I get to Dunhuang? Is there a train or do I need to fly?",a:"Dunhuang has both an airport (DNH) and a high-speed train station. The Lanzhou–Dunhuang high-speed train takes about 8 hours. Direct flights from Xi'an (2.5 hours), Beijing (4 hours), and Urumqi (1.5 hours) are available. Most of our tour packages include all domestic transportation — your guide will meet you at whichever arrival point you choose."},
      {q:"What's the best Gansu itinerary for first-time Silk Road travelers?",a:"Our 6-day Gansu Highlights ($1,150) is the perfect introduction. It covers Lanzhou (Yellow River), Zhangye (rainbow mountains), Jiayuguan (Great Wall's western end), and Dunhuang (Mogao Caves + sand dunes). You'll travel by high-speed train, stay in 4-star hotels, and have an English-speaking guide throughout. It's our most popular first-timer Gansu tour."},
      {q:"Can I combine Gansu with Xinjiang or Qinghai in one trip?",a:"Yes — our most popular combo is the 13-day Silk Road Group Tour ($2,070) covering Kashgar to Xining across Xinjiang, Gansu, and Qinghai. For a shorter option, the 10-day Xinjiang-Gansu-Qinghai tour ($1,450) covers the highlights. The high-speed train network makes multi-province Silk Road travel seamless."},
    ],
    tibet: [
      {q:"Do I need a special permit to visit Tibet? How do I get one?",a:"Yes, all foreign travelers need a Tibet Travel Permit (TTP) to enter Tibet. We arrange this for you at no extra cost. You'll also need a Chinese visa first — we provide the invitation letter. Apply at least 20 days before travel. Note: individual travel is not allowed in Tibet; you must be part of an organized tour with a licensed guide. We handle the entire process."},
      {q:"How bad is altitude sickness in Tibet? What precautions should I take?",a:"Lhasa is at 3,650m and Everest Base Camp reaches 5,200m. Most travelers experience mild symptoms (headache, shortness of breath) for the first 1–2 days. We recommend: spend 2 days acclimatizing in Lhasa before heading higher, drink 3–4 liters of water daily, avoid alcohol, and consider Diamox (consult your doctor). All our tours include oxygen supplies and our guides are trained in altitude first aid."},
      {q:"What's the best time to visit Tibet? When can I see Everest?",a:"The best months for Tibet travel are May–October. May–June and September–October offer the clearest skies and most comfortable temperatures. Everest Base Camp is accessible from April to October. July–August is monsoon season — possible rain but landscapes are lush and green. Winter (November–March) is very cold (-10°C to -15°C at night) but Lhasa is still accessible and tourist crowds are minimal."},
      {q:"How much does a Tibet tour cost? And what's included?",a:"Our Tibet tours range from $980 (5-day Namtso Lake retreat) to $3,450 (15-day Tibet & Silk Road combo). A classic 8-day Lhasa–Everest Base Camp tour costs $1,890 per person including: Tibet Travel Permit, all accommodation, English-speaking Tibetan guide, private vehicle, all entrance fees (including Everest Base Camp), and most meals. Not included: flights to Lhasa, Chinese visa, travel insurance."},
    ],
    centralasia: [
      {q:"Do I need visas for Central Asian countries? How do I get them?",a:"Most nationalities need visas for the Central Asian 'Stans. Uzbekistan offers e-visas (20 days, apply online) for most nationalities. Kyrgyzstan is visa-free for 60+ countries including US, UK, EU, and Australia. Kazakhstan is visa-free for many nationalities. Turkmenistan requires an invitation letter. We provide detailed visa guidance and support letters for all our Central Asia tours."},
      {q:"Is it safe to travel the Karakoram Highway? What about the Pakistan border?",a:"The Chinese section of the Karakoram Highway (Kashgar to Taxkorgan) is well-maintained and completely safe. Our tours use experienced local drivers who know every curve of the road. The Pakistan border crossing at Khunjerab Pass (4,693m) requires advance permits which we arrange. The Pakistan side is also open to tourism — our 23-day Uzbekistan–Pakistan tour covers both sides with local guides."},
      {q:"What currency do I need in Central Asia? Can I use credit cards?",a:"Each Central Asian country has its own currency: Uzbek Som, Kyrgyz Som, Kazakh Tenge. US Dollars are widely accepted for exchange. ATMs are available in major cities (Tashkent, Bishkek, Almaty) but less common in rural areas. We recommend carrying a mix of USD cash and a travel card. Your guide will help you find the best exchange rates."},
      {q:"How long does it take to travel from China to Uzbekistan overland?",a:"Our 19-day China & Uzbekistan Tour ($4,390) covers the full journey from Kashgar to Samarkand. The overland sections include Kashgar–Torugart Pass–Naryn–Bishkek (Kyrgyzstan), then flights connect you to Tashkent, Samarkand, and Bukhara in Uzbekistan. If you prefer a shorter trip, the 15-day Kashgar to Tashkent tour ($3,738) focuses on the China–Uzbekistan route."},
      {q:"What's the food like in Central Asia? I have dietary restrictions.",a:"Central Asian cuisine is meat-heavy — expect lamb kebabs, plov (rice pilaf), laghman (hand-pulled noodles), and samsa (baked pastries). Vegetarian options exist (vegetable plov, fresh salads, breads) but are less common in rural areas. Halal food is standard throughout the region. We can accommodate most dietary requirements — just let us know when booking and we'll inform all restaurants in advance."},
    ],
    china: [
      {q:"Do I need a visa for China? How long does it take?",a:"Most nationalities need a tourist (L) visa for China. The process typically takes 4–7 business days at your nearest Chinese embassy or visa center. You'll need: passport (valid 6+ months), completed application form, passport photo, flight itinerary, and hotel bookings. We provide an official invitation letter and detailed itinerary to support your application. Apply at least 3 weeks before travel."},
      {q:"How do I get around China? Is the train system easy to use?",a:"China has the world's largest and fastest high-speed rail network — trains run at 300 km/h connecting all major cities. On our tours, all train tickets are included and pre-booked. Your guide handles platform navigation and luggage. For internal flights, we use China's major airlines (China Southern, Air China, China Eastern). Private air-conditioned vehicles are provided for all road transfers and sightseeing."},
      {q:"Can I use my phone and internet in China? What about Google and WhatsApp?",a:"Yes, but with preparation. Google, WhatsApp, Facebook, Instagram, and Gmail are blocked in China. We recommend: 1) Install a VPN before arriving (ExpressVPN and Astrill work most reliably), 2) Get a Chinese SIM card at the airport (China Unicom offers good tourist plans), 3) Download WeChat — it's essential for communication, payments, and your guide will use it. Hotel WiFi generally works well."},
      {q:"What's the best way to handle money in China? Is cash still used?",a:"China is nearly cashless — WeChat Pay and Alipay dominate. As a foreign traveler: bring a Visa/Mastercard for hotels and major stores, set up Alipay Tour Pass (links to your foreign card) for everyday payments, carry some RMB cash (¥2,000–3,000) for small vendors and markets. ATMs accepting foreign cards are available at airports and in city centers. Your guide can help with any payment issues."},
    ],
    silkroad: [
      {q:"How long should I spend on the Silk Road? What's the ideal itinerary?",a:"The ideal first-time Silk Road trip is 10–14 days covering the Chinese section: Xi'an, Dunhuang, Turpan, and Kashgar. Our 13-day Silk Road Group Tour ($2,070) is our bestseller — it adds Zhangye's rainbow mountains and Qinghai's Chaka Salt Lake. If you have more time, extend into Central Asia with our 19-day China–Uzbekistan tour ($4,390). Even a focused 7-day trip ($980) can cover Gansu and Qinghai highlights."},
      {q:"When is the best time to travel the Silk Road? What's the weather like?",a:"The optimal Silk Road season is April–May (spring) and September–October (autumn). Spring brings mild temperatures (15–25°C) and blooming landscapes. Autumn offers crisp, clear skies perfect for photography. Summers (June–August) are hot — Turpan can hit 45°C while Kashgar stays around 30°C. Winter (November–March) is cold (-10°C to 5°C) but offers snowy Dunhuang dunes and empty sites."},
      {q:"What should I pack for a Silk Road trip?",a:"Essentials: layered clothing (temperatures vary widely between desert days and mountain nights), comfortable walking shoes, sun protection (hat, sunglasses, SPF 50+), a scarf or buff (for dust and mosque visits), a reusable water bottle, and a power bank. In summer, light cotton clothing plus a jacket for evenings. In spring/autumn, a warm fleece and windbreaker. We send a detailed packing list 2 weeks before departure."},
      {q:"Can I drink the tap water? What about food safety on the Silk Road?",a:"Don't drink tap water anywhere on the Silk Road — stick to bottled or filtered water (provided on all our tours). Street food in Kashgar, Xi'an, and Dunhuang is generally safe and delicious — your guide will recommend the best stalls. We choose restaurants carefully and have had zero food-related incidents in 20+ years. For sensitive stomachs, avoid raw vegetables at small street stalls and peel fruit yourself."},
      {q:"What are the best Silk Road souvenirs? Where should I shop?",a:"Kashgar Sunday Market: handmade Uyghur carpets, embroidered doppa caps, copper teapots, and Xinjiang jade. Dunhuang: Silk Road–themed art, replica Mogao murals, camel-wool scarves. Xi'an Muslim Quarter: terracotta warrior replicas, shadow puppets, and local spices. Pro tip: bargaining is expected in markets but not in fixed-price shops. Your guide will help you negotiate fair prices and avoid tourist traps."},
      {q:"Is the Silk Road suitable for children or elderly travelers?",a:"Yes — we regularly host families and senior travelers. For families: our guides adjust pacing, recommend kid-friendly meals, and the train rides are an adventure in themselves. For seniors: choose private tours with flexible schedules and fewer early starts. Avoid tours with multi-day treks or altitudes above 3,500m. Let us know your group composition and we'll recommend the best itinerary."},
      {q:"Why should I book with Silk Road Wonders instead of a big platform like Viator?",a:"We're a Xinjiang-based, licensed travel agency operating since 2005 — not a reseller. That means: direct pricing (no platform markup), local guides who grew up on the Silk Road (not contractors), and 24/7 support from the team that designed your trip. We specialize exclusively in Silk Road and Central Asia travel. Our 99% satisfaction rate from 20,000+ travelers speaks for itself."},
    ],
  };

  // Map tour slugs to FAQ pools
  var map = {
    // Xinjiang
    "11d-kashgar-kanas":"xinjiang","11d-silk-road-xinjiang":"xinjiang","11d-kashgar-xian":"xinjiang",
    "silk-road-northern-xinjiang":"xinjiang",
    // Gansu
    "7d-gansu-qinghai":"gansu","8d-lanzhou-urumqi":"gansu","10d-xinjiang-gansu-qinghai":"gansu",
    // Central Asia
    "19d-china-uzbekistan":"centralasia","7d-kashgar-bishkek":"centralasia",
    "11d-urumqi-bishkek":"centralasia","15d-kashgar-tashkent":"centralasia",
    "uzbekistan-pakistan-karakoram":"centralasia","uzbekistan-kyrgyzstan-china":"centralasia",
    // Tibet
    "silk-road-tibet-adventure":"tibet",
    // China
    "beijing-chengdu-zhangjiajie-shanghai":"china","silk-road-yunnan":"china",
    "16d-uzbekistan-china":"china",
    // Default Silk Road
    "13d-silk-road-group":"silkroad","9d-dunhuang-kashgar":"silkroad",
    "12d-silk-road-train":"silkroad","9d-luxury-xian-urumqi":"silkroad",
  };

  var pool = pools[map[page]] || pools.silkroad;
  // Pick 4 most relevant FAQs (first 4 from pool)
  var faqs = pool.slice(0, 4);

  var h = '';
  faqs.forEach(function(f){
    h += '<div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">';
    h += '<button class="faq-q" onclick="this.classList.toggle(\'open\');this.nextElementSibling.classList.toggle(\'open\')" itemprop="name">'+f.q+'</button>';
    h += '<div class="faq-a" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer"><div itemprop="text"><p>'+f.a+'</p></div></div>';
    h += '</div>';
  });

  // Inject FAQ — replace existing FAQ section, or append after Includes/Excludes
  var faqSection = document.querySelector('.faq-item');
  if (faqSection) {
    // Remove old FAQ items
    var parent = faqSection.parentElement;
    var oldFaqs = parent.querySelectorAll('.faq-item');
    oldFaqs.forEach(function(el){ el.remove(); });
    // Remove old h2
    var oldH2 = parent.querySelector('h2:last-of-type');
    if (oldH2 && oldH2.textContent.includes('Frequently')) oldH2.remove();

    // Find the right insertion point (after inc-list or before sidebar)
    var incList = parent.querySelector('.inc-list');
    var target = incList ? incList.parentElement : parent;

    target.insertAdjacentHTML('beforeend', '<h2>Frequently Asked Questions</h2>' + h);
  }
})();
