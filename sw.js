*/*// Define a unique name for the cache.
// Incrementing the version (e.g., v2, v3) is a common strategy to invalidate old caches during an update.
const CACHE_NAME = 'karenifier-cache-v3'; // Incremented version

// A list of all the essential files the application needs to run offline.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/index.tsx',
  '/src/App.tsx',
  '/src/services/geminiService.ts',
  '/src/services/trackingService.ts',
  '/src/components/Header.tsx',
  '/src/components/QueryInput.tsx',
  '/src/components/ResponseDisplay.tsx',
  '/src/components/EngagingLoader.tsx',
  '/src/components/Icons.tsx',
  '/src/components/ApiKeySetup.tsx',
  '/src/components/MainAppView.tsx',
  '/src/components/ConversationHistory.tsx',
  '/src/components/UsageStats.tsx',
  'https://cdn.tailwindcss.com',
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGJmaXh0a3B0YnVnZjNqMDljNHdoa3h3djIyMGw2MnFtbzNiZ2FscCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4pT9M7xTuvBzwtGg/giphy.gif'
];

/**
 * 'install' event listener.
 * This event fires when the service worker is first installed.
 * It opens the cache and adds all specified URLs to it.
 */
self.addEventListener('install', event => {
  // waitUntil ensures the service worker won't be considered 'installed' until the caching is complete.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all URLs to the cache. We wrap this in promises to handle individual failures.
        const promises = URLS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
          });
        });
        return Promise.all(promises);
      })
  );
});

/**
 * 'fetch' event listener.
 * This event fires for every network request made by the page.
 * It implements a "cache-first" strategy.
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    // Check if the request exists in our cache.
    caches.match(event.request)
      .then(response => {
        // If a cached response is found, return it immediately.
        if (response) {
          return response;
        }
        // If the request is not in the cache, proceed with the actual network request.
        return fetch(event.request);
      })
  );
});

/**
 * 'activate' event listener.
 * This event fires when the new service worker becomes active.
 * Its primary job is to clean up old, unused caches.
 */
self.addEventListener('activate', event => {
  // A whitelist containing the names of caches we want to keep.
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache name is not in our whitelist, it's an old cache that needs to be deleted.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
