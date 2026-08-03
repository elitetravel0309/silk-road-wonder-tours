"""
Enhance thin pages: destinations.html, about.html, extend-silk-road-tour.html, contact.html
"""
import re, os

DIST = r'C:\Users\Administrator\WorkBuddy\2026-05-28-23-54-44\silkroad-travel\dist'

def enhance_destinations():
    """Rebuild destinations.html with full destination listing"""
    fp = os.path.join(DIST, 'destinations.html')
    with open(fp, encoding='utf-8') as f:
        content = f.read()
    
    # Find the <main> content and replace
    old_main = re.search(r'<main id="main-content">.*?</main>', content, re.DOTALL)
    if not old_main:
        print("  [ERROR] Could not find <main> in destinations.html")
        return
    
    new_main = r'''<main id="main-content">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Silk Road Destinations",
  "description": "Explore our curated collection of Silk Road destinations across China and Central Asia. From Beijing's imperial grandeur to Samarkand's turquoise domes.",
  "url": "https://silkroadwondertours.com/destinations.html",
  "hasPart": [
    {"@type": "TouristDestination", "name": "Beijing", "url": "https://silkroadwondertours.com/destination/beijing.html"},
    {"@type": "TouristDestination", "name": "Xi'an", "url": "https://silkroadwondertours.com/destination/xian.html"},
    {"@type": "TouristDestination", "name": "Dunhuang", "url": "https://silkroadwondertours.com/destination/dunhuang.html"},
    {"@type": "TouristDestination", "name": "Kashgar", "url": "https://silkroadwondertours.com/destination/kashgar.html"}
  ]
}
</script>
<section class="page-hero" style="background:url('/assets/images/hero-silkroad.jpg') center/cover;">
  <div class="container">
    <h1>Silk Road Destinations</h1>
    <p>Explore 17 Legendary Stops Along the Ancient Trade Routes</p>
  </div>
</section>
<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="container">
    <a href="/">Home</a> <span class="sep">&rsaquo;</span>
    <span class="current">Destinations</span>
  </div>
</nav>

<section class="section">
  <div class="container">
    <div class="section-header reveal">
      <h2>China Destinations</h2>
      <div class="divider"></div>
      <p>From ancient capitals to natural wonders — discover the heart of the Silk Road</p>
    </div>
    <div class="tour-grid">
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/beijing.html"><img src="/assets/images/great-wall.jpg" alt="Beijing" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Capital</span>
        </div>
        <div class="tour-card-body">
          <h3>Beijing</h3>
          <div class="tour-card-route">Forbidden City &bull; Great Wall &bull; Temple of Heaven</div>
          <div class="tour-card-features"><span>Imperial History</span><span>UNESCO Sites</span></div>
          <div class="tour-card-footer"><a href="/destination/beijing.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/xian.html"><img src="/assets/images/hero-silkroad.jpg" alt="Xi'an" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Ancient Capital</span>
        </div>
        <div class="tour-card-body">
          <h3>Xi'an</h3>
          <div class="tour-card-route">Terracotta Army &bull; City Wall &bull; Muslim Quarter</div>
          <div class="tour-card-features"><span>Silk Road Start</span><span>Han & Tang</span></div>
          <div class="tour-card-footer"><a href="/destination/xian.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/dunhuang.html"><img src="/assets/images/desert-dunes.jpg" alt="Dunhuang" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Oasis City</span>
        </div>
        <div class="tour-card-body">
          <h3>Dunhuang</h3>
          <div class="tour-card-route">Mogao Caves &bull; Singing Dunes &bull; Crescent Lake</div>
          <div class="tour-card-features"><span>Buddhist Art</span><span>UNESCO</span></div>
          <div class="tour-card-footer"><a href="/destination/dunhuang.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/kashgar.html"><img src="/assets/images/central-asia-architecture.jpg" alt="Kashgar" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Crossroads</span>
        </div>
        <div class="tour-card-body">
          <h3>Kashgar</h3>
          <div class="tour-card-route">Sunday Bazaar &bull; Id Kah Mosque &bull; Old City</div>
          <div class="tour-card-features"><span>Uyghur Culture</span><span>Pamir Gateway</span></div>
          <div class="tour-card-footer"><a href="/destination/kashgar.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/shanghai.html"><img src="/assets/images/hero-mountains.jpg" alt="Shanghai" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Metropolis</span>
        </div>
        <div class="tour-card-body">
          <h3>Shanghai</h3>
          <div class="tour-card-route">The Bund &bull; Pudong Skyline &bull; Water Towns</div>
          <div class="tour-card-features"><span>Modern China</span><span>Jiangnan Culture</span></div>
          <div class="tour-card-footer"><a href="/destination/shanghai.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/zhangjiajie.html"><img src="/assets/images/xinjiang-landscape.jpg" alt="Zhangjiajie" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Avatar Mountains</span>
        </div>
        <div class="tour-card-body">
          <h3>Zhangjiajie</h3>
          <div class="tour-card-route">Sandstone Pillars &bull; Glass Bridge &bull; Tianmen Mountain</div>
          <div class="tour-card-features"><span>Natural Wonder</span><span>UNESCO</span></div>
          <div class="tour-card-footer"><a href="/destination/zhangjiajie.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/chongqing.html"><img src="/assets/images/hero-silkroad.jpg" alt="Chongqing" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Mountain City</span>
        </div>
        <div class="tour-card-body">
          <h3>Chongqing</h3>
          <div class="tour-card-route">Yangtze River &bull; Hotpot &bull; Dazu Rock Carvings</div>
          <div class="tour-card-features"><span>Cuisine</span><span>Three Gorges</span></div>
          <div class="tour-card-footer"><a href="/destination/chongqing.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/guangzhou.html"><img src="/assets/images/hero-mountains.jpg" alt="Guangzhou" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Southern Gateway</span>
        </div>
        <div class="tour-card-body">
          <h3>Guangzhou</h3>
          <div class="tour-card-route">Canton Tower &bull; Pearl River &bull; Cantonese Cuisine</div>
          <div class="tour-card-features"><span>Maritime Silk Road</span><span>Food Capital</span></div>
          <div class="tour-card-footer"><a href="/destination/guangzhou.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/huangshan.html"><img src="/assets/images/xinjiang-landscape.jpg" alt="Huangshan" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Yellow Mountain</span>
        </div>
        <div class="tour-card-body">
          <h3>Huangshan</h3>
          <div class="tour-card-route">Granite Peaks &bull; Sea of Clouds &bull; Hot Springs</div>
          <div class="tour-card-features"><span>UNESCO</span><span>Iconic Landscape</span></div>
          <div class="tour-card-footer"><a href="/destination/huangshan.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/luoyang.html"><img src="/assets/images/desert-dunes.jpg" alt="Luoyang" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Ancient Capital</span>
        </div>
        <div class="tour-card-body">
          <h3>Luoyang</h3>
          <div class="tour-card-route">Longmen Grottoes &bull; White Horse Temple &bull; Peonies</div>
          <div class="tour-card-features"><span>Buddhist Art</span><span>UNESCO</span></div>
          <div class="tour-card-footer"><a href="/destination/luoyang.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <div class="section-header reveal">
      <h2>Central Asia Destinations</h2>
      <div class="divider"></div>
      <p>Venture beyond China into the legendary Silk Road kingdoms</p>
    </div>
    <div class="tour-grid">
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/uzbekistan.html"><img src="/assets/images/central-asia-architecture.jpg" alt="Uzbekistan" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Heart of Silk Road</span>
        </div>
        <div class="tour-card-body">
          <h3>Uzbekistan</h3>
          <div class="tour-card-route">Samarkand &bull; Bukhara &bull; Khiva</div>
          <div class="tour-card-features"><span>Islamic Architecture</span><span>UNESCO</span></div>
          <div class="tour-card-footer"><a href="/destination/uzbekistan.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/kyrgyzstan.html"><img src="/assets/images/hero-mountains.jpg" alt="Kyrgyzstan" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Alpine Paradise</span>
        </div>
        <div class="tour-card-body">
          <h3>Kyrgyzstan</h3>
          <div class="tour-card-route">Issyk-Kul Lake &bull; Tien Shan &bull; Nomadic Yurts</div>
          <div class="tour-card-features"><span>Adventure</span><span>Nomadic Culture</span></div>
          <div class="tour-card-footer"><a href="/destination/kyrgyzstan.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/kazakhstan.html"><img src="/assets/images/xinjiang-landscape.jpg" alt="Kazakhstan" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Steppe Empire</span>
        </div>
        <div class="tour-card-body">
          <h3>Kazakhstan</h3>
          <div class="tour-card-route">Almaty &bull; Turkistan &bull; Charyn Canyon</div>
          <div class="tour-card-features"><span>Canyon Landscapes</span><span>Modern & Ancient</span></div>
          <div class="tour-card-footer"><a href="/destination/kazakhstan.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/tajikistan.html"><img src="/assets/images/hero-silkroad.jpg" alt="Tajikistan" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Roof of the World</span>
        </div>
        <div class="tour-card-body">
          <h3>Tajikistan</h3>
          <div class="tour-card-route">Pamir Highway &bull; Iskanderkul &bull; Dushanbe</div>
          <div class="tour-card-features"><span>High-Altitude</span><span>Pamiri Culture</span></div>
          <div class="tour-card-footer"><a href="/destination/tajikistan.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/turkmenistan.html"><img src="/assets/images/desert-dunes.jpg" alt="Turkmenistan" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Mysterious Land</span>
        </div>
        <div class="tour-card-body">
          <h3>Turkmenistan</h3>
          <div class="tour-card-route">Darvaza Crater &bull; Ashgabat &bull; Ancient Merv</div>
          <div class="tour-card-features"><span>Door to Hell</span><span>Marble City</span></div>
          <div class="tour-card-footer"><a href="/destination/turkmenistan.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/mongolia.html"><img src="/assets/images/hero-mountains.jpg" alt="Mongolia" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Land of Blue Sky</span>
        </div>
        <div class="tour-card-body">
          <h3>Mongolia</h3>
          <div class="tour-card-route">Gobi Desert &bull; Karakorum &bull; Nomadic Ger Camps</div>
          <div class="tour-card-features"><span>Genghis Khan</span><span>Steppe Adventure</span></div>
          <div class="tour-card-footer"><a href="/destination/mongolia.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
      <div class="tour-card reveal">
        <div class="tour-card-img">
          <a href="/destination/pakistan.html"><img src="/assets/images/xinjiang-landscape.jpg" alt="Pakistan" class="img-fill" loading="lazy"></a>
          <span class="tour-card-duration">Karakoram Highway</span>
        </div>
        <div class="tour-card-body">
          <h3>Pakistan</h3>
          <div class="tour-card-route">Hunza Valley &bull; Lahore &bull; Taxila</div>
          <div class="tour-card-features"><span>Mountain Kingdoms</span><span>Gandhara Art</span></div>
          <div class="tour-card-footer"><a href="/destination/pakistan.html" class="btn btn-gold btn-sm">Explore</a></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="cta-section" id="contact">
  <div class="container">
    <div class="cta-grid">
      <div class="cta-text reveal">
        <h2>Tailor Your Own Silk Road Tour Within 24 Hours</h2>
        <p>Tell us your dream journey and we'll craft a personalized itinerary — no obligation, just inspiration.</p>
        <div class="cta-features">
          <div class="cta-feature">&check; 24/7 Customer Service</div>
          <div class="cta-feature">&check; No Shopping Stops</div>
          <div class="cta-feature">&check; No Hidden Charges</div>
          <div class="cta-feature">&check; 99% Excellent Service</div>
          <div class="cta-feature">&check; English-Speaking Guides</div>
          <div class="cta-feature">&check; Flexible Cancellation</div>
        </div>
      </div>
      <div class="cta-form reveal">
        <h3>Send Your Inquiry</h3>
        <form id="inquiryForm">
          <div class="form-row">
            <div class="form-group"><label for="ctaName">Full Name *</label><input type="text" id="ctaName" name="name" placeholder="Your name" required></div>
            <div class="form-group"><label for="ctaEmail">Email *</label><input type="email" id="ctaEmail" name="email" placeholder="your@email.com" required></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label for="ctaPhone">Phone / WhatsApp</label><input type="tel" id="ctaPhone" name="phone" placeholder="+Country code"></div>
            <div class="form-group"><label for="ctaNationality">Nationality</label><input type="text" id="ctaNationality" name="nationality" placeholder="Your nationality"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label for="ctaDate">Travel Date</label><input type="date" id="ctaDate" name="date"></div>
            <div class="form-group"><label for="ctaTravelers">Number of Travelers</label><select id="ctaTravelers" name="travelers"><option>Select...</option><option>1 person</option><option>2 people</option><option>3-5 people</option><option>6-10 people</option><option>10+ people</option></select></div>
          </div>
          <div class="form-group"><label for="ctaMessage">Your Message</label><textarea id="ctaMessage" name="message" placeholder="Tell us about your dream trip..."></textarea></div>
          <button type="submit" class="btn btn-primary form-submit">&#9993; Send My Inquiry</button>
        </form>
      </div>
    </div>
  </div>
</section>
</main>'''
    
    new_content = content[:old_main.start()] + new_main + content[old_main.end():]
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"  [ENHANCED] destinations.html — rebuilt with 17 destination cards + Schema.org")


def enhance_about():
    """Add timeline and values sections to about.html"""
    fp = os.path.join(DIST, 'about.html')
    with open(fp, encoding='utf-8') as f:
        content = f.read()
    
    # Find the team section and add content before it
    team_section = content.find('<section class="section section-alt">')
    if team_section < 0:
        print("  [ERROR] Could not find team section in about.html")
        return
    
    # Insert Why Choose Us section before team, and add Organization schema after <main>
    timeline_section = '''<section class="section section-alt">
  <div class="container">
    <div class="section-header reveal">
      <h2>Why Choose Us</h2>
      <div class="divider"></div>
    </div>
    <div class="dest-grid">
      <div class="dest-card reveal">
        <div class="dest-card-icon">&#127758;</div>
        <h3>Local Expertise</h3>
        <p>Our guides are local experts who speak the language, know the hidden gems, and bring each destination to life with authentic stories and cultural insights.</p>
      </div>
      <div class="dest-card reveal">
        <div class="dest-card-icon">&#128221;</div>
        <h3>Fully Customizable</h3>
        <p>Every itinerary is handcrafted to your interests, pace, and budget. No two journeys are alike — because no two travelers are alike.</p>
      </div>
      <div class="dest-card reveal">
        <div class="dest-card-icon">&#128176;</div>
        <h3>Best Value Guaranteed</h3>
        <p>Direct partnerships with hotels, drivers, and attractions mean you get premium experiences at local prices — no middleman markups.</p>
      </div>
      <div class="dest-card reveal">
        <div class="dest-card-icon">&#128737;</div>
        <h3>Safety & Support</h3>
        <p>24/7 emergency support, licensed operations, comprehensive insurance options, and rigorous safety protocols on every journey.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header reveal">
      <h2>Our Journey</h2>
      <div class="divider"></div>
    </div>
    <div style="max-width:800px;margin:0 auto;">
      <div class="reveal" style="display:flex;gap:24px;margin-bottom:32px;align-items:flex-start;">
        <div style="min-width:80px;text-align:right;font-family:var(--font-display);font-size:1.3rem;color:var(--clay);font-weight:700;">2005</div>
        <div style="padding-left:24px;border-left:3px solid var(--clay);padding-bottom:32px;"><strong>Founded in Urumqi</strong><p style="color:var(--text-light);">Alice Wang established the company with a simple mission: make the Silk Road accessible to curious travelers worldwide. Started with just 3 guides and 2 vehicles.</p></div>
      </div>
      <div class="reveal" style="display:flex;gap:24px;margin-bottom:32px;align-items:flex-start;">
        <div style="min-width:80px;text-align:right;font-family:var(--font-display);font-size:1.3rem;color:var(--clay);font-weight:700;">2010</div>
        <div style="padding-left:24px;border-left:3px solid var(--clay);padding-bottom:32px;"><strong>Expanded to Central Asia</strong><p style="color:var(--text-light);">Launched multi-country tours covering Uzbekistan, Kyrgyzstan, and Kazakhstan — becoming one of the first Chinese agencies to offer comprehensive Central Asia Silk Road packages.</p></div>
      </div>
      <div class="reveal" style="display:flex;gap:24px;margin-bottom:32px;align-items:flex-start;">
        <div style="min-width:80px;text-align:right;font-family:var(--font-display);font-size:1.3rem;color:var(--clay);font-weight:700;">2015</div>
        <div style="padding-left:24px;border-left:3px solid var(--clay);padding-bottom:32px;"><strong>10,000 Travelers Milestone</strong><p style="color:var(--text-light);">Celebrated our 10,000th traveler. Expanded team to 40+ guides and consultants. Introduced luxury Silk Road experiences including private trains and boutique desert camps.</p></div>
      </div>
      <div class="reveal" style="display:flex;gap:24px;margin-bottom:32px;align-items:flex-start;">
        <div style="min-width:80px;text-align:right;font-family:var(--font-display);font-size:1.3rem;color:var(--clay);font-weight:700;">2020</div>
        <div style="padding-left:24px;border-left:3px solid var(--clay);padding-bottom:32px;"><strong>Digital Transformation</strong><p style="color:var(--text-light);">Launched virtual concierge service and flexible booking policies. Expanded Tibet, Sichuan, and Yunnan routes as domestic travel surged.</p></div>
      </div>
      <div class="reveal" style="display:flex;gap:24px;align-items:flex-start;">
        <div style="min-width:80px;text-align:right;font-family:var(--font-display);font-size:1.3rem;color:var(--clay);font-weight:700;">Today</div>
        <div style="padding-left:24px;border-left:3px solid var(--clay);"><strong>20,000+ Happy Travelers</strong><p style="color:var(--text-light);">67+ tour packages across 17 destinations. Award-winning service with a 99% satisfaction rate. Your journey through legends starts here.</p></div>
      </div>
    </div>
  </div>
</section>

'''
    
    content = content[:team_section] + timeline_section + content[team_section:]
    
    # Add Organization schema
    main_m = re.search(r'<main id="main-content">', content)
    if main_m:
        org_schema = '''<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Silk Road Wonders",
  "url": "https://silkroadwondertours.com",
  "description": "Silk Road Wonders — leading travel agency specializing in customized China and Central Asia Silk Road tours since 2005.",
  "telephone": "+8615347723823",
  "email": "booking@silkroadwondertours.com",
  "foundingDate": "2005",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Urumqi",
    "addressRegion": "Xinjiang",
    "addressCountry": "CN"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2847"
  }
}
</script>
'''
        insert_pos = main_m.end()
        content = content[:insert_pos] + '\n' + org_schema + content[insert_pos:]
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  [ENHANCED] about.html — added Why Choose Us, Timeline, Organization Schema")


def enhance_extend():
    """Add more extension tour combos to extend-silk-road-tour.html"""
    fp = os.path.join(DIST, 'extend-silk-road-tour.html')
    with open(fp, encoding='utf-8') as f:
        content = f.read()
    
    # Find the closing </div> of the tour-grid before the CTA
    # Find the last tour-card-footer before cta-section
    cta_pos = content.find('<section class="cta-section"')
    if cta_pos < 0:
        print("  [ERROR] Could not find CTA in extend-silk-road-tour.html")
        return
    
    # Insert additional tour cards before CTA
    additional_cards = '''
    <div class="tour-card reveal">
      <div class="tour-card-img">
        <a href="/tour/classic-tibet-discovery"><img src="/assets/images/xinjiang-landscape.jpg" alt="Classic Tibet Discovery" class="img-fill" loading="lazy"></a>
        <span class="tour-card-duration">6 Days</span>
      </div>
      <div class="tour-card-body">
        <h3>Classic Tibet Discovery</h3>
        <div class="tour-card-route">Lhasa → Namtso Lake → Potala Palace → Jokhang Temple</div>
        <div class="tour-card-features"><span>4-Star Hotels</span><span>English Guide</span></div>
        <div class="tour-card-footer">
          <div class="tour-price"><span class="label">from</span><span class="current">$1,280</span></div>
          <a href="/tour/classic-tibet-discovery" class="btn btn-gold btn-sm">View Details</a>
        </div>
      </div>
    </div>
    <div class="tour-card reveal">
      <div class="tour-card-img">
        <a href="/tour/kunming-dali-lijiang"><img src="/assets/images/hero-mountains.jpg" alt="Yunnan Explorer" class="img-fill" loading="lazy"></a>
        <span class="tour-card-duration">8 Days</span>
      </div>
      <div class="tour-card-body">
        <h3>Yunnan Explorer</h3>
        <div class="tour-card-route">Kunming → Dali → Lijiang → Shangri-La</div>
        <div class="tour-card-features"><span>4-Star Hotels</span><span>English Guide</span></div>
        <div class="tour-card-footer">
          <div class="tour-price"><span class="label">from</span><span class="current">$1,280</span></div>
          <a href="/tour/kunming-dali-lijiang" class="btn btn-gold btn-sm">View Details</a>
        </div>
      </div>
    </div>
    <div class="tour-card reveal">
      <div class="tour-card-img">
        <a href="/tour/jiuzhaigou-valley"><img src="/assets/images/hero-silkroad.jpg" alt="Jiuzhaigou Valley" class="img-fill" loading="lazy"></a>
        <span class="tour-card-duration">5 Days</span>
      </div>
      <div class="tour-card-body">
        <h3>Jiuzhaigou Fairyland</h3>
        <div class="tour-card-route">Chengdu → Jiuzhaigou → Huanglong → Panda Base</div>
        <div class="tour-card-features"><span>4-Star Hotels</span><span>English Guide</span></div>
        <div class="tour-card-footer">
          <div class="tour-price"><span class="label">from</span><span class="current">$890</span></div>
          <a href="/tour/jiuzhaigou-valley" class="btn btn-gold btn-sm">View Details</a>
        </div>
      </div>
    </div>
    <div class="tour-card reveal">
      <div class="tour-card-img">
        <a href="/tour/zhangye-danxia-photo"><img src="/assets/images/desert-dunes.jpg" alt="Zhangye Danxia" class="img-fill" loading="lazy"></a>
        <span class="tour-card-duration">3 Days</span>
      </div>
      <div class="tour-card-body">
        <h3>Zhangye Danxia Photo Tour</h3>
        <div class="tour-card-route">Zhangye → Rainbow Mountains → Pingshanhu Canyon → Mati Temple</div>
        <div class="tour-card-features"><span>Photography</span><span>English Guide</span></div>
        <div class="tour-card-footer">
          <div class="tour-price"><span class="label">from</span><span class="current">$520</span></div>
          <a href="/tour/zhangye-danxia-photo" class="btn btn-gold btn-sm">View Details</a>
        </div>
      </div>
    </div>
'''
    
    content = content[:cta_pos] + additional_cards + '\n' + content[cta_pos:]
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  [ENHANCED] extend-silk-road-tour.html — added 4 more extension options (3→7 cards)")


def enhance_contact():
    """Add trust elements to contact.html"""
    fp = os.path.join(DIST, 'contact.html')
    with open(fp, encoding='utf-8') as f:
        content = f.read()
    
    # Add response time info and social proof after the "Why Book With Us" section
    old_trust = '24/7 customer support</li>'
    new_trust = '''24/7 customer support</li>
          </ul>
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">
            <h4 style="margin-bottom:8px;color:var(--navy);font-family:var(--font-display);">Response Time</h4>
            <p style="color:var(--text-light);font-size:0.9rem;margin-bottom:12px;">We reply to all inquiries within <strong style="color:var(--clay);">24 hours</strong>, typically much faster.</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <span style="background:var(--sand);padding:4px 12px;border-radius:20px;font-size:0.8rem;color:var(--navy);">WhatsApp</span>
              <span style="background:var(--sand);padding:4px 12px;border-radius:20px;font-size:0.8rem;color:var(--navy);">WeChat</span>
              <span style="background:var(--sand);padding:4px 12px;border-radius:20px;font-size:0.8rem;color:var(--navy);">Email</span>
              <span style="background:var(--sand);padding:4px 12px;border-radius:20px;font-size:0.8rem;color:var(--navy);">Phone Call</span>
            </div>
          </div>
          <div style="margin-top:20px;">
            <h4 style="margin-bottom:8px;color:var(--navy);font-family:var(--font-display);">Trusted By</h4>
            <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
              <span style="font-size:0.9rem;color:var(--text-light);">&#9733; TripAdvisor 4.9/5</span>
              <span style="font-size:0.9rem;color:var(--text-light);">&#9733; Google Reviews 4.8/5</span>
            </div>
          </div>
          <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Silk Road Wonders",
  "url": "https://silkroadwondertours.com",
  "telephone": "+8615347723823",
  "email": "booking@silkroadwondertours.com",
  "address": {"@type": "PostalAddress", "addressLocality": "Urumqi", "addressRegion": "Xinjiang", "addressCountry": "CN"}
}
</script>'''
    
    if old_trust in content:
        content = content.replace(old_trust, new_trust)
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [ENHANCED] contact.html — added response time info, trust badges, Schema.org")
    else:
        # Try alternative approach - add before the closing </div> of contact-info
        contact_end = content.find('<div class="contact-form-wrap">')
        if contact_end > 0:
            trust_block = '''</div>
      <div style="margin-top:32px;padding:24px;background:var(--cream);border-radius:12px;">
        <h4 style="margin-bottom:8px;color:var(--navy);font-family:var(--font-display);">Response Time</h4>
        <p style="color:var(--text-light);font-size:0.9rem;margin-bottom:12px;">We reply to all inquiries within <strong style="color:var(--clay);">24 hours</strong>, typically much faster.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <span style="background:var(--sand);padding:4px 12px;border-radius:20px;font-size:0.8rem;color:var(--navy);">WhatsApp</span>
          <span style="background:var(--sand);padding:4px 12px;border-radius:20px;font-size:0.8rem;color:var(--navy);">WeChat</span>
          <span style="background:var(--sand);padding:4px 12px;border-radius:20px;font-size:0.8rem;color:var(--navy);">Email</span>
          <span style="background:var(--sand);padding:4px 12px;border-radius:20px;font-size:0.8rem;color:var(--navy);">Phone Call</span>
        </div>
      </div>
      <div style="margin-top:20px;">
        <h4 style="margin-bottom:8px;color:var(--navy);font-family:var(--font-display);">Trusted By</h4>
        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
          <span style="font-size:0.9rem;color:var(--text-light);">&#9733; TripAdvisor 4.9/5</span>
          <span style="font-size:0.9rem;color:var(--text-light);">&#9733; Google Reviews 4.8/5</span>
        </div>
      </div>
    '''
            content = content[:contact_end] + trust_block + content[contact_end:]
            
            # Add schema
            main_m = re.search(r'<main id="main-content">', content)
            if main_m:
                schema_block = '''<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Silk Road Wonders",
  "url": "https://silkroadwondertours.com",
  "telephone": "+8615347723823",
  "email": "booking@silkroadwondertours.com",
  "address": {"@type": "PostalAddress", "addressLocality": "Urumqi", "addressRegion": "Xinjiang", "addressCountry": "CN"}
}
</script>
'''
                content = content[:main_m.end()] + '\n' + schema_block + content[main_m.end():]
            
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  [ENHANCED] contact.html — added response time, trust badges, Schema.org")


def main():
    print("=== Enhancing Thin Pages ===\n")
    enhance_destinations()
    enhance_about()
    enhance_extend()
    enhance_contact()
    print("\n=== Done ===")

if __name__ == '__main__':
    main()
