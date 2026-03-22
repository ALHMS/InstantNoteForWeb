const CACHE_NAME = 'memo-app-v5';

// オフライン動作用に保存するファイルのリスト（新アイコン追加）
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/undo.svg',
  './assets/redo.svg',
  './assets/trash.svg',
  './assets/copy.svg',
  './assets/paste.svg',
  './assets/partial-select.svg'
];

// インストール時にファイルをキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); 
});

// 新しいService Workerが有効になったときに、古いキャッシュを削除する
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

// ネットワークリクエストをインターセプトしてキャッシュから返す
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});