const CACHE_NAME = 'kadastr-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// O'rnatish
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Faollashtirish
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// So'rovlarni ushlash
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request)
        .then(fetchResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            if (event.request.method === 'GET') {
              cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        })
      )
      .catch(() => caches.match('./index.html'))
  );
});
