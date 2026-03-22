const CACHE_NAME = 'memo-app-v1';
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
});

// ネットワークリクエストをインターセプトしてキャッシュから返す
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあればそれを返し、無ければネットワークから取得
        return response || fetch(event.request);
      })
  );
});