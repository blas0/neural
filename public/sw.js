const CACHE_NAME = 'neural-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  // CSS and JS assets will be added dynamically
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests and API routes
  if (url.origin !== location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  // Skip dynamic content that should never be cached
  const skipCachePatterns = [
    '/api/',
    '/_next/webpack-hmr',
    '/__nextjs',
    '/hot-update',
    '.hot-update.'
  ];
  
  if (skipCachePatterns.some(pattern => url.pathname.includes(pattern))) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // For HTML documents, use stale-while-revalidate strategy
        if (event.request.destination === 'document') {
          const networkFetch = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
              }
              return networkResponse;
            })
            .catch(() => response); // Fallback to cached version if network fails

          return response || networkFetch;
        }

        // For assets, serve from cache first, then network
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Only cache successful responses for static assets
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Only cache static assets (CSS, JS, images)
            const contentType = response.headers.get('content-type') || '';
            const shouldCache = contentType.includes('text/css') ||
                               contentType.includes('application/javascript') ||
                               contentType.includes('image/') ||
                               url.pathname.includes('/assets/');

            if (shouldCache) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('Caching new resource:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // Return a basic offline page for document requests
            if (event.request.destination === 'document') {
              return new Response(
                '<h1>Offline</h1><p>Please check your internet connection.</p>',
                {
                  headers: { 'Content-Type': 'text/html' }
                }
              );
            }
          });
      })
  );
});

// Background sync for form submissions (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(
      // Handle any queued form submissions
      self.registration.showNotification('Neural', {
        body: 'Your form submission has been processed.',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      })
    );
  }
});

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      },
      actions: [
        {
          action: 'explore',
          title: 'Open Website',
          icon: '/icon-192.png'
        },
        {
          action: 'close',
          title: 'Close',
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('Neural', options)
    );
  }
});