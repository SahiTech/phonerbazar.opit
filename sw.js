// sw.js
const CACHE_NAME = 'phonerbazar-v1';
const urlsToCache = [
  '/', // main page
  '/index.html',
  '/styles/home-styles.css',
  '/scripts/home-script.js',
  '/images/hero.webp',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Cache opened');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Old cache removed:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch event - serve from cache first, fallback network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() =>
          new Response('⚠️ Network error, please try again later.')
        )
      );
    })
  );
});
