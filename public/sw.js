/* ===== Silk Road Wonders — Service Worker ===== */
const CACHE_VERSION = 'srw-v2.4';
const PRE_CACHE = 'srw-precache-' + CACHE_VERSION;
const RUNTIME_CACHE = 'srw-runtime-' + CACHE_VERSION;
const IMG_CACHE = 'srw-images-' + CACHE_VERSION;

/* Critical assets to pre-cache on install */
const PRECACHE_URLS = [
  '/',
  'css/style.css',
  'js/main.js',
  'assets/favicon.svg',
  'assets/logo.png',
  'assets/home-banner.jpg',
  'manifest.json',
  '404.html',
  'index.html',
  'tours.html',
  'destinations.html',
  'about.html',
  'contact.html',
  'blog.html',
  'search.html'
];

/* === INSTALL === */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRE_CACHE).then(cache => {
      console.log('[SW] Pre-caching', PRECACHE_URLS.length, 'assets');
      return Promise.allSettled(
        PRECACHE_URLS.map(url => cache.add(url).catch(err => {
          console.warn('[SW] Pre-cache fail:', url, err.message);
        }))
      );
    }).then(() => self.skipWaiting())
  );
});

/* === ACTIVATE === */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k.startsWith('srw-') && k !== PRE_CACHE && k !== RUNTIME_CACHE && k !== IMG_CACHE)
          .map(k => caches.delete(k))
      );
    }).then(() => {
      console.log('[SW] Activated v' + CACHE_VERSION);
      return self.clients.claim();
    })
  );
});

/* === FETCH === */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET and cross-origin (except fonts/images) */
  if (request.method !== 'GET') return;

  /* Google Fonts: stale-while-revalidate via cache-first */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request));
    return;
  }

  /* External images: cache-first with expiry */
  if (url.hostname === 'images.unsplash.com') {
    event.respondWith(imageCache(request));
    return;
  }

  /* Navigation (HTML pages): network-first, fallback to cache, then offline */
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  /* Local static assets (CSS, JS, local images): cache-first */
  if (url.origin === self.location.origin) {
    if (request.destination === 'style' || request.destination === 'script' || request.destination === 'image' || request.destination === 'font') {
      event.respondWith(cacheFirst(request));
      return;
    }
  }

  /* Everything else: network-first */
  event.respondWith(networkFirst(request));
});

/* === Strategies === */

/* Cache first — serve from cache, update cache in background */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    /* Background refresh */
    fetch(request).then(resp => {
      if (resp.ok) {
        caches.open(RUNTIME_CACHE).then(cache => cache.put(request, resp));
      }
    }).catch(() => {});
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
    }
    return response;
  } catch (e) {
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

/* Network first — try network, fall back to cache, then offline */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    if (cached) return cached;
    /* Fallback to cached offline page */
    const offline = await caches.match('404.html');
    return offline || new Response('You are offline and this page is not cached.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/* Image cache — cache-first with LRU max 200 entries */
async function imageCache(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      const cache = await caches.open(IMG_CACHE);
      cache.put(request, clone);
      /* Trim cache to 200 entries */
      const keys = await cache.keys();
      if (keys.length > 200) {
        for (let i = 0; i < keys.length - 200; i++) {
          cache.delete(keys[i]);
        }
      }
    }
    return response;
  } catch (e) {
    return new Response('', { status: 408, statusText: 'Image offline' });
  }
}
