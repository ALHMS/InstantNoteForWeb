// 1. バージョン名を変更する（アップデートのたびに v2, v3... と変えていきます）
const CACHE_NAME = 'memo-app-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// インストール時にファイルをキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  // 新しいService Workerを強制的に待機状態から実行状態にする
  self.skipWaiting(); 
});

// 2. 新しいService Workerが有効になったときに、古いキャッシュを削除する
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 現在のバージョン（v2）以外のキャッシュ（v1など）をすべて削除
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除しました:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // コントロールを即座に新しいService Workerに移す
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