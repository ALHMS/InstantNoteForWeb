// ▼ バージョンを v1.1.4 に引き上げました ▼
const CACHE_NAME = 'memo-app-v1.1.4';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/undo.svg',
  './assets/redo.svg',
  './assets/trash.svg',
  './assets/copy.svg',
  './assets/paste.svg',
  './assets/partial-select.svg',
  './assets/info.svg',
  './assets/leftArrow.svg',
  './assets/jumpLeftArrow.svg',
  './assets/rightArrow.svg',
  './assets/jumpRightArrow.svg',
  './assets/InstantNote.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除しました:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});