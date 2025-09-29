const CACHE_NAME = 'karenifier-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/services/geminiService.ts',
  '/components/Header.tsx',
  '/components/QueryInput.tsx',
  '/components/ResponseDisplay.tsx',
  '/components/LoadingSpinner.tsx',
  '/components/Icons.tsx',
  '/components/ApiKeyInput.tsx',
  'https://cdn.tailwindcss.com',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnA4OTRoc3R0eXQzbXhvY3N0c2I4aHhyOWRjN3hpaDdlYmdsZWNpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKyOoGtsprVTA3K/giphy.gif',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // AddAll can fail if one resource fails. We will cache them individually and ignore failures for external resources.
        const cachePromises = urlsToCache.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
          });
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
