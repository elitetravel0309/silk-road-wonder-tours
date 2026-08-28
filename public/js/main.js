/* ===== Silk Road Travel — Shared Scripts ===== */
/* Service Worker registration */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(reg => {
      console.log('[SW] Registered:', reg.scope);
    }).catch(err => {
      console.warn('[SW] Registration failed:', err.message);
    });
  });
}

/* Utility: debounce for performance */
function debounce(fn, delay) { let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); }; }

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close nav on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Keyboard accessibility for dropdown menus
  document.querySelectorAll('.has-dropdown > a').forEach(dropdownLink => {
    dropdownLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const parent = dropdownLink.parentElement;
        const wasOpen = parent.classList.contains('open');
        // Close all other open dropdowns first
        document.querySelectorAll('.has-dropdown.open').forEach(d => {
          if (d !== parent) d.classList.remove('open');
        });
        parent.classList.toggle('open', !wasOpen);
        dropdownLink.setAttribute('aria-expanded', wasOpen ? 'false' : 'true');
      }
    });
    // Close dropdown when Escape pressed while focus is inside it
    const dropdown = dropdownLink.nextElementSibling;
    if (dropdown && dropdown.classList.contains('dropdown')) {
      dropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dropdownLink.parentElement.classList.remove('open');
          dropdownLink.setAttribute('aria-expanded', 'false');
          dropdownLink.focus();
        }
      });
    }
  });

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '/' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Scroll reveal
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealElements.forEach(el => observer.observe(el));

  // Inquiry forms (Web3Forms) — handles inquiryFormMain, inquiryFormCta, cooperationForm, reviewForm
  document.querySelectorAll('#inquiryFormMain, #inquiryFormCta, #cooperationForm, #reviewForm').forEach(form => {
  form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const formData = new FormData(this);
      formData.append('access_key', 'bc152022-a23a-4453-ba98-25cb8784102a');

      try {
        const endpoint = 'https:' + '//api.web3forms.com/submit';
        const res = await fetch(endpoint, { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) {
          btn.textContent = '✓ Inquiry Sent!';
          btn.style.background = '#2D8B4E';
        } else {
          btn.textContent = '⚠ ' + (data.message || 'Try Again');
          btn.style.background = '#C67B4B';
        }
      } catch (err) {
        btn.textContent = '⚠ Network Error';
        btn.style.background = '#C67B4B';
      } finally {
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          if (btn.textContent.includes('Sent')) this.reset();
        }, 3000);
      }
    });
  });

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

// Hero carousel (only on pages that have it)
(function initHero() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  const dotsContainer = document.getElementById('heroDots');
  if (!dotsContainer) return;

  let currentSlide = 0;
  let autoPlayInterval;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.hero-dot');
  function goToSlide(i) { slides[currentSlide].classList.remove('active'); dots[currentSlide].classList.remove('active'); currentSlide = i; slides[currentSlide].classList.add('active'); dots[currentSlide].classList.add('active'); }
  function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
  function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }

  document.getElementById('heroNext')?.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
  document.getElementById('heroPrev')?.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

  function resetAutoPlay() { clearInterval(autoPlayInterval); autoPlayInterval = setInterval(nextSlide, 5000); }

  let touchStartX = 0;
  document.querySelector('.hero')?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  document.querySelector('.hero')?.addEventListener('touchend', e => { const diff = touchStartX - e.changedTouches[0].clientX; if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); resetAutoPlay(); } });

  autoPlayInterval = setInterval(nextSlide, 5000);
})();

// ===== TOUR SEARCH =====
(function initSearch() {
  const searchInput = document.getElementById('tourSearch');
  if (!searchInput) return;
  const searchBtn = document.getElementById('searchBtn');

  function filterTours(query) {
    const cards = document.querySelectorAll('.tour-card');
    const sections = document.querySelectorAll('.section');
    let found = 0;
    const q = query.toLowerCase().trim();

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (!q || text.includes(q)) { card.style.display = ''; found++; }
      else { card.style.display = 'none'; }
    });

    // Show/hide no-results message and sections
    sections.forEach(s => {
      const visibleCards = s.querySelectorAll('.tour-card[style*="display: none"]');
      const totalCards = s.querySelectorAll('.tour-card');
      const sectionHeader = s.querySelector('.section-header');
      if (q && visibleCards.length === totalCards.length && totalCards.length > 0) {
        if (sectionHeader) sectionHeader.style.display = 'none';
        const viewMore = s.querySelector('.view-more');
        if (viewMore) viewMore.style.display = 'none';
      } else {
        if (sectionHeader) sectionHeader.style.display = '';
        const viewMore = s.querySelector('.view-more');
        if (viewMore) viewMore.style.display = '';
      }
    });
  }

  searchInput.addEventListener('input', debounce(() => filterTours(searchInput.value), 300));
  searchBtn?.addEventListener('click', () => filterTours(searchInput.value));
  searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); filterTours(searchInput.value); } });
})();

// ===== PRICE CALCULATOR =====
(function initCalculator() {
  const daysSlider = document.getElementById('daysSlider');
  if (!daysSlider) return;
  const peopleSlider = document.getElementById('peopleSlider');
  const hotelSelect = document.getElementById('hotelSelect');
  const tourTypeSelect = document.getElementById('tourTypeSelect');
  const flightSelect = document.getElementById('flightSelect');
  const seasonSelect = document.getElementById('seasonSelect');

  const basePricePerDay = 160;
  function calc() {
    const days = parseInt(daysSlider.value);
    const people = parseInt(peopleSlider.value);
    const hotel = parseFloat(hotelSelect.value);
    const type = parseFloat(tourTypeSelect.value);
    const flights = parseFloat(flightSelect.value);
    const season = parseFloat(seasonSelect.value);

    // Group discount
    let groupDisc = 1;
    if (type < 1 && people >= 4) groupDisc = 0.85;
    if (type < 1 && people >= 6) groupDisc = 0.78;

    const perPerson = Math.round(basePricePerDay * days * hotel * type * flights * season * groupDisc);
    const total = Math.round(perPerson * people);

    document.getElementById('calcDays').textContent = days + ' days';
    document.getElementById('calcPeople').textContent = people;
    document.getElementById('calcTotal').innerHTML = '$' + perPerson.toLocaleString() + '<span class="per">per person</span>';

    document.getElementById('calcBreakdown').innerHTML =
      '<div class="line"><span>Base rate</span><span>$' + basePricePerDay + '/day</span></div>' +
      '<div class="line"><span>Duration</span><span>× ' + days + ' days</span></div>' +
      '<div class="line"><span>Hotel level</span><span>× ' + hotel.toFixed(1) + '</span></div>' +
      '<div class="line"><span>Tour type</span><span>× ' + type.toFixed(1) + '</span></div>' +
      '<div class="line"><span>Group discount</span><span>× ' + groupDisc.toFixed(2) + '</span></div>' +
      '<div class="line"><strong>Total for ' + people + ' pax</strong><strong>$' + total.toLocaleString() + '</strong></div>';
  }

  [daysSlider, peopleSlider, hotelSelect, tourTypeSelect, flightSelect, seasonSelect].forEach(el => {
    el.addEventListener('input', calc);
    el.addEventListener('change', calc);
  });
  calc();
})();

// ===== FAQ ACCORDION =====
(function initFAQ() {
  // Accordion toggle
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-a');
      const isOpen = btn.classList.contains('open');
      // Close all others in same parent section
      if (item.parentElement) {
        item.parentElement.querySelectorAll('.faq-q.open').forEach(other => {
          if (other !== btn) { other.classList.remove('open'); other.nextElementSibling?.classList.remove('open'); }
        });
      }
      btn.classList.toggle('open', !isOpen);
      if (answer) answer.classList.toggle('open', !isOpen);
    });
  });

  // Category filter
  document.querySelectorAll('.faq-categories button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-categories button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.faq-item').forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      document.querySelectorAll('.faq-section h3').forEach(h3 => {
        const section = h3.dataset.section;
        if (cat === 'all' || cat === section) {
          h3.style.display = '';
        } else {
          h3.style.display = 'none';
        }
      });
    });
  });
})();

// ===== LANGUAGE SWITCH =====
(function initLang() {
  const toggle = document.getElementById('langToggle');
  if (!toggle) return;

  const translations = {
    en: {
      home: 'Home', tours: 'Silk Road Tours', destinations: 'Destinations',
      about: 'About Us', blog: 'Blog', contact: 'Tailor My Trip',
      search: 'Search tours...', bookNow: 'Book Now', viewDetails: 'View Details',
      viewAll: 'View All Tours', readMore: 'Read More',
      viewAllTours: 'View All Tours →',
      readMoreArticles: 'Read More Articles →',
      sendInquiry: 'Send My Inquiry',
      groupTours: 'Most Popular Silk Road Travel Itineraries in Small Group',
      popularTours: 'Most Popular Silk Road Tours',
      extendTours: 'Extend Your Silk Road Tour',
      reviews: 'What Our Customers Are Saying',
      whyUs: 'Why Choose Us',
      destinations: 'Most Popular China & Silk Road Destinations',
      latestNews: 'Latest Silk Road Travel Information',
      ctaTitle: 'Tailor Your Own Silk Road Tour Within 24 Hours',
      ctaText: "Tell us your dream journey and we'll craft a personalized itinerary — no obligation, just inspiration.",
      footerContact: 'Contact', copyright: 'All Rights Reserved.',
      tailorMade: '100% Tailor Made', expertKnowledge: 'Expert Knowledge',
      professional: 'Professional Arrangements', trustedService: 'Trusted Service',
      heroTitle: 'Journey Through Legends',
      heroSub: 'Discover the ancient Silk Road — from the vibrant bazaars of Kashgar to the rainbow mountains of Zhangye',
      heroBadge: '20+ Years of Excellence',
      trusted: 'Trusted Since 2005',
      exploreTours: 'Explore Our Tours',
      tailorMyTrip: 'Tailor My Trip',
      smallGroupHeader: 'Most Popular Small Group Silk Road Journeys',
      smallGroupSub: '4-star hotels · English-speaking guides · Saturday departures · 99% satisfaction · Includes trains & flights',
      stories: 'Real Stories from Real Travelers',
      planJourney: 'Plan Your Journey',
      contactToday: 'Contact Us Today',
      startPlanning: 'Start Planning',
      askAnything: 'Ask Us Anything',
      submitReview: 'Submit Review',
      shareExperience: 'Share Your Experience',
      writeReview: 'Write a Review',
      ratingLabel: 'Rating',
      yourName: 'Your Name',
      yourEmail: 'Email',
      yourCountry: 'Country',
      tourTaken: 'Tour Taken',
      yourReview: 'Your Review',
      happyTravelers: 'Happy Travelers',
      yearsExperience: 'Years Experience',
      satisfaction: 'Satisfaction',
      avgRating: 'Average Rating',
      satisfactionRate: 'Satisfaction Rate',
      countriesReached: 'Countries',
      learnMore: 'Learn More',
      getExactQuote: 'Get Exact Quote',
      galleryTitle: 'Journey through the Silk Road in pictures',
      faqTitle: 'Everything you need to know about traveling the Silk Road',
      allQuestions: 'All Questions',
      bookingPayment: 'Booking & Payment',
      visasDocs: 'Visas & Documents',
      travelSafety: 'Travel & Safety',
      onTheTour: 'On the Tour',
      paymentTitle: 'Secure and convenient payment options for your Silk Road tour',
      paymentMethods: 'Payment Methods',
      paymentProcess: 'Payment Process',
      howItWorks: 'Simple, transparent, and secure',
      secureTrusted: 'Secure & Trusted',
      faqPayment: 'Frequently Asked Questions',
      readyToStart: 'Ready to Start?',
      privacyPolicy: 'Privacy Policy',
      confirmBooking: 'Confirm Booking',
      payDeposit: 'Pay Deposit',
      receiveConfirm: 'Receive Confirmation',
      payBalance: 'Pay Balance',
      reviewPageTitle: 'Read what travelers say about their Silk Road experience',
      reviewPageSub: 'Authentic reviews from travelers around the world',
      reviewPageDesc: 'We\'d love to hear about your Silk Road journey!',
      cooperationTitle: 'Partner with the leading Silk Road travel operator',
      cooperationWhyTitle: 'Why Partner With Silk Road Travel',
      cooperationBenefits: 'Partnership Benefits',
      cooperationTypes: 'Types of Partnerships',
      becomePartner: 'Become a Partner',
      submitPartnership: 'Submit Partnership Inquiry',
      // Header nav
      tagline: 'Journey Through Legends',
      navHome: 'Home', navTours: 'Tours', navGroupTours: 'Group Tours',
      navPrivateTours: 'Private Tours', navXinjiang: 'Xinjiang', navTibet: 'Tibet',
      navGansuQinghai: 'Gansu & Qinghai', navSichuanYunnan: 'Sichuan & Yunnan',
      navLuxury: 'Luxury Silk Road', navDestinations: 'Destinations',
      navAbout: 'About', navBlog: 'Blog', navContact: 'Contact',
      searchPlaceholder: 'Search tours...',
      // Destinations
      destBeijing: 'Beijing', destXian: 'Xi\'an', destShanghai: 'Shanghai',
      destKashgar: 'Kashgar', destDunhuang: 'Dunhuang', destZhangjiajie: 'Zhangjiajie',
      destChongqing: 'Chongqing', destUzbekistan: 'Uzbekistan', destKyrgyzstan: 'Kyrgyzstan',
      destKazakhstan: 'Kazakhstan', destMongolia: 'Mongolia', destPakistan: 'Pakistan',
      destGuangzhou: 'Guangzhou', destHuangshan: 'Huangshan', destLuoyang: 'Luoyang',
      destTajikistan: 'Tajikistan', destTurkmenistan: 'Turkmenistan',
      // Footer
      footerAbout: 'About Us', footerBestOperator: 'The Best Silk Road Tour Operator',
      footerContactUs: 'Contact Us', footerCEO: 'Words from Our CEO',
      footerPayment: 'Payment', footerCooperation: 'Travel Agency Cooperation',
      footerHowToBook: 'How to Book Your Silk Road Tour', footerReview: 'Silk Road Review',
      footerCancel: 'Cancellation Policy', footerVisa: 'Visa Guide',
      footerPrivacy: 'Privacy Policy', footerTerms: 'Terms & Conditions',
      footerTours: 'China Tours', footerLuxuryTours: 'Luxury Silk Road Tours',
      footerXinjiang: 'Xinjiang Tours', footerXinjiang2: 'Xinjiang',
      footerTibet: 'Tibet Tours', footerGansu: 'Gansu Tours',
      footerQinghai: 'Qinghai Tours', footerSichuan: 'Sichuan Tours',
      footerYunnan: 'Yunnan Tours', footerCityTours: 'City Tours',
      footerDest: 'Destinations', footerSilkRoad: 'Silk Road',
      footerContactH4: 'Contact', footerCopyright: '© 2006 - 2026 SilkRoadWonderTours.com. All Rights Reserved.',
      // Destinations page
      'dest-hero-title': 'Silk Road Destinations',
      'dest-hero-sub': '22 Legendary Cities & Regions Across China & Central Asia',
      'dest-china-title': 'China Silk Road Destinations',
      'dest-china-desc': 'From the imperial capital of Xi\'an to the vast deserts of Xinjiang, China\'s Silk Road stretches over 4,000 kilometers through ancient cities, Buddhist grottoes, and breathtaking landscapes. Each destination tells a chapter of the 2,000-year story that connected East and West.',
      'dest-ca-title': 'Central Asia Silk Road Destinations',
      'dest-ca-desc': 'Beyond China\'s western borders lies the heart of the ancient Silk Road. Samarkand\'s turquoise domes, Kyrgyzstan\'s alpine lakes, and the legendary Pamir and Karakoram highways — Central Asia preserves the most authentic Silk Road heritage on Earth.',
      'dest-why-title': 'Why Explore the Silk Road With Us',
      'dest-feat-local': 'Local Expertise',
      'dest-feat-custom': '100% Customizable',
      'dest-feat-safety': 'Safety First',
      'dest-feat-value': 'Best Value',
      'dest-tips-title': 'Silk Road Travel Tips',
      // Luxury page
      'lux-hero': 'Luxury Silk Road Tours',
      'lux-hero-sub': '5-Star Hotels · Private Transfers · VIP Access · Exclusive Experiences',
      'lux-intro-title': 'The Silk Road, Reimagined in Luxury',
      'lux-intro-desc': 'The ancient Silk Road was once traveled by camel caravans and merchant princes. Today, we\'ve reimagined this legendary route for the modern luxury traveler — five-star desert resorts, private UNESCO access, and Michelin-caliber dining.',
      'lux-why-title': 'The Silk Road Wonders Luxury Difference',
      'lux-feat-hotels': '5-Star & Boutique Hotels',
      'lux-feat-transport': 'Private Chauffeur Service',
      'lux-feat-exclusive': 'Exclusive Access',
      'lux-feat-dining': 'Curated Dining',
      'lux-tours-title': 'Our Luxury Silk Road Collection',
      'lux-tours-desc': 'Travel the ancient trade route in unparalleled comfort and style — every journey fully customizable',
      // Tibet page
      'tib-hero': 'Tibet Tours',
      'tib-hero-sub': 'Journey to the Roof of the World — Lhasa, Everest Base Camp, Mount Kailash',
      'tib-intro-title': 'Welcome to Tibet — The Roof of the World',
      'tib-intro-desc': 'At an average elevation of 4,500 meters, Tibet is unlike anywhere else on Earth. This is the land of snow-capped Himalayan peaks, turquoise sacred lakes, and ancient Buddhist monasteries clinging to mountainsides.',
      'tib-intro-desc2': 'Our Tibet tours take you beyond the postcards — from Lhasa\'s Jokhang Temple to Everest Base Camp, from Yamdrok Lake to Mount Kailash. Every journey is led by experienced Tibetan guides.',
      'tib-highlights-title': 'Tibet\'s Must-See Wonders',
      'tib-hl-potala': 'Potala Palace',
      'tib-hl-everest': 'Everest Base Camp',
      'tib-hl-kailash': 'Mount Kailash',
      'tib-hl-yamdrok': 'Yamdrok Lake',
      'tib-tips-title': 'Essential Tibet Travel Information',
      'tib-tip-permit': 'Permits & Visas',
      'tib-tip-altitude': 'Altitude & Acclimatization',
      'tib-tip-season': 'Best Time to Visit',
      'tib-tours-title': 'Our Tibet Tour Collection',
      'tib-tours-desc': 'Sacred temples, snow-capped peaks, and ancient traditions await on the Tibetan Plateau',
      // Gansu page
      'gan-hero': 'Gansu Tours',
      'gan-hero-sub': 'Dunhuang Mogao Caves · Zhangye Danxia · Hexi Corridor — The Heart of the Silk Road',
      'gan-intro-title': 'Welcome to Gansu — Where the Silk Road Comes Alive',
      'gan-intro-desc': 'Gansu is the living heart of the ancient Silk Road. This narrow corridor between the Tibetan Plateau and the Gobi Desert was the lifeline of trade between China and the West for over a millennium.',
      'gan-intro-desc2': 'Our Gansu tours take you along the legendary Hexi Corridor — wander through the Mogao Caves, ride a camel across the Singing Sand Dunes, walk the ramparts of Jiayuguan Fortress, and taste authentic Lanzhou beef noodles.',
      'gan-wonders': 'Must-See Wonders of Gansu',
      'gan-w1-title': 'Mogao Caves, Dunhuang', 'gan-w1-desc': 'A UNESCO World Heritage site with 492 caves, over 45,000 sqm of Buddhist murals spanning 1,000 years — one of the world\'s greatest repositories of ancient art.',
      'gan-w2-title': 'Zhangye Danxia', 'gan-w2-desc': 'China\'s most famous rainbow mountains — layers of red, orange, yellow, and green sandstone sculpted by 24 million years of tectonic activity.',
      'gan-w3-title': 'Jiayuguan Fortress', 'gan-w3-desc': 'The westernmost pass of the Ming Great Wall — a mighty fortress at the edge of the Gobi Desert marking where Chinese civilization met the unknown.',
      'gan-w4-title': 'Singing Sand Dunes', 'gan-w4-desc': 'Climb the massive dunes surrounding Crescent Moon Spring — an oasis that has survived in the desert for 2,000 years. Camel rides at sunset create unforgettable memories.',
      'gan-tour-title': 'Gansu Silk Road Tours', 'gan-tour-sub': 'From ancient Buddhist grottoes to rainbow-colored mountains — explore the best of Gansu',
      'gan-tips-title': 'Gansu Travel Tips',
      'gan-t1-title': '🌤 Best Time to Visit', 'gan-t1-desc': 'May–October offers the most pleasant weather. September–October is ideal for photography with crisp air and golden autumn hues. Avoid July–August summer peak if you prefer fewer crowds.',
      'gan-t2-title': '🚂 Getting Around', 'gan-t2-desc': 'High-speed trains connect Lanzhou, Zhangye, Jiayuguan, and Dunhuang in under 4 hours. Our tours use private vehicles to maximize flexibility and include train tickets where appropriate.',
      'gan-t3-title': '🍜 Local Food', 'gan-t3-desc': 'Don\'t miss Lanzhou beef noodles (the city\'s iconic breakfast), Dunhuang donkey meat huangmian, Zhangye搓鱼面, and Jiayuguan barbecued lamb. Gansu\'s fusion of Chinese and Central Asian flavors is unique.',
      // Qinghai page
      'qin-hero': 'Qinghai Tours',
      'qin-hero-sub': 'Qinghai Lake · Chaka Salt Lake · Amdo Tibetan Culture — The Mirror of the Sky',
      'qin-intro-title': 'Welcome to Qinghai — Land of Sapphire Lakes & Sacred Mountains',
      'qin-intro-desc': 'Qinghai sits at the crossroads of cultures — where the Tibetan Plateau meets the Silk Road, where monasteries rise from emerald grasslands, and China\'s largest inland lake shimmers in vivid turquoise.',
      'qin-intro-desc2': 'Our Qinghai tours showcase the province\'s extraordinary diversity — from the mirror-like Chaka Salt Lake at sunrise to Labrang Monastery, from cycling around Qinghai Lake to tracking the source of the Yellow River.',
      'qin-wonders': 'Qinghai\'s Natural & Cultural Wonders',
      'qin-w1-title': 'Qinghai Lake', 'qin-w1-desc': 'China\'s largest inland lake at 3,200m — a vast sapphire expanse surrounded by snow-capped mountains, golden rape flower fields in summer, and Tibetan nomad camps.',
      'qin-w2-title': 'Chaka Salt Lake', 'qin-w2-desc': 'Walk on water at this surreal salt flat where sky merges with earth. The shallow brine creates a perfect mirror — one of China\'s most photographed landscapes.',
      'qin-w3-title': 'Labrang Monastery', 'qin-w3-desc': 'One of Tibetan Buddhism\'s six great monasteries, home to 1,500+ monks. Walk the 3km kora path at dawn and witness mesmerizing monk debate sessions.',
      'qin-w4-title': 'Dachaidan Emerald Lake', 'qin-w4-desc': 'A hidden gem of the Qaidam Basin — emerald-green salt lakes across a barren landscape, shifting from jade to turquoise with the light.',
      'qin-tour-title': 'Qinghai Tours', 'qin-tour-sub': 'From the Mirror of the Sky to Tibetan monasteries — discover Qinghai\'s breathtaking beauty',
      'qin-tips-title': 'Qinghai Travel Tips',
      'qin-t1-title': '🏔 High Altitude Awareness', 'qin-t1-desc': 'Most of Qinghai sits above 3,000m. Xining (2,200m) is ideal for acclimatization. Take it easy the first day, stay hydrated, and avoid alcohol. Our tours are paced to allow natural adjustment.',
      'qin-t2-title': '📷 Photography Season', 'qin-t2-desc': 'July–August: rape flower fields bloom around Qinghai Lake. June & September: clearest skies for Chaka reflections. October: golden grasslands. Tours are timed for best light.',
      'qin-t3-title': '🙏 Cultural Etiquette', 'qin-t3-desc': 'When visiting Tibetan monasteries, walk clockwise around stupas and prayer wheels. Ask permission before photographing monks. Dress modestly — shoulders and knees covered.',
      // Yunnan page
      'yun-hero': 'Yunnan Tours',
      'yun-hero-sub': 'Kunming · Dali · Lijiang · Shangri-La · Xishuangbanna — China\'s Most Diverse Province',
      'yun-intro-title': 'Welcome to Yunnan — Where Snow Peaks Meet Tropical Rainforests',
      'yun-intro-desc': 'No other province packs as much diversity — wander 1,000-year-old towns, stand before Himalayan peaks, trek the world\'s deepest gorge, and sip tea in tropical gardens. Yunnan is home to 25 ethnic minorities.',
      'yun-intro-desc2': 'Our Yunnan tours cover the province\'s greatest hits — UNESCO-listed Lijiang and Dali, Shangri-La monasteries, Tiger Leaping Gorge, Yuanyang rice terraces, and tropical Xishuangbanna.',
      'yun-wonders': 'Yunnan\'s Must-See Destinations',
      'yun-w1-title': 'Lijiang Old Town', 'yun-w1-desc': 'A UNESCO site — cobblestone streets, wooden Naxi houses, ancient stone bridges over crystal canals, with Jade Dragon Snow Mountain towering in the distance.',
      'yun-w2-title': 'Shangri-La', 'yun-w2-desc': 'The mythical land at 3,300m — Songzanlin Monastery (the \'Little Potala\'), Pudacuo National Park\'s pristine lakes, and Tibetan culture at the edge of the Himalayas.',
      'yun-w3-title': 'Tiger Leaping Gorge', 'yun-w3-desc': 'One of the world\'s deepest gorges — the Yangtze thunders through a canyon flanked by 5,596m Jade Dragon Snow Mountain. The 22km high trail offers jaw-dropping views.',
      'yun-w4-title': 'Xishuangbanna', 'yun-w4-desc': 'China\'s tropical south — palm-fringed roads, Dai minority stilt houses, wild elephants, and Southeast Asian flavors. A completely different China just a short flight from Kunming.',
      'yun-tour-title': 'Yunnan Tours', 'yun-tour-sub': 'From ancient towns to Himalayan peaks — discover China\'s most diverse province',
      'yun-tips-title': 'Yunnan Travel Tips',
      'yun-t1-title': '🌦 Weather by Region', 'yun-t1-desc': 'Kunming is the \'Spring City\' (15–25°C year-round), Shangri-La is alpine, Xishuangbanna is tropical. Pack layers and check each destination\'s forecast before departing.',
      'yun-t2-title': '🎨 Ethnic Festivals', 'yun-t2-desc': 'Time your visit with the Dai Water Splashing Festival (mid-April), Yi Torch Festival (late July), or Tibetan Horse Racing Festival in Shangri-La (June).',
      'yun-t3-title': '🚂 Getting Around', 'yun-t3-desc': 'Kunming is the hub. Our tours use private vehicles between close destinations and flights for longer hops. High-speed rail links Kunming–Dali–Lijiang.',
      // Sichuan page
      'sic-hero': 'Sichuan Tours',
      'sic-hero-sub': 'Chengdu Pandas · Jiuzhaigou Valley · Leshan Buddha · Tibetan Highlands — Land of Abundance',
      'sic-intro-title': 'Welcome to Sichuan — Pandas, Peppers & Paradises',
      'sic-intro-desc': 'Sichuan is a province of superlatives — giant pandas, China\'s spiciest cuisine, the world\'s most turquoise lakes (Jiuzhaigou), and the largest stone Buddha ever carved (71m at Leshan).',
      'sic-intro-desc2': 'Our Sichuan tours cover the full spectrum — from 3-day culture-and-cuisine breaks in Chengdu to 10-day journeys across Tibetan highlands. Get close to baby pandas, stand before Huanglong\'s pools, and learn to cook mapo tofu.',
      'sic-wonders': 'Sichuan\'s Greatest Hits',
      'sic-w1-title': 'Chengdu Panda Base', 'sic-w1-desc': 'The world\'s premier giant panda research facility. Watch pandas of all ages — from newborn cubs to adults lazily munching bamboo — in a beautifully landscaped setting.',
      'sic-w2-title': 'Jiuzhaigou Valley', 'sic-w2-desc': 'A UNESCO fairytale — 108 turquoise lakes connected by multi-tiered waterfalls, virgin forest, and snow-capped peaks. Autumn transforms the valley into a riot of gold, orange, and red.',
      'sic-w3-title': 'Leshan Giant Buddha', 'sic-w3-desc': 'A 71-meter seated Buddha carved into a cliff overlooking three rivers. Built over 90 years starting in 713 AD, it remains the world\'s largest stone Buddha.',
      'sic-w4-title': 'Sichuan Cuisine', 'sic-w4-desc': 'The world\'s boldest food culture — numbing-spicy Sichuan peppercorns, bubbling hot pot, mapo tofu, kung pao chicken. Take a cooking class and learn the secrets.',
      'sic-tour-title': 'Sichuan Tours', 'sic-tour-sub': 'From pandas to mountain peaks — explore the Land of Abundance',
      'sic-tips-title': 'Sichuan Travel Tips',
      'sic-t1-title': '🌶 Spice Level Survival Guide', 'sic-t1-desc': 'Say \'bù yào là\' for no spice, or \'wēi là\' for mild. Hot pot places offer split pots with non-spicy broth. The numbing sensation from Sichuan peppercorns is normal!',
      'sic-t2-title': '⛅ Best Seasons', 'sic-t2-desc': 'Autumn (Sept–Oct): Jiuzhaigou\'s fall colors. Spring (Mar–May): pleasant in Chengdu. Summer: escape heat in the mountains. Winter: Jiuzhaigou frozen wonderland with fewer tourists.',
      'sic-t3-title': '🍵 Tea House Culture', 'sic-t3-desc': 'Chengdu\'s tea houses are essential — spend an afternoon in People\'s Park sipping jasmine tea and watching locals play mahjong. Heming Tea House has served since the Qing Dynasty.',
      // Northern Xinjiang page
      'nx-hero': 'Northern Xinjiang Tours',
      'nx-hero-sub': 'Kanas Lake · Altay Mountains · Ili Valley · Hemu Village — China\'s Alpine Wonderland',
      'nx-intro-title': 'Welcome to Northern Xinjiang — Where the Tian Shan Meets Siberia',
      'nx-intro-desc': 'Northern Xinjiang is a different world — alpine lakes the color of turquoise, golden birch forests like Switzerland, endless grasslands where Kazakh horsemen herd flocks, and the snow-capped Altay Mountains at the Siberian border.',
      'nx-intro-desc2': 'Our tours take you deep into this pristine landscape — cruise Kanas Lake in autumn, trek the Altay Mountains with Kazakh guides, wander Ili lavender fields in June, and ride horses across Naraty Grassland.',
      'nx-wonders': 'Northern Xinjiang\'s Natural Wonders',
      'nx-w1-title': 'Kanas Lake', 'nx-w1-desc': 'A crescent of impossibly blue water in the Altay Mountains. In autumn, surrounding birch forests turn gold and crimson — arguably China\'s most beautiful seasonal landscape.',
      'nx-w2-title': 'Hemu Village', 'nx-w2-desc': 'China\'s most beautiful village — Tuwa wooden cabins in a valley of birch forests. In autumn, morning mist rises as sun illuminates golden trees. In winter, a silent fairytale under deep snow.',
      'nx-w3-title': 'Ili River Valley', 'nx-w3-desc': 'Known as \'China\'s Switzerland\' — a lush green corridor between the Tian Shan ranges. Lavender fields bloom purple in June, fruit orchards, and snow-capped peaks frame every view.',
      'nx-w4-title': 'Sayram Lake', 'nx-w4-desc': 'The \'Last Teardrop of the Atlantic\' — a sapphire-blue alpine lake at 2,070m, ringed by snow peaks and summer wildflowers. Kazakh herders graze livestock along the shores.',
      'nx-tour-title': 'Northern Xinjiang Tours', 'nx-tour-sub': 'From Kanas Lake to the Ili Valley — discover China\'s most spectacular wilderness',
      'nx-tips-title': 'Northern Xinjiang Travel Tips',
      'nx-t1-title': '🌺 Best Time by Season', 'nx-t1-desc': 'Late Sept–early Oct: Kanas autumn peak — golden birches, turquoise water. June–July: Ili lavender bloom. Dec–Feb: Hemu winter wonderland. May & Oct: shoulder season with lower prices.',
      'nx-t2-title': '🌲 Altitude & Climate', 'nx-t2-desc': 'Most destinations are 1,000–2,500m — lower than Tibet, but pack warm layers. Kanas can drop to freezing at night even in September. The Ili Valley is milder. UV is intense — bring sunscreen.',
      'nx-t3-title': '🏕 Kazakh & Tuva Culture', 'nx-t3-desc': 'Stay in traditional yurts, drink fermented mare\'s milk (koumiss), watch eagle hunting demonstrations, and listen to throat singing. The Tuwa people are believed descendants of Genghis Khan\'s soldiers.',
      // 404 page
      errorTitle: '404 — Page Not Found',
      errorDesc: 'The page you\'re looking for doesn\'t exist or has been moved.',
      errorHelpTitle: 'Let Us Help You Find Your Way',
      errorHelpDesc: 'Whether you\'re looking for a Silk Road adventure or travel inspiration, our site has something for every explorer.',
      errorBtnHome: 'Back to Home',
      errorBtnTours: 'Browse Tours',
      errorBtnContact: 'Contact Us',
      errorPopularDest: 'Popular Silk Road Destinations',
      destXinjiang: 'Xinjiang', destTibet: 'Tibet', destXian: 'Xi\'an',
      destShanghai: 'Shanghai', destKashgar: 'Kashgar',
      errorReassure: 'If you typed the address, please double-check it. If a link brought you here, let us know and we\'ll fix it.',
      // Mobile nav
      mobHome: 'Home', mobTours: 'Tours', mobPlaces: 'Places',
      mobAbout: 'About', mobInquiry: 'Inquiry'
    },
    zh: {
      home: '首页', tours: '丝绸之路旅行', destinations: '目的地',
      about: '关于我们', blog: '博客', contact: '定制行程',
      search: '搜索行程...', bookNow: '立即预订', viewDetails: '查看详情',
      viewAll: '查看全部行程', readMore: '查看更多',
      viewAllTours: '查看全部行程 →',
      readMoreArticles: '查看更多文章 →',
      sendInquiry: '提交询价',
      groupTours: '最受欢迎丝绸之路小团旅行路线',
      popularTours: '热门丝绸之路旅行',
      extendTours: '延伸您的丝绸之路之旅',
      reviews: '客户评价',
      whyUs: '为什么选择我们',
      destinations: '热门中国及丝绸之路目的地',
      latestNews: '最新丝绸之路旅游资讯',
      ctaTitle: '24小时内定制您的专属丝绸之路之旅',
      ctaText: '告诉我们您的梦想之旅，我们将为您定制个性化行程——免费咨询，无任何义务。',
      copyright: '版权所有。',
      tailorMade: '100%量身定制', expertKnowledge: '专业知识',
      professional: '专业安排', trustedService: '值得信赖',
      heroTitle: '穿越传奇之旅',
      heroSub: '探索古老丝绸之路——从喀什热闹的巴扎到张掖七彩丹霞',
      heroBadge: '20+年卓越服务',
      trusted: '始于2005年，值得信赖',
      exploreTours: '探索行程',
      tailorMyTrip: '定制旅程',
      smallGroupHeader: '最受欢迎的丝绸之路小团旅行',
      smallGroupSub: '四星级酒店 · 英文导游 · 周六出发 · 99%满意度 · 含火车及机票',
      stories: '来自旅行者的真实故事',
      viewAllDest: '查看全部目的地',
      planJourney: '规划您的旅程',
      contactToday: '联系我们',
      startPlanning: '开始规划',
      askAnything: '咨询任何问题',
      submitReview: '提交评价',
      shareExperience: '分享您的体验',
      writeReview: '写评价',
      ratingLabel: '评分',
      yourName: '您的姓名',
      yourEmail: '邮箱',
      yourCountry: '国家',
      tourTaken: '参加的行程',
      yourReview: '您的评价',
      yearsExperience: '年经验',
      satisfaction: '满意度',
      avgRating: '平均评分',
      satisfactionRate: '满意率',
      countriesReached: '覆盖国家',
      learnMore: '了解更多',
      getExactQuote: '获取精准报价',
      galleryTitle: '通过照片穿越丝绸之路',
      faqTitle: '关于丝绸之路旅行，您需要了解的一切',
      allQuestions: '全部问题',
      bookingPayment: '预订与支付',
      visasDocs: '签证与证件',
      travelSafety: '旅行与安全',
      onTheTour: '行程途中',
      paymentTitle: '为您提供安全便捷的丝绸之路旅行支付方案',
      paymentMethods: '支付方式',
      paymentProcess: '支付流程',
      howItWorks: '简单、透明、安全——了解更多',
      secureTrusted: '安全可靠',
      faqPayment: '常见问题',
      readyToStart: '准备好出发了吗？',
      privacyPolicy: '隐私政策',
      confirmBooking: '确认预订',
      payDeposit: '支付订金',
      receiveConfirm: '收到确认',
      payBalance: '支付尾款',
      reviewPageTitle: '了解旅行者对丝绸之路的真实评价',
      reviewPageSub: '来自世界各地旅行者的真实评价',
      reviewPageDesc: '我们期待听到您的丝绸之路故事！',
      cooperationTitle: '与领先的丝绸之路旅行运营商合作',
      cooperationWhyTitle: '为什么选择丝绸之路旅行',
      cooperationBenefits: '合作优势',
      cooperationTypes: '合作类型',
      becomePartner: '成为合作伙伴',
      submitPartnership: '提交合作申请',
      // Header nav
      tagline: '穿越传奇之旅',
      navHome: '首页', navTours: '行程', navGroupTours: '团体游',
      navPrivateTours: '私人定制', navXinjiang: '新疆', navTibet: '西藏',
      navGansuQinghai: '甘肃青海', navSichuanYunnan: '四川云南',
      navLuxury: '豪华丝绸之路', navDestinations: '目的地',
      navAbout: '关于我们', navBlog: '博客', navContact: '联系我们',
      searchPlaceholder: '搜索行程...',
      // Destinations
      destBeijing: '北京', destXian: '西安', destShanghai: '上海',
      destKashgar: '喀什', destDunhuang: '敦煌', destZhangjiajie: '张家界',
      destChongqing: '重庆', destUzbekistan: '乌兹别克斯坦', destKyrgyzstan: '吉尔吉斯斯坦',
      destKazakhstan: '哈萨克斯坦', destMongolia: '蒙古', destPakistan: '巴基斯坦',
      destGuangzhou: '广州', destHuangshan: '黄山', destLuoyang: '洛阳',
      destTajikistan: '塔吉克斯坦', destTurkmenistan: '土库曼斯坦',
      // Footer
      footerAbout: '关于我们', footerBestOperator: '最佳丝绸之路旅行运营商',
      footerContactUs: '联系我们', footerCEO: '创始人寄语',
      footerPayment: '支付方式', footerCooperation: '旅行社合作',
      footerHowToBook: '如何预订丝绸之路之旅', footerReview: '丝绸之路评价',
      footerCancel: '取消政策', footerVisa: '签证指南',
      footerPrivacy: '隐私政策', footerTerms: '条款与条件',
      footerTours: '中国旅行', footerLuxuryTours: '豪华丝绸之路之旅',
      footerXinjiang: '新疆旅行', footerXinjiang2: '新疆',
      footerTibet: '西藏旅行', footerGansu: '甘肃旅行',
      footerQinghai: '青海旅行', footerSichuan: '四川旅行',
      footerYunnan: '云南旅行', footerCityTours: '城市游',
      footerDest: '目的地', footerSilkRoad: '丝绸之路',
      footerContactH4: '联系方式', footerCopyright: '© 2006 - 2026 SilkRoadWonderTours.com. 版权所有。',
      // Destinations page
      'dest-hero-title': '丝绸之路目的地',
      'dest-hero-sub': '横跨中国和中亚的22个传奇城市与地区',
      'dest-china-title': '中国丝绸之路目的地',
      'dest-china-desc': '从古都西安到广阔的新疆沙漠，中国的丝绸之路绵延4000多公里，穿越古城、佛教石窟和壮丽风景。每个目的地都诉说着连接东西方两千年故事的一个篇章。',
      'dest-ca-title': '中亚丝绸之路目的地',
      'dest-ca-desc': '在中国西部边界之外，是古老丝绸之路的心脏地带。撒马尔罕的蓝色穹顶、吉尔吉斯斯坦的高山湖泊、传奇的帕米尔和喀喇昆仑公路——中亚保存着地球上最原汁原味的丝路遗产。',
      'dest-why-title': '为什么选择我们探索丝绸之路',
      'dest-feat-local': '本地专业',
      'dest-feat-custom': '100%可定制',
      'dest-feat-safety': '安全至上',
      'dest-feat-value': '最优性价比',
      'dest-tips-title': '丝绸之路旅行贴士',
      // Luxury page
      'lux-hero': '豪华丝绸之路之旅',
      'lux-hero-sub': '五星级酒店 · 私人接送 · VIP通道 · 独家体验',
      'lux-intro-title': '以奢华重新定义丝绸之路',
      'lux-intro-desc': '古老的丝绸之路曾经是骆驼商队和王公贵族走过的路。今天，我们为现代奢华旅行者重新构想这条传奇路线——五星级沙漠度假村、联合国教科文组织遗址的私人通道，以及米其林级别的美食体验。',
      'lux-why-title': '丝绸之路奇观豪华差异',
      'lux-feat-hotels': '五星级精品酒店',
      'lux-feat-transport': '私人司机服务',
      'lux-feat-exclusive': '独家VIP通道',
      'lux-feat-dining': '精选美食体验',
      'lux-tours-title': '我们的豪华丝绸之路系列',
      'lux-tours-desc': '以无与伦比的舒适和格调穿越古老商道——每一次旅程都可完全定制',
      // Tibet page
      'tib-hero': '西藏之旅',
      'tib-hero-sub': '踏上世界屋脊之旅——拉萨、珠峰大本营、冈仁波齐',
      'tib-intro-title': '欢迎来到西藏——世界屋脊',
      'tib-intro-desc': '西藏平均海拔4500米，是地球上独一无二的存在。这里是喜马拉雅雪峰、碧蓝圣湖和依山而建的古老佛教寺院的国度。千百年来，西藏以其深邃的灵性和壮丽的风景吸引着朝圣者、探险家和旅行者。',
      'tib-intro-desc2': '我们的西藏之旅带您超越明信片——从拉萨大昭寺的朝圣人群到珠峰大本营的寂静威严，从羊卓雍错的碧蓝湖水到冈仁波齐的神圣山坡。每次旅程都由经验丰富的藏族导游带领。所有行程均包含西藏旅行许可证。',
      'tib-highlights-title': '西藏必看奇观',
      'tib-hl-potala': '布达拉宫',
      'tib-hl-everest': '珠峰大本营',
      'tib-hl-kailash': '冈仁波齐',
      'tib-hl-yamdrok': '羊卓雍错',
      'tib-tips-title': '西藏旅行必备信息',
      'tib-tip-permit': '许可证与签证',
      'tib-tip-altitude': '海拔与适应',
      'tib-tip-season': '最佳旅行时间',
      'tib-tours-title': '我们的西藏旅行系列',
      'tib-tours-desc': '神圣的寺庙、雪峰和古老传统在青藏高原上等待——每个行程都包含西藏许可证',
      // Gansu page
      'gan-hero': '甘肃之旅',
      'gan-hero-sub': '敦煌莫高窟 · 张掖丹霞 · 河西走廊 —— 丝绸之路的心脏',
      'gan-intro-title': '欢迎来到甘肃——丝绸之路在此苏醒',
      'gan-intro-desc': '甘肃是古丝绸之路跳动的心脏。这条位于青藏高原和戈壁沙漠之间的狭窄走廊，曾是中西贸易的生命线，延续了千年之久。如今，这里保存着这条古道最壮观的宝藏。',
      'gan-intro-desc2': '我们的甘肃之旅带您沿传奇的河西走廊行进——漫步莫高窟的回响大厅，骑骆驼穿越鸣沙山，行走嘉峪关城墙，品尝正宗兰州牛肉面。每个行程都包含英文导游、四星住宿和私人交通。',
      'gan-wonders': '甘肃必看奇观',
      'gan-w1-title': '敦煌莫高窟', 'gan-w1-desc': '联合国教科文组织世界遗产，拥有492个洞窟、超过45,000平方米的佛教壁画，跨越千年艺术史——世界上最伟大的古代艺术宝库之一。',
      'gan-w2-title': '张掖丹霞', 'gan-w2-desc': '中国最著名的彩虹山——红色、橙色、黄色和绿色的砂岩层叠，经过2400万年的地质活动雕琢而成，仿佛画家的调色板。',
      'gan-w3-title': '嘉峪关城楼', 'gan-w3-desc': '明长城最西端的关隘——一座雄伟的堡垒矗立在戈壁沙漠边缘，标志着中华文明与未知世界的分界线。',
      'gan-w4-title': '鸣沙山月牙泉', 'gan-w4-desc': '攀登环绕月牙泉的巨大沙丘——这片绿洲在沙漠中奇迹般地存在了2000年。骑骆驼看日落，留下难忘回忆。',
      'gan-tour-title': '甘肃丝绸之路之旅', 'gan-tour-sub': '从古老佛教石窟到彩虹色的山脉——探索甘肃最美的一面',
      'gan-tips-title': '甘肃旅行贴士',
      'gan-t1-title': '🌤 最佳旅行时间', 'gan-t1-desc': '5月至10月天气最舒适。9月至10月是摄影黄金期，空气清透，秋色金黄。如果想避开人群，请避开7月至8月的暑期高峰。',
      'gan-t2-title': '🚂 交通出行', 'gan-t2-desc': '高铁连接兰州、张掖、嘉峪关和敦煌，全程不到4小时。我们的行程使用私人车辆以最大化灵活性，在适当情况下包含火车票。',
      'gan-t3-title': '🍜 当地美食', 'gan-t3-desc': '不要错过兰州牛肉面（城市标志性早餐）、敦煌驴肉黄面、张掖搓鱼面和嘉峪关烤羊肉串。甘肃融合了中国和中亚的独特风味。',
      // Qinghai page
      'qin-hero': '青海之旅',
      'qin-hero-sub': '青海湖 · 茶卡盐湖 · 安多藏族文化 —— 天空之镜',
      'qin-intro-title': '欢迎来到青海——蓝宝石湖泊与圣山之地',
      'qin-intro-desc': '青海位于文化的十字路口——青藏高原与丝绸之路在此交汇，寺院从翠绿草原中升起，中国最大的内陆湖闪烁着令人难以置信的绿松石色光芒。',
      'qin-intro-desc2': '我们的青海之旅展示这个省份非凡的多样性——从茶卡盐湖日出时分的镜面倒影到拉卜楞寺，从环青海湖骑行到追踪黄河源头。',
      'qin-wonders': '青海自然与文化奇观',
      'qin-w1-title': '青海湖', 'qin-w1-desc': '中国最大的内陆湖，海拔3200米——一片广阔的蓝宝石水面，四周环绕雪山、夏季金色油菜花田和藏族牧民帐篷。',
      'qin-w2-title': '茶卡盐湖——天空之镜', 'qin-w2-desc': '在这片超现实的盐沼上行走，天地在此融为一体。浅盐水形成完美的镜面倒影——中国最上镜的风景之一。',
      'qin-w3-title': '拉卜楞寺', 'qin-w3-desc': '藏传佛教六大寺院之一，拥有1500多名僧侣。黎明时分绕3公里转经道行走，下午见证令人着迷的辩经场景。',
      'qin-w4-title': '大柴旦翡翠湖', 'qin-w4-desc': '柴达木盆地的隐藏宝石——翠绿色的盐湖散布在荒芜的地貌上，随光线和矿物浓度从翡翠色变为绿松石色。',
      'qin-tour-title': '青海之旅', 'qin-tour-sub': '从天空之镜到藏传佛教寺院——发现青海令人惊叹的美',
      'qin-tips-title': '青海旅行贴士',
      'qin-t1-title': '🏔 高海拔注意事项', 'qin-t1-desc': '青海大部分地区海拔在3000米以上。西宁（2200米）是适应高原的理想第一站。第一天放慢节奏，多喝水，避免饮酒。我们的行程节奏适中，让身体自然适应。',
      'qin-t2-title': '📷 摄影季节', 'qin-t2-desc': '7月至8月：青海湖周围油菜花盛开。6月和9月：茶卡盐湖倒影最清晰的天空。10月：金色草原。摄影行程按最佳光线时间安排。',
      'qin-t3-title': '🙏 文化礼仪', 'qin-t3-desc': '参观藏传寺院时，绕佛塔和转经筒顺时针行走。拍摄僧侣前请征得同意。着装得体——遮盖肩膀和膝盖。进入殿堂时脱帽。',
      // Yunnan page
      'yun-hero': '云南之旅',
      'yun-hero-sub': '昆明 · 大理 · 丽江 · 香格里拉 · 西双版纳 —— 中国最多元的省份',
      'yun-intro-title': '欢迎来到云南——雪山与热带雨林交汇之处',
      'yun-intro-desc': '中国没有哪个省份能像云南一样拥有如此丰富的多样性——漫步千年古镇，站在喜马拉雅雪峰前，徒步世界上最深的峡谷，在热带植物园品茶。云南是25个少数民族的家园。',
      'yun-intro-desc2': '我们的云南之旅涵盖全省最精彩的景点——联合国教科文组织列入的丽江和大理古城、香格里拉寺院、虎跳峡、元阳梯田和热带西双版纳。',
      'yun-wonders': '云南必游目的地',
      'yun-w1-title': '丽江古城', 'yun-w1-desc': '联合国教科文组织世界遗产——鹅卵石街道、纳西木屋、古老石桥横跨清澈水渠，玉龙雪山在远处巍峨耸立。',
      'yun-w2-title': '香格里拉', 'yun-w2-desc': '海拔3300米的梦幻之地——松赞林寺（"小布达拉宫"）、普达措国家公园的原始湖泊、喜马拉雅边缘的藏族文化。',
      'yun-w3-title': '虎跳峡', 'yun-w3-desc': '世界最深峡谷之一——长江咆哮着穿过两侧是5596米玉龙雪山的峡谷。22公里高路步道，每一步都带来令人惊叹的美景。',
      'yun-w4-title': '西双版纳', 'yun-w4-desc': '中国的热带南方——棕榈成荫的道路、傣族吊脚楼、野生大象和东南亚风味。从昆明短途飞行即可到达一个完全不同的中国。',
      'yun-tour-title': '云南之旅', 'yun-tour-sub': '从古镇到喜马拉雅山峰——发现中国最多元的省份',
      'yun-tips-title': '云南旅行贴士',
      'yun-t1-title': '🌦 各地气候', 'yun-t1-desc': '昆明是"春城"（全年15-25°C），香格里拉属高山气候，西双版纳是热带气候。多层穿衣，出发前查看每个目的地的天气预报。',
      'yun-t2-title': '🎨 民族节庆', 'yun-t2-desc': '可选择在傣族泼水节（4月中旬）、彝族火把节（7月下旬）或香格里拉藏族赛马节（6月）期间到访。每个节日都展现了云南鲜活的民族文化。',
      'yun-t3-title': '🚂 交通出行', 'yun-t3-desc': '昆明是枢纽。我们的行程在近距目的地间使用私人车辆，远距离则搭乘航班。高铁连接昆明-大理-丽江。',
      // Sichuan page
      'sic-hero': '四川之旅',
      'sic-hero-sub': '成都熊猫 · 九寨沟 · 乐山大佛 · 藏区高地 —— 天府之国',
      'sic-intro-title': '欢迎来到四川——熊猫、麻辣与人间仙境',
      'sic-intro-desc': '四川是一个极致之省——大熊猫、中国最辣的菜系、世界上最碧蓝的湖泊（九寨沟）以及有史以来最大的石雕佛像（乐山71米）。两千年来这里一直被称为"天府之国"。',
      'sic-intro-desc2': '我们的四川之旅涵盖全系列——从成都3日文化美食之旅到10日穿越藏区高地的旅程。近距离接触熊猫宝宝，站在黄龙钙化池前，学习烹饪麻婆豆腐。',
      'sic-wonders': '四川精选亮点',
      'sic-w1-title': '成都大熊猫基地', 'sic-w1-desc': '世界顶级大熊猫研究和繁育设施。在景观优美的环境中观看各年龄段的大熊猫——从育婴箱里的新生幼崽到悠闲啃竹子的成年熊猫。',
      'sic-w2-title': '九寨沟', 'sic-w2-desc': '联合国教科文组织童话世界——108个绿松石色湖泊由多层瀑布相连，原始森林和雪峰环绕。秋季将山谷变成金色、橙色和红色的盛宴。',
      'sic-w3-title': '乐山大佛', 'sic-w3-desc': '71米高的坐佛直接雕刻在三江交汇处的悬崖上。从公元713年开始建造，历时90年，至今仍是世界最大的石雕佛像。',
      'sic-w4-title': '四川美食', 'sic-w4-desc': '世界最大胆的美食文化——麻辣花椒、翻滚的火锅、麻婆豆腐、宫保鸡丁。参加烹饪课程，学习味道背后的秘密。',
      'sic-tour-title': '四川之旅', 'sic-tour-sub': '从熊猫到山峰——探索天府之国',
      'sic-tips-title': '四川旅行贴士',
      'sic-t1-title': '🌶 辣度生存指南', 'sic-t1-desc': '说"不要辣"可避免辣味，"微辣"代表温和。火锅店提供鸳鸯锅配不辣汤底。花椒带来的麻感是正常的——这是体验的一部分！',
      'sic-t2-title': '⛅ 最佳季节', 'sic-t2-desc': '秋季（9-10月）：九寨沟秋色世界闻名。春季（3-5月）：成都气候宜人，熊猫最活跃。夏季：到山上避暑。冬季：九寨沟变成冰雪仙境，游客稀少。',
      'sic-t3-title': '🍵 茶馆文化', 'sic-t3-desc': '成都茶馆是必不可少的体验——在人民公园泡一个下午，品茉莉花茶，看当地人打麻将。鹤鸣茶馆自清代经营至今。',
      // Northern Xinjiang page
      'nx-hero': '北疆之旅',
      'nx-hero-sub': '喀纳斯湖 · 阿尔泰山 · 伊犁河谷 · 禾木村 —— 中国的阿尔卑斯仙境',
      'nx-intro-title': '欢迎来到北疆——天山与西伯利亚交汇之处',
      'nx-intro-desc': '北疆是另一个世界——绿松石色的高山湖泊、像瑞士一样的金色白桦林、哈萨克骑手牧羊的无尽草原，以及标志着西伯利亚边界的阿尔泰雪山。这是中国最后的荒野，面积超过法国。',
      'nx-intro-desc2': '我们的旅程带您深入这片原始风景——秋季在喀纳斯湖上巡游，与哈萨克向导徒步阿尔泰山，六月徜徉伊犁薰衣草田，在那拉提草原上骑马。',
      'nx-wonders': '北疆自然奇观',
      'nx-w1-title': '喀纳斯湖', 'nx-w1-desc': '一弯令人难以置信的碧蓝湖水坐落在阿尔泰群山之中。秋季，周围的白桦和松林变成金色和深红色——堪称中国最美的季节性风景。',
      'nx-w2-title': '禾木村', 'nx-w2-desc': '中国最美的村庄——图瓦人的木屋散布在白桦林环绕的山谷中。秋季，晨雾从河面升起，阳光照亮金色树梢。冬季，成为深深积雪下的宁静童话。',
      'nx-w3-title': '伊犁河谷', 'nx-w3-desc': '被誉为"中国的瑞士"——天山山脉间一条郁郁葱葱的绿色走廊。六月薰衣草田绽放紫色，果园里苹果和杏子累累，雪峰框住每一个视角。',
      'nx-w4-title': '赛里木湖', 'nx-w4-desc': '"大西洋的最后一滴眼泪"——海拔2070米的蓝宝石色高山湖泊，环绕着雪峰和夏季野花草甸。哈萨克牧民沿湖岸放牧，构成北疆最具画面感的场景。',
      'nx-tour-title': '北疆之旅', 'nx-tour-sub': '从喀纳斯湖到伊犁河谷——发现中国最壮丽的荒野',
      'nx-tips-title': '北疆旅行贴士',
      'nx-t1-title': '🌺 各季节最佳时间', 'nx-t1-desc': '9月下旬至10月上旬：喀纳斯秋色巅峰——金色白桦、碧蓝湖水。6月至7月：伊犁薰衣草盛开。12月至2月：禾木冬季仙境。5月和10月：平季价格更低。',
      'nx-t2-title': '🌲 海拔与气候', 'nx-t2-desc': '大部分目的地海拔1000-2500米——比西藏低，但仍需携带保暖层。喀纳斯即使在9月夜间也可能降至冰点。伊犁河谷较为温和。紫外线强烈——带防晒霜和帽子。',
      'nx-t3-title': '🏕 哈萨克与图瓦文化', 'nx-t3-desc': '入住传统毡房，品尝发酵马奶（马奶酒），观看猎鹰表演，聆听呼麦。图瓦人据信是成吉思汗士兵的后裔。',
      // 404 page
      errorTitle: '404 — 页面未找到',
      errorDesc: '您访问的页面不存在或已被移动。',
      errorHelpTitle: '让我们帮您找到正确的方向',
      errorHelpDesc: '无论您是在寻找丝绸之路探险还是旅行灵感，我们的网站都能满足每位探险者的需求。',
      errorBtnHome: '返回首页',
      errorBtnTours: '浏览行程',
      errorBtnContact: '联系我们',
      errorPopularDest: '热门丝绸之路目的地',
      destXinjiang: '新疆', destTibet: '西藏', destXian: '西安',
      destShanghai: '上海', destKashgar: '喀什',
      errorReassure: '如果您手动输入了网址，请检查是否正确。如果是链接带您来到这里，请告知我们，我们会尽快修复。',
      // Mobile nav
      mobHome: '首页', mobTours: '行程', mobPlaces: '目的地',
      mobAbout: '关于', mobInquiry: '咨询'
    }
  };

  const buttons = toggle.querySelectorAll('button');
  let currentLang = localStorage.getItem('silkroad-lang') || 'en';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('silkroad-lang', lang);
    buttons.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    const t = translations[lang];
    // Update elements with data-i18n — preserves child nodes (for dropdown arrows etc.)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (!t[key]) return;
      // Find the first text node and replace it
      for (let node of el.childNodes) {
        if (node.nodeType === 3 && node.textContent.trim()) {
          node.textContent = t[key];
          return;
        }
      }
      // Fallback: no text node found, set textContent
      el.textContent = t[key];
    });
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key]) el.placeholder = t[key];
    });
  }

  buttons.forEach(b => {
    b.addEventListener('click', () => applyLang(b.dataset.lang));
  });

  applyLang(currentLang);

  /* ===== Cookie Consent Banner ===== */
  const cookieConsent = localStorage.getItem('silkroad-cookie-consent');
  if (!cookieConsent) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = '<div class="container"><p>This website uses cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept", you consent to our use of cookies. <a href="privacy-policy.html">Privacy Policy</a></p><div class="cookie-buttons"><button class="btn btn-outline" id="cookieDecline" style="color:#fff;border-color:rgba(255,255,255,0.3);">Decline</button><button class="btn btn-gold" id="cookieAccept">Accept</button></div></div>';
    document.body.appendChild(banner);
    // Show after a short delay
    setTimeout(() => banner.classList.add('show'), 500);

    banner.querySelector('#cookieAccept').addEventListener('click', () => {
      localStorage.setItem('silkroad-cookie-consent', 'accepted');
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 400);
      initAnalytics();
    });
    banner.querySelector('#cookieDecline').addEventListener('click', () => {
      localStorage.setItem('silkroad-cookie-consent', 'declined');
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 400);
    });
  } else if (cookieConsent === 'accepted') {
    initAnalytics();
  }

  function initAnalytics() {
    // GA4 — replace G-SRWONDERS with your actual Measurement ID
    if (document.getElementById('ga-script')) return;
    var gaId = window.GA_MEASUREMENT_ID || null; if (!gaId) return;
    var gaScript = document.createElement('script');
    gaScript.id = 'ga-script';
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(gaScript);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', gaId);
  }
})();

// ===== BACK TO TOP =====
(function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, 100);
  }, { passive: true });
})();

// ===== GALLERY LIGHTBOX =====
(function initLightbox() {
  const items = document.querySelectorAll('.gallery-item img');
  if (!items.length) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">×</button>
    <button class="lightbox-nav prev" aria-label="Previous">‹</button>
    <button class="lightbox-nav next" aria-label="Next">›</button>
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(overlay);

  const img = document.createElement('img');
  img.alt = '';
  overlay.insertBefore(img, overlay.querySelector('.lightbox-caption'));
  const caption = overlay.querySelector('.lightbox-caption');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-nav.prev');
  const nextBtn = overlay.querySelector('.lightbox-nav.next');

  let currentIndex = 0;
  const galleryImages = Array.from(items);

  function showImage(index) {
    if (index < 0) index = galleryImages.length - 1;
    if (index >= galleryImages.length) index = 0;
    currentIndex = index;
    const src = galleryImages[index];
    img.src = src.src;
    img.alt = src.alt;
    const cap = src.closest('.gallery-item')?.querySelector('.caption');
    caption.textContent = cap ? cap.textContent.trim() : src.alt;
    // Update prev/next visibility
    prevBtn.style.display = galleryImages.length > 1 ? '' : 'none';
    nextBtn.style.display = galleryImages.length > 1 ? '' : 'none';
  }

  function open(index) {
    showImage(index);
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Attach click handlers to gallery images
  galleryImages.forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View larger: ' + (item.alt || 'image'));
    item.addEventListener('click', () => open(i));
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(i); });
  });

  // Close handlers
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === img) close();
  });

  // Navigation
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowLeft') { showImage(currentIndex - 1); }
    else if (e.key === 'ArrowRight') { showImage(currentIndex + 1); }
  });

  // Swipe support
  let touchStartX = 0;
  overlay.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  overlay.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) { diff > 0 ? showImage(currentIndex + 1) : showImage(currentIndex - 1); }
  });
})();

// ===== STATS COUNTER ANIMATION =====
(function initStatsCounter() {
  const statEls = document.querySelectorAll('.intro-stat .num, .stat-card .stat-num, [data-count]');
  if (!statEls.length) return;

  function parseTarget(el) {
    if (el.dataset.count) return { value: parseFloat(el.dataset.count), suffix: el.dataset.suffix || '' };
    const text = el.textContent.trim();
    const match = text.match(/^([\d,]+\.?\d*)\s*(.*)$/);
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, ''));
      return { value: num, suffix: match[2] || '' };
    }
    return null;
  }

  function animate(el, target) {
    const duration = 2000;
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target.value * eased;
      el.textContent = (Number.isInteger(target.value) ? Math.round(current).toLocaleString() : current.toFixed(1)) + target.suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = parseTarget(entry.target);
      if (target) animate(entry.target, target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  statEls.forEach(el => observer.observe(el));
})();

function quickInquiry() {
  const name = document.getElementById('ctaName')?.value || '';
  const email = document.getElementById('ctaEmail')?.value || '';
  const month = document.getElementById('ctaMonth')?.value || '';
  const travelers = document.getElementById('ctaTravelers')?.value || '';
  const tourTitle = document.querySelector('.page-hero h1')?.textContent || document.title;
  const params = new URLSearchParams();
  if (name) params.set('name', name);
  if (email) params.set('email', email);
  if (month) params.set('month', month);
  if (travelers) params.set('travelers', travelers);
  params.set('tour', tourTitle);
  const contactUrl = (window.location.pathname.includes('/tour/') || window.location.pathname.includes('/destination/') || window.location.pathname.includes('/blog/')) ? '../contact.html' : 'contact.html';
  window.location.href = contactUrl + '?' + params.toString();
}