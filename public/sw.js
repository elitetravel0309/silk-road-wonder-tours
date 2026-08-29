/* ===== Silk Road Wonders — Service Worker ===== */
const CACHE_VERSION = 'srw-v3.0';
const PRE_CACHE = 'srw-precache-' + CACHE_VERSION;
const RUNTIME_CACHE = 'srw-runtime-' + CACHE_VERSION;
const IMG_CACHE = 'srw-images-' + CACHE_VERSION;

/* Critical assets to pre-cache on install */
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/assets/favicon.svg',
  '/assets/logo.png',
  '/manifest.json',
  '/404.html',
  '/tours.html',
  '/destinations.html',
  '/about.html',
  '/contact.html',
  '/blog.html'
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

/* === ACTIVATE — clear all old caches === */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k.startsWith('srw-') && !k.includes(CACHE_VERSION))
          .map(k => caches.delete(k))
      );
    }).then(() => {
      console.log('[SW] Activated', CACHE_VERSION);
      return self.clients.claim();
    })
  );
});

/* === FETCH === */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET */
  if (request.method !== 'GET') return;

  /* Google Fonts: cache-first */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request));
    return;
  }

  /* Navigation (HTML pages): network-first, fallback to cache */
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  /* Local CSS/JS: stale-while-revalidate (serve cache, update in background) */
  if (url.origin === self.location.origin) {
    if (request.destination === 'style' || request.destination === 'script') {
      event.respondWith(staleWhileRevalidate(request));
      return;
    }
  }

  /* Local images: cache-first with background refresh */
  if (url.origin === self.location.origin && request.destination === 'image') {
    event.respondWith(cacheFirst(request));
    return;
  }

  /* Everything else: network-first */
  event.respondWith(networkFirst(request));
});

/* === Strategies === */

/* Stale-while-revalidate — serve cache immediately, update in background */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const networkFetch = fetch(request).then(response => {
    if (response.ok) {
      const clone = response.clone();
      caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
    }
    return response;
  }).catch(() => cached);
  return cached || networkFetch;
}

/* Cache first — serve from cache, update in background */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
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

/* Network first — try network, fall back to cache */
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
    const offline = await caches.match('/404.html');
    return offline || new Response('You are offline.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
