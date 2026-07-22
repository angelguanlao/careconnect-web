/* ============================================================================
   CareConnect service worker
   ----------------------------------------------------------------------------
   Caching strategy (see Week 10 §2 PWA plan):

   • App shell / navigations  → NETWORK FIRST, fall back to cache, then to the
     cached offline shell (index.html). Keeps HTML fresh when online, but the
     app still opens with no connection.
   • Static assets (JS/CSS/  → STALE-WHILE-REVALIDATE. Serve the cached copy
     fonts/icons)               instantly, then refresh the cache in the
                                background so the next load is up to date.
   • Cross-origin / API-style  → left to the network (not cached here).

   Bump CACHE_VERSION on every deploy so old caches are cleaned up in `activate`.
   ============================================================================ */

const CACHE_VERSION = 'careconnect-v1';
const PRECACHE = `${CACHE_VERSION}-precache`;
const RUNTIME = `${CACHE_VERSION}-runtime`;

// The minimal shell that must be available offline.
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './fonts/epilogue-latin.woff2',
  './fonts/nunito-sans-latin.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Allow the page to trigger an immediate update.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // don't touch cross-origin

  // App-shell navigations: Network First → cache → offline shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  // Static assets: Stale-While-Revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
