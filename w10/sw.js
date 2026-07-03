const CACHE_NAME = 'english-quiz-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './vocab.js',
  './audio.js',
  './app.js',
  './manifest.json'
];

// Install Event
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event (Cache First with network fallback)
self.addEventListener('fetch', (e) => {
  // Only intercept HTTP/HTTPS requests (avoid chrome-extension:// or file:// errors)
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Cache dynamic assets if needed, else just return
        return networkResponse;
      }).catch(() => {
        // Fallback or offline page can be served here if needed
      });
    })
  );
});
